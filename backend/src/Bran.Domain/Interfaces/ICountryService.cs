using Bran.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Bran.Application.Countries.Interfaces
{
    public interface ICountryService
    {
        Task<IReadOnlyCollection<Country>> GetAllAsync();
        Task<Country?> GetByCodeAsync(string code);
    }
}
