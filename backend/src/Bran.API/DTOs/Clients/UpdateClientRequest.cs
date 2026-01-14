using Bran.Domain.ValueObjects;

namespace Bran.API.DTOs.Clients
{
    public class UpdateClientRequest
    {
        public string Name { get; set; }
        public string Country { get; set; }
        public string GovernmentId { get; set; }
        public ClientType Type { get; set; }
        public double Income { get; set; }
        public KycStatus KycStatus { get; set; }
    }
}
