using Bran.Application.Services;
using Bran.Domain.ValueObjects;
using Bran.API.DTOs.Alerts;
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

        // GET: api/v1/alerts/{id}
        [HttpGet("{id:guid}")]
        public async Task<ActionResult<AlertResponse>> GetById(Guid id)
        {
            var alert = await _alertService.GetAlertAsync(id);
            if (alert is null)
                return NotFound();

            var dto = MapToResponse(alert);
            return Ok(dto);
        }

        // GET: api/v1/alerts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AlertResponse>>> GetAll()
        {
            var alerts = await _alertService.GetAllAlertsAsync();
            return Ok(alerts.Select(MapToResponse));
        }

        // GET: api/v1/alerts/client/{clientId}
        [HttpGet("client/{clientId:guid}")]
        public async Task<ActionResult<IEnumerable<AlertResponse>>> GetByClient(Guid clientId)
        {
            var alerts = await _alertService.GetAlertsByClientIdAsync(clientId);
            return Ok(alerts.Select(MapToResponse));
        }

        // GET: api/v1/alerts/status/{status}
        [HttpGet("status/{status}")]
        public async Task<ActionResult<IEnumerable<AlertResponse>>> GetByStatus(AlertStatus status)
        {
            var alerts = await _alertService.GetAlertsByStatusAsync(status);
            return Ok(alerts.Select(MapToResponse));
        }

        // GET: api/v1/alerts/severity/{severity}
        [HttpGet("severity/{severity}")]
        public async Task<ActionResult<IEnumerable<AlertResponse>>> GetBySeverity(AlertSeverity severity)
        {
            var alerts = await _alertService.GetAlertsBySeverityAsync(severity);
            return Ok(alerts.Select(MapToResponse));
        }

        // GET: api/v1/alerts/transaction/{transactionId}
        [HttpGet("transaction/{transactionId:guid}")]
        public async Task<ActionResult<IEnumerable<AlertResponse>>> GetByTransaction(Guid transactionId)
        {
            var alerts = await _alertService.GetByTransactionIdAsync(transactionId);
            return Ok(alerts.Select(MapToResponse));
        }

        // GET: api/v1/alerts/period?clientId=...&startDate=...&endDate=...
        [HttpGet("period")]
        public async Task<ActionResult<IEnumerable<AlertResponse>>> GetByPeriod(Guid clientId, DateTime startDate, DateTime endDate)
        {
            var alerts = await _alertService.GetByClientAndPeriodAsync(clientId, startDate, endDate);
            return Ok(alerts.Select(MapToResponse));
        }

        // PUT: api/v1/alerts/{alertId}/status
        [HttpPut("{alertId:guid}/status")]
        public async Task<IActionResult> UpdateStatus(Guid alertId, [FromBody] UpdateAlertRequest request)
        {
            await _alertService.UpdateStausAsync(alertId, request.Status);
            return NoContent();
        }

        // ------------------------
        // Helper para mapear entidade -> DTO
        // ------------------------
        private static AlertResponse MapToResponse(Bran.Domain.Entities.Alert alert)
        {
            return new AlertResponse
            {
                Id = alert.Id,
                ClientId = alert.ClientId,
                TransactionId = alert.TransactionId,
                RuleName = alert.Name,
                Severity = alert.Severity,
                CreatedAt = alert.CreatedAt
            };
        }
    }
}