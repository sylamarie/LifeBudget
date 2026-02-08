using LifeBudget.Api.Models;
using MongoDB.Driver;

namespace LifeBudget.Api.Services;

public class BillRepository
{
    private readonly IMongoCollection<Bill> _bills;

    public BillRepository(IMongoDatabase db)
    {
        _bills = db.GetCollection<Bill>("bills");
    }

    public async Task<List<Bill>> GetByUserIdAsync(string userId)
    {
        return await _bills
            .Find(b => b.UserId == userId)
            .SortBy(b => b.DueDay)
            .ToListAsync();
    }

    public async Task<Bill> CreateAsync(Bill bill)
    {
        await _bills.InsertOneAsync(bill);
        return bill;
    }

    public async Task<bool> DeleteAsync(string id, string userId)
    {
        var result = await _bills.DeleteOneAsync(
            b => b.Id == id && b.UserId == userId
        );

        return result.DeletedCount > 0;
    }
}
