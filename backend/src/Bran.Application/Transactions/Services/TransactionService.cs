using Bran.Domain.Interfaces;
using Bran.Domain.ValueObjects;
using System;
using System.Collections.Generic;
using System.Text;
using Bran.Domain.Entities;

namespace Bran.Application.Transactions.Services
{
    public class TransactionService 
    {
        private readonly IClientsRepository _clientsRepository;
        private readonly ITransactionsRepository _transactionsRepository;
        private readonly TransactionEvaluationService _evaluationService;
        private readonly IAlertsRepository _alertsRepository;

        public TransactionService(IClientsRepository clientsRepository, ITransactionsRepository transactionsRepository, TransactionEvaluationService evaluationService, IAlertsRepository alertsRepository)
        {
            _clientsRepository = clientsRepository;
            _transactionsRepository = transactionsRepository;
            _evaluationService = evaluationService;
            _alertsRepository = alertsRepository;
        }

        public async Task<Transaction> CreateAsync(
            Guid clientId,
            TransactionType transactionType,
            double amount,
            string currency,
            Guid counterpartyId,
            DateTime dateHour,
            string country)
        {
            var client = await _clientsRepository.GetByIdAsync(clientId);

            if (client is null)
                throw new Exception("Client not found");

            // Domínio forte: valida tudo no construtor
            var transaction = new Transaction(
                clientId,
                transactionType,
                amount,
                currency,
                counterpartyId,
                dateHour,
                country
            );

            await _transactionsRepository.AddAsync(transaction);

            // Avaliação pós-criação
            await _evaluationService.EvaluateTransactionAsync(transaction.Id);

            return transaction;
        }
    }
}
