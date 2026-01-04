using Bran.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using Bran.Domain.Interfaces;

namespace Bran.Domain.Strategy
{
    public class CountryRiskRule : IClientRiskRule
    {
        private readonly ICountriesRepository _repository;

        public CountryRiskRule(ICountriesRepository repository)
        {
            _repository = repository;
        }

        public int CalculatePoints(Client client)
        {
            var riskLevel = _repository.GetRiskLevel(client.Country);
            return (int)riskLevel;
        }
    }
}
