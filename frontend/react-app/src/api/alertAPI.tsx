import { type Alert } from "@/types/globalTypes";

export const API_ALERT_BASE_URL = "http://localhost:5131/api/v1/alerts";

/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
       -------- ALERT API HERE --------
   XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

/**
 * Maps a backend alert object to the Alert type used in the frontend.
 * @param backendAlert any : the alert in the backend database
 * @returns Alert : the mapped alert to the parameters used in the frontend
 */
export const mapBackendAlert = (backendAlert: any): Alert => {
  return {
    id: backendAlert.id || "none",
    idCliente: backendAlert.clientId || "none",
    idTransacao: backendAlert.transactionId || "none",
    severidade:
      backendAlert.severity === 0
        ? "Baixa"
        : backendAlert.severity === 1
        ? "Média"
        : backendAlert.severity === 2
        ? "Alta"
        : backendAlert.severity === 3
        ? "Crítico"
        : "Média",
    status:
      backendAlert.status === 0
        ? "Novo"
        : backendAlert.status === 1
        ? "Em Análise"
        : backendAlert.status === 2
        ? "Resolvido"
        : "Novo",
  };
};

/**
 * Maps a frontend alert object to the backend alert format.
 * @param alert Alert : frontend alert
 * @returns any : backend alert
 */
export const reverseMapBackendAlert = (alert: Alert): any => {
  return {
    id: alert.id,
    clientId: alert.idCliente,
    transactionId: alert.idTransacao,
    severity:
      alert.severidade === "Baixa"
        ? 0
        : alert.severidade === "Média"
        ? 1
        : alert.severidade === "Alta"
        ? 2
        : alert.severidade === "Crítico"
        ? 3
        : 1,
    status:
      alert.status === "Novo"
        ? 0
        : alert.status === "Em Análise"
        ? 1
        : alert.status === "Resolvido"
        ? 2
        : 0,
  };
};

// API helper functions
export const alertsApi = {
  // Fetch all alerts
  getAll: async (): Promise<Alert[]> => {
    const response = await fetch(API_ALERT_BASE_URL);
    if (!response.ok) throw new Error("Failed to fetch alerts");
    const rawData = await response.json();
    console.log("Fetched Raw alerts:", rawData);
    console.log("Mapped AAlerts:", rawData.map(mapBackendAlert));
    return rawData.map(mapBackendAlert);
  },

  // Update alert
  update: async (id: string, alert: Alert): Promise<Alert> => {
    const response = await fetch(`${API_ALERT_BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reverseMapBackendAlert(alert)),
    });
    if (!response.ok) throw new Error("Failed to update alert");
    const rawAlert = await response.json();
    return mapBackendAlert(rawAlert);
  },
};
/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   -------------- END ALERT ---------------
   XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */
