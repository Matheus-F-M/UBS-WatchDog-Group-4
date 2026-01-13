using Bran.Application.Interfaces;
using Bran.Domain.Entities;
using Bran.Domain.Interfaces;
using Bran.Domain.Strategy;
using Bran.Domain.ValueObjects;

namespace Bran.Application.Services
{
    public class ClientService : IClientService
    {
        private readonly ICountriesRepository _countryRiskRepository;
        private readonly IClientsRepository _clientRepository;

        public ClientService(ICountriesRepository countryRiskRepository, IClientsRepository clientRepository)
        {
            _countryRiskRepository = countryRiskRepository;
            _clientRepository = clientRepository;
        }

        public async Task<Client> CreateClientAsync(string name, string document, ClientType type, string country, double income)
        {
            var client = new Client(name, country, document, type, income);

            var rules = new List<IClientRiskRule> { new ClientTypeRiskRule() };

            var calculator = new ClientRiskCalculator(rules);

            var points = calculator.Calculate(client);

            client.ApplyRiskPoints(points);

            await _clientRepository.AddAsync(client);

            return client;
        }

        public async Task<Client?> UpdateAsync(Guid clientId, string name, string country, ClientType type, double income)
        {
            var client = await _clientRepository.GetByIdAsync(clientId);

            if (client is null)
                return null;

            client.UpdateBasicInfo(name, country, type, income);

            var rules = new List<IClientRiskRule> { new ClientTypeRiskRule() };

            var calculator = new ClientRiskCalculator(rules);
            var points = calculator.Calculate(client);

            client.ApplyRiskPoints(points);

            await _clientRepository.UpdateAsync(client);

            return client;
        }

        public async Task<Client?> GetByIdAsync(Guid clientId)
        {
            return await _clientRepository.GetByIdAsync(clientId);
        }

        public async Task<IReadOnlyCollection<Client>> GetAllAsync()
        {
            return await _clientRepository.GetAllAsync();
        }

        public async Task<bool> DeleteAsync(Guid clientId)
        {
            var exists = await _clientRepository.ExistsAsync(clientId);

            if (!exists)
                return false;

            await _clientRepository.DeleteAsync(clientId);

            return true;
        }
    }
}
