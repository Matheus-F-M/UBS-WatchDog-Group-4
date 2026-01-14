using Bran.Domain.ValueObjects;

namespace Bran.API.DTOs.Clients
{
    public class ClientResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Country { get; set; }
        public ClientType Type { get; set; }
        public double Income { get; set; }
        public ClientRiskLevel RiskLevel { get; set; }
        public KycStatus KycStatus { get; set; }
        public string GovernmentId { get; set; }
        public bool isActive { get; set; }
    }
}
