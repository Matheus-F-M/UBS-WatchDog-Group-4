using Bran.Domain.Entities;
using Bran.Domain.Interfaces;
using Bran.Domain.ValueObjects;
using System;
using System.Collections.Generic;
using System.Text;

namespace Bran.Domain.Rules.Clients
{
    public class ClientTypeRiskRule : IClientRiskRule
    {
        public int CalculatePoints(Client client)
        {
            if (client.Type == ClientType.PJ)
                return 2;

            return 1; // PF
        }
    }
}
