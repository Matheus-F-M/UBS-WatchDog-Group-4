using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Bran.Domain.ValueObjects;

namespace Bran.Domain.Entities
{
    public class Country
    {
        public Guid Id { get; private set; }
        public string Name { get; private set; }
        public string CountryCode { get; private set; }
        public CountryRiskLevel RiskLevel { get; private set; }
        
        protected Country() { }

        public Country(Guid id,string countryCode, string name, CountryRiskLevel riskLevel)
        {
            Id = id;
            CountryCode = countryCode.ToUpper();
            Name = name;
            RiskLevel = riskLevel;
        }
    }
}
