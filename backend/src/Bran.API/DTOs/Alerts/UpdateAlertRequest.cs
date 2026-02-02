using Bran.Domain.ValueObjects;
namespace Bran.API.DTOs.Alerts
{
    public class UpdateAlertRequest
    {
        public AlertStatus Status { get; set; }
    }
}