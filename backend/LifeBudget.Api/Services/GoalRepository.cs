using LifeBudget.Api.Models;
using MongoDB.Driver;

namespace LifeBudget.Api.Services;

public class GoalRepository
{
    private readonly IMongoCollection<Goal> _goals;

    public GoalRepository(IMongoDatabase db)
    {
        _goals = db.GetCollection<Goal>("goals");
    }

    public async Task<List<Goal>> GetByUserIdAsync(string userId)
    {
        return await _goals
            .Find(g => g.UserId == userId)
            .SortByDescending(g => g.CreatedAtUtc)
            .ToListAsync();
    }

    public async Task<Goal> CreateAsync(Goal goal)
    {
        goal.CreatedAtUtc = DateTime.UtcNow;
        await _goals.InsertOneAsync(goal);
        return goal;
    }

    public async Task<Goal?> UpdateAsync(string id, string userId, Goal update)
    {
        var filter = Builders<Goal>.Filter.Where(g => g.Id == id && g.UserId == userId);
        var updateDef = Builders<Goal>.Update
            .Set(g => g.Name, update.Name)
            .Set(g => g.TargetAmount, update.TargetAmount)
            .Set(g => g.CurrentAmount, update.CurrentAmount)
            .Set(g => g.TargetDateUtc, update.TargetDateUtc);

        var options = new FindOneAndUpdateOptions<Goal>
        {
            ReturnDocument = ReturnDocument.After
        };

        return await _goals.FindOneAndUpdateAsync(filter, updateDef, options);
    }

    public async Task<bool> DeleteAsync(string id, string userId)
    {
        var result = await _goals.DeleteOneAsync(g => g.Id == id && g.UserId == userId);
        return result.DeletedCount > 0;
    }
}

