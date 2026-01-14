import { type Country } from "@/types/globalTypes";

export const API_COUNTRY_BASE_URL = "http://localhost:5131/api/countries";

/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
       -------- COUNTRY API HERE --------
   XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

/**
 * Maps a backend country object to the Country type used in the frontend.
 * @param backendCountry any : the country in the backend database
 * @returns Country : the mapped country to the parameters used in the frontend
 */
export const mapBackendCountry = (backendCountry: any): Country => {
  return {
    id: backendCountry.code || "none",
    nome: backendCountry.name || "none",
    codigo: backendCountry.countryCode || "none",
    risco:
      backendCountry.riskLevel === 0
        ? "Baixo"
        : backendCountry.riskLevel === 1
        ? "Médio"
        : backendCountry.riskLevel === 2
        ? "Alto"
        : "Baixo",
  };
};

/**
 * Maps a frontend country object to the backend country format.
 * @param country Country : frontend country
 * @returns any : backend country
 */
export const reverseMapBackendCountry = (country: Country): any => {
  return {
    countryCode: country.codigo,
    name: country.nome,
    riskLevel:
      country.risco === "Baixo"
        ? 0
        : country.risco === "Médio"
        ? 1
        : country.risco === "Alto"
        ? 2
        : 0,
  };
};

// API helper functions
export const countriesApi = {
  // Fetch all countries
  getAll: async (): Promise<Country[]> => {
    const response = await fetch(API_COUNTRY_BASE_URL);
    if (!response.ok) throw new Error("Failed to fetch countries");
    const rawData = await response.json();
    return rawData.map(mapBackendCountry);
  },

  // Get country by code
  getByCode: async (code: string): Promise<Country> => {
    const response = await fetch(`${API_COUNTRY_BASE_URL}/${code}`);
    if (!response.ok) throw new Error(`Failed to fetch country with code ${code}`);
    const rawCountry = await response.json();
    return mapBackendCountry(rawCountry);
  },
};
/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   -------------- END COUNTRY --------------
   XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */
