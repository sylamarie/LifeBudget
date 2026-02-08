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

    public async Task<Bill?> UpdateStatusAsync(string id, string userId, string status, DateTime? lastPaidUtc)
    {
        var filter = Builders<Bill>.Filter.Where(b => b.Id == id && b.UserId == userId);
        var update = Builders<Bill>.Update
            .Set(b => b.Status, status)
            .Set(b => b.LastPaidUtc, lastPaidUtc);
        var options = new FindOneAndUpdateOptions<Bill>
        {
            ReturnDocument = ReturnDocument.After
        };

        return await _bills.FindOneAndUpdateAsync(filter, update, options);
    }

    public async Task<Bill?> UpdateAsync(string id, string userId, Bill update)
    {
        var filter = Builders<Bill>.Filter.Where(b => b.Id == id && b.UserId == userId);
        var updateDef = Builders<Bill>.Update
            .Set(b => b.Name, update.Name)
            .Set(b => b.Amount, update.Amount)
            .Set(b => b.DueDay, update.DueDay)
            .Set(b => b.IsRecurring, update.IsRecurring)
            .Set(b => b.Status, update.Status)
            .Set(b => b.LastPaidUtc, update.LastPaidUtc);

        var options = new FindOneAndUpdateOptions<Bill>
        {
            ReturnDocument = ReturnDocument.After
        };

        return await _bills.FindOneAndUpdateAsync(filter, updateDef, options);
    }
}
