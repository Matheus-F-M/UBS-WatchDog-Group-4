//using Bran.Application.Clients.Interfaces;
//using Bran.Application.Countries.Interfaces;
using Bran.Application.Services;
using Bran.Domain.Helpers;
using Bran.Domain.Interfaces;
using Bran.Domain.Rules.Clients;
using Bran.Domain.Rules.Transactions;
using Bran.Infrastructure.Persistence;
using Bran.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Serilog;
using System;

var builder = WebApplication.CreateBuilder(args);

// ---------------- LOGGING (Serilog) ----------------
Log.Logger = new LoggerConfiguration()
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .CreateLogger();

builder.Host.UseSerilog();

// ---------------- SERVICES ----------------
builder.Services.AddControllers();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS (React)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod());
});

//Application
builder.Services.AddScoped<ClientService>();
//builder.Services.AddScoped<ICountryService, CountryService>();

//Repositories
builder.Services.AddScoped<IClientsRepository, ClientRepository>();
builder.Services.AddScoped<ICountriesRepository, CountriesRepository>();
builder.Services.AddScoped<ITransactionsRepository, TransactionsRepository>();
builder.Services.AddScoped<ICountriesRepository, CountriesRepository>();
builder.Services.AddScoped<TransactionService>();
builder.Services.AddScoped<TransactionEvaluationService>();
builder.Services.AddScoped<ComplianceService>();
builder.Services.AddScoped<IAlertsRepository, AlertsRepository>();
builder.Services.AddScoped<CurrencyService>();
builder.Services.AddScoped<ICurrencyRepository, CurrencyRepository>();
builder.Services.AddScoped<IClientRiskRule, ClientTypeRiskRule>();
builder.Services.AddScoped<IClientRiskRule, CountryRiskRule>();
builder.Services.AddScoped<ClientRiskCalculator>();
builder.Services.AddScoped<IComplianceConfigsRepository, ComplianceConfigsRepository>();
builder.Services.AddScoped<IComplianceRule, TransactionDailyLimitRule>();
builder.Services.AddScoped<IComplianceRule, TransactionStructuringRule>();
builder.Services.AddScoped<IComplianceRule, TransactionRiskCountryRule>();
builder.Services.AddScoped<AlertServices>();

// Dependency Injection/DbContext (PostgreSQL)
builder.Services.AddDbContext<BranDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")
    )
);

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy",
        policy =>
        {
            policy
                .WithOrigins("http://localhost:5173")
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
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

app.UseCors("AllowReact");



app.UseCors("FrontendPolicy");

app.UseAuthorization();

app.MapControllers();

app.Run();