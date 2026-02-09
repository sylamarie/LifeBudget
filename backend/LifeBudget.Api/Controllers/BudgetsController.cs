using System.Globalization;
using LifeBudget.Api.Dtos;
using LifeBudget.Api.Models;
using LifeBudget.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace LifeBudget.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BudgetsController : ControllerBase
{
    private readonly BudgetRepository _budgets;

    public BudgetsController(BudgetRepository budgets)
    {
        _budgets = budgets;
    }

    [HttpGet]
    public async Task<IActionResult> GetByUser([FromQuery] string userId, [FromQuery] string? month)
    {
        if (string.IsNullOrWhiteSpace(userId))
            return BadRequest("userId is required.");

        if (string.IsNullOrWhiteSpace(month))
        {
            var results = await _budgets.GetByUserIdAsync(userId);
            return Ok(results);
        }

        if (!TryParseMonth(month, out var monthUtc))
            return BadRequest("month must be in YYYY-MM format.");

        var filtered = await _budgets.GetByUserIdAndMonthAsync(userId, monthUtc);
        return Ok(filtered);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateBudgetRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.UserId))
            return BadRequest("userId is required.");
        if (string.IsNullOrWhiteSpace(request.Category))
            return BadRequest("category is required.");
        if (request.MonthlyLimit <= 0)
            return BadRequest("monthlyLimit must be greater than 0.");

        var monthUtc = NormalizeMonth(request.MonthUtc ?? DateTime.UtcNow);

        var budget = new CategoryBudget
        {
            UserId = request.UserId.Trim(),
            Category = request.Category.Trim(),
            MonthlyLimit = request.MonthlyLimit,
            MonthUtc = monthUtc
        };

        var created = await _budgets.CreateAsync(budget);
        return Ok(created);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, UpdateBudgetRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.UserId))
            return BadRequest("userId is required.");
        if (string.IsNullOrWhiteSpace(request.Category))
            return BadRequest("category is required.");
        if (request.MonthlyLimit <= 0)
            return BadRequest("monthlyLimit must be greater than 0.");

        var monthUtc = NormalizeMonth(request.MonthUtc ?? DateTime.UtcNow);

        var update = new CategoryBudget
        {
            UserId = request.UserId.Trim(),
            Category = request.Category.Trim(),
            MonthlyLimit = request.MonthlyLimit,
            MonthUtc = monthUtc
        };

        var updated = await _budgets.UpdateAsync(id, request.UserId.Trim(), update);
        return updated == null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id, [FromQuery] string userId)
    {
        if (string.IsNullOrWhiteSpace(userId))
            return BadRequest("userId is required.");

        var deleted = await _budgets.DeleteAsync(id, userId);
        return deleted ? NoContent() : NotFound();
    }

    private static DateTime NormalizeMonth(DateTime input)
    {
        var utc = input.Kind == DateTimeKind.Utc ? input : input.ToUniversalTime();
        return new DateTime(utc.Year, utc.Month, 1, 0, 0, 0, DateTimeKind.Utc);
    }

    private static bool TryParseMonth(string value, out DateTime monthUtc)
    {
        if (DateTime.TryParseExact(
                value,
                "yyyy-MM",
                CultureInfo.InvariantCulture,
                DateTimeStyles.AssumeUniversal | DateTimeStyles.AdjustToUniversal,
                out var parsed))
        {
            monthUtc = NormalizeMonth(parsed);
            return true;
        }

        monthUtc = default;
        return false;
    }
}
