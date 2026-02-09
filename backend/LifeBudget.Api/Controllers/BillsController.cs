using LifeBudget.Api.Dtos;
using LifeBudget.Api.Models;
using LifeBudget.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace LifeBudget.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BillsController : ControllerBase
{
    private readonly BillRepository _bills;

    public BillsController(BillRepository bills)
    {
        _bills = bills;
    }

    [HttpGet]
    public async Task<IActionResult> GetByUser([FromQuery] string userId)
    {
        if (string.IsNullOrWhiteSpace(userId))
            return BadRequest("userId is required.");

        var results = await _bills.GetByUserIdAsync(userId);
        return Ok(results);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateBillRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.UserId))
            return BadRequest("userId is required.");
        if (string.IsNullOrWhiteSpace(request.Name))
            return BadRequest("Name is required.");
        if (request.Amount <= 0)
            return BadRequest("Amount must be greater than 0.");

        var bill = new Bill
        {
            UserId = request.UserId.Trim(),
            Name = request.Name.Trim(),
            Amount = request.Amount,
            DueDay = request.DueDay,
            IsRecurring = request.IsRecurring,
            Status = "unpaid",
            LastPaidUtc = null
        };

        var created = await _bills.CreateAsync(bill);
        return Ok(created);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id, [FromQuery] string userId)
    {
        if (string.IsNullOrWhiteSpace(userId))
            return BadRequest("userId is required.");

        var deleted = await _bills.DeleteAsync(id, userId);
        return deleted ? NoContent() : NotFound();
    }

    [HttpPut("{id}/status")]
    [HttpPost("{id}/status")]
    public async Task<IActionResult> UpdateStatus(string id, UpdateBillStatusRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.UserId))
            return BadRequest("userId is required.");
        if (string.IsNullOrWhiteSpace(request.Status))
            return BadRequest("status is required.");

        var status = request.Status.Trim().ToLowerInvariant();
        if (status is not ("paid" or "upcoming" or "unpaid"))
            return BadRequest("status must be paid, upcoming, or unpaid.");

        DateTime? lastPaidUtc = status == "paid" ? DateTime.UtcNow : null;
        if (status == "upcoming") status = "unpaid";

        var updated = await _bills.UpdateStatusAsync(id, request.UserId.Trim(), status, lastPaidUtc);
        return updated == null ? NotFound() : Ok(updated);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, UpdateBillRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.UserId))
            return BadRequest("userId is required.");
        if (string.IsNullOrWhiteSpace(request.Name))
            return BadRequest("Name is required.");
        if (request.Amount <= 0)
            return BadRequest("Amount must be greater than 0.");

        var status = string.IsNullOrWhiteSpace(request.Status)
            ? "unpaid"
            : request.Status.Trim().ToLowerInvariant();
        if (status is not ("paid" or "upcoming" or "unpaid"))
            return BadRequest("status must be paid, upcoming, or unpaid.");
        if (status == "upcoming") status = "unpaid";

        var bill = new Bill
        {
            UserId = request.UserId.Trim(),
            Name = request.Name.Trim(),
            Amount = request.Amount,
            DueDay = request.DueDay,
            IsRecurring = request.IsRecurring,
            Status = status,
            LastPaidUtc = status == "paid" ? DateTime.UtcNow : null
        };

        var updated = await _bills.UpdateAsync(id, request.UserId.Trim(), bill);
        return updated == null ? NotFound() : Ok(updated);
    }
}
