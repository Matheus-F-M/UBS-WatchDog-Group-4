using Bran.Domain.ValueObjects;

namespace Bran.API.DTOs.Transactions
{
    public class TransactionResponse
    {
        public Guid Id { get; set; }
        public Guid ClientId { get; set; }
        public TransactionType TransactionType { get; set; }
        public double Amount { get; set; }
        public string Currency { get; set; }
        public Guid CounterpartyId { get; set; }
        public DateTime DateHour { get; set; }
    }
}
