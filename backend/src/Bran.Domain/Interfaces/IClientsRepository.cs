using Bran.Domain.Entities;
using Bran.Domain.ValueObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bran.Domain.Interfaces
{
    public interface IClientsRepository
    {
        Task<Client?> GetByIdAsync(Guid clientId);
        Task<IReadOnlyCollection<Client>> GetAllAsync();
        Task AddAsync(Client client);
        Task UpdateAsync(Client client);
        Task DeactivateAsync(Client client);
        Task<bool> ExistsAsync(Guid clientId);
        Task<IReadOnlyCollection<Client>> GetByKycStatusAsync(KycStatus kycStatus);
    }
}
