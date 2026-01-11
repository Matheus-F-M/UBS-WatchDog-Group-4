using Bran.Domain.Entities;
using Bran.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace Bran.Domain.Strategy
{
    public class ClientRiskCalculator
    {
        private readonly IEnumerable<IClientRiskRule> _rules;

        public ClientRiskCalculator(IEnumerable<IClientRiskRule> rules)
        {
            _rules = rules;
        }

        public int Calculate(Client client)
        {
            return _rules.Sum(rule => rule.CalculatePoints(client));
        }
    }
}
