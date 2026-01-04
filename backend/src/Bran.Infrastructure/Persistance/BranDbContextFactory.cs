using Bran.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Bran.Infrastructure.Persistence
{
    public class BranDbContextFactory
        : IDesignTimeDbContextFactory<BranDbContext>
    {
        public BranDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<BranDbContext>();

            optionsBuilder.UseNpgsql(
                "Host=localhost;Port=5432;Database=bran_db;Username=postgres;Password=postgres"
            );

            return new BranDbContext(optionsBuilder.Options);
        }
    }
}
