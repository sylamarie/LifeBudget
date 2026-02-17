using LifeBudget.Api.Dtos;
using LifeBudget.Api.Models;
using LifeBudget.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace LifeBudget.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserRepository _users;

    public AuthController(UserRepository users)
    {
        _users = users;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        var password = request.Password;
        var firstName = request.FirstName?.Trim() ?? string.Empty;
        var lastName = request.LastName?.Trim() ?? string.Empty;

        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
            return BadRequest(new { success = false, message = "Email and password are required." });

        if (string.IsNullOrWhiteSpace(firstName) || string.IsNullOrWhiteSpace(lastName))
            return BadRequest(new { success = false, message = "First name and last name are required." });

        var existing = await _users.FindByEmailAsync(email);
        if (existing != null)
            return BadRequest(new { success = false, message = "Email already exists." });

        // TODO: hash password
        var user = new User
        {
            Email = email,
            PasswordHash = password,
            FirstName = firstName,
            LastName = lastName
        };

        await _users.CreateAsync(user);
        var userId = string.IsNullOrWhiteSpace(user.Id) ? user.Email : user.Id;

        return Ok(new
        {
            success = true,
            message = "Registered",
            userId,
            firstName,
            lastName
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        var password = request.Password;

        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
            return BadRequest(new { success = false, message = "Email and password are required." });

        var user = await _users.FindByEmailAsync(email);
        if (user == null)
            return Unauthorized(new { success = false, message = "Invalid credentials" });

        if (user.PasswordHash != password)
            return Unauthorized(new { success = false, message = "Invalid credentials" });

        var loginUserId = string.IsNullOrWhiteSpace(user.Id) ? user.Email : user.Id;
        return Ok(new
        {
            success = true,
            message = "Logged in",
            userId = loginUserId,
            firstName = user.FirstName,
            lastName = user.LastName
        });
    }
}
