using Bran.Domain.ValueObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bran.Domain.Entities
{
    public class Client
    {
        public Guid Id { get; private set; }
        public string Name { get; private set; }
        public string Country { get; private set; }
        public RiskLevel RiskLevel { get; private set; }
        public KycStatus KycStatus { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public DateTime UpdatedAt { get; private set; }
        public string GovernmentId { get; private set; }
        public bool isPF { get; private set; }
        
        protected Client() { }

        public Client(string name, string country, RiskLevel riskLevel, KycStatus kycStatus, string governmentId)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Name cannot be null or empty.", nameof(name));
            if (string.IsNullOrWhiteSpace(country))
                throw new ArgumentException("Country cannot be null or empty.", nameof(country));

            Id = Guid.NewGuid();
            Name = name;
            Country = country;
            RiskLevel = riskLevel;
            KycStatus = kycStatus;
            CreatedAt = DateTime.UtcNow;
            UpdatedAt = DateTime.UtcNow;
            GovernmentId = governmentId;
            isPF = true;
        }
        public override string ToString()
        {
            return $"Client - ID: {Id}, Name: {Name}, Country: {Country}, RiskLevel: {RiskLevel}, KycStatus: {KycStatus}, CreatedAt: {CreatedAt}, UpdatedAt: {UpdatedAt}, isPF: {isPF}";
        }

    }
}
