namespace LifeBudget.Api.Dtos;

public class CreateBillRequest
{
    public string UserId { get; set; } = null!;
    public string Name { get; set; } = null!;
    public decimal Amount { get; set; }
    public int DueDay { get; set; }
    public bool IsRecurring { get; set; }
}

public class UpdateBillStatusRequest
{
    public string UserId { get; set; } = null!;
    public string Status { get; set; } = null!;
}

public class UpdateBillRequest
{
    public string UserId { get; set; } = null!;
    public string Name { get; set; } = null!;
    public decimal Amount { get; set; }
    public int DueDay { get; set; }
    public bool IsRecurring { get; set; }
    public string? Status { get; set; }
}
