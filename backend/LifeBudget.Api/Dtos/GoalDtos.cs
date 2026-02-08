namespace LifeBudget.Api.Dtos;

public record CreateGoalRequest(
    string UserId,
    string Name,
    decimal TargetAmount,
    decimal CurrentAmount,
    DateTime? TargetDateUtc
);

public record UpdateGoalRequest(
    string UserId,
    string Name,
    decimal TargetAmount,
    decimal CurrentAmount,
    DateTime? TargetDateUtc
);

