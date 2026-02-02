using Bran.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Bran.Domain.Interfaces
{
    public interface IComplianceConfigsRepository
    {
        Task<IReadOnlyCollection<ComplianceConfigs>> GetByRuleAsync(string ruleName, CancellationToken ct = default);
        Task<ComplianceConfigs?> GetParameterAsync(string ruleName, string key, CancellationToken ct = default);
        Task UpdateParameterAsync(ComplianceConfigs parameter, CancellationToken ct = default);

    }
}
