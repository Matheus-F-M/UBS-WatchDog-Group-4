using Bran.Domain.ValueObjects;

namespace Bran.API.DTOs.Countries
{
    public class CountryResponse
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public CountryRiskLevel RiskLevel { get; set; }
    }
}
