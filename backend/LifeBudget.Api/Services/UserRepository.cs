using LifeBudget.Api.Models;
using MongoDB.Driver;

namespace LifeBudget.Api.Services;

public class UserRepository
{
    private readonly IMongoCollection<User> _users;

    public UserRepository(IMongoDatabase db)
    {
        _users = db.GetCollection<User>("users");
    }

    public async Task<User?> FindByEmailAsync(string email)
    {
        email = email.Trim().ToLowerInvariant();
        return await _users.Find(u => u.Email == email).FirstOrDefaultAsync();
    }

    public async Task CreateAsync(User user)
    {
        user.Email = user.Email.Trim().ToLowerInvariant();
        user.CreatedAtUtc = DateTime.UtcNow;
        if (string.IsNullOrWhiteSpace(user.Id))
        {
            user.Id = MongoDB.Bson.ObjectId.GenerateNewId().ToString();
        }
        await _users.InsertOneAsync(user);
    }
}
