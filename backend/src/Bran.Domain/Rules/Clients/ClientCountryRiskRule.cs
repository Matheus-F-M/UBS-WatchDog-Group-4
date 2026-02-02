using Bran.Domain.Entities;
using Bran.Domain.Interfaces;
using Bran.Domain.ValueObjects;
using System;
using System.Collections.Generic;
using System.Text;

namespace Bran.Domain.Rules.Clients
{
    public class CountryRiskRule : IClientRiskRule
    {
        private readonly ICountriesRepository _countriesRepository;

        public CountryRiskRule(ICountriesRepository countriesRepository)
        {
            _countriesRepository = countriesRepository
                ?? throw new ArgumentNullException(nameof(countriesRepository));
        }

        public int CalculatePoints(Client client)
        {
            if (client == null)
                throw new ArgumentNullException(nameof(client));

            if (string.IsNullOrWhiteSpace(client.Country))
                return 0;

            var riskLevel = _countriesRepository.GetRiskLevel(client.Country);

            var points = riskLevel == CountryRiskLevel.High ? 5 :
                         riskLevel == CountryRiskLevel.Medium ? 3 : 1;

            return points;
        }
    }
}
