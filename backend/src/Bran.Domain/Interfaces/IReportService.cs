using Bran.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Bran.Domain.Interfaces
{
    public interface IReportService
    {
        Task<Report>GenerateClientReportAsync(Guid clientId, DateTime startDate, DateTime endDate);
    }
}
