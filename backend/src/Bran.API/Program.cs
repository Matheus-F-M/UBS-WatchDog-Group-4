using Bran.Application.Services;
using Bran.Domain.Helpers;
using Bran.Domain.Interfaces;
using Bran.Domain.Rules.Clients;
using Bran.Domain.Rules.Transactions;
using Bran.Infrastructure.Persistence;
using Bran.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// ---------------- LOGGING (Serilog) ----------------
Log.Logger = new LoggerConfiguration()
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .CreateLogger();

builder.Host.UseSerilog();

// ---------------- PORTA DINÂMICA ----------------
// Railway/Render/Fly.io injetam a variável PORT
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
builder.WebHost.UseUrls($"http://*:{port}");

// ---------------- SERVICES ----------------
builder.Services.AddControllers();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS (React)
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy
            .WithOrigins(
                "http://localhost:5173",       // dev local
                "https://seu-front.vercel.app" // produção
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// Application Services
builder.Services.AddScoped<ClientService>();
builder.Services.AddScoped<TransactionService>();
builder.Services.AddScoped<TransactionEvaluationService>();
builder.Services.AddScoped<ComplianceService>();
builder.Services.AddScoped<CurrencyService>();
builder.Services.AddScoped<ClientRiskCalculator>();
builder.Services.AddScoped<AlertServices>();

// Repositories
builder.Services.AddScoped<IClientsRepository, ClientRepository>();
builder.Services.AddScoped<ICountriesRepository, CountriesRepository>();
builder.Services.AddScoped<ITransactionsRepository, TransactionsRepository>();
builder.Services.AddScoped<IAlertsRepository, AlertsRepository>();
builder.Services.AddScoped<ICurrencyRepository, CurrencyRepository>();
builder.Services.AddScoped<IComplianceConfigsRepository, ComplianceConfigsRepository>();

// Rules
builder.Services.AddScoped<IClientRiskRule, ClientTypeRiskRule>();
builder.Services.AddScoped<IClientRiskRule, CountryRiskRule>();
builder.Services.AddScoped<IComplianceRule, TransactionDailyLimitRule>();
builder.Services.AddScoped<IComplianceRule, TransactionStructuringRule>();
builder.Services.AddScoped<IComplianceRule, TransactionRiskCountryRule>();

// DbContext (PostgreSQL)
builder.Services.AddDbContext<BranDbContext>(options =>
{
    var connectionString = Environment.GetEnvironmentVariable("DATABASE_PUBLIC_URL");
    if (string.IsNullOrEmpty(connectionString))
    {
        throw new InvalidOperationException("DATABASE_PUBLIC_URL não está definida nas variáveis de ambiente.");
    }
    options.UseNpgsql(connectionString);
});

var app = builder.Build();

// ---------------- PIPELINE ----------------
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseSerilogRequestLogging();
app.UseHttpsRedirection();
app.UseCors("FrontendPolicy");
app.UseAuthorization();
app.MapControllers();

app.Run();
