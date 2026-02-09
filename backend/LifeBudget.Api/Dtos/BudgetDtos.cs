namespace LifeBudget.Api.Dtos;

public record CreateBudgetRequest(
    string UserId,
    string Category,
    decimal MonthlyLimit,
    DateTime? MonthUtc
);

public record UpdateBudgetRequest(
    string UserId,
    string Category,
    decimal MonthlyLimit,
    DateTime? MonthUtc
);
