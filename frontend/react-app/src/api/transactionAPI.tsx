import { type Transaction } from "@/types/globalTypes";


export const API_TRANSACTION_BASE_URL = "http://localhost:5131/api/v1/transactions";

/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   -------- API IMPLEMENTATION HERE --------
   XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

/**
 * Maps a backend transaction object to the Transaction type used in the frontend.
 * @param backendTransaction any : the transaction in the backend database
 * @returns Transaction : the mapped transaction to the parameters used in the frontend
 */
export const mapBackendTransaction = (backendTransaction: any): Transaction => {

  return {
    id: backendTransaction.id || "none",
    idCliente: backendTransaction.clientId || "none",
    tipo: backendTransaction.transactionType === 0 ? "Depósito"
      : backendTransaction.transactionType === 1 ? "Saque"
      : backendTransaction.transactionType === 2 ? "Transferência"
      : "Depósito",
    valor: backendTransaction.amount || 0,
    moeda: backendTransaction.currency || "BRL",
    idContraparte: backendTransaction.counterpartyId || "none",
    dataHora: backendTransaction.dateHour || "2024-01-01 00:00:00",
  };
};

/**
 * Maps a frontend transaction object to the backend transaction format.
 * @param transaction Transaction : frontend transaction
 * @returns any : backend transaction
 */
export const reverseMapBackendTransaction = (transaction: Transaction): any => {
  return {
    clientId: transaction.idCliente,
    transactionType: transaction.tipo === "Depósito" ? 0
      : transaction.tipo === "Saque" ? 1
      : transaction.tipo === "Transferência" ? 2
      : 0,
    amount: transaction.valor,
    counterpartyId: transaction.idContraparte,
    currency: transaction.moeda,
    dateHour: transaction.dataHora,
  };
};

// API helper functions
export const transactionsApi = {
  // Fetch all transactions
  getAll: async (): Promise<Transaction[]> => {
    const response = await fetch(API_TRANSACTION_BASE_URL);
    if (!response.ok) throw new Error("Failed to fetch transactions");
    const rawData = await response.json();
    return rawData.map(mapBackendTransaction);
  },

  // Create new transaction
  create: async (transaction: Omit<Transaction, "id">): Promise<Transaction> => {
    const response = await fetch(API_TRANSACTION_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reverseMapBackendTransaction(transaction as Transaction)),
    });
    if (!response.ok) throw new Error("Failed to create transaction");
    return mapBackendTransaction(await response.json());
  },
};
/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ------------------ END ------------------
   XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */
