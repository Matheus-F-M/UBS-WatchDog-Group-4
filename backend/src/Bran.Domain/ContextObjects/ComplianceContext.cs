using Bran.Domain.Entities;
using System;
using System.Collections.Generic;

namespace Bran.Domain.ContextObjects
{
    public class ComplianceContext
    {
        public Transaction CurrentTransaction { get; }
        public Guid ClientId { get; private set; }
        public Guid CounterpartyId { get; private set; }
        public string OriginCountry { get; private set; }
        public string DestinationCountry { get; private set; }
        public IEnumerable<Transaction> RecentTransactions { get; private set; }

        /*public ComplianceContext(Guid clientId, Guid counterpartyId, string originCountry, string destinationCountry, IEnumerable<Transaction> recentTransactions)
        {
            ClientId = clientId;
            CounterpartyId = counterpartyId;
            OriginCountry = originCountry;
            DestinationCountry = destinationCountry;
            RecentTransactions = recentTransactions ?? throw new ArgumentNullException(nameof(recentTransactions));
        }*/

        public ComplianceContext(
            Transaction currentTransaction,
            IEnumerable<Transaction> recentTransactions,
            string originCountry,
            string destinationCountry)
        {
            CurrentTransaction = currentTransaction
                ?? throw new ArgumentNullException(nameof(currentTransaction));

            RecentTransactions = recentTransactions?
                .Where(t => t.Id != currentTransaction.Id)
                .ToList()
                ?? throw new ArgumentNullException(nameof(recentTransactions));

            ClientId = currentTransaction.ClientId;
            CounterpartyId = currentTransaction.CounterpartyId;
            OriginCountry = originCountry;
            DestinationCountry = destinationCountry;
        }
    }
}