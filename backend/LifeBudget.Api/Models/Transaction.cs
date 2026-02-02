using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace LifeBudget.Api.Models;

public class Transaction
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    public string UserId { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    public string Type { get; set; } = "expense";

    public string? Category { get; set; }

    public DateTime DateUtc { get; set; } = DateTime.UtcNow;
}
