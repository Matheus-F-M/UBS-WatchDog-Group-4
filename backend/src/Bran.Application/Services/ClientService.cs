using Bran.Domain.Entities;
using Bran.Domain.Interfaces;
using Bran.Domain.Strategy;
using Bran.Domain.ValueObjects;
using System;
using System.Collections.Generic;
using System.Text;

namespace Bran.Application.Services
{
    public class ClientService
    {
        private readonly ICountriesRepository _countryRiskRepository;
        private readonly IClientsRepository _clientRepository;

        public ClientService(
            ICountriesRepository countryRiskRepository,
            IClientsRepository clientRepository)
        {
            _countryRiskRepository = countryRiskRepository;
            _clientRepository = clientRepository;
        }

        public async Task<Client> CreateClientAsync(
            string name,
            string document,
            ClientType type,
            string country,
            decimal income)
        {

            var client = new Client(
                name,
                country,
                document,
                type
            );

            var rules = new List<IClientRiskRule>
        {
            new ClientTypeRiskRule(),
        };

            var calculator = new ClientRiskCalculator(rules);

            var points = calculator.Calculate(client);

            client.ApplyRiskPoints(points);

            await _clientRepository.AddAsync(client);

            return client;
        }
    }

}
