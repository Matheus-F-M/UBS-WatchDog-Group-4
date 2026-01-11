using Bran.API.DTOs.Countries;
using Bran.Application.Countries.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Bran.API.Controllers
{
    [ApiController]
    [Route("api/countries")]
    public class CountriesController : ControllerBase
    {
        private readonly ICountryService _countryService;

        public CountriesController(ICountryService countryService)
        {
            _countryService = countryService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var countries = await _countryService.GetAllAsync();

            var response = countries.Select(c => new CountryResponse
            {
                Code = c.CountryCode,
                Name = c.Name,
                RiskLevel = c.RiskLevel
            });

            return Ok(response);
        }

        [HttpGet("{code}")]
        public async Task<IActionResult> GetByCode(string code)
        {
            var country = await _countryService.GetByCodeAsync(code);

            if (country is null)
                return NotFound();

            var response = new CountryResponse
            {
                Code = country.CountryCode,
                Name = country.Name,
                RiskLevel = country.RiskLevel
            };

            return Ok(response);
        }
    }
}
