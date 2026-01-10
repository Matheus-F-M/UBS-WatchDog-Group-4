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
        public async Task<IActionResult> Update(
            Guid id,
            [FromBody] UpdateClientRequest request)
        {
            var client = await _clientService.UpdateAsync(
                id,
                request.Name,
                request.Country,
                request.Type,
                request.Income
            );

            if (client is null)
                return NotFound();

            return Ok(client);
        }
    }

}
