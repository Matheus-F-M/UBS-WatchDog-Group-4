using Bran.Domain.Interfaces;
using Bran.Domain.Entities;
using Bran.Domain.ValueObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using Bran.Domain.ContextObjects;

namespace Bran.Domain.ComplianceRules
{
    public class TransactionRiskCountryRule : IComplianceRule
    {
        private readonly HashSet<string> _riskCountries;
        public string Name => "Transfer to Risk Country";

        public TransactionRiskCountryRule(IEnumerable<string> riskCountries)
        {
            _riskCountries = new HashSet<string>(riskCountries, StringComparer.OrdinalIgnoreCase);
        }

        public Alert? Validate(ComplianceContext complianceContext)
        {
            if (_riskCountries.Contains(complianceContext.OriginCountry) ||
                _riskCountries.Contains(complianceContext.DestinationCountry))
            {
                var lastTransaction = complianceContext.RecentTransactions
                    .Where(t => t.ClientId == complianceContext.ClientId)
                    .OrderByDescending(t => t.DateHour)
                    .FirstOrDefault();

                if (lastTransaction != null)
                {
                    return new Alert(
                        complianceContext.ClientId,
                        lastTransaction.Id,
                        Name,
                        AlertSeverity.Medium
                    );
                }
            }

            return null;
        }
    }
}