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
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
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
    regra: "Limite Diário",
  },
  {
    id: "2",
    idCliente: "789012",
    idTransacao: "T002",
    severidade: "Média",
    status: "Em Análise",
    regra: "Limite Diário",
  },
  {
    id: "3",
    idCliente: "345678",
    idTransacao: "T003",
    severidade: "Crítico",
    status: "Novo",
    regra: "Limite Diário",
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
    const idParam = searchParams.get("id");
    const idClienteParam = searchParams.get("idCliente");
    const idTransacaoParam = searchParams.get("idTransacao");

    if (idParam) {
      setAlertFilter("id", idParam);
    }

    if (idClienteParam) {
      setAlertFilter("idCliente", idClienteParam);
    }

    if (idTransacaoParam) {
      setAlertFilter("idTransacao", idTransacaoParam);
    }
  }, [searchParams, setAlertFilter]);

  /**
   * Toggles the visibility of a table column
   */
  const toggleColumn = (column: keyof typeof visibleColumns) => {
    toggleAlertColumn(column);
  };

  /**
   * Resets all filters and ensures all columns are visible
   */
  const handleResetFiltersAndColumns = () => {
    resetAlertFilters();
    // Ensure all columns are visible
    console.log(visibleColumns);
    if (!visibleColumns.id) toggleAlertColumn('id');
    if (!visibleColumns.idCliente) toggleAlertColumn('idCliente');
    if (!visibleColumns.idTransacao) toggleAlertColumn('idTransacao');
    if (!visibleColumns.severidade) toggleAlertColumn('severidade');
    if (!visibleColumns.regra) toggleAlertColumn('regra');
    if (!visibleColumns.status) toggleAlertColumn('status');
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
const handleStatusChange = async (
  alertId: string,
  newStatus: Alert["status"]
) => {
  const alertToUpdate = alertData.find((alert) => alert.id === alertId);
  if (!alertToUpdate) return;

  // Atualização otimista na UI
  setAlertData(
    alertData.map((alert) =>
      alert.id === alertId ? { ...alert, status: newStatus } : alert
    )
  );

  try {
    // Converte string para número (0=Novo, 1=Em Análise, 2=Resolvido)
    const statusNumber =
      newStatus === "Novo" ? 0 : newStatus === "Em Análise" ? 1 : 2;

    // Chama API → grava no banco
    await alertsApi.update(alertId, statusNumber);

    // Não precisa esperar retorno, já atualizamos a UI
  } catch (err) {
    setError("Erro ao atualizar status do alerta");
    // Reverte se falhar
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
    <div className="p-8 animate-in fade-in duration-1000">
      <div className="max-w-7xl mx-auto">
        {error && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800">
              {error} 
            </div>
          )}
        <div className="bg-gray-50 rounded-lg border-2 border-red-600 p-6 shadow-[0_0_8px_#ff0a0a]">

          <h2 className="mb-4 text-4xl font-bold bg-gradient-to-r from-[#780707] to-[#000000] bg-clip-text text-transparent">
            Alertas
          </h2>

          {/* --------------------------------------- */}
          {/* Filter Button and Loading Indicator */}
          {/* --------------------------------------- */}

          <div className="mb-2 flex gap-2">
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
            <div className="max-h-[600px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {visibleColumns.id && (
                    <TableHead className="font-bold bg-gradient-to-r from-[#780707] to-[#000000] bg-clip-text text-transparent">
                      ID
                    </TableHead>
                  )}
                  {visibleColumns.idCliente && (
                    <TableHead className="font-bold bg-gradient-to-r from-[#780707] to-[#000000] bg-clip-text text-transparent">
                      ID Cliente
                    </TableHead>
                  )}
                  {visibleColumns.idTransacao && (
                    <TableHead className="font-bold bg-gradient-to-r from-[#780707] to-[#000000] bg-clip-text text-transparent">
                      ID Transação
                    </TableHead>
                  )}
                  {visibleColumns.severidade && (
                    <TableHead className="font-bold bg-gradient-to-r from-[#780707] to-[#000000] bg-clip-text text-transparent">
                      Severidade
                    </TableHead>
                  )}
                  {visibleColumns.regra && (
                    <TableHead className="font-bold bg-gradient-to-r from-[#780707] to-[#000000] bg-clip-text text-transparent">
                      Regra
                    </TableHead>
                  )}
                  {visibleColumns.status && (
                    <TableHead className="font-bold bg-gradient-to-r from-[#780707] to-[#000000] bg-clip-text text-transparent">
                      Status
                    </TableHead>
                  )}
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
                    const severidadeMatch =
                      severidadeFilter.length === 0 ||
                      severidadeFilter.some(sev => sev.toLowerCase() === alert.severidade.toLowerCase());

                    // Check status filter
                    const statusMatch =
                      statusFilter.length === 0 ||
                      statusFilter.some(stat => stat.toLowerCase() === alert.status.toLowerCase());

                    return (
                      alert.id.toLowerCase().includes(idSearch) &&
                      alert.idCliente.toLowerCase().includes(idClienteSearch) &&
                      alert.idTransacao
                        .toLowerCase()
                        .includes(idTransacaoSearch) &&
                      severidadeMatch &&
                      statusMatch
                    );
                  })
                  .map((alert, index) => (
                    <TableRow
                      key={alert.id}
                      className={`${
                        index % 2 === 0 ? "bg-gray-100" : "bg-white"
                      }`}
                    >
                      {visibleColumns.id && <TableCell>{alert.id}</TableCell>}
                      {visibleColumns.idCliente && (
                        <TableCell>{alert.idCliente}</TableCell>
                      )}
                      {visibleColumns.idTransacao && (
                        <TableCell>{alert.idTransacao}</TableCell>
                      )}
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
                      {visibleColumns.regra && (
                        <TableCell>{alert.regra}</TableCell>
                      )}
                      {visibleColumns.status && (
                        <TableCell>
                          <NativeSelect
                            value={alert.status}
                            onChange={(e) =>
                              handleStatusChange(
                                alert.id,
                                e.target.value as Alert["status"]
                              )
                            }
                            className={`w-full font-medium ${
                              alert.status === "Resolvido"
                                ? "text-green-600"
                                : alert.status === "Em Análise"
                                ? "text-yellow-600"
                                : "text-blue-600"
                            }`}
                          >
                            <NativeSelectOption
                              value="Novo"
                              className="text-blue-600"
                            >
                              Novo
                            </NativeSelectOption>
                            <NativeSelectOption
                              value="Em Análise"
                              className="text-yellow-600"
                            >
                              Em Análise
                            </NativeSelectOption>
                            <NativeSelectOption
                              value="Resolvido"
                              className="text-green-600"
                            >
                              Resolvido
                            </NativeSelectOption>
                          </NativeSelect>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            </div>
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
                <label
                  htmlFor="col-idCliente"
                  className="text-sm cursor-pointer"
                >
                  ID Cliente
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="col-idTransacao"
                  checked={visibleColumns.idTransacao}
                  onCheckedChange={() => toggleColumn("idTransacao")}
                />
                <label
                  htmlFor="col-idTransacao"
                  className="text-sm cursor-pointer"
                >
                  ID Transação
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="col-severidade"
                  checked={visibleColumns.severidade}
                  onCheckedChange={() => toggleColumn("severidade")}
                />
                <label
                  htmlFor="col-severidade"
                  className="text-sm cursor-pointer"
                >
                  Severidade
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="col-regra"
                  checked={visibleColumns.regra}
                  onCheckedChange={() => toggleColumn("regra")}
                />
                <label
                  htmlFor="col-regra"
                  className="text-sm cursor-pointer"
                >
                  Regra
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
                  <Label className="py-2 block mb-2">
                    Severidade
                  </Label>
                  <div className="space-y-2">
                    {['Baixa', 'Média', 'Alta', 'Crítico'].map((sev) => (
                      <div key={sev} className="flex items-center space-x-2">
                        <Checkbox
                          id={`sev-${sev}`}
                          checked={severidadeFilter.includes(sev)}
                          onCheckedChange={(checked) => {
                            const newFilter = checked
                              ? [...severidadeFilter, sev]
                              : severidadeFilter.filter(s => s !== sev);
                            setAlertFilter('severidade', newFilter as any);
                          }}
                        />
                        <label htmlFor={`sev-${sev}`} className="text-sm cursor-pointer">
                          {sev}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex-1">
                  <Label className="py-2 block mb-2">
                    Status
                  </Label>
                  <div className="space-y-2">
                    {['Novo', 'Em Análise', 'Resolvido'].map((stat) => (
                      <div key={stat} className="flex items-center space-x-2">
                        <Checkbox
                          id={`stat-${stat}`}
                          checked={statusFilter.includes(stat)}
                          onCheckedChange={(checked) => {
                            const newFilter = checked
                              ? [...statusFilter, stat]
                              : statusFilter.filter(s => s !== stat);
                            setAlertFilter('status', newFilter as any);
                          }}
                        />
                        <label htmlFor={`stat-${stat}`} className="text-sm cursor-pointer">
                          {stat}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={handleResetFiltersAndColumns}>
              Restaurar Padrão
            </Button>
            <Button
              variant="outline"
              onClick={() => setFilterDialogOpen(false)}
            >
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
