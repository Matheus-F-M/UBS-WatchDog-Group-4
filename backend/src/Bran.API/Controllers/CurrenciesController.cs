using Bran.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Bran.API.DTOs;
using Bran.Application.Services;

namespace Bran.API.Controllers
{
    [ApiController]
    [Route("api/v1/currencies")]
    public class CurrenciesController : ControllerBase
    {
        private readonly CurrencyService _currencyService;

        public CurrenciesController(CurrencyService currencyService)
        {
            _currencyService = currencyService;
        }

        [HttpGet]
        public async Task<ActionResult<List<Currency>>> GetAll()
        {
            var currencies = await _currencyService.GetAllAsync();
            return Ok(currencies);
        }

        [HttpPost]
        public async Task<ActionResult<Currency>> Create(
            [FromBody] CreateCurrencyRequest request)
        {
            var currency = await _currencyService.CreateAsync(
                request.Code,
                request.Name,
                request.ExchangeRate
            );

            return CreatedAtAction(nameof(GetAll), currency);
        }
    }
}
