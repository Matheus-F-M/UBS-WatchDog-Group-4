using Bran.Domain.ContextObjects;
using Bran.Domain.Entities;
using Bran.Domain.Interfaces;
using Bran.Domain.Rules.Transactions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bran.Application.Services
{
    public class ComplianceService
    {
        private readonly IEnumerable<IComplianceRule> _rules; 
        private readonly IAlertsRepository _alertsRepository;

        public ComplianceService(IEnumerable<IComplianceRule> rules, IAlertsRepository alertsRepository)
        {
            _rules = rules;
            _alertsRepository = alertsRepository;
        }

        public async Task ValidateComplianceAsync(ComplianceContext context)
        {
            var alerts = new List<Alert>();
            foreach (var rule in _rules)
            {
                var alert = await rule.ValidateAsync(context);
                if (alert != null)
                {
                    alerts.Add(alert);
                }
            }
            if (alerts.Any())
            {
                await _alertsRepository.AddRangeAsync(alerts);
            }

            Console.WriteLine($"ComplianceService: {alerts.Count} alerts generated");
        }
    }
}
