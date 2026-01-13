using Bran.Domain.Entities;
using Bran.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Bran.Domain.Helpers
{
    public class ClientRiskCalculator
    {
        private readonly IEnumerable<IClientRiskRule> _rules;

        public ClientRiskCalculator(IEnumerable<IClientRiskRule> rules)
        {
            _rules = rules;
        }

        public int CalculatePoints(Client client)
        {
            return _rules.Sum(rule => rule.CalculatePoints(client));
        }
    }
}

