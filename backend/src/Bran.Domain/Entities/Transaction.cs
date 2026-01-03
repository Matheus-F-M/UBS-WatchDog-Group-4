using Bran.Domain.ValueObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bran.Domain.Entities
{
    public class Transaction
    {
        public Guid Id { get; private set; }
        public Guid ClientId { get; private set; }
        public TransactionType TransactionType { get; private set; }
        public decimal Amount { get; private set; }
        public string Currency { get; private set; }
        public Guid CounterpartyId { get; private set; }
        public DateTime DateHour { get; private set; }
        public string Country { get; private set; }   // <-- novo campo

        protected Transaction() { }

        public Transaction(Guid clientId, TransactionType transactionType, decimal amount, string currency, Guid counterpartyId, DateTime dateHour, string country)
        {
            if (amount <= 0)
                throw new ArgumentException("Amount must be greater than zero.", nameof(amount));
            if (string.IsNullOrWhiteSpace(currency))
                throw new ArgumentNullException(nameof(currency), "Currency cannot be null or empty.");
            if (string.IsNullOrWhiteSpace(country))
                throw new ArgumentNullException(nameof(country), "Country cannot be null or empty.");

            Id = Guid.NewGuid();
            ClientId = clientId;
            TransactionType = transactionType;
            Amount = amount;
            Currency = currency;
            CounterpartyId = counterpartyId;
            DateHour = dateHour;
            Country = country;
        }

        public override string ToString()
        {
            return $"Transaction - ID: {Id}, ClientID: {ClientId}, Type: {TransactionType}, Amount: {Amount} {Currency}, CounterpartyID: {CounterpartyId}, DateHour: {DateHour}";
        }
    }

}
