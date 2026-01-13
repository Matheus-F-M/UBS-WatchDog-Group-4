import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type Alert } from "@/types/globalTypes";
import { alertsApi } from "@/api/alertAPI";
import { useFilterStore } from "@/stores/filterStore";

/* 00000000000000000000000000000000000000000
   ------------ CODE STARTS HERE -----------
   00000000000000000000000000000000000000000 */

const initialAlertData: Alert[] = [
  {
    id: "1",
    idCliente: "123456",
    idTransacao: "T001",
    severidade: "Alta",
    status: "Novo",
  },
  {
    id: "2",
    idCliente: "789012",
    idTransacao: "T002",
    severidade: "Média",
    status: "Em Análise",
  },
  {
    id: "3",
    idCliente: "345678",
    idTransacao: "T003",
    severidade: "Crítico",
    status: "Novo",
  },
];

/* 00000000000000000000000000000000000000000
   ---------- ALERT PAGE START -------------
   00000000000000000000000000000000000000000 */

export default function AlertPage() {
  const [searchParams] = useSearchParams();
  const [alertData, setAlertData] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  // --------------------------------------
  // Get filters and columns from Zustand store
  // --------------------------------------
  const {
    alertFilters,
    alertVisibleColumns: visibleColumns,
    setAlertFilter,
    toggleAlertColumn,
    resetAlertFilters,
  } = useFilterStore();

  // Destructure filters for easier access
  const idFilter = alertFilters.id;
  const idClienteFilter = alertFilters.idCliente;
  const idTransacaoFilter = alertFilters.idTransacao;
  const severidadeFilter = alertFilters.severidade;
  const statusFilter = alertFilters.status;

  // Check for parameters coming from URL to pre-fill filters
  useEffect(() => {
    const idParam = searchParams.get('id');
    const idClienteParam = searchParams.get('idCliente');
    const idTransacaoParam = searchParams.get('idTransacao');
    
    if (idParam) {
      setAlertFilter('id', idParam);
    }
    
    if (idClienteParam) {
      setAlertFilter('idCliente', idClienteParam);
    }
    
    if (idTransacaoParam) {
      setAlertFilter('idTransacao', idTransacaoParam);
    }
  }, [searchParams, setAlertFilter]);

  /**
   * Toggles the visibility of a table column
   */
  const toggleColumn = (column: keyof typeof visibleColumns) => {
    toggleAlertColumn(column);
  };
  // --------------------------------------
  // END Column visibility state
  // --------------------------------------

  // Fetch alerts on component mount
  useEffect(() => {
    fetchAlerts();
  }, []);

  /**
   * Fetches alert data from the API and handles loading and error states.
   */
  const fetchAlerts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      setAlertData(await alertsApi.getAll());
    } catch (err) {
      setError("Erro ao carregar alertas. Usando dados de exemplo.");
      // Fallback to initial data if API fails
      setAlertData(initialAlertData);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles status change for an alert
   * @param alertId String
   * @param newStatus Alert status
   */
  const handleStatusChange = async (alertId: string, newStatus: Alert["status"]) => {
    const alertToUpdate = alertData.find((alert) => alert.id === alertId);
    if (!alertToUpdate) return;

    // Optimistically update the UI
    setAlertData(
      alertData.map((alert) =>
        alert.id === alertId ? { ...alert, status: newStatus } : alert
      )
    );

    // Update via API
    try {
      const updatedAlert = await alertsApi.update(alertId, {
        ...alertToUpdate,
        status: newStatus,
      });
      // Update with the response from the server
      setAlertData(
        alertData.map((alert) =>
          alert.id === updatedAlert.id ? updatedAlert : alert
        )
      );
    } catch (err) {
      setError("Erro ao atualizar status do alerta");
      // Revert the optimistic update
      setAlertData(
        alertData.map((alert) =>
          alert.id === alertId ? alertToUpdate : alert
        )
      );
      alert("Erro ao atualizar status do alerta");
    }
  };

  /** -----------------------------------------
   *  ----------- Beginning of HTML -----------
      ----------------------------------------- */
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Alertas</h2>

          {error && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800">
              {error}
            </div>
          )}

          {/* --------------------------------------- */}
          {/* Filter Button and Loading Indicator */}
          {/* --------------------------------------- */}

          <div className="mb-4 flex gap-2">
            <Button
              onClick={() => setFilterDialogOpen(true)}
              disabled={isLoading}
              variant="outline"
            >
              Filtros e Pesquisa
            </Button>
            {isLoading && (
              <span className="text-sm text-gray-500 self-center">
                Carregando...
              </span>
            )}
          </div>

          {/* --------------------------------------- */}
          {/* -----------------Table----------------- */}
          {/* --------------------------------------- */}

          {isLoading && alertData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Carregando alertas...
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  {visibleColumns.id && <TableHead>ID</TableHead>}
                  {visibleColumns.idCliente && <TableHead>ID Cliente</TableHead>}
                  {visibleColumns.idTransacao && <TableHead>ID Transação</TableHead>}
                  {visibleColumns.severidade && <TableHead>Severidade</TableHead>}
                  {visibleColumns.status && <TableHead>Status</TableHead>}
                </TableRow>
              </TableHeader>

              {/* --------------Table Body--------------- */}
              <TableBody>
                {alertData
                  .filter((alert) => {
                    const idSearch = idFilter.toLowerCase();
                    const idClienteSearch = idClienteFilter.toLowerCase();
                    const idTransacaoSearch = idTransacaoFilter.toLowerCase();
                    
                    // Check severidade filter
                    const severidadeMatch = severidadeFilter === "" || 
                      alert.severidade.toLowerCase() === severidadeFilter.toLowerCase();
                    
                    // Check status filter
                    const statusMatch = statusFilter === "" || 
                      alert.status.toLowerCase() === statusFilter.toLowerCase();
                    
                    return (
                      alert.id.toLowerCase().includes(idSearch) &&
                      alert.idCliente.toLowerCase().includes(idClienteSearch) &&
                      alert.idTransacao.toLowerCase().includes(idTransacaoSearch) &&
                      severidadeMatch &&
                      statusMatch
                    );
                  })
                  .map((alert) => (
                  <TableRow key={alert.id}>
                    {visibleColumns.id && <TableCell>{alert.id}</TableCell>}
                    {visibleColumns.idCliente && <TableCell>{alert.idCliente}</TableCell>}
                    {visibleColumns.idTransacao && <TableCell>{alert.idTransacao}</TableCell>}
                    {visibleColumns.severidade && (
                      <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          alert.severidade === "Crítico"
                            ? "bg-red-100 text-red-800"
                            : alert.severidade === "Alta"
                            ? "bg-orange-100 text-orange-800"
                            : alert.severidade === "Média"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {alert.severidade}
                      </span>
                    </TableCell>
                    )}
                    {visibleColumns.status && (
                      <TableCell>
                      <NativeSelect
                        value={alert.status}
                        onChange={(e) =>
                          handleStatusChange(alert.id, e.target.value as Alert["status"])
                        }
                        className={`w-full font-medium ${
                          alert.status === "Resolvido"
                            ? "text-green-600"
                            : alert.status === "Em Análise"
                            ? "text-yellow-600"
                            : "text-blue-600"
                        }`}     
                      >
                        <NativeSelectOption value="Novo" 
                        className="text-blue-600">
                            Novo
                        </NativeSelectOption>
                        <NativeSelectOption value="Em Análise"
                        className="text-yellow-600">
                          Em Análise
                        </NativeSelectOption>
                        <NativeSelectOption value="Resolvido"
                        className="text-green-600">
                          Resolvido
                        </NativeSelectOption>
                      </NativeSelect>
                    </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
      {/* --------------------------------------- */}
      {/* ------------------END------------------ */}
      {/* --------------------------------------- */}

{/* ---------------------------------------------------------- */}
{/* -------------------- FILTER AND SEARCH ------------------- */}
{/* ---------------------------------------------------------- */}
      <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filtros e Pesquisa</DialogTitle>
            <DialogDescription>Filtre e Pesquise alertas</DialogDescription>
          </DialogHeader>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Colunas Visíveis</h3>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="col-id"
                  checked={visibleColumns.id}
                  onCheckedChange={() => toggleColumn("id")}
                />
                <label htmlFor="col-id" className="text-sm cursor-pointer">
                  ID
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="col-idCliente"
                  checked={visibleColumns.idCliente}
                  onCheckedChange={() => toggleColumn("idCliente")}
                />
                <label htmlFor="col-idCliente" className="text-sm cursor-pointer">
                  ID Cliente
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="col-idTransacao"
                  checked={visibleColumns.idTransacao}
                  onCheckedChange={() => toggleColumn("idTransacao")}
                />
                <label htmlFor="col-idTransacao" className="text-sm cursor-pointer">
                  ID Transação
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="col-severidade"
                  checked={visibleColumns.severidade}
                  onCheckedChange={() => toggleColumn("severidade")}
                />
                <label htmlFor="col-severidade" className="text-sm cursor-pointer">
                  Severidade
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="col-status"
                  checked={visibleColumns.status}
                  onCheckedChange={() => toggleColumn("status")}
                />
                <label htmlFor="col-status" className="text-sm cursor-pointer">
                  Status
                </label>
              </div>
            </div>
          </div>

          <div className="py-4 space-y-6 max-h-[60vh] overflow-y-auto">
            <div>
              <h3 className="mb-3 text-sm font-semibold">Filtrar por ID</h3>
              <Input
                placeholder="Digite o ID..."
                value={idFilter}
                onChange={(e) => setAlertFilter("id", e.target.value)}
              />
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold">
                Filtrar por ID Cliente
              </h3>
              <Input
                placeholder="Digite o ID do cliente..."
                value={idClienteFilter}
                onChange={(e) => setAlertFilter("idCliente", e.target.value)}
              />
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold">
                Filtrar por ID Transação
              </h3>
              <Input
                placeholder="Digite o ID da transação..."
                value={idTransacaoFilter}
                onChange={(e) => setAlertFilter("idTransacao", e.target.value)}
              />
            </div>

            {/* Side by Side Severidade and Status Filters */}
            <div>
              <h3 className="mb-3 text-sm font-semibold">Filtrar por Status</h3>
              <div className="flex gap-3">
                <div className="flex-1">
                  <Label htmlFor="filter-severidade" className="py-2">Severidade</Label>
                  <NativeSelect
                    id="filter-severidade"
                    value={severidadeFilter}
                    onChange={(e) =>
                      setAlertFilter("severidade", e.target.value)
                    }
                  >
                    <NativeSelectOption value="">Todos</NativeSelectOption>
                    <NativeSelectOption value="baixa">Baixa</NativeSelectOption>
                    <NativeSelectOption value="média">Média</NativeSelectOption>
                    <NativeSelectOption value="alta">Alta</NativeSelectOption>
                    <NativeSelectOption value="crítico">
                      Crítico
                    </NativeSelectOption>
                  </NativeSelect>
                </div>
                <div className="flex-1">
                  <Label htmlFor="filter-status" className="py-2">Status</Label>
                  <NativeSelect
                    id="filter-status"
                    value={statusFilter}
                    onChange={(e) => setAlertFilter("status", e.target.value)}
                  >
                    <NativeSelectOption value="">Todos</NativeSelectOption>
                    <NativeSelectOption value="novo">Novo</NativeSelectOption>
                    <NativeSelectOption value="em análise">
                      Em Análise
                    </NativeSelectOption>
                    <NativeSelectOption value="resolvido">
                      Resolvido
                    </NativeSelectOption>
                  </NativeSelect>
                </div>
              </div>
            </div>

          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => resetAlertFilters()}>
              Restaurar Padrão
            </Button>
            <Button variant="outline" onClick={() => setFilterDialogOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

{/* --------------------------------------- */}
{/* ------------------END------------------ */}
{/* --------------------------------------- */}
    </div>
  );
}
