using Bran.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Bran.Domain.Interfaces
{
    public interface IRiskRule
    {
        int CalculatePoints(Client client);
    }
}
