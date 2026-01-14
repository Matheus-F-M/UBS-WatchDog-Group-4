using Bran.Domain.ContextObjects;
using Bran.Domain.Entities;
using Bran.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bran.Application.Services
{
    public class TransactionEvaluationService
    {
        private readonly IClientsRepository _clientsRepository;
        private readonly ITransactionsRepository _transactionsRepository;
        private readonly ComplianceService _complianceService;

        public TransactionEvaluationService(
            IClientsRepository clientsRepository,
            ITransactionsRepository transactionsRepository,
            ComplianceService complianceService)
        {
            _clientsRepository = clientsRepository;
            _transactionsRepository = transactionsRepository;
            _complianceService = complianceService;
        }

        public async Task EvaluateTransactionAsync(Guid transactionId, CancellationToken ct = default)
        {
            Console.WriteLine($"AVALIAÇÂO");

            var transaction = await _transactionsRepository.GetByIdAsync(transactionId);
            Console.WriteLine($"PEGOU ");
            if (transaction == null)
            {
                throw new ArgumentException("Transaction not found.", nameof(transactionId));
            }
            var client = await _clientsRepository.GetByIdAsync(transaction.ClientId);
            var counterparty = await _clientsRepository.GetByIdAsync(transaction.CounterpartyId);
            var recentTransactions = await _transactionsRepository.GetByClientAndPeriodAsync(
                transaction.ClientId,
                DateTime.UtcNow.AddMonths(-1),
                DateTime.UtcNow);
            var clientRecentTransactions = recentTransactions.ToList();
            //clientRecentTransactions.Add(transaction);
            var complianceContext = new ComplianceContext (
                transaction,
                clientRecentTransactions,
                client.Country,
                counterparty.Country
            );
            await _complianceService.ValidateComplianceAsync(complianceContext);
        }
    }
}
