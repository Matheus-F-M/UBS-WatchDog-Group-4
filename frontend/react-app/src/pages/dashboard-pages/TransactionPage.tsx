import { API_CLIENT_BASE_URL, clientsApi } from "@/api/clientAPI";
import { transactionsApi } from "@/api/transactionAPI";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useFilterStore } from "@/stores/filterStore";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  type Transaction,
  type Currency,
  formatCurrency,
} from "@/types/globalTypes";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

/* 00000000000000000000000000000000000000000
   ------------ CODE STARTS HERE -----------
   00000000000000000000000000000000000000000 */

// Initial transaction data for fallback
const initialTransactiondata: Transaction[] = [
  {
    id: "1",
    idCliente: "2bb1758e-6589-4a24-af8a-d28861fa3f36",
    tipo: "Depósito",
    valor: 10000.50,
    moeda: "BRL",
    idContraparte: "000.000.000-00",
    dataHora: "2024-01-15 14:30:00",
    pais: "Sudão",
  },
];

export default function TransactionPage() {
  const [transactiondata, setTransactiondata] = useState<Transaction[]>([]);
  const [clientNames, setClientNames] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [newTransaction, setNewTransaction] = useState<Partial<Transaction>>({
    idCliente: "",
    tipo: "Depósito",
    valor: undefined,
    moeda: "BRL",
    idContraparte: "",
  });

  // Get filters and columns from Zustand store
  const {
    transactionFilters,
    transactionVisibleColumns: visibleColumns,
    setTransactionFilter,
    toggleTransactionColumn,
    resetTransactionFilters,
  } = useFilterStore();

  /**
   * Toggles the visibility of a table column
   */
  const toggleColumn = (column: keyof typeof visibleColumns) => {
    toggleTransactionColumn(column);
  };

  /* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
     ------ Fetch Transactions from API ----
     XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */
  // Fetch transactions on component mount
  useEffect(() => {
    fetchTransactions();
  }, []);

  /**
   * Fetches transaction data from the API and handles loading and error states.
   */
  const fetchTransactions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const transactions = await transactionsApi.getAll();
      setTransactiondata(transactions);
      
      // Fetch client names for all unique client IDs
      const uniqueClientIds = [...new Set(transactions.map(t => t.idCliente))];
      const names: Record<string, string> = {};
      
      await Promise.all(
        uniqueClientIds.map(async (clientId) => {
          try {
            const client = await clientsApi.getById(clientId);
            names[clientId] = client.nome;
          } catch (err) {
            names[clientId] = "Desconhecido";
          }
        })
      );
      
      setClientNames(names);
    } catch (err) {
      setError("Erro ao carregar transações. Usando dados de exemplo.");
      // Fallback to initial data if API fails
      setTransactiondata([initialTransactiondata[0]]);
    } finally {
      setIsLoading(false);
    }
  };
    /**
   * Fetches client ID from CPF/CNPJ by calling the clients API
   * @param cpfCnpj string - CPF/CNPJ of the client
   * @returns Promise<string | null> - Client ID or null if not found
   */
  const fetchClientIdFromCpfCnpj = async (cpfCnpj: string): Promise<string | null> => {
    try {
      const response = await fetch(API_CLIENT_BASE_URL);
      if (!response.ok) throw new Error("Failed to fetch clients");
      const clients = await response.json();
      
      // Find client with matching CPF/CNPJ (documentNumber in backend)
      const matchingClient = clients.find(
        (client: any) => client.governmentId === cpfCnpj
      );
      
      return matchingClient ? matchingClient.id : null;
    } catch (err) {
      console.error("Error fetching client ID:", err);
      return null;
    }
  };
  /* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
     ------------ END FETCHING -------------
     XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

  /** -----------------------------------------
   *  ----- Handles adding a new transaction ----
      ----------------------------------------- */
  const handleAddTransaction = async () => {
    if (
      !newTransaction.idCliente ||
      !newTransaction.tipo ||
      !newTransaction.valor ||
      !newTransaction.moeda ||
      !newTransaction.idContraparte
    ) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const transactionToAdd: Omit<Transaction, "id"> = {
        idCliente: newTransaction.idCliente,
        tipo: newTransaction.tipo as Transaction["tipo"],
        valor: newTransaction.valor,
        moeda: newTransaction.moeda as Currency,
        idContraparte: newTransaction.idContraparte,
        dataHora: "2026-01-13T04:39:33.792Z", // backend will set current date/time   
        pais: "string", // backend will set country based on client info
      };

      console.log("Adding transaction:", transactionToAdd);
      const createdTransaction = await transactionsApi.create(transactionToAdd);
      setTransactiondata([...transactiondata, createdTransaction]);
      setAddDialogOpen(false);
      setNewTransaction({
        idCliente: "",
        tipo: "Depósito",
        valor: undefined,
        moeda: "BRL",
        idContraparte: "",
      });
    } catch (err) {
      setError("Erro ao criar transação");
      alert("Erro ao criar transação");
    } finally {
      setIsLoading(false);
    }
  };
  /*  -----------------------------------------
      ------------------ END ------------------
      ----------------------------------------- */

  /** -----------------------------------------
   *  ----------- Beginning of HTML -----------
      ----------------------------------------- */
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Transações</h2>

          {error && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800">
              {error}
            </div>
          )}

{/* --------------------------------------- */}
{/* Add Transaction Button and Filter Button */}
{/* --------------------------------------- */}

          <div className="mb-4 flex gap-2">
            <Button onClick={() => setAddDialogOpen(true)} disabled={isLoading}>
              Adicionar Transação
            </Button>
            <Button onClick={() => setFilterDialogOpen(true)} disabled={isLoading} variant="outline">
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

          {isLoading && transactiondata.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Carregando transações...
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  {visibleColumns.id && <TableHead>ID</TableHead>}
                  {visibleColumns.idCliente && <TableHead>ID Cliente</TableHead>}
                  {visibleColumns.nomeCliente && <TableHead>Cliente</TableHead>}
                  {visibleColumns.tipo && <TableHead>Tipo</TableHead>}
                  {visibleColumns.valor && <TableHead>Valor</TableHead>}
                  {visibleColumns.moeda && <TableHead>Moeda</TableHead>}
                  {visibleColumns.idContraparte && <TableHead>Contraparte</TableHead>}
                  {visibleColumns.dataHora && <TableHead>Data e Hora</TableHead>}
                </TableRow>
              </TableHeader>

{/* --------------Table Body--------------- */}
              <TableBody>
                {transactiondata
                  .filter((transaction) => {
                    const idSearch = transactionFilters.id.toLowerCase();
                    const idClienteSearch = transactionFilters.idCliente.toLowerCase();
                    const nomeClienteSearch = (transactionFilters.nomeCliente || "").toLowerCase();
                    const tipoSearch = transactionFilters.tipo.toLowerCase();
                    const valorSearch = transactionFilters.valor.toLowerCase();
                    const moedaSearch = transactionFilters.moeda.toLowerCase();
                    const contraparteSearch = (transactionFilters.idContraparte || "").toLowerCase();
                    const dataSearch = (transactionFilters.dataHora || "").toLowerCase();

                    const clientName = (clientNames[transaction.idCliente] || "").toLowerCase();

                    return (
                      transaction.id.toLowerCase().includes(idSearch) &&
                      transaction.idCliente.toLowerCase().includes(idClienteSearch) &&
                      clientName.includes(nomeClienteSearch) &&
                      transaction.tipo.toLowerCase().includes(tipoSearch) &&
                      transaction.valor.toString().includes(valorSearch) &&
                      transaction.moeda.toLowerCase().includes(moedaSearch) &&
                      transaction.idContraparte.toLowerCase().includes(contraparteSearch) &&
                      transaction.dataHora.toLowerCase().includes(dataSearch)
                    );
                  })
                  .map((transaction) => (
                    <TableRow key={transaction.id}>
                      {visibleColumns.id && <TableCell>{transaction.id}</TableCell>}
                      {visibleColumns.idCliente && <TableCell>{transaction.idCliente}</TableCell>}
                      {visibleColumns.nomeCliente && <TableCell>{clientNames[transaction.idCliente] || "Carregando..."}</TableCell>}
                      {visibleColumns.tipo && <TableCell>{transaction.tipo}</TableCell>}
                      {visibleColumns.valor && (
                        <TableCell className="font-medium">
                          {formatCurrency(transaction.valor)}
                        </TableCell>
                      )}
                      {visibleColumns.moeda && <TableCell>{transaction.moeda}</TableCell>}
                      {visibleColumns.idContraparte && <TableCell>{transaction.idContraparte}</TableCell>}
                      {visibleColumns.dataHora && <TableCell>{transaction.dataHora}</TableCell>}
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
{/* ------------------- ADD NEW TRANSACTION ------------------ */}
{/* ---------------------------------------------------------- */}

      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Adicionar Nova Transação</DialogTitle>
            <DialogDescription>
              Preencha os dados da nova transação
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-idCliente">ID do Cliente *</Label>
              <Input
                id="new-idCliente"
                value={newTransaction.idCliente || ""}
                onChange={(e) => setNewTransaction({ ...newTransaction, idCliente: e.target.value })}
                placeholder="Digite o ID do cliente..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-contraparte">ID da Contraparte *</Label>
              <Input
                id="new-contraparte"
                value={newTransaction.idContraparte || ""}
                onChange={(e) =>
                  setNewTransaction({ ...newTransaction, idContraparte: e.target.value })
                }
                placeholder="Digite o ID da contraparte..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-tipo">Tipo *</Label>
              <NativeSelect
                id="new-tipo"
                value={newTransaction.tipo || "Depósito"}
                onChange={(e) =>
                  setNewTransaction({
                    ...newTransaction,
                    tipo: e.target.value as Transaction["tipo"],
                  })
                }
              >
                <NativeSelectOption value="Depósito">
                  Depósito
                </NativeSelectOption>
                <NativeSelectOption value="Saque">
                  Saque
                </NativeSelectOption>
                <NativeSelectOption value="Transferência">
                  Transferência
                </NativeSelectOption>
              </NativeSelect>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-valor">Valor *</Label>
              <Input
                id="new-valor"
                type="number"
                step="0.01"
                value={newTransaction.valor || ""}
                onChange={(e) =>
                  setNewTransaction({
                    ...newTransaction,
                    valor: e.target.value ? parseFloat(e.target.value) : undefined,
                  })
                }
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-moeda">Moeda *</Label>
              <NativeSelect
                id="new-moeda"
                value={newTransaction.moeda || "BRL"}
                onChange={(e) =>
                  setNewTransaction({ ...newTransaction, moeda: e.target.value as Currency })
                }
              >
                <NativeSelectOption value="BRL">BRL - Real Brasileiro</NativeSelectOption>
                <NativeSelectOption value="USD">USD - Dólar Americano</NativeSelectOption>
                <NativeSelectOption value="EUR">EUR - Euro</NativeSelectOption>
                <NativeSelectOption value="CHF">CHF - Franco Suíço</NativeSelectOption>
              </NativeSelect>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddDialogOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button onClick={handleAddTransaction} disabled={isLoading}>
              {isLoading ? "Adicionando..." : "Adicionar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
            <DialogDescription>
              Filtre e pesquise transações
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-6 max-h-[60vh] overflow-y-auto">
            <div>
              <h3 className="mb-3 text-sm font-semibold">Filtrar por ID</h3>
              <Input
                placeholder="Digite o ID da transação..."
                value={transactionFilters.id}
                onChange={(e) => setTransactionFilter('id', e.target.value)}
              />
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold">Filtrar por ID Cliente</h3>
              <Input
                placeholder="Digite o ID do cliente..."
                value={transactionFilters.idCliente}
                onChange={(e) => setTransactionFilter('idCliente', e.target.value)}
              />
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold">Filtrar por Nome do Cliente</h3>
              <Input
                placeholder="Digite o nome do cliente..."
                value={transactionFilters.nomeCliente || ""}
                onChange={(e) => setTransactionFilter('nomeCliente', e.target.value)}
              />
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold">Filtrar por Tipo</h3>
              <NativeSelect
                value={transactionFilters.tipo}
                onChange={(e) => setTransactionFilter('tipo', e.target.value)}
              >
                <NativeSelectOption value="">Todos</NativeSelectOption>
                <NativeSelectOption value="Depósito">Depósito</NativeSelectOption>
                <NativeSelectOption value="Saque">Saque</NativeSelectOption>
                <NativeSelectOption value="Transferência">Transferência</NativeSelectOption>
              </NativeSelect>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold">Filtrar por Valor</h3>
              <Input
                placeholder="Digite o valor..."
                value={transactionFilters.valor}
                onChange={(e) => setTransactionFilter('valor', e.target.value)}
              />
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold">Filtrar por Moeda</h3>
              <NativeSelect
                value={transactionFilters.moeda}
                onChange={(e) => setTransactionFilter('moeda', e.target.value)}
              >
                <NativeSelectOption value="">Todas</NativeSelectOption>
                <NativeSelectOption value="BRL">BRL - Real Brasileiro</NativeSelectOption>
                <NativeSelectOption value="USD">USD - Dólar Americano</NativeSelectOption>
                <NativeSelectOption value="EUR">EUR - Euro</NativeSelectOption>
                <NativeSelectOption value="CHF">CHF - Franco Suíço</NativeSelectOption>
              </NativeSelect>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold">Filtrar por Contraparte</h3>
              <Input
                placeholder="Digite a contraparte..."
                value={transactionFilters.idContraparte}
                onChange={(e) => setTransactionFilter('idContraparte', e.target.value)}
              />
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold">Filtrar por Data e Hora</h3>
              <Input
                placeholder="Digite a data e hora..."
                value={transactionFilters.dataHora}
                onChange={(e) => setTransactionFilter('dataHora', e.target.value)}
              />
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold">Colunas Visíveis</h3>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="col-id"
                    checked={visibleColumns.id}
                    onCheckedChange={() => toggleColumn('id')}
                  />
                  <label htmlFor="col-id" className="text-sm cursor-pointer">
                    ID
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="col-idCliente"
                    checked={visibleColumns.idCliente}
                    onCheckedChange={() => toggleColumn('idCliente')}
                  />
                  <label htmlFor="col-idCliente" className="text-sm cursor-pointer">
                    ID Cliente
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="col-tipo"
                    checked={visibleColumns.tipo}
                    onCheckedChange={() => toggleColumn('tipo')}
                  />
                  <label htmlFor="col-tipo" className="text-sm cursor-pointer">
                    Tipo
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="col-valor"
                    checked={visibleColumns.valor}
                    onCheckedChange={() => toggleColumn('valor')}
                  />
                  <label htmlFor="col-valor" className="text-sm cursor-pointer">
                    Valor
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="col-moeda"
                    checked={visibleColumns.moeda}
                    onCheckedChange={() => toggleColumn('moeda')}
                  />
                  <label htmlFor="col-moeda" className="text-sm cursor-pointer">
                    Moeda
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="col-contraparte"
                    checked={visibleColumns.idContraparte}
                    onCheckedChange={() => toggleColumn('idContraparte')}
                  />
                  <label htmlFor="col-contraparte" className="text-sm cursor-pointer">
                    Contraparte
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="col-dataHora"
                    checked={visibleColumns.dataHora}
                    onCheckedChange={() => toggleColumn('dataHora')}
                  />
                  <label htmlFor="col-dataHora" className="text-sm cursor-pointer">
                    Data e Hora
                  </label>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="secondary" 
              onClick={() => resetTransactionFilters()}
            >
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
/* 00000000000000000000000000000000000000000
   ------------ CLIENT PAGE END ------------
   00000000000000000000000000000000000000000 */