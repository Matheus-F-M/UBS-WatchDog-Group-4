namespace Bran.API.DTOs.Currency
{
    public class CreateCurrencyRequest
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public decimal ExchangeRate { get; set; }
    }
}
