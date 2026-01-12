using Bran.Domain.Entities;
using Bran.Domain.ValueObjects;
using System;
using System.Collections.Generic;
using System.Text;

namespace Bran.Application.Clients.Interfaces
{
    public interface IClientService
    {
        Task<Client> CreateClientAsync(string name, string document, ClientType type, string country, double income);

        Task<Client?> UpdateAsync(Guid clientId, string name, string country, ClientType type, double income);
        Task<Client?> GetByIdAsync(Guid clientId);
        Task<IReadOnlyCollection<Client>> GetAllAsync();
        Task<bool> DeleteAsync(Guid clientId);
    }
}
