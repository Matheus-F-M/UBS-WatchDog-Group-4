using Bran.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Bran.Domain.Interfaces
{
    public interface ICurrencyRepository
    {
        Task<Currency?> GetByCodeAsync(string code);
        Task<List<Currency>> GetAllAsync();
        Task AddAsync(Currency currency);
        Task UpdateAsync(Currency currency);
    }
}
