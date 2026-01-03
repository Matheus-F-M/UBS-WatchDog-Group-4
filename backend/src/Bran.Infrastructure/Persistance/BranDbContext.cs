using Microsoft.EntityFrameworkCore;
using Bran.Domain.Entities;
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
        public DbSet<RiskCountry> RiskCountries { get; set; }
        public DbSet<User> Users { get; set; }
    }
}