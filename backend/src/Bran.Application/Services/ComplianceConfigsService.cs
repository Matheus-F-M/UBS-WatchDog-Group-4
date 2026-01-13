using System;
using System.Collections.Generic;
using System.Text;
using Bran.Domain.Interfaces;

namespace Bran.Application.Services
{
    public class ComplianceConfigsService
    {

        private readonly IComplianceConfigsRepository _complianceConfigsRepository;
        public ComplianceConfigsService(IComplianceConfigsRepository complianceConfigsRepository)
        {
            _complianceConfigsRepository = complianceConfigsRepository;
        }
        public async Task<Dictionary<string, string>> GetRuleParametersAsync(string ruleName, CancellationToken ct = default)
        {
            var parameters = await _complianceConfigsRepository.GetByRuleAsync(ruleName, ct);
            var result = new Dictionary<string, string>();
            foreach (var param in parameters)
            {
                result[param.Key] = param.Value;
            }
            return result;
        }
        public async Task UpdateRuleParameterAsync(string ruleName, string key, string newValue, CancellationToken ct = default)
        {
            var parameter = await _complianceConfigsRepository.GetParameterAsync(ruleName, key, ct);
            if (parameter == null)
            {
                throw new ArgumentException($"Parameter '{key}' for rule '{ruleName}' not found.");
            }
            parameter.UpdateValue(newValue);
            await _complianceConfigsRepository.UpdateParameterAsync(parameter, ct);

        }
    }
}
