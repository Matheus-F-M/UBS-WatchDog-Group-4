using System;
using System.Collections.Generic;
using System.Text;

namespace Bran.Domain.Entities
{
    public class Report
    {
        public Guid ClientId { get; private set; }
        public string ClientName { get; private set; }
        public decimal TotalAmount { get; private set; }
        public int AlertCount { get; private set; }
        public DateTime PeriodStart { get; private set; }
        public DateTime PeriodEnd { get; private set; }

        public Report(Guid clientId, string clientName, decimal totalAmount, int alertCount, DateTime periodStart, DateTime periodEnd)
        {
            ClientId = clientId;
            ClientName = clientName;
            TotalAmount = totalAmount;
            AlertCount = alertCount;
            PeriodStart = periodStart;
            PeriodEnd = periodEnd;
        }
    }
}
