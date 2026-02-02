namespace LifeBudget.Api.Dtos;

public record CreateTransactionRequest(
    string UserId,
    string Description,
    decimal Amount,
    string Type,
    string? Category,
    DateTime? DateUtc
);

public record UpdateTransactionRequest(
    string UserId,
    string Description,
    decimal Amount,
    string Type,
    string? Category,
    DateTime? DateUtc
);
