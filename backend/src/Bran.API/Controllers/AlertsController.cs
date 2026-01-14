using Bran.Application.Services;
using Bran.Domain.ValueObjects;
using Microsoft.AspNetCore.Mvc;

namespace Bran.API.Controllers
{
    [ApiController]
    [Route("api/v1/alerts")]
    public class AlertsController : ControllerBase
    {
        private readonly AlertServices _alertService;

        public AlertsController(AlertServices alertService)
        {
            _alertService = alertService;
        }

        [HttpGet("{id:guid}")]

        public async Task<IActionResult> GetById(Guid id)
        {
            var alert = await _alertService.GetAlertAsync(id);
            if (alert is null)
                return NotFound();
            return Ok(alert);
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var alerts = await _alertService.GetAllAlertsAsync();
            return Ok(alerts);
        }

        [HttpGet("client/{clientId:guid}")]
        public async Task<IActionResult> GetByClient(Guid clientId)
        {
            var alerts = await _alertService.GetAlertsByClientIdAsync(clientId);
            return Ok(alerts);
        }

        [HttpGet("status/{status}")]
        public async Task<IActionResult> GetByStatus(AlertStatus status)
        {
            var alerts = await _alertService.GetAlertsByStatusAsync(status);
            return Ok(alerts);
        }

        [HttpGet("severity/{severity}")]
        public async Task<IActionResult> GetBySeverity(AlertSeverity severity)
        {
            var alerts = await _alertService.GetAlertsBySeverityAsync(severity);
            return Ok(alerts);
        }

        [HttpGet("transaction/{transactionId:guid}")]
        public async Task<IActionResult> GetByTransaction(Guid transactionId)
        {
            var alerts = await _alertService.GetByTransactionIdAsync(transactionId);
            return Ok(alerts);
        }

        [HttpGet("period")]
        public async Task<IActionResult> GetByPeriod(Guid clientId, DateTime startDate, DateTime endDate)
        {
            var alerts = await _alertService.GetByClientAndPeriodAsync(clientId, startDate, endDate);
            return Ok(alerts);
        }

        [HttpPut("{alertId:guid}/status")]
        public async Task<IActionResult> UpdateStatus(Guid alertId, [FromBody] AlertStatus newStatus)
        {
            await _alertService.UpdateStausAsync(alertId, newStatus);
            return NoContent();
        }
    }
}
