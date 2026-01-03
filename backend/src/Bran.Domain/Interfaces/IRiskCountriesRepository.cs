using Bran.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bran.Domain.Interfaces
{
    public interface IRiskCountriesRepository
    {
        Task<IReadOnlyCollection<string>> GetAllAsync(CancellationToken ct = default);
        Task<string?> GetByNameAsync(string countryName, CancellationToken ct = default);
        Task AddAsync(string countryName, CancellationToken ct = default);
        Task DeleteAsync(string countryName, CancellationToken ct = default);
    }
}
