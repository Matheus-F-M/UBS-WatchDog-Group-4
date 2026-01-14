import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { clientsApi } from "@/api/clientAPI";
import { countriesApi } from "@/api/countryAPI";
import { transactionsApi } from "@/api/transactionAPI";
import { alertsApi } from "@/api/alertAPI";
import {
  type Client,
  type Country,
  type Transaction,
  type Alert,
  isCPF,
  validateCpfCnpj,
  type CpfCnpj,
} from "@/types/globalTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { CountryCombobox } from "@/components/ui/countryComboBox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ClientReport() {
  const { clientId } = useParams<{ clientId: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [editedClient, setEditedClient] = useState<Client | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [countryComboboxOpen, setCountryComboboxOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [counterpartyCpfCnpj, setCounterpartyCpfCnpj] = useState<
    Record<string, string>
  >({});
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const fetchClient = async () => {
      if (!clientId) {
        setError("Client ID not provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const clientData = await clientsApi.getById(clientId);
        console.log("isActive: ", clientData.isActive);
        setClient(clientData);
        setEditedClient(clientData);
        setError(null);
      } catch (err) {
        setError("Failed to load client data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchCountries = async () => {
      try {
        const fetchedCountries = await countriesApi.getAll();
        setCountries(fetchedCountries);
      } catch (err) {
        console.error("Failed to fetch countries:", err);
      }
    };

    const fetchCounterpartyCpfCnpj = async (transactions: Transaction[]) => {
      const uniqueCounterpartyIds = [
        ...new Set(transactions.map((t) => t.idContraparte)),
      ];
      const cpfCnpjs: Record<string, string> = {};

      await Promise.all(
        uniqueCounterpartyIds.map(async (counterpartyId) => {
          try {
            const counterparty = await clientsApi.getById(counterpartyId);
            cpfCnpjs[counterpartyId] = counterparty.cpfCnpj;
          } catch (err) {
            cpfCnpjs[counterpartyId] = "Desconhecido";
          }
        })
      );

      setCounterpartyCpfCnpj(cpfCnpjs);
    };

    const fetchTransactions = async () => {
      if (!clientId) return;
      try {
        const allTransactions = await transactionsApi.getAll();
        const clientTransactions = allTransactions
          .filter((t) => t.idCliente === clientId)
          .sort(
            (a, b) =>
              new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime()
          );
        setTransactions(clientTransactions);
        await fetchCounterpartyCpfCnpj(clientTransactions);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
      }
    };

    const fetchAlerts = async () => {
      if (!clientId) return;
      try {
        const allAlerts = await alertsApi.getAll();
        const clientAlerts = allAlerts.filter((a) => a.idCliente === clientId);
        setAlerts(clientAlerts);
      } catch (err) {
        console.error("Failed to fetch alerts:", err);
      }
    };

    fetchClient();
    fetchCountries();
    fetchTransactions();
    fetchAlerts();
  }, [clientId]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedClient(client);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!editedClient) return;

    const validated = validateCpfCnpj(editedClient.cpfCnpj);
    if (!validated) {
      alert("CPF/CNPJ inválido. Use 000.000.000-00 ou 00.000.000/0000-00");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const clientToUpdate: Client = {
        ...editedClient,
        cpfCnpj: validated,
      };
      
      console.log("Updating client:", clientToUpdate);
      
      const updatedClient = await clientsApi.update(editedClient.id, clientToUpdate);
      
      console.log("Update successful:", updatedClient);
      
      setClient(updatedClient);
      setEditedClient(updatedClient);
      setIsEditing(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save client data";
      setError(errorMessage);
      console.error("Error updating client:", err);
      alert(`Erro ao salvar: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading client data...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">Error: {error}</div>;
  }

  if (!client) {
    return <div className="p-6">Client not found</div>;
  }

  return (
    <div className="p-12 bg-gray-200 animate-in fade-in duration-1000">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-UBS-black via-gray-600 to-UBS-black bg-clip-text text-transparent">
            {client.nome}
            </h1>
        {!isEditing ? (
          <Button onClick={handleEdit} size="xl" className="text-lg bg-UBS-black">
            Editar
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleSave} size="xl" disabled={loading} className="text-lg">
              Salvar
            </Button>
            <Button
              onClick={handleCancel}
              size="xl"
              variant="outline"
              disabled={loading}
              className="text-lg"
            >
              Cancelar
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Top-left cell */}
        <div className="border rounded-lg p-4 space-y-2 bg-gray-50">
          <p className="text-xl">
            <strong className="bg-gradient-to-r from-UBS-black via-gray-600 to-UBS-black bg-clip-text text-transparent">Nível de Risco:</strong>{" "}
            <span
              className={
                client.nivelDeRisco === "Baixo"
                  ? "text-green-600 font-bold"
                  : client.nivelDeRisco === "Medio"
                  ? "text-yellow-600 font-bold"
                  : client.nivelDeRisco === "Alto"
                  ? "text-red-600 font-bold"
                  : client.nivelDeRisco === "Crítico"
                  ? "text-red-600 font-bold"
                  : "text-gray-600"
              }
            >
              {client.nivelDeRisco}
            </span>
          </p>

          {editedClient && (
            <div className="flex items-center gap-2 ">
              <Label
                htmlFor="edit-kycStatus-top"
                className="min-w-[80px] text-xl font-bold bg-gradient-to-r from-UBS-black via-gray-600 to-UBS-black bg-clip-text text-transparent"
              >
                KYC Status:
              </Label>
              {isEditing ? (
                <NativeSelect
                  id="edit-kycStatus-top"
                  className="flex-1"
                  value={editedClient.kycStatus}
                  onChange={(e) =>
                    setEditedClient({
                      ...editedClient,
                      kycStatus: e.target.value as Client["kycStatus"],
                    })
                  }
                >
                  <NativeSelectOption value="Aprovado">
                    Aprovado
                  </NativeSelectOption>
                  <NativeSelectOption value="Pendente">
                    Pendente
                  </NativeSelectOption>
                  <NativeSelectOption value="Rejeitado">
                    Rejeitado
                  </NativeSelectOption>
                </NativeSelect>
              ) : (
                <p className="text-xl">
                  <span
                    className={
                      editedClient.kycStatus === "Aprovado"
                        ? "text-green-600 font-bold"
                        : editedClient.kycStatus === "Pendente"
                        ? "text-yellow-600 font-bold"
                        : editedClient.kycStatus === "Rejeitado"
                        ? "text-red-600 font-bold"
                        : "text-gray-600"
                    }
                  >
                    {editedClient.kycStatus}
                  </span>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Top-Right cell */}
        <div className="border rounded-lg p-4 space-y-2 bg-gray-50">
          {editedClient && (
            <div>
              <Label htmlFor="edit-income" className="min-w-[80px] ">
                Renda:
              </Label>
              {isEditing ? (
                <Input
                  id="edit-income"
                  type="number"
                  step="0.01"
                  className="flex-1 text-xl px-2 mt-2"
                  value={editedClient.income || ""}
                  onChange={(e) =>
                    setEditedClient({
                      ...editedClient,
                      income: parseFloat(e.target.value) || undefined,
                    })
                  }
                />
              ) : (
                <p className="text-4xl  px-2">
                  <strong className="bg-gradient-to-r from-UBS-black via-gray-600 to-UBS-black bg-clip-text text-transparent">
                    {editedClient.income
                      ? `R$ ${editedClient.income.toFixed(2)}${
                          isCPF(editedClient.cpfCnpj) ? "/mês" : ""
                        }`
                      : "N/A"}
                  </strong>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Mid-Left cell */}
        <div className="border rounded-lg p-4 space-y-2 bg-gray-50">
          <p>
            <strong>ID:</strong> {client.id}
          </p>

          {editedClient && (
            <>
              <div className="flex items-center gap-2">
                <Label htmlFor="edit-pais" className="min-w-[80px]">
                  País:
                </Label>
                {isEditing ? (
                  <div className="flex-1">
                    <CountryCombobox
                      isOpen={countryComboboxOpen}
                      setIsOpen={setCountryComboboxOpen}
                      selectedCountry={editedClient.pais}
                      onSelect={(countryCode) =>
                        setEditedClient({ ...editedClient, pais: countryCode })
                      }
                      countries={countries}
                    />
                  </div>
                ) : (
                  <p className="text-sm">{editedClient.pais}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Label htmlFor="edit-cpfCnpj" className="min-w-[80px]">
                  CPF/CNPJ:
                </Label>
                {isEditing ? (
                  <Input
                    id="edit-cpfCnpj"
                    className="flex-1"
                    value={editedClient.cpfCnpj}
                    onChange={(e) =>
                      setEditedClient({
                        ...editedClient,
                        cpfCnpj: e.target.value as CpfCnpj,
                      })
                    }
                  />
                ) : (
                  <p className="text-sm">{editedClient.cpfCnpj}</p>
                )}
              </div>

              {/* Status Field */}
              <div className="flex items-center gap-2">
                <Label htmlFor="edit-status" className="min-w-[80px]">
                  Status:
                </Label>

                <p className="text-sm">
                  {/* Status Field NORMAL*/}
                  <span
                    className={
                      editedClient.isActive
                        ? "text-green-600 font-bold"
                        : "text-red-600 font-bold"
                    }
                  >
                    {editedClient.isActive ? "Ativo" : "Inativo"}
                  </span>
                </p>
              </div>
            </>
          )}
        </div>

        {/* Mid-Right cell - Edit Fields */}
        <div className="border rounded-lg p-4 flex flex-col justify-around h-full bg-gray-50">
          {/* Alerts Count */}
          <div className="flex items-center gap-4">
            <div className="text-5xl">🚨</div>
            <div>
              <p className="text-3xl font-bold">{alerts.length} Alertas</p>
            </div>
          </div>

          {/* Transactions Count */}
          <div className="flex items-center gap-4">
            <div className="text-5xl">↔️</div>
            <div>
              <p className="text-3xl font-bold">{transactions.length} Transações</p>
            </div>
          </div>

          {/* Alert Ratio */}
          <div className="flex items-center gap-4">
            <div className="text-5xl">🤝</div>
            <div>
              <p className="text-3xl font-bold">
                {transactions.length === 0 ? (
                  "------"
                ) : (
                  <>
                    <span
                      className={
                        (() => {
                          const confidence = Math.max(-100, Math.min(100, 100.0 - (alerts.length / transactions.length) * 100));
                          if (confidence >= 90) return "text-green-600 font-bold";
                          if (confidence >= 80) return "text-green-600";
                          if (confidence >= 60) return "text-yellow-600";
                          return "text-red-600";
                        })()
                      }
                    >
                      {Math.max(-100, Math.min(100, 100.0 - (alerts.length / transactions.length) * 100)).toFixed(1)}%
                    </span>
                    {" de Confiança!"}
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom-Left cell - Alerts */}
        <div className="border rounded-lg p-4 bg-gray-50">
          <h2 className="text-xl font-bold mb-4">Alertas</h2>
          <div className="overflow-x-auto max-w-full max-h-[400px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">#</TableHead>
                  <TableHead className="w-[150px]">Severidade</TableHead>
                  <TableHead className="w-[150px]">Regra</TableHead>
                  <TableHead className="w-[150px]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alerts.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-gray-500"
                    >
                      Nenhum alerta encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  alerts.map((alert, index) => (
                    <TableRow key={alert.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <span
                          className={
                            alert.severidade === "Baixa"
                              ? "text-blue-600 font-semibold"
                              : alert.severidade === "Média"
                              ? "text-yellow-600 font-semibold"
                              : alert.severidade === "Alta"
                              ? "text-orange-600 font-semibold"
                              : alert.severidade === "Crítico"
                              ? "text-red-600 font-bold"
                              : "text-gray-600"
                          }
                        >
                          {alert.severidade}
                        </span>
                      </TableCell>
                      <TableCell>{alert.regra}</TableCell>
                      <TableCell>
                        <span
                          className={
                            alert.status === "Novo"
                              ? "text-blue-600 font-semibold"
                              : alert.status === "Em Análise"
                              ? "text-yellow-600 font-semibold"
                              : alert.status === "Resolvido"
                              ? "text-green-600 font-semibold"
                              : "text-gray-600"
                          }
                        >
                          {alert.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Bottom-Right cell*/}
        <div className="border rounded-lg p-4 bg-gray-50">
          <h2 className="text-xl font-bold mb-4">Transações Recentes</h2>
          <div className="overflow-x-auto max-w-full max-h-[400px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">Valor</TableHead>
                  <TableHead className="w-[200px]">Contraparte</TableHead>
                  <TableHead className="w-[180px]">Data/Hora</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center text-gray-500"
                    >
                      Nenhuma transação encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">
                        R$ {transaction.valor.toFixed(2)}
                      </TableCell>
                      <TableCell className="truncate max-w-[200px]">
                        {counterpartyCpfCnpj[transaction.idContraparte] ||
                          "Carregando..."}
                      </TableCell>
                      <TableCell>
                        {new Date(transaction.dataHora).toLocaleString(
                          "pt-BR",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
