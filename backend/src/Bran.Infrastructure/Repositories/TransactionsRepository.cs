using Bran.Domain.Entities;
using Bran.Domain.Interfaces;
using Bran.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Bran.Infrastructure.Repositories
{
    public class TransactionsRepository : ITransactionsRepository
    {
        private readonly BranDbContext _dbContext;

        public TransactionsRepository(BranDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Transaction?> GetByIdAsync(Guid transactionId)
        {
            return await _dbContext.Transactions
                .FirstOrDefaultAsync(t => t.Id == transactionId);
        }

        public async Task<IReadOnlyCollection<Transaction>> GetByClientIdAsync(Guid clientId)
        {
            return await _dbContext.Transactions
                .Where(t => t.ClientId == clientId)
                .ToListAsync();
        }

        public async Task<IReadOnlyCollection<Transaction>> GetByCounterpartyIdAsync(Guid counterpartyId)
        {
            return await _dbContext.Transactions
                .Where(t => t.CounterpartyId == counterpartyId)
                .ToListAsync();
        }

        public async Task<IReadOnlyCollection<Transaction>> GetByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            return await _dbContext.Transactions
                .Where(t => t.DateHour >= startDate && t.DateHour <= endDate)
                .ToListAsync();
        }
        public async Task<IReadOnlyCollection<Transaction>> GetByClientAndPeriodAsync(Guid clientId, DateTime startDate, DateTime endDate)
        {
            return await _dbContext.Transactions
                .Where(t => t.ClientId == clientId && t.DateHour >= startDate && t.DateHour <= endDate)
                .ToListAsync();
        }

        public async Task AddAsync(Transaction transaction)
        {
            await _dbContext.Transactions.AddAsync(transaction);
            await _dbContext.SaveChangesAsync();
        }

        public async Task UpdateAsync(Transaction transaction)
        {
            _dbContext.Transactions.Update(transaction);
            await _dbContext.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid transactionId)
        {
            var transaction = await GetByIdAsync(transactionId);
            if (transaction != null)
            {
                _dbContext.Transactions.Remove(transaction);
                await _dbContext.SaveChangesAsync();
            }
        }

        public async Task<IReadOnlyCollection<Transaction>> GetAllAsync()
        {
            return await _dbContext.Transactions
                .AsNoTracking()
                .ToListAsync();
        }
    }

}