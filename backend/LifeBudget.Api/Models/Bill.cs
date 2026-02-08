using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace LifeBudget.Api.Models;

public class Bill
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("userId")]
    public string UserId { get; set; } = null!;

    [BsonElement("name")]
    public string Name { get; set; } = null!;

    [BsonElement("amount")]
    public decimal Amount { get; set; }

    [BsonElement("dueDay")]
    public int DueDay { get; set; }  

    [BsonElement("status")]
    public string Status { get; set; } = "upcoming";

    [BsonElement("isRecurring")]
    public bool IsRecurring { get; set; } = false;
}
