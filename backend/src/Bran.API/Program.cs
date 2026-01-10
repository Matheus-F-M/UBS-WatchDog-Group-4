using Bran.Application.Clients.Interfaces;
using Bran.Application.Clients.Services;
using Bran.Domain.Interfaces;
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
builder.Services.AddScoped<IClientService, ClientService>();

//Repositories
builder.Services.AddScoped<IClientsRepository, ClientRepository>();
builder.Services.AddScoped<ICountriesRepository, CountriesRepository>();

// Dependency Injection/DbContext (PostgreSQL)
builder.Services.AddDbContext<BranDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")
    )
);

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

app.UseAuthorization();

app.MapControllers();

app.Run();