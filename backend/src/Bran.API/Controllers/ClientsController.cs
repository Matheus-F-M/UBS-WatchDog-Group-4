using Bran.API.DTOs.Clients;
using Bran.Application.Clients.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Bran.API.Controllers
{
    [ApiController]
    [Route("api/v1/clients")]
    public class ClientsController : ControllerBase
    {
        private readonly IClientService _clientService;

        public ClientsController(IClientService clientService)
        {
            _clientService = clientService;
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateClientRequest request)
        {
            var client = await _clientService.CreateClientAsync(
                request.Name,
                request.GovernmentId,
                request.Type,
                request.Country,
                request.Income
            );

            return Ok(client);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateClientRequest request)
        {
            var client = await _clientService.UpdateAsync(id, request.Name, request.Country, request.Type, request.Income);

            if (client is null) return NotFound();

            return Ok(client);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var client = await _clientService.GetByIdAsync(id);

            if (client is null)
                return NotFound();

            var response = new ClientResponse
            {
                Id = client.Id,
                Name = client.Name,
                Country = client.Country,
                Type = client.Type,
                Income = client.Income,
                RiskLevel = client.RiskLevel,
                KycStatus = client.KycStatus,
                GovernmentId = client.GovernmentId,
            };

            return Ok(response);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var clients = await _clientService.GetAllAsync();

            var response = clients.Select(client => new ClientResponse
            {
                Id = client.Id,
                Name = client.Name,
                Country = client.Country,
                Type = client.Type,
                Income = client.Income,
                RiskLevel = client.RiskLevel,
                KycStatus = client.KycStatus
            });

            return Ok(response);
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var deleted = await _clientService.DeleteAsync(id);

            if (!deleted)
                return NotFound();

            return NoContent();
        }
    }

}
