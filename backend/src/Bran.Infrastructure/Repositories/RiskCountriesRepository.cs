using Bran.Domain.Entities;
using Bran.Domain.Interfaces;
using Bran.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bran.Infrastructure.Repositories
{
    public class RiskCountriesRepository : IRiskCountriesRepository
    {
        private readonly BranDbContext _context;
        public RiskCountriesRepository(BranDbContext context)
        {
            _context = context;
        }
        public async Task AddAsync(string countryName, CancellationToken ct = default)
        {
            var riskCountry = new Domain.Entities.RiskCountry
            {
                Id = Guid.NewGuid(),
                Name = countryName
            };
            await _context.RiskCountries.AddAsync(riskCountry, ct);
            await _context.SaveChangesAsync(ct);
        }
        public async Task DeleteAsync(string countryName, CancellationToken ct = default)
        {
            var riskCountry = await _context.RiskCountries
                .FirstOrDefaultAsync(rc => rc.Name == countryName, ct);
            if (riskCountry != null)
            {
                _context.RiskCountries.Remove(riskCountry);
                await _context.SaveChangesAsync(ct);
            }
        }
        public async Task<IReadOnlyCollection<string>> GetAllAsync(CancellationToken ct = default)
        {
            return await _context.RiskCountries
                .Select(rc => rc.Name)
                .ToListAsync(ct);
        }
        public async Task<string?> GetByNameAsync(string countryName, CancellationToken ct = default)
        {
            var riskCountry = await _context.RiskCountries
                .FirstOrDefaultAsync(rc => rc.Name == countryName, ct);
            return riskCountry?.Name;
        }
    }
}
