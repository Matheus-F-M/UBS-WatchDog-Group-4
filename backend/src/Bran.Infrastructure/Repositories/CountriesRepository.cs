using Bran.Domain.Entities;
using Bran.Domain.Interfaces;
using Bran.Domain.ValueObjects;
using Bran.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bran.Infrastructure.Repositories
{
    public class CountriesRepository : ICountriesRepository
    {
        private readonly BranDbContext _context;
        public CountriesRepository(BranDbContext context)
        {
            _context = context;
        }
        public async Task AddAsync(Country country, CancellationToken ct = default)
        {
            var riskCountry = country;
            await _context.Countries.AddAsync(riskCountry, ct);
            await _context.SaveChangesAsync(ct);
        }
        public async Task DeleteAsync(string countryName, CancellationToken ct = default)
        {
            var riskCountry = await _context.Countries
                .FirstOrDefaultAsync(rc => rc.Name == countryName, ct);
            if (riskCountry != null)
            {
                _context.Countries.Remove(riskCountry);
                await _context.SaveChangesAsync(ct);
            }
        }
        public async Task<IReadOnlyCollection<string>> GetAllAsync(CancellationToken ct = default)
        {
            return await _context.Countries
                .Select(rc => rc.Name)
                .ToListAsync(ct);
        }
        public async Task<string?> GetByNameAsync(string countryName, CancellationToken ct = default)
        {
            var riskCountry = await _context.Countries
                .FirstOrDefaultAsync(rc => rc.Name == countryName, ct);
            return riskCountry?.Name;
        }

        public CountryRiskLevel GetRiskLevel(string countryCode)
        {
            var country = _context.Countries
                .FirstOrDefault(c => c.CountryCode == countryCode.ToUpper());

            return country?.RiskLevel ?? CountryRiskLevel.Low;
        }

        public async Task<IReadOnlyCollection<Country>> GetAllAsync()
        {
            return await _context.Countries
                .AsNoTracking()
                .OrderBy(c => c.Name)
                .ToListAsync();
        }

        public async Task<Country?> GetByCodeAsync(string code)
        {
            return await _context.Countries
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.CountryCode == code);
        }
    }
}
