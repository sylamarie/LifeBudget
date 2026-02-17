using LifeBudget.Api.Configuration;
using LifeBudget.Api.Services;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("DevCors", policy =>
    {
        var allowedOrigins = new List<string> { "http://localhost:5173" };
        
        // Add production frontend URL from environment variable
        var productionUrl = Environment.GetEnvironmentVariable("FRONTEND_URL");
        if (!string.IsNullOrWhiteSpace(productionUrl))
        {
            allowedOrigins.Add(productionUrl);
        }
        
        policy.WithOrigins(allowedOrigins.ToArray())
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

builder.Services.Configure<MongoDbSettings>(
    builder.Configuration.GetSection("MongoDb"));

builder.Services.AddSingleton<IMongoClient>(sp =>
{
    var settings = sp.GetRequiredService<IOptions<MongoDbSettings>>().Value;
    var envConnection = Environment.GetEnvironmentVariable("MONGODB_URI");
    var connectionString = string.IsNullOrWhiteSpace(envConnection)
        ? settings.ConnectionString
        : envConnection;
    return new MongoClient(connectionString);
});

builder.Services.AddSingleton(sp =>
{
    var settings = sp.GetRequiredService<IOptions<MongoDbSettings>>().Value;
    var client = sp.GetRequiredService<IMongoClient>();
    return client.GetDatabase(settings.DatabaseName);
});

builder.Services.AddSingleton<UserRepository>();
builder.Services.AddSingleton<TransactionRepository>();
builder.Services.AddSingleton<GoalRepository>();
builder.Services.AddSingleton<BillRepository>();
builder.Services.AddSingleton<BudgetRepository>();


var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("DevCors");

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};
app.MapControllers();

app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
});

var port = Environment.GetEnvironmentVariable("PORT");
if (port != null)
{
    // Producción (Render)
    app.Run($"http://0.0.0.0:{port}");
}
else
{
    // Desarrollo local
    app.Run("http://localhost:5274");
}

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
