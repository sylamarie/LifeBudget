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
            IsRecurring = request.IsRecurring
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
}
