using Bran.Domain.Entities;
using Bran.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Bran.Application.Services
{
    public class CountryService
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
