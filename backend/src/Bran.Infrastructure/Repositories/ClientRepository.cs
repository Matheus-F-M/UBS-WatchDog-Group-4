using Bran.Domain.Entities;
using Bran.Domain.Interfaces;
using Bran.Domain.ValueObjects;
using Bran.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Bran.Infrastructure.Repositories
{
    public class ClientRepository : IClientsRepository
    {
        private readonly BranDbContext _context;

        public ClientRepository(BranDbContext context)
        {
            _context = context;
        }

        public async Task<Client?> GetByIdAsync(Guid clientId)
        {
            return await _context.Clients
                .FirstOrDefaultAsync(c => c.Id == clientId);
        }

        public async Task<IReadOnlyCollection<Client>> GetAllAsync()
        {
            return await _context.Clients
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task AddAsync(Client client)
        {
            await _context.Clients.AddAsync(client);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Client client)
        {
            _context.Clients.Update(client);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid clientId)
        {
            var client = await _context.Clients.FindAsync(clientId);
            if (client != null)
            {
                _context.Clients.Remove(client);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> ExistsAsync(Guid clientId)
        {
            return await _context.Clients.AnyAsync(c => c.Id == clientId);
        }

        public async Task<IReadOnlyCollection<Client>> GetByKycStatusAsync(KycStatus kycStatus)
        {
            return await _context.Clients
                .Where(c => c.KycStatus == kycStatus)
                .ToListAsync();
        }

        public async Task<IReadOnlyCollection<Client>> GetByRiskLevelAsync(ClientRiskLevel riskLevel)
        {
            return await _context.Clients
                .Where(c => c.RiskLevel == riskLevel)
                .ToListAsync();
        }

        public async Task<IReadOnlyCollection<Client>> GetByCountryAsync(string country)
        {
            return await _context.Clients
                .Where(c => c.Country == country)
                .ToListAsync();
        }
    }
}