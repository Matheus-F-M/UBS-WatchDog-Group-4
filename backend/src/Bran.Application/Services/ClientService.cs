using Bran.Domain.Interfaces;
using Bran.Domain.Entities;
using Bran.Domain.Helpers;
using Bran.Domain.Rules.Clients;
using Bran.Domain.ValueObjects;

namespace Bran.Application.Services
{
    public class ClientService
    {
        private readonly ICountriesRepository _countryRiskRepository;
        private readonly IClientsRepository _clientInterface;
        private readonly ClientRiskCalculator _calculator;

        public ClientService(ICountriesRepository countryRiskRepository, IClientsRepository clientRepository, ClientRiskCalculator calculator)
        {
            _countryRiskRepository = countryRiskRepository;
            _clientInterface = clientRepository;
            _calculator = calculator;
        }

        public async Task<Client> CreateClientAsync(string name, string document, ClientType type, string country, double income)
        {
            var client = new Client(name, country, document, type, income);

            var points = _calculator.CalculatePoints(client);

            client.ApplyRiskPoints(points);

            await _clientInterface.AddAsync(client);

            return client;

        }

        public async Task<Client?> UpdateAsync(Guid clientId, string name, string country, ClientType type, double income, KycStatus kycStatus)
        {
            var client = await _clientInterface.GetByIdAsync(clientId);

            if (client is null)
                return null;

            var points = _calculator.CalculatePoints(client);

            client.ApplyRiskPoints(points);

            await _clientInterface.UpdateAsync(client);

            return client;
        }

        public async Task<Client?> GetByIdAsync(Guid clientId)
        {
            return await _clientInterface.GetByIdAsync(clientId);
        }

        public async Task<IReadOnlyCollection<Client>> GetAllAsync()
        {
            return await _clientInterface.GetAllAsync();
        }

        public async Task<bool> DeleteAsync(Guid clientId)
        {
            var exists = await _clientInterface.ExistsAsync(clientId);

            if (!exists)
                return false;

            await _clientInterface.DeleteAsync(clientId);

            return true;
        }
    }
}
