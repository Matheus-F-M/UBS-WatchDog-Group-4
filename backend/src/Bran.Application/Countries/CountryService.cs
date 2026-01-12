using Bran.Application.Countries.Interfaces;
using Bran.Domain.Entities;
using Bran.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Bran.Application.Countries
{
    public class CountryService : ICountryService
    {
        private readonly ICountriesRepository _countriesRepository;

        public CountryService(ICountriesRepository countriesRepository)
        {
            _countriesRepository = countriesRepository;
        }

        public async Task<IReadOnlyCollection<Country>> GetAllAsync()
        {
            return await _countriesRepository.GetAllAsync();
        }

        public async Task<Country?> GetByCodeAsync(string code)
        {
            return await _countriesRepository.GetByCodeAsync(code);
        }
    }
}
