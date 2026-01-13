using Bran.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
using Bran.Domain.Entities;

namespace Bran.Application.Services
{
    public class CurrencyService
    {
        private readonly ICurrencyRepository _currencyRepository;

        public CurrencyService(ICurrencyRepository currencyRepository)
        {
            _currencyRepository = currencyRepository;
        }

        public async Task<Currency> CreateAsync(
            string code,
            string name,
            decimal exchangeRate)
        {
            var existing = await _currencyRepository.GetByCodeAsync(code);
            if (existing != null)
                throw new InvalidOperationException("Currency already exists.");

            var currency = new Currency(code, name, exchangeRate);

            await _currencyRepository.AddAsync(currency);

            return currency;
        }

        public async Task<List<Currency>> GetAllAsync()
        {
            return await _currencyRepository.GetAllAsync();
        }

        public async Task UpdateRateAsync(string code, decimal newRate)
        {
            var currency = await _currencyRepository.GetByCodeAsync(code);
            if (currency == null)
                throw new ArgumentException("Currency not found.");

            currency.UpdateExchangeRate(newRate);

            await _currencyRepository.UpdateAsync(currency);
        }
    }
}
