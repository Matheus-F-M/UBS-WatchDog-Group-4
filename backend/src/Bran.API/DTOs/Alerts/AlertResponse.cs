using Bran.Domain.ValueObjects;

namespace Bran.API.DTOs.Alerts
{
    public class AlertResponse
    {
        public Guid Id { get; set; }
        public Guid ClientId { get; set; }
        public Guid TransactionId { get; set; }
        public string RuleName { get; set; }
        public AlertSeverity Severity { get; set; }
        public DateTime CreatedAt { get; set; }
        public AlertStatus Status { get; set; }

    }
}