using LifeBudget.Api.Models;
using MongoDB.Driver;

namespace LifeBudget.Api.Services;

public class BudgetRepository
{
    private readonly IMongoCollection<CategoryBudget> _budgets;

    public BudgetRepository(IMongoDatabase db)
    {
        _budgets = db.GetCollection<CategoryBudget>("category_budgets");
    }

    public async Task<List<CategoryBudget>> GetByUserIdAsync(string userId)
    {
        return await _budgets
            .Find(b => b.UserId == userId)
            .SortByDescending(b => b.MonthUtc)
            .ToListAsync();
    }

    public async Task<List<CategoryBudget>> GetByUserIdAndMonthAsync(string userId, DateTime monthUtc)
    {
        return await _budgets
            .Find(b => b.UserId == userId && b.MonthUtc == monthUtc)
            .SortBy(b => b.Category)
            .ToListAsync();
    }

    public async Task<CategoryBudget> CreateAsync(CategoryBudget budget)
    {
        await _budgets.InsertOneAsync(budget);
        return budget;
    }

    public async Task<CategoryBudget?> UpdateAsync(string id, string userId, CategoryBudget update)
    {
        var filter = Builders<CategoryBudget>.Filter.Where(b => b.Id == id && b.UserId == userId);
        var updateDef = Builders<CategoryBudget>.Update
            .Set(b => b.Category, update.Category)
            .Set(b => b.MonthlyLimit, update.MonthlyLimit)
            .Set(b => b.MonthUtc, update.MonthUtc);

        var options = new FindOneAndUpdateOptions<CategoryBudget>
        {
            ReturnDocument = ReturnDocument.After
        };

        return await _budgets.FindOneAndUpdateAsync(filter, updateDef, options);
    }

    public async Task<bool> DeleteAsync(string id, string userId)
    {
        var result = await _budgets.DeleteOneAsync(b => b.Id == id && b.UserId == userId);
        return result.DeletedCount > 0;
    }
}
