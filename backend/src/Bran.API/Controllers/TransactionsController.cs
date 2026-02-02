using Bran.API.DTOs.Clients;
using Bran.API.DTOs.Transactions;
//using Bran.Application.Clients.Interfaces;
using Bran.Application.Services;
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
                DateTime.UtcNow
            );

            return Ok(transaction);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllTransactions()
        {
            var transactions = await _transactionService.GetTransactionsAsync();

            var response = transactions.Select(transaction => new TransactionResponse
            {
                Id = transaction.Id,
                ClientId = transaction.ClientId,
                TransactionType = transaction.TransactionType,
                Amount = transaction.Amount,
                Currency = transaction.Currency,
                CounterpartyId = transaction.CounterpartyId,
                DateHour = transaction.DateHour,
            });

            return Ok(response);
        }

        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetTransactionById(Guid id)
        {
            var transaction = await _transactionService.GetByIdAsync(id);

            if (transaction is null)
                return NotFound();

            var response = new TransactionResponse
            {
                Id = transaction.Id,
                ClientId= transaction.ClientId,
                TransactionType = transaction.TransactionType,
                Amount = transaction.Amount,
                Currency = transaction.Currency,
                CounterpartyId = transaction.CounterpartyId,
                DateHour = transaction.DateHour,
            };

            return Ok(response);
        }
    }
}
