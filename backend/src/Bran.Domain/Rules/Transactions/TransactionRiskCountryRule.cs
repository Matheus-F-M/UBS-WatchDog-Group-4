using Bran.Domain.Interfaces;
using Bran.Domain.Entities;
using Bran.Domain.ValueObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using Bran.Domain.ContextObjects;

namespace Bran.Domain.Rules.Transactions
{
    public class TransactionRiskCountryRule : IComplianceRule
    {
        private readonly IQueryable<Country> _countries;
        public string Name => "Transfer to High Risk Country";

        public TransactionRiskCountryRule(IQueryable<Country> countries)
        {
            _countries = countries;
        }

        public Alert? Validate(ComplianceContext complianceContext)
        {
            // pega todos os códigos de países com risco alto
            var highRiskCodes = _countries
                .Where(c => c.RiskLevel == CountryRiskLevel.High)
                .Select(c => c.CountryCode)
                .ToHashSet(StringComparer.OrdinalIgnoreCase);

            if (highRiskCodes.Contains(complianceContext.OriginCountry) ||
                highRiskCodes.Contains(complianceContext.DestinationCountry))
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