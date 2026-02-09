using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace LifeBudget.Api.Models;

public class CategoryBudget
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    public string UserId { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;

    public decimal MonthlyLimit { get; set; }

    public DateTime MonthUtc { get; set; } = DateTime.UtcNow;
}
