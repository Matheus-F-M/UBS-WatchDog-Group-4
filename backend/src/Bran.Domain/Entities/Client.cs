using Bran.Domain.ValueObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Bran.Domain.Entities
{
    public class Client
    {
        public Guid Id { get; private set; }
        public string Name { get; private set; }
        public string Country { get; private set; }
        public ClientRiskLevel RiskLevel { get; private set; }
        public KycStatus KycStatus { get; private set; }
        public DateTime CreatedAt { get; private set; }
        public DateTime UpdatedAt { get; private set; }
        public string GovernmentId { get; private set; }
        public ClientType Type { get; private set; }
        public double Income { get; private set; }
        public bool IsActive { get; private set; }

        protected Client() { }

        public Client(string name, string country, string governmentId, ClientType type, double income, bool isActive)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Name cannot be null or empty.", nameof(name));
            if (string.IsNullOrWhiteSpace(country))
                throw new ArgumentException("Country cannot be null or empty.", nameof(country));

            Id = Guid.NewGuid();
            Name = name;
            Country = country;
            KycStatus = 0;
            CreatedAt = DateTime.UtcNow;
            UpdatedAt = DateTime.UtcNow;
            GovernmentId = governmentId;
            Type = type;
            Income = income;
            IsActive = isActive;
        }
        public override string ToString()
        {
            return $"Client - ID: {Id}, Name: {Name}, Country: {Country}, RiskLevel: {RiskLevel}, KycStatus: {KycStatus}, CreatedAt: {CreatedAt}, UpdatedAt: {UpdatedAt}, Type: {Type}, IsActive: {IsActive}";
        }

        public void ApplyRiskPoints(int points)
        {
            if (points < 5)
                RiskLevel = ClientRiskLevel.Low;
            else if (points < 10)
                RiskLevel = ClientRiskLevel.Medium;
            else
                RiskLevel = ClientRiskLevel.High;
        }

        public void UpdateBasicInfo(string name, string country, ClientType type, double income, KycStatus kycStatus, string governmentId)
        {
            Name = name;
            Country = country;
            Type = type;
            Income = income;
            KycStatus = kycStatus;
            UpdatedAt = DateTime.UtcNow;
            GovernmentId = governmentId;
        }

        public void Deactivate()
        {
            IsActive = false;
            UpdatedAt = DateTime.UtcNow;
        }
    }
}
