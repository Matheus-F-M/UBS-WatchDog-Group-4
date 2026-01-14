using Bran.Domain.ContextObjects;
using Bran.Domain.Entities;
using Bran.Domain.Interfaces;
using Bran.Domain.ValueObjects;

public class TransactionRiskCountryRule : IComplianceRule
{
    private readonly ICountriesRepository _countriesRepository;
    public string Name => "Transfer to High Risk Country";

    public TransactionRiskCountryRule(ICountriesRepository countriesRepository)
    {
        _countriesRepository = countriesRepository;
    }

    public async Task<Alert?> ValidateAsync(ComplianceContext complianceContext)
    {
        var countries = await _countriesRepository.GetAllAsync();

        var highRiskCodes = countries
            .Where(c => c.RiskLevel == CountryRiskLevel.High)
            .Select(c => c.CountryCode)
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

        if (highRiskCodes.Contains(complianceContext.OriginCountry) ||
            highRiskCodes.Contains(complianceContext.DestinationCountry))
        {
            var lastTransaction = complianceContext.CurrentTransaction;

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