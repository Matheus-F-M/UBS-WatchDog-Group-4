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
        private readonly IClientsRepository _clientRepository;
        private readonly ClientRiskCalculator _calculator;

        public ClientService(ICountriesRepository countryRiskRepository, IClientsRepository clientRepository, ClientRiskCalculator calculator)
        {
            _countryRiskRepository = countryRiskRepository;
            _clientRepository = clientRepository;
            _calculator = calculator;
        }

        public async Task<Client> CreateClientAsync(string name, string document, ClientType type, string country, double income)
        {
            var client = new Client(name, country, document, type, income, true);

            var points = _calculator.CalculatePoints(client);

            client.ApplyRiskPoints(points);

            await _clientRepository.AddAsync(client);

            return client;

        }

        public async Task<Client?> UpdateAsync(Guid clientId, string name, string country, ClientType type, double income, KycStatus kycStatus, string governmentId)
        {
            var client = await _clientRepository.GetByIdAsync(clientId);

            if (client is null)
                return null;

            client.UpdateBasicInfo(name, country, type, income, kycStatus, governmentId);

            var points = _calculator.CalculatePoints(client);

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

        public async Task DeactivateClientAsync(Guid clientId)
        {
            var client = await _clientRepository.GetByIdAsync(clientId);
            if (client is null)
                throw new ArgumentException("Client not found.", nameof(clientId));
            await _clientRepository.DeactivateAsync(client);
        }
    }
}
