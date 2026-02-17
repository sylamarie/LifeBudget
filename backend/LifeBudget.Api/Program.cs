using LifeBudget.Api.Configuration;
using LifeBudget.Api.Services;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);

// Controllers
builder.Services.AddControllers();

// Swagger / OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS: Dev + Producción
builder.Services.AddCors(options =>
{
    options.AddPolicy("DevCors", policy =>
    {
        var allowedOrigins = new List<string>
        {
            "http://localhost:5173" // frontend desarrollo
        };

        var productionUrl = Environment.GetEnvironmentVariable("FRONTEND_URL");
        if (!string.IsNullOrWhiteSpace(productionUrl))
        {
            allowedOrigins.Add(productionUrl.TrimEnd('/'));
        }

        policy.WithOrigins(allowedOrigins.ToArray())
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Configuración MongoDB
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

// Repositories
builder.Services.AddSingleton<UserRepository>();
builder.Services.AddSingleton<TransactionRepository>();
builder.Services.AddSingleton<GoalRepository>();
builder.Services.AddSingleton<BillRepository>();
builder.Services.AddSingleton<BudgetRepository>();

var app = builder.Build();

// Swagger
app.UseSwagger();
app.UseSwaggerUI();

// CORS
app.UseCors("DevCors");

app.MapControllers();

// Ejemplo endpoint de prueba
var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast = Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
});

// Puerto dinámico para Render
var port = Environment.GetEnvironmentVariable("PORT") ?? "5274";
app.Run($"http://0.0.0.0:{port}");

// Record para el endpoint de prueba
record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
