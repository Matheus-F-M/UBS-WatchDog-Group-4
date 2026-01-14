import { clientsApi } from "@/api/clientAPI";
import { transactionsApi } from "@/api/transactionAPI";
import { currenciesApi } from "@/api/currencyAPI";
import { ClientCombobox } from "@/components/ui/clientComboBox";
import { CurrencyCombobox } from "@/components/ui/currencyComboBox";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useFilterStore } from "@/stores/filterStore";
import { format, parseISO } from "date-fns";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import {
  type Transaction,
  type Currency,
  type Client,
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
    valor: 10000.5,
    moeda: "BRL",
    idContraparte: "000.000.000-00",
    dataHora: "2024-01-15 14:30:00",
  },
];

export default function TransactionPage() {
  const [transactiondata, setTransactiondata] = useState<Transaction[]>([]);
  const [clientNames, setClientNames] = useState<Record<string, string>>({});
  const [counterpartyCpfCnpj, setCounterpartyCpfCnpj] = useState<
    Record<string, string>
  >({});
  const [clients, setClients] = useState<Client[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [clientComboboxOpen, setClientComboboxOpen] = useState(false);
  const [counterpartyComboboxOpen, setCounterpartyComboboxOpen] =
    useState(false);
  const [currencyComboboxOpen, setCurrencyComboboxOpen] = useState(false);
  const [filterClientComboboxOpen, setFilterClientComboboxOpen] =
    useState(false);
  const [filterCounterpartyComboboxOpen, setFilterCounterpartyComboboxOpen] =
    useState(false);
  const [selectedClientIdFilter, setSelectedClientIdFilter] =
    useState<string>("");
  const [selectedCounterpartyIdFilter, setSelectedCounterpartyIdFilter] =
    useState<string>("");

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

  /**
   * Resets all filters, local state filters, and ensures all columns are visible
   */
  const handleResetFiltersAndColumns = () => {
    resetTransactionFilters();
    setSelectedClientIdFilter("");
    setSelectedCounterpartyIdFilter("");
    // Ensure all columns are visible
    if (!visibleColumns.id) toggleTransactionColumn('id');
    if (!visibleColumns.idCliente) toggleTransactionColumn('idCliente');
    if (!visibleColumns.nomeCliente) toggleTransactionColumn('nomeCliente');
    if (!visibleColumns.tipo) toggleTransactionColumn('tipo');
    if (!visibleColumns.valor) toggleTransactionColumn('valor');
    if (!visibleColumns.moeda) toggleTransactionColumn('moeda');
    if (!visibleColumns.idContraparte) toggleTransactionColumn('idContraparte');
    if (!visibleColumns.dataHora) toggleTransactionColumn('dataHora');
  };

  /* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
     ------ Fetch Transactions from API ----
     XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */
  // Fetch transactions and clients on component mount
  useEffect(() => {
    fetchTransactions();
    fetchClients();
    fetchCurrencies();
  }, []);

  /**
   * Fetches all clients from the API.
   */
  const fetchClients = async () => {
    try {
      const fetchedClients = await clientsApi.getAll();
      setClients(fetchedClients);
    } catch (err) {
      console.error("Erro ao carregar clientes:", err);
    }
  };

  /**
   * Fetches all currencies from the API.
   */
  const fetchCurrencies = async () => {
    try {
      const fetchedCurrencies = await currenciesApi.getAll();
      setCurrencies(fetchedCurrencies);
    } catch (err) {
      console.error("Erro ao carregar moedas:", err);
    }
  };

  /**
   * Fetches client names for all transactions by their IDs.
   * @param transactions - Array of transactions to fetch client names for
   */
  const fetchClientNames = async (transactions: Transaction[]) => {
    const uniqueClientIds = [...new Set(transactions.map((t) => t.idCliente))];
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
  };

  /**
   * Fetches counterparty CPF/CNPJ for all transactions by their IDs.
   * @param transactions - Array of transactions to fetch counterparty CPF/CNPJ for
   */
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

  /**
   * Fetches transaction data from the API and handles loading and error states.
   */
  const fetchTransactions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const transactions = await transactionsApi.getAll();
      setTransactiondata(transactions);

      // Fetch client names and counterparty CPF/CNPJ for all transactions
      await fetchClientNames(transactions);
      await fetchCounterpartyCpfCnpj(transactions);
    } catch (err) {
      setError("Erro ao carregar transações. Usando dados de exemplo.");
      // Fallback to initial data if API fails
      setTransactiondata([initialTransactiondata[0]]);
    } finally {
      setIsLoading(false);
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
        moeda: newTransaction.moeda,
        idContraparte: newTransaction.idContraparte,
        dataHora: "", // backend will set current date/time
      };

      const createdTransaction = await transactionsApi.create(transactionToAdd);
      setTransactiondata([...transactiondata, createdTransaction]);

      // Fetch the client name and counterparty CPF/CNPJ for the new transaction
      try {
        const client = await clientsApi.getById(createdTransaction.idCliente);
        setClientNames((prev) => ({
          ...prev,
          [createdTransaction.idCliente]: client.nome,
        }));
      } catch (err) {
        console.error("Erro ao carregar nome do cliente:", err);
        setClientNames((prev) => ({
          ...prev,
          [createdTransaction.idCliente]: "Desconhecido",
        }));
      }

      try {
        const counterparty = await clientsApi.getById(
          createdTransaction.idContraparte
        );
        setCounterpartyCpfCnpj((prev) => ({
          ...prev,
          [createdTransaction.idContraparte]: counterparty.cpfCnpj,
        }));
      } catch (err) {
        console.error("Erro ao carregar CPF/CNPJ da contraparte:", err);
        setCounterpartyCpfCnpj((prev) => ({
          ...prev,
          [createdTransaction.idContraparte]: "Desconhecido",
        }));
      }

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
    <div className="p-8 ">
      <div className="max-w-7xl mx-auto animate-in fade-in duration-1000">
        <div className="bg-white rounded-lg border-2 border-blue-600 p-6 shadow-[0_0_12px_#1100ff]">
          {error && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800">
              {error}
            </div>
          )}

          <h2 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-[#0b0198] to-[#000000] bg-clip-text text-transparent">
            Transações
          </h2>

          {/* --------------------------------------- */}
          {/* Add Transaction Button and Filter Button */}
          {/* --------------------------------------- */}

          <div className="mb-4 flex gap-2">
            <Button onClick={() => setAddDialogOpen(true)} disabled={isLoading}
              className="hover:bg-[#0b0198]">
              Adicionar Transação
            </Button>
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

          {isLoading && transactiondata.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Carregando transações...
            </div>
          ) : (
            <div className="max-h-[600px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {visibleColumns.id && (
                    <TableHead className="bg-gradient-to-r from-[#0b0198] to-[#000000] bg-clip-text text-transparent">
                      ID
                    </TableHead>
                  )}
                  {visibleColumns.idCliente && (
                    <TableHead className="bg-gradient-to-r from-[#0b0198] to-[#000000] bg-clip-text text-transparent">
                      ID Cliente
                    </TableHead>
                  )}
                  {visibleColumns.nomeCliente && (
                    <TableHead className="bg-gradient-to-r from-[#0b0198] to-[#000000] bg-clip-text text-transparent">
                      Cliente
                    </TableHead>
                  )}
                  {visibleColumns.tipo && (
                    <TableHead className="bg-gradient-to-r from-[#0b0198] to-[#000000] bg-clip-text text-transparent">
                      Tipo
                    </TableHead>
                  )}
                  {visibleColumns.moeda && (
                    <TableHead className="bg-gradient-to-r from-[#0b0198] to-[#000000] bg-clip-text text-transparent">
                      Moeda
                    </TableHead>
                  )}
                  {visibleColumns.valor && (
                    <TableHead className="bg-gradient-to-r from-[#0b0198] to-[#000000] bg-clip-text text-transparent">
                      Valor
                    </TableHead>
                  )}
                  {visibleColumns.idContraparte && (
                    <TableHead className="bg-gradient-to-r from-[#0b0198] to-[#000000] bg-clip-text text-transparent">
                      Contraparte
                    </TableHead>
                  )}
                  {visibleColumns.dataHora && (
                    <TableHead className="bg-gradient-to-r from-[#0b0198] to-[#000000] bg-clip-text text-transparent">
                      Data e Hora
                    </TableHead>
                  )}
                </TableRow>
              </TableHeader>

              {/* --------------Table Body--------------- */}
              <TableBody>
                {transactiondata
                  .filter((transaction) => {
                    const idSearch = transactionFilters.id.toLowerCase();
                    const tipoSearch = transactionFilters.tipo.toLowerCase();
                    const valorSearch = transactionFilters.valor.toLowerCase();
                    const moedaSearch = transactionFilters.moeda.toLowerCase();
                    const dataSearch = (
                      transactionFilters.dataHora || ""
                    ).toLowerCase();

                    // Check client ID filter (from ClientCombobox)
                    const clientIdMatch =
                      selectedClientIdFilter === "" ||
                      transaction.idCliente === selectedClientIdFilter;

                    // Check counterparty ID filter (from ClientCombobox)
                    const counterpartyIdMatch =
                      selectedCounterpartyIdFilter === "" ||
                      transaction.idContraparte ===
                        selectedCounterpartyIdFilter;

                    // Check client isActive filter
                    const client = clients.find(
                      (c) => c.id === transaction.idCliente
                    );
                    const isActiveMatch =
                      transactionFilters.isActive === "" ||
                      (transactionFilters.isActive === "ativo" &&
                        client?.isActive) ||
                      (transactionFilters.isActive === "inativo" &&
                        client &&
                        !client.isActive);

                    // Format date for searching
                    let formattedDate = "";
                    try {
                      formattedDate = format(
                        parseISO(transaction.dataHora),
                        "dd/MM/yyyy HH:mm"
                      ).toLowerCase();
                    } catch {
                      formattedDate = transaction.dataHora.toLowerCase();
                    }

                    return (
                      transaction.id.toLowerCase().includes(idSearch) &&
                      clientIdMatch &&
                      counterpartyIdMatch &&
                      isActiveMatch &&
                      transaction.tipo.toLowerCase().includes(tipoSearch) &&
                      transaction.valor.toString().includes(valorSearch) &&
                      transaction.moeda.toLowerCase().includes(moedaSearch) &&
                      formattedDate.includes(dataSearch)
                    );
                  })
                  .sort((a, b) => {
                    // Sort by date/time, latest first
                    try {
                      const dateA = parseISO(a.dataHora);
                      const dateB = parseISO(b.dataHora);
                      return dateB.getTime() - dateA.getTime();
                    } catch {
                      return 0;
                    }
                  })
                  .map((transaction, index) => {
                    const client = clients.find(
                      (c) => c.id === transaction.idCliente
                    );
                    const isClientInactive = client && !client.isActive;

                    const counterparty = clients.find(
                      (c) => c.id === transaction.idContraparte
                    );
                    const isCounterpartyInactive =
                      counterparty && !counterparty.isActive;

                    return (
                      <TableRow
                        key={transaction.id}
                        className={`${
                          index % 2 === 0 ? "bg-gray-100" : "bg-white"
                        }`}
                      >
                        {visibleColumns.id && (
                          <TableCell>{transaction.id}</TableCell>
                        )}
                        {visibleColumns.idCliente && (
                          <TableCell>{transaction.idCliente}</TableCell>
                        )}
                        {visibleColumns.nomeCliente && (
                          <TableCell>
                            <Button
                              variant="default"
                              size="sm"
                              className={`px-2 py-1 rounded-full text-xs text-purple-700 font-medium bg-purple-200 hover:bg-purple-300 ${
                                isClientInactive
                                  ? "text-red-600 font-semibold"
                                  : ""
                              }`}
                              onClick={() =>
                                window.open(
                                  `/dashboard/clients/${transaction.idCliente}`,
                                  "_blank"
                                )
                              }
                            >
                              {clientNames[transaction.idCliente] ||
                                "Carregando..."}
                            </Button>
                          </TableCell>
                        )}
                        {visibleColumns.tipo && (
                          <TableCell>{transaction.tipo}</TableCell>
                        )}
                        {visibleColumns.moeda && (
                          <TableCell>{transaction.moeda}</TableCell>
                        )}
                        {visibleColumns.valor && (
                          <TableCell className="font-medium">
                            {formatCurrency(transaction.valor)}
                          </TableCell>
                        )}
                        {visibleColumns.idContraparte && (
                          <TableCell>
                            <Button
                              variant="default"
                              size="sm"
                              className={`px-2 py-1 rounded-full text-xs text-purple-700 font-medium bg-purple-200 hover:bg-purple-300 ${
                                isCounterpartyInactive
                                  ? "text-red-600 font-semibold"
                                  : ""
                              }`}
                              onClick={() =>
                                window.open(
                                  `/dashboard/clients/${transaction.idContraparte}`,
                                  "_blank"
                                )
                              }
                            >
                              {counterpartyCpfCnpj[transaction.idContraparte] ||
                                "Carregando..."}
                            </Button>
                          </TableCell>
                        )}
                        {visibleColumns.dataHora && (
                          <TableCell>
                            {(() => {
                              try {
                                return format(
                                  parseISO(transaction.dataHora),
                                  "dd/MM/yyyy HH:mm"
                                );
                              } catch {
                                return transaction.dataHora;
                              }
                            })()}
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
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
              <Label htmlFor="new-idCliente">Cliente *</Label>
              <ClientCombobox
                isOpen={clientComboboxOpen}
                setIsOpen={setClientComboboxOpen}
                selectedClientId={newTransaction.idCliente || ""}
                onSelect={(clientId) =>
                  setNewTransaction({ ...newTransaction, idCliente: clientId })
                }
                clients={clients.filter((client) => client.isActive)}
                placeholder="Selecione o cliente..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-contraparte">Contraparte *</Label>
              <ClientCombobox
                isOpen={counterpartyComboboxOpen}
                setIsOpen={setCounterpartyComboboxOpen}
                selectedClientId={newTransaction.idContraparte || ""}
                onSelect={(clientId) =>
                  setNewTransaction({
                    ...newTransaction,
                    idContraparte: clientId,
                  })
                }
                clients={clients.filter((client) => client.isActive)}
                placeholder="Selecione a contraparte..."
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
                <NativeSelectOption value="Saque">Saque</NativeSelectOption>
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
                    valor: e.target.value
                      ? parseFloat(e.target.value)
                      : undefined,
                  })
                }
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-moeda">Moeda *</Label>
              <CurrencyCombobox
                isOpen={currencyComboboxOpen}
                setIsOpen={setCurrencyComboboxOpen}
                selectedCurrency={newTransaction.moeda || "BRL"}
                onSelect={(currencyCode) =>
                  setNewTransaction({ ...newTransaction, moeda: currencyCode })
                }
                currencies={currencies}
              />
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
            <DialogDescription>Filtre e pesquise transações</DialogDescription>
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
                  id="col-nomeCliente"
                  checked={visibleColumns.nomeCliente}
                  onCheckedChange={() => toggleColumn("nomeCliente")}
                />
                <label
                  htmlFor="col-nomeCliente"
                  className="text-sm cursor-pointer"
                >
                  Cliente
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="col-tipo"
                  checked={visibleColumns.tipo}
                  onCheckedChange={() => toggleColumn("tipo")}
                />
                <label htmlFor="col-tipo" className="text-sm cursor-pointer">
                  Tipo
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="col-valor"
                  checked={visibleColumns.valor}
                  onCheckedChange={() => toggleColumn("valor")}
                />
                <label htmlFor="col-valor" className="text-sm cursor-pointer">
                  Valor
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="col-moeda"
                  checked={visibleColumns.moeda}
                  onCheckedChange={() => toggleColumn("moeda")}
                />
                <label htmlFor="col-moeda" className="text-sm cursor-pointer">
                  Moeda
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="col-contraparte"
                  checked={visibleColumns.idContraparte}
                  onCheckedChange={() => toggleColumn("idContraparte")}
                />
                <label
                  htmlFor="col-contraparte"
                  className="text-sm cursor-pointer"
                >
                  Contraparte
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="col-dataHora"
                  checked={visibleColumns.dataHora}
                  onCheckedChange={() => toggleColumn("dataHora")}
                />
                <label
                  htmlFor="col-dataHora"
                  className="text-sm cursor-pointer"
                >
                  Data e Hora
                </label>
              </div>
            </div>
          </div>

          <div className="py-4 space-y-6 max-h-[60vh] overflow-y-auto">
            <div>
              <h3 className="mb-3 text-sm font-semibold">Filtrar por ID</h3>
              <Input
                placeholder="Digite o ID da transação..."
                value={transactionFilters.id}
                onChange={(e) => setTransactionFilter("id", e.target.value)}
              />
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold">
                Filtrar por Cliente
              </h3>
              <ClientCombobox
                isOpen={filterClientComboboxOpen}
                setIsOpen={setFilterClientComboboxOpen}
                selectedClientId={selectedClientIdFilter}
                onSelect={(clientId) => setSelectedClientIdFilter(clientId)}
                clients={clients}
                showAllOption={true}
                placeholder="Buscar cliente..."
              />
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold">
                Filtrar por Contraparte
              </h3>
              <ClientCombobox
                isOpen={filterCounterpartyComboboxOpen}
                setIsOpen={setFilterCounterpartyComboboxOpen}
                selectedClientId={selectedCounterpartyIdFilter}
                onSelect={(clientId) =>
                  setSelectedCounterpartyIdFilter(clientId)
                }
                clients={clients}
                showAllOption={true}
                placeholder="Buscar contraparte..."
              />
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold">Filtrar por Tipo</h3>
              <NativeSelect
                value={transactionFilters.tipo}
                onChange={(e) => setTransactionFilter("tipo", e.target.value)}
              >
                <NativeSelectOption value="">Todos</NativeSelectOption>
                <NativeSelectOption value="Depósito">
                  Depósito
                </NativeSelectOption>
                <NativeSelectOption value="Saque">Saque</NativeSelectOption>
                <NativeSelectOption value="Transferência">
                  Transferência
                </NativeSelectOption>
              </NativeSelect>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold">Filtrar por Valor</h3>
              <Input
                placeholder="Digite o valor..."
                value={transactionFilters.valor}
                onChange={(e) => setTransactionFilter("valor", e.target.value)}
              />
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold">Filtrar por Moeda</h3>
              <NativeSelect
                value={transactionFilters.moeda}
                onChange={(e) => setTransactionFilter("moeda", e.target.value)}
              >
                <NativeSelectOption value="">Todas</NativeSelectOption>
                <NativeSelectOption value="BRL">
                  BRL - Real Brasileiro
                </NativeSelectOption>
              </NativeSelect>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold">
                Filtrar por Data e Hora
              </h3>
              <Input
                placeholder="Ex: 15/01/2024 ou 14:30..."
                value={transactionFilters.dataHora}
                onChange={(e) =>
                  setTransactionFilter("dataHora", e.target.value)
                }
              />
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold">
                Filtrar por Status do Cliente
              </h3>
              <NativeSelect
                value={transactionFilters.isActive}
                onChange={(e) =>
                  setTransactionFilter("isActive", e.target.value)
                }
              >
                <NativeSelectOption value="">Todos</NativeSelectOption>
                <NativeSelectOption value="ativo">Ativo</NativeSelectOption>
                <NativeSelectOption value="inativo">Inativo</NativeSelectOption>
              </NativeSelect>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="secondary"
              onClick={handleResetFiltersAndColumns}
            >
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
/* 00000000000000000000000000000000000000000
   ------------ CLIENT PAGE END ------------
   00000000000000000000000000000000000000000 */
