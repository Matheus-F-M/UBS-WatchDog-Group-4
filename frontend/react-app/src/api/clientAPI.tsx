import { validateCpfCnpj, type Client } from "@/types/globalTypes";

export const API_CLIENT_BASE_URL = "http://localhost:5131/api/v1/clients";

/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
       -------- CLIENT API HERE --------
   XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

/**
 * Maps a backend client object to the Client type used in the frontend.
 * @param backendClient any : the client in the backend database
 * @returns Client : the mapped client to the parameters used in the frontend
 */
export const mapBackendClient = (backendClient: any): Client => {
  return {
    id: backendClient.id || "none",
    nome: backendClient.name || "none",
    cpfCnpj: validateCpfCnpj(backendClient.governmentId) || "000.000.000-00",
    pais: backendClient.country || "none",
    kycStatus:
      backendClient.kycStatus === 0
        ? "Pendente"
        : backendClient.kycStatus === 1
        ? "Aprovado"
        : backendClient.kycStatus === 2
        ? "Rejeitado"
        : "Pendente",
    nivelDeRisco:
      backendClient.riskLevel === 0
        ? "Baixo"
        : backendClient.riskLevel === 1
        ? "Medio"
        : backendClient.riskLevel === 2
        ? "Alto"
        : "Medio",
    income: backendClient.income,
    isActive: backendClient.isActive ?? true,
  };
};

/**
 * Maps a frontend client object to the backend client format.
 * @param client Client : frontend client
 * @returns any : backend client
 */
export const reverseMapBackendClient = (client: Client): any => {
  return {
    id: client.id,
    name: client.nome,
    governmentId: client.cpfCnpj,
    country: client.pais,
    kycStatus:
      client.kycStatus === "Pendente"
        ? 0
        : client.kycStatus === "Aprovado"
        ? 1
        : client.kycStatus === "Rejeitado"
        ? 2
        : 0,
    riskLevel:
      client.nivelDeRisco === "Baixo"
        ? 0
        : client.nivelDeRisco === "Medio"
        ? 1
        : client.nivelDeRisco === "Alto"
        ? 2
        : 1,
    income: client.income,
    isActive: client.isActive,
  };
};

// API helper functions
export const clientsApi = {
  // Fetch all clients
  getAll: async (): Promise<Client[]> => {
    const response = await fetch(API_CLIENT_BASE_URL);
    if (!response.ok) throw new Error("Failed to fetch clients");
    const rawData = await response.json();
    return rawData.map(mapBackendClient);
  },

  // Get client by ID
  getById: async (id: string): Promise<Client> => {
    const response = await fetch(`${API_CLIENT_BASE_URL}/${id}`);
    if (!response.ok) throw new Error(`Failed to fetch client with id ${id}`);
    const rawClient = await response.json();
    return mapBackendClient(rawClient); // eu n acho q a gente precise de um map enteiro.
  },

  // Create new client
  create: async (client: Omit<Client, "id">): Promise<Client> => {
    const response = await fetch(API_CLIENT_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reverseMapBackendClient(client as Client)),
    });
    if (!response.ok) throw new Error("Failed to create client");
    return mapBackendClient(await response.json());
  },

  // Update client
  update: async (id: string, client: Client): Promise<Client> => {
    const response = await fetch(`${API_CLIENT_BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reverseMapBackendClient(client as Client)),
    });
    if (!response.ok) throw new Error("Failed to update client");
    const rawClient = await response.json();
    return mapBackendClient(rawClient);
  },

  // Delete client
  deactivate: async (id: string): Promise<void> => {
    const response = await fetch(`${API_CLIENT_BASE_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to deactivate client");
  },
};
/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   -------------- END CLIENT ---------------
   XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */
