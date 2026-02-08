using LifeBudget.Api.Dtos;
using LifeBudget.Api.Models;
using LifeBudget.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace LifeBudget.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransactionsController : ControllerBase
{
    private readonly TransactionRepository _transactions;

    public TransactionsController(TransactionRepository transactions)
    {
        _transactions = transactions;
    }

    [HttpGet]
    public async Task<IActionResult> GetByUser([FromQuery] string userId)
    {
        if (string.IsNullOrWhiteSpace(userId))
            return BadRequest("userId is required.");

        var results = await _transactions.GetByUserIdAsync(userId);
        return Ok(results);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateTransactionRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.UserId))
            return BadRequest("userId is required.");
        if (string.IsNullOrWhiteSpace(request.Description))
            return BadRequest("Description is required.");
        if (request.Amount <= 0)
            return BadRequest("Amount must be greater than 0.");
        if (request.Type is not ("income" or "expense"))
            return BadRequest("Type must be income or expense.");

        var transaction = new Transaction
        {
            UserId = request.UserId.Trim(),
            Description = request.Description.Trim(),
            Amount = request.Amount,
            Type = request.Type,
            Category = string.IsNullOrWhiteSpace(request.Category) ? null : request.Category.Trim(),
            DateUtc = request.DateUtc ?? DateTime.UtcNow
        };

        var created = await _transactions.CreateAsync(transaction);
        return Ok(created);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, UpdateTransactionRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.UserId))
            return BadRequest("userId is required.");
        if (string.IsNullOrWhiteSpace(request.Description))
            return BadRequest("Description is required.");
        if (request.Amount <= 0)
            return BadRequest("Amount must be greater than 0.");
        if (request.Type is not ("income" or "expense"))
            return BadRequest("Type must be income or expense.");

        var update = new Transaction
        {
            UserId = request.UserId.Trim(),
            Description = request.Description.Trim(),
            Amount = request.Amount,
            Type = request.Type,
            Category = string.IsNullOrWhiteSpace(request.Category) ? null : request.Category.Trim(),
            DateUtc = request.DateUtc ?? DateTime.UtcNow
        };

        var updated = await _transactions.UpdateAsync(id, request.UserId.Trim(), update);
        return updated == null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id, [FromQuery] string userId)
    {
        if (string.IsNullOrWhiteSpace(userId))
            return BadRequest("userId is required.");

        var deleted = await _transactions.DeleteAsync(id, userId);
        return deleted ? NoContent() : NotFound();
    }
}