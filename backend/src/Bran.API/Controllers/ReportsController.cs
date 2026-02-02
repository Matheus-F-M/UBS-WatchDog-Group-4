using Bran.API.DTOs.Reports;
using Bran.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace Bran.API.Controllers
{
    [ApiController]
    [Route("api/v1/reports")]
    public class ReportsController : ControllerBase
    {
        private readonly ReportService _reportService;

        public ReportsController(ReportService reportService)
        {
            _reportService = reportService;
        }

        /// <summary>
        /// Relatório de um cliente específico no período informado.
        /// </summary>
        [HttpGet("client/{clientId:guid}")]
        public async Task<IActionResult> GetClientReport(Guid clientId, DateTime startDate, DateTime endDate)
        {
            var report = await _reportService.GenerateClientReportAsync(clientId, startDate, endDate);

            if (report is null)
                return NotFound();

            var response = new ReportResponse
            {
                ClientId = report.ClientId,
                ClientName = report.ClientName,
                TotalAmount = report.TotalAmount,
                AlertCount = report.AlertCount,
                PeriodStart = report.PeriodStart,
                PeriodEnd = report.PeriodEnd
            };

            return Ok(response);
        }

        /// <summary>
        /// Relatórios de todos os clientes no período informado.
        /// </summary>
        [HttpGet("all")]
        public async Task<IActionResult> GetAllReports(DateTime startDate, DateTime endDate)
        {
            var reports = await _reportService.GenerateAllClientsReportAsync(startDate, endDate);

            var response = reports.Select(report => new ReportResponse
            {
                ClientId = report.ClientId,
                ClientName = report.ClientName,
                TotalAmount = report.TotalAmount,
                AlertCount = report.AlertCount,
                PeriodStart = report.PeriodStart,
                PeriodEnd = report.PeriodEnd
            });

            return Ok(response);
        }
    }
}