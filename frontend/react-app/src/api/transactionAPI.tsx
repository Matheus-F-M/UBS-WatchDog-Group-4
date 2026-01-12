import { validateDate, validateTime, type Transaction } from "@/types/globalTypes";


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
  const validatedDate = validateDate(backendTransaction.date);
  const validatedTime = validateTime(backendTransaction.time);

  return {
    id: backendTransaction.id || "none",
    idCliente: backendTransaction.clientId || "none",
    tipo: backendTransaction.type === 0 ? "Depósito"
      : backendTransaction.type === 1 ? "Saque"
      : backendTransaction.type === 2 ? "Transferência"
      : "Depósito",
    valor: backendTransaction.amount || 0,
    moeda: backendTransaction.currency || "BRL",
    contraparte: backendTransaction.counterparty || "none",
    data: validatedDate || validateDate("2024-01-01")!,
    hora: validatedTime || validateTime("00:00:00")!,
  };
};

/**
 * Maps a frontend transaction object to the backend transaction format.
 * @param transaction Transaction : frontend transaction
 * @returns any : backend transaction
 */
export const reverseMapBackendTransaction = (transaction: Transaction): any => {
  return {
    id: transaction.id,
    clientId: transaction.idCliente,
    type: transaction.tipo === "Depósito" ? 0
      : transaction.tipo === "Saque" ? 1
      : transaction.tipo === "Transferência" ? 2
      : 0,
    amount: transaction.valor,
    currency: transaction.moeda,
    counterparty: transaction.contraparte,
    date: transaction.data,
    time: transaction.hora,
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

  // Update transaction
  update: async (id: string, transaction: Transaction): Promise<Transaction> => {
    const response = await fetch(`${API_TRANSACTION_BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reverseMapBackendTransaction(transaction)),
    });
    if (!response.ok) throw new Error("Failed to update transaction");
    return mapBackendTransaction(await response.json());
  },

  // Delete transaction
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_TRANSACTION_BASE_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete transaction");
  },
};
/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ------------------ END ------------------
   XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */
