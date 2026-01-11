using Bran.Domain.Entities;
using Bran.Domain.ValueObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bran.Domain.Interfaces
{
    public interface ICountriesRepository
    {
        Task<IReadOnlyCollection<string>> GetAllAsync(CancellationToken ct = default);
        Task<string?> GetByNameAsync(string countryName, CancellationToken ct = default);
        Task AddAsync(Country country, CancellationToken ct = default);
        Task DeleteAsync(string countryName, CancellationToken ct = default);
        CountryRiskLevel GetRiskLevel(string countryCode);
        Task<IReadOnlyCollection<Country>> GetAllAsync();
        Task<Country?> GetByCodeAsync(string code);

    }
}
