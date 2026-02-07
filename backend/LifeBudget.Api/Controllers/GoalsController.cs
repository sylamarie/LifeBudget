using LifeBudget.Api.Dtos;
using LifeBudget.Api.Models;
using LifeBudget.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace LifeBudget.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GoalsController : ControllerBase
{
    private readonly GoalRepository _goals;

    public GoalsController(GoalRepository goals)
    {
        _goals = goals;
    }

    [HttpGet]
    public async Task<IActionResult> GetByUser([FromQuery] string userId)
    {
        if (string.IsNullOrWhiteSpace(userId))
            return BadRequest("userId is required.");

        var results = await _goals.GetByUserIdAsync(userId.Trim());
        return Ok(results);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateGoalRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.UserId))
            return BadRequest("userId is required.");
        if (string.IsNullOrWhiteSpace(request.Name))
            return BadRequest("Name is required.");
        if (request.TargetAmount <= 0)
            return BadRequest("TargetAmount must be greater than 0.");
        if (request.CurrentAmount < 0)
            return BadRequest("CurrentAmount cannot be negative.");

        var goal = new Goal
        {
            UserId = request.UserId.Trim(),
            Name = request.Name.Trim(),
            TargetAmount = request.TargetAmount,
            CurrentAmount = request.CurrentAmount,
            TargetDateUtc = request.TargetDateUtc
        };

        var created = await _goals.CreateAsync(goal);
        return Ok(created);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, UpdateGoalRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.UserId))
            return BadRequest("userId is required.");
        if (string.IsNullOrWhiteSpace(request.Name))
            return BadRequest("Name is required.");
        if (request.TargetAmount <= 0)
            return BadRequest("TargetAmount must be greater than 0.");
        if (request.CurrentAmount < 0)
            return BadRequest("CurrentAmount cannot be negative.");

        var update = new Goal
        {
            UserId = request.UserId.Trim(),
            Name = request.Name.Trim(),
            TargetAmount = request.TargetAmount,
            CurrentAmount = request.CurrentAmount,
            TargetDateUtc = request.TargetDateUtc
        };

        var updated = await _goals.UpdateAsync(id, request.UserId.Trim(), update);
        return updated == null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id, [FromQuery] string userId)
    {
        if (string.IsNullOrWhiteSpace(userId))
            return BadRequest("userId is required.");

        var deleted = await _goals.DeleteAsync(id, userId.Trim());
        return deleted ? NoContent() : NotFound();
    }
}

