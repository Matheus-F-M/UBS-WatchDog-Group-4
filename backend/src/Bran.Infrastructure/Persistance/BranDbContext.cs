using Bran.Domain.Entities;
using Bran.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bran.Infrastructure.Persistence
{
    public class BranDbContext : DbContext
    {
        public BranDbContext(DbContextOptions<BranDbContext> options) : base(options) { }
        public DbSet<Client> Clients { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<Alert> Alerts { get; set; }
        public DbSet<Country> Countries { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Currency> Currencies { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Country>().HasData(
                new Country(
                    Guid.Parse("11111111-1111-1111-1111-111111111111"),
                    "BR", "Brazil", CountryRiskLevel.Low
                ),
                new Country(
                    Guid.Parse("22222222-2222-2222-2222-222222222222"),
                    "KP", "North Korea", CountryRiskLevel.High
                ),
                new Country(
                    Guid.Parse("33333333-3333-3333-3333-333333333333"),
                    "IR", "Iran", CountryRiskLevel.High
                ),
                new Country(
                    Guid.Parse("44444444-4444-4444-4444-444444444444"),
                    "MM", "Myanmar", CountryRiskLevel.High
                )
            );

            modelBuilder.Entity<Currency>(entity =>
            {
                entity.HasKey(c => c.Code);

                entity.Property(c => c.Code)
                      .IsRequired()
                      .HasMaxLength(3);

                entity.Property(c => c.Name)
                      .IsRequired()
                      .HasMaxLength(100);

                entity.Property(c => c.DailyRate)
                      .HasPrecision(18, 6);
            });
        }
    }
}