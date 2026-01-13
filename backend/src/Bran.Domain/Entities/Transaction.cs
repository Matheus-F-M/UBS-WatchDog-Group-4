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
        public double Amount { get; private set; }
        public string Currency { get; private set; }
        public Guid CounterpartyId { get; private set; }
        public DateTime DateHour { get; private set; }
        protected Transaction() { }

        public Transaction(Guid clientId, TransactionType transactionType, double amount, string currency, Guid counterpartyId, DateTime dateHour)
        {
            if (amount <= 0)
                throw new ArgumentException("Amount must be greater than zero.", nameof(amount));
            if (string.IsNullOrWhiteSpace(currency))
                throw new ArgumentNullException(nameof(currency), "Currency cannot be null or empty.");
            if (dateHour > DateTime.UtcNow)
                throw new ArgumentException("DateHour cannot be in the future.", nameof(dateHour));
            if (clientId == Guid.Empty)
                throw new ArgumentException("ClientId cannot be empty.", nameof(clientId));
            if (counterpartyId == Guid.Empty)
                throw new ArgumentException("CounterpartyId cannot be empty.", nameof(counterpartyId));
            if (!Enum.IsDefined(typeof(TransactionType), transactionType))
                throw new ArgumentException("Invalid transaction type.", nameof(transactionType));

            Id = Guid.NewGuid();
            ClientId = clientId;
            TransactionType = transactionType;
            Amount = amount;
            Currency = currency;
            CounterpartyId = counterpartyId;
            DateHour = dateHour;
        }

        public override string ToString()
        {
            return $"Transaction - ID: {Id}, ClientID: {ClientId}, Type: {TransactionType}, Amount: {Amount} {Currency}, CounterpartyID: {CounterpartyId}, DateHour: {DateHour}";
        }
    }

}
