using Bran.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Bran.Domain.Interfaces
{
    public interface IClientRiskRule
    {
        int CalculatePoints(Client client);
    }
}
