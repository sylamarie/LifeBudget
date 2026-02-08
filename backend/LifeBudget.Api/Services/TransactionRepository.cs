using LifeBudget.Api.Models;
using MongoDB.Driver;

namespace LifeBudget.Api.Services;

public class TransactionRepository
{
    private readonly IMongoCollection<Transaction> _transactions;

    public TransactionRepository(IMongoDatabase db)
    {
        _transactions = db.GetCollection<Transaction>("transactions");
    }

    public async Task<List<Transaction>> GetByUserIdAsync(string userId)
    {
        return await _transactions
            .Find(t => t.UserId == userId)
            .SortByDescending(t => t.DateUtc)
            .ToListAsync();
    }

    public async Task<Transaction> CreateAsync(Transaction transaction)
    {
        transaction.DateUtc = transaction.DateUtc == default ? DateTime.UtcNow : transaction.DateUtc;
        await _transactions.InsertOneAsync(transaction);
        return transaction;
    }

    public async Task<bool> DeleteAsync(string id, string userId)
    {
        var result = await _transactions.DeleteOneAsync(t => t.Id == id && t.UserId == userId);
        return result.DeletedCount > 0;
    }

    public async Task<Transaction?> UpdateAsync(string id, string userId, Transaction update)
    {
        var filter = Builders<Transaction>.Filter.Where(t => t.Id == id && t.UserId == userId);
        var updateDef = Builders<Transaction>.Update
            .Set(t => t.Description, update.Description)
            .Set(t => t.Amount, update.Amount)
            .Set(t => t.Type, update.Type)
            .Set(t => t.Category, update.Category)
            .Set(t => t.DateUtc, update.DateUtc);

        var options = new FindOneAndUpdateOptions<Transaction>
        {
            ReturnDocument = ReturnDocument.After
        };

        return await _transactions.FindOneAndUpdateAsync(filter, updateDef, options);
    }
}