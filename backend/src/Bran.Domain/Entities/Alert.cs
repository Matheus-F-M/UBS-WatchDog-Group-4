using Bran.Domain.ValueObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bran.Domain.Entities
{
    public class Alert
    {
        public Guid Id { get; private set; }
        public Guid ClientId { get; private set; }
        public Guid TransactionId { get; private set; }
        public string Name { get; private set; }
        public AlertSeverity Severity { get; private set; }
        public AlertStatus Status { get; private set; }
        public DateTime CreatedAt { get; private set; }

        protected Alert() { }

        public Alert(Guid clientId, Guid transactionId, string name, AlertSeverity severity)
        {
            Id = Guid.NewGuid();
            ClientId = clientId;
            TransactionId = transactionId;
            Name = name;
            Severity = severity;
            Status = AlertStatus.New;
            CreatedAt = DateTime.UtcNow;
        }
        public override string ToString()
        {
            return $"Alert - ID: {Id}, ClientID: {ClientId}, TransactionID: {TransactionId}, Ruke: {Name}, Severity: {Severity}, Status: {Status}, CreatedAt: {CreatedAt}";
        }
    }
}
