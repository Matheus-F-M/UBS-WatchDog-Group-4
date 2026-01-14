import { type Currency } from "@/types/globalTypes";

export const API_CURRENCY_BASE_URL = "http://localhost:5131/api/v1/currencies";

/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
       -------- CURRENCY API HERE --------
   XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

/**
 * Maps a backend currency object to the Currency type used in the frontend.
 * @param backendCurrency any : the currency in the backend database
 * @returns Currency : the mapped currency to the parameters used in the frontend
 */
export const mapBackendCurrency = (backendCurrency: any): Currency => {
  // If API returns null, use default BRL currency
  if (!backendCurrency) {
    return {
      codigo: "BRL",
      nome: "Real Brasileiro",
      taxaDiaria: 1.0,
    };
  }
  
  return {
    codigo: backendCurrency.code || "BRL",
    nome: backendCurrency.name || "Real Brasileiro",
    taxaDiaria: backendCurrency.dailyRate ?? 1.0,
  };
};

/**
 * Maps a frontend currency object to the backend currency format.
 * @param currency Currency : frontend currency
 * @returns any : backend currency
 */
export const reverseMapBackendCurrency = (currency: Currency): any => {
  return {
    code: currency.codigo,
    name: currency.nome,
    dailyRate: currency.taxaDiaria,
  };
};

// API helper functions
export const currenciesApi = {
  // Fetch all currencies
  getAll: async (): Promise<Currency[]> => {
    const response = await fetch(API_CURRENCY_BASE_URL);
    if (!response.ok) throw new Error("Failed to fetch currencies");
    const rawData = await response.json();
    return rawData.map(mapBackendCurrency);
  },

  // Create new currency
  create: async (currency: Currency): Promise<Currency> => {
    const response = await fetch(API_CURRENCY_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reverseMapBackendCurrency(currency)),
    });
    if (!response.ok) throw new Error("Failed to create currency");
    return mapBackendCurrency(await response.json());
  },

  // Delete currency
  delete: async (code: string): Promise<void> => {
    const response = await fetch(`${API_CURRENCY_BASE_URL}/${code}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete currency");
  },
};
/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   -------------- END CURRENCY -------------
   XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */
