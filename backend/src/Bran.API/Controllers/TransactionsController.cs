using Bran.API.DTOs.Transactions;
using Bran.Application.Clients.Interfaces;
using Bran.Application.Transactions.Services;
using Bran.Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Bran.API.Controllers
{
    [ApiController]
    [Route("api/v1/transactions")]
    public class TransactionsController : ControllerBase
    {
        private readonly TransactionService _transactionService;

        public TransactionsController(TransactionService transactionService)
        {
            _transactionService = transactionService;
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateTransactionRequest request)
        {
            var transaction = await _transactionService.CreateAsync(
                request.ClientId,
                request.TransactionType,
                request.Amount,
                request.Currency,
                request.CounterpartyId,
                request.DateHour,
                request.Country
            );

            return Ok(transaction);
        }
    }
}
