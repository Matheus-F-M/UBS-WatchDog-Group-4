using Bran.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Bran.Domain.Interfaces
{
    public interface ITransactionsRepository
    {
        // Recupera uma transação pelo ID
        Task<Transaction?> GetByIdAsync(Guid transactionId);

        // Recupera todas as transações de um cliente
        Task<IReadOnlyCollection<Transaction>> GetByClientIdAsync(Guid clientId);

        // Recupera todas as transações de uma contraparte
        Task<IReadOnlyCollection<Transaction>> GetByCounterpartyIdAsync(Guid counterpartyId);

        // Recupera transações em um intervalo de datas
        Task<IReadOnlyCollection<Transaction>> GetByDateRangeAsync(DateTime startDate, DateTime endDate);
        
        Task<IReadOnlyCollection<Transaction>> GetByClientAndPeriodAsync(Guid clientId, DateTime startDate, DateTime endDate);

        // Adiciona uma nova transação
        Task AddAsync(Transaction transaction);

        // Atualiza uma transação existente
        Task UpdateAsync(Transaction transaction);

        // Remove uma transação
        Task DeleteAsync(Guid transactionId);
        
        Task<IReadOnlyCollection<Transaction>> GetAllAsync();
    }
}