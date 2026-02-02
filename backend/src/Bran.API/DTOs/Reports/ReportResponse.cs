namespace Bran.API.DTOs.Reports
{
    public class ReportResponse
    {
        public Guid ClientId { get; set; }
        public string ClientName { get; set; }
        public decimal TotalAmount { get; set; }
        public int AlertCount { get; set; }
        public DateTime PeriodStart { get; set; }
        public DateTime PeriodEnd { get; set; }
    }
}

