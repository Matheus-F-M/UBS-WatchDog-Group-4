/* IF WE HAD MORE TIME
  1) The filter dialog could allow for multiple names/ids/KYC statuses/etc.

*/

import { clientsApi } from "@/api/clientAPI";
import { countriesApi } from "@/api/countryAPI";
import { CountryCombobox } from "@/components/ui/countryComboBox";
import { ClientCombobox } from "@/components/ui/clientComboBox";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useFilterStore } from "@/stores/filterStore";
import {
  type Client,
  type Country,
  type CpfCnpj,
  isCPF,
  isCNPJ,
  validateCpfCnpj,
  formatCurrency,
} from "@/types/globalTypes";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

/* 00000000000000000000000000000000000000000
   ------------ CODE STARTS HERE -----------
   00000000000000000000000000000000000000000 */

// Types and functions are imported from @/types/globalTypes

const initialClientData: Client[] = [
  {
    id: "123456",
    nome: "Fulano",
    cpfCnpj: validateCpfCnpj("123.456.789-00")!,
    pais: "Brasil",
    kycStatus: "Aprovado",
    nivelDeRisco: "Baixo",
    income: 5000.7,
    isActive: true,
  },
];

/* 00000000000000000000000000000000000000000
   ---------- CLIENT PAGE START ------------
   00000000000000000000000000000000000000000 */

export default function ClientPage() {
  const [clientData, setClientData] = useState<Client[]>([]); // Where all the information of our customers are
  const [countries, setCountries] = useState<Country[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [countryComboboxOpen, setCountryComboboxOpen] = useState(false);
  const [filterCountryComboboxOpen, setFilterCountryComboboxOpen] =
    useState(false);
  const [filterClientComboboxOpen, setFilterClientComboboxOpen] =
    useState(false);
  const [selectedClientIdFilter, setSelectedClientIdFilter] =
    useState<string>("");
  const [newClient, setNewClient] = useState<Partial<Client>>({
    nome: "",
    cpfCnpj: "" as CpfCnpj,
    pais: "",
    kycStatus: "Pendente",
    nivelDeRisco: "Medio",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --------------------------------------
  // Get filters and columns from Zustand store
  // --------------------------------------
  const {
    clientFilters,
    clientVisibleColumns: visibleColumns,
    setClientFilter,
    toggleClientColumn,
    resetClientFilters,
  } = useFilterStore();

  // Destructure filters for easier access
  const nameFilter = clientFilters.nome;
  const paisFilter = clientFilters.pais;
  const capitalFilter = clientFilters.capital;
  const kycStatusFilter = clientFilters.kycStatus;
  const nivelDeRiscoFilter = clientFilters.nivelDeRisco;

  /**
   * Toggles the visibility of a table column
   */
  const toggleColumn = (column: keyof typeof visibleColumns) => {
    toggleClientColumn(column);
  };

  /**
   * Resets all filters and ensures all columns are visible
   */
  const handleResetFiltersAndColumns = () => {
    resetClientFilters();
    // Ensure all columns are visible
    if (!visibleColumns.id) toggleClientColumn('id');
    if (!visibleColumns.nome) toggleClientColumn('nome');
    if (!visibleColumns.cpfCnpj) toggleClientColumn('cpfCnpj');
    if (!visibleColumns.pais) toggleClientColumn('pais');
    if (!visibleColumns.capital) toggleClientColumn('capital');
    if (!visibleColumns.kycStatus) toggleClientColumn('kycStatus');
    if (!visibleColumns.nivelDeRisco) toggleClientColumn('nivelDeRisco');
    // Reset client ID filter from combobox
    setSelectedClientIdFilter('');
  };
  // --------------------------------------
  // END Column visibility state
  // --------------------------------------

  /* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ------- Fetch Clients from API --------
   XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

  // Fetch clients and countries on component mount
  useEffect(() => {
    fetchClients();
    fetchCountries();
  }, []);

  /**
   * Fetches client data from the API and handles loading and error states.
   */
  const fetchClients = async () => {
    setIsLoading(true);
    setError(null);
    try {
      setClientData(await clientsApi.getAll());
    } catch (err) {
      setError("Erro ao carregar clientes. Usando dados de exemplo.");
      // Fallback to initial data if API fails
      setClientData([initialClientData[0]]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Fetches all countries from the API.
   */
  const fetchCountries = async () => {
    try {
      const fetchedCountries = await countriesApi.getAll();
      setCountries(fetchedCountries);
    } catch (err) {
      console.error("Erro ao carregar países:", err);
      setError("Erro ao carregar países do banco de dados.");
    }
  };
  /* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ------------ END FETCHING -------------
   XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

  /**
   * Handles the deletion of client data
   * @param clientId String
   */
  const handleDelete = (clientId: string) => {
    setClientToDelete(clientId);
    setDeleteDialogOpen(true);
  };

  /**
   * Uses Alert Dialogue to confirm a deletion action
   */
  const confirmDelete = async () => {
    if (clientToDelete) {
      setIsLoading(true);
      setError(null);
      try {
        await clientsApi.deactivate(clientToDelete);
        setClientData(clientData.filter((c) => c.id !== clientToDelete));
        setDeleteDialogOpen(false);
        setClientToDelete(null);
      } catch (err) {
        setError("Erro ao deletar cliente");
        alert("Erro ao deletar cliente");
      } finally {
        setIsLoading(false);
      }
    }
  };

  /** -----------------------------------------
   *  ------ Handles adding a new client ------ TODO CLIENT TO ADD
      ----------------------------------------- */
  const handleAddClient = async () => {
    if (!newClient.nome || !newClient.cpfCnpj || !newClient.pais) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    // Catch invalid CPF/CNPJ
    const validated = validateCpfCnpj(newClient.cpfCnpj);
    if (!validated) {
      alert("CPF/CNPJ inválido. Use 000.000.000-00 ou 00.000.000/0000-00");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const clientToAdd: Omit<Client, "id"> = {
        nome: newClient.nome,
        cpfCnpj: validated,
        pais: newClient.pais,
        kycStatus: newClient.kycStatus || "Pendente",
        ...(newClient.income !== undefined && {
          income: newClient.income,
        }),
        nivelDeRisco: newClient.nivelDeRisco || "Medio", // <<<< TODO using backend api
        isActive: true,
      };

      console.log("Adding client:", clientToAdd);
      const createdClient = await clientsApi.create(clientToAdd);
      setClientData([...clientData, createdClient]);
      setAddDialogOpen(false);
      setNewClient({
        nome: "",
        cpfCnpj: "" as CpfCnpj,
        pais: "",
        kycStatus: "Pendente",
      });
    } catch (err) {
      setError("Erro ao criar cliente");
      alert("Erro ao criar cliente");
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
    <div className="p-8 animate-in fade-in duration-1000">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-50 rounded-lg border-2 border-pink-600 p-6 shadow-[0_0_8px_#ed2df0]">
          {error && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800">
              {error}
            </div>
          )}

          <h2 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-[#971e99] to-[#000000] bg-clip-text text-transparent">
            Clientes
          </h2>

          {/* --------------------------------------- */}
          {/* Add Client Button and Loading Indicator */}
          {/* --------------------------------------- */}

          <div className="mb-4 flex gap-2">
            <Button onClick={() => setAddDialogOpen(true)} disabled={isLoading}
              className="hover:bg-[#971e99]">
              Adicionar Cliente
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

          {isLoading && clientData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Carregando clientes...
            </div>
          ) : (
            <div className="max-h-[600px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {visibleColumns.id && (
                    <TableHead className="bg-gradient-to-r from-[#971e99] to-[#000000] bg-clip-text text-transparent">
                      ID
                    </TableHead>
                  )}
                  {visibleColumns.nome && (
                    <TableHead className="bg-gradient-to-r from-[#971e99] to-[#000000] bg-clip-text text-transparent">
                      Nome
                    </TableHead>
                  )}
                  {visibleColumns.cpfCnpj && (
                    <TableHead className="bg-gradient-to-r from-[#971e99] to-[#000000] bg-clip-text text-transparent">
                      CPF/CNPJ
                    </TableHead>
                  )}
                  {visibleColumns.pais && (
                    <TableHead className="bg-gradient-to-r from-[#971e99] to-[#000000] bg-clip-text text-transparent">
                      País
                    </TableHead>
                  )}
                  {visibleColumns.capital && (
                    <TableHead className="bg-gradient-to-r from-[#971e99] to-[#000000] bg-clip-text text-transparent">
                      Capital
                    </TableHead>
                  )}
                  {visibleColumns.kycStatus && (
                    <TableHead className="bg-gradient-to-r from-[#971e99] to-[#000000] bg-clip-text text-transparent">
                      KYC Status
                    </TableHead>
                  )}
                  {visibleColumns.nivelDeRisco && (
                    <TableHead className="bg-gradient-to-r from-[#971e99] to-[#000000] bg-clip-text text-transparent">
                      Nível de Risco
                    </TableHead>
                  )}
                  <TableHead className="w-32 bg-gradient-to-r from-[#971e99] to-[#000000] bg-clip-text text-transparent">
                    Ações
                  </TableHead>
                  <TableHead className="w-24 bg-gradient-to-r from-[#971e99] to-[#000000] bg-clip-text text-transparent">
                    Remover
                  </TableHead>
                </TableRow>
              </TableHeader>

              {/* --------------Table Body--------------- */}
              <TableBody>
                {clientData
                  .filter((client) => {
                    const nomeSearch = nameFilter.toLowerCase();
                    const paisSearch = paisFilter.toLowerCase();
                    const capitalSearch = capitalFilter.toLowerCase();

                    // Check if capital filter matches income or income
                    const capitalMatch =
                      capitalSearch === "" ||
                      client.income
                        ?.toString()
                        .toLowerCase()
                        .includes(capitalSearch);

                    // Check KYC Status filter
                    const kycMatch =
                      kycStatusFilter.length === 0 ||
                      kycStatusFilter.includes(client.kycStatus);

                    // Check Nível de Risco filter
                    const riscoMatch =
                      nivelDeRiscoFilter.length === 0 ||
                      nivelDeRiscoFilter.includes(client.nivelDeRisco);

                    // Check client ID filter (from ClientCombobox)
                    const clientIdMatch =
                      selectedClientIdFilter === "" ||
                      client.id === selectedClientIdFilter;

                    return (
                      client.isActive === true &&
                      clientIdMatch &&
                      client.nome?.toLowerCase().includes(nomeSearch) &&
                      client.pais?.toLowerCase().includes(paisSearch) &&
                      capitalMatch &&
                      kycMatch &&
                      riscoMatch
                    );
                  })
                  .map((client, index) => (
                    <TableRow
                      key={client.id}
                      className={`${
                        index % 2 === 0 ? "bg-gray-100" : "bg-white"
                      }`}
                    >
                      {visibleColumns.id && <TableCell>{client.id}</TableCell>}
                      {visibleColumns.nome && (
                        <TableCell>{client.nome}</TableCell>
                      )}
                      {visibleColumns.cpfCnpj && (
                        <TableCell>{client.cpfCnpj}</TableCell>
                      )}
                      {visibleColumns.pais && (
                        <TableCell>{client.pais}</TableCell>
                      )}
                      {visibleColumns.capital && (
                        <TableCell>
                          {isCPF(client.cpfCnpj) && client.income
                            ? `R$${formatCurrency(client.income)}/month`
                            : isCNPJ(client.cpfCnpj) && client.income
                            ? `R$${formatCurrency(client.income)}`
                            : "-"}
                        </TableCell>
                      )}
                      {visibleColumns.kycStatus && (
                        <TableCell
                          className={
                            client.kycStatus === "Aprovado"
                              ? "text-green-600 font-semibold"
                              : client.kycStatus === "Pendente"
                              ? "text-yellow-600"
                              : client.kycStatus === "Em Análise"
                              ? "text-blue-600"
                              : client.kycStatus === "Rejeitado"
                              ? "text-red-600 font-semibold"
                              : "text-gray-600"
                          }
                        >
                          {client.kycStatus}
                        </TableCell>
                      )}
                      {visibleColumns.nivelDeRisco && (
                        <TableCell
                          className={
                            client.nivelDeRisco === "Baixo"
                              ? "text-green-600 font-semibold"
                              : client.nivelDeRisco === "Medio"
                              ? "text-yellow-600 font-semibold"
                              : client.nivelDeRisco === "Alto"
                              ? "text-red-600 font-semibold"
                              : "text-gray-600"
                          }
                        >
                          {client.nivelDeRisco}
                        </TableCell>
                      )}
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            window.open(
                              `/dashboard/clients/${client.id}`,
                              "_blank"
                            )
                          }
                        >
                          Ver Relatório
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(client.id)}
                        >
                          ❌
                        </Button>
                      </TableCell>
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

      {/* -------------------------------------------------------------- */}
      {/* ---------------- Delete Confirmation Dialogue ---------------- */}
      {/* -------------------------------------------------------------- */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover cliente</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar este cliente? Esta ação não pode
              ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ---------------------------------------------------------- */}
      {/* --------------------- ADD NEW CLIENT --------------------- */}
      {/* ---------------------------------------------------------- */}

      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Cliente</DialogTitle>
            <DialogDescription>
              Preencha os dados do novo cliente
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-nome">Nome *</Label>
              <Input
                id="new-nome"
                value={newClient.nome || ""}
                onChange={(e) =>
                  setNewClient({ ...newClient, nome: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-cpfCnpj">CPF/CNPJ *</Label>
              <Input
                id="new-cpfCnpj"
                value={newClient.cpfCnpj || ""}
                onChange={(e) =>
                  setNewClient({
                    ...newClient,
                    cpfCnpj: e.target.value as CpfCnpj,
                  })
                }
                placeholder="000.000.000-00 ou 00.000.000/0000-00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-pais">País *</Label>
              <CountryCombobox
                isOpen={countryComboboxOpen}
                setIsOpen={setCountryComboboxOpen}
                selectedCountry={newClient.pais || ""}
                onSelect={(countryName) =>
                  setNewClient({ ...newClient, pais: countryName })
                }
                countries={countries}
              />
            </div>

            {/* Conditional fields based on CPF/CNPJ */}
            {/* This should pop-up as soon as the user inserts a valid CPF or CNPJ */}
            {newClient.cpfCnpj && isCPF(newClient.cpfCnpj as string) && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="new-income">Renda Mensal</Label>
                  <Input
                    id="new-income"
                    type="number"
                    value={newClient.income || ""}
                    onChange={(e) =>
                      setNewClient({
                        ...newClient,
                        income: e.target.value
                          ? parseFloat(e.target.value)
                          : undefined,
                      })
                    }
                    placeholder="0.00"
                  />
                </div>
              </>
            )}

            {newClient.cpfCnpj && isCNPJ(newClient.cpfCnpj as string) && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="new-income">Capital Social</Label>
                  <Input
                    id="new-income"
                    type="number"
                    value={newClient.income || ""}
                    onChange={(e) =>
                      setNewClient({
                        ...newClient,
                        income: e.target.value
                          ? parseFloat(e.target.value)
                          : undefined,
                      })
                    }
                    placeholder="0.00"
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="new-kycStatus">KYC Status</Label>
              <NativeSelect
                id="new-kycStatus"
                value={newClient.kycStatus || "Pendente"}
                onChange={(e) =>
                  setNewClient({
                    ...newClient,
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
            <Button onClick={handleAddClient} disabled={isLoading}>
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
            <DialogDescription>Filtre e Pesquise clientes</DialogDescription>
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
                  id="col-nome"
                  checked={visibleColumns.nome}
                  onCheckedChange={() => toggleColumn("nome")}
                />
                <label htmlFor="col-nome" className="text-sm cursor-pointer">
                  Nome
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="col-cpfCnpj"
                  checked={visibleColumns.cpfCnpj}
                  onCheckedChange={() => toggleColumn("cpfCnpj")}
                />
                <label htmlFor="col-cpfCnpj" className="text-sm cursor-pointer">
                  CPF/CNPJ
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="col-pais"
                  checked={visibleColumns.pais}
                  onCheckedChange={() => toggleColumn("pais")}
                />
                <label htmlFor="col-pais" className="text-sm cursor-pointer">
                  País
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="col-capital"
                  checked={visibleColumns.capital}
                  onCheckedChange={() => toggleColumn("capital")}
                />
                <label htmlFor="col-capital" className="text-sm cursor-pointer">
                  Capital
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="col-kycStatus"
                  checked={visibleColumns.kycStatus}
                  onCheckedChange={() => toggleColumn("kycStatus")}
                />
                <label
                  htmlFor="col-kycStatus"
                  className="text-sm cursor-pointer"
                >
                  KYC Status
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="col-nivelDeRisco"
                  checked={visibleColumns.nivelDeRisco}
                  onCheckedChange={() => toggleColumn("nivelDeRisco")}
                />
                <label
                  htmlFor="col-nivelDeRisco"
                  className="text-sm cursor-pointer"
                >
                  Nível de Risco
                </label>
              </div>
            </div>

            <div className="py-4 space-y-6 max-h-[60vh] overflow-y-auto">
              <div>
                <h3 className="mb-3 text-sm font-semibold">
                  Filtrar por Cliente
                </h3>
                <ClientCombobox
                  isOpen={filterClientComboboxOpen}
                  setIsOpen={setFilterClientComboboxOpen}
                  selectedClientId={selectedClientIdFilter}
                  onSelect={(clientId) => setSelectedClientIdFilter(clientId)}
                  clients={clientData.filter(client => client.isActive)}
                  showAllOption={true}
                  placeholder="Buscar cliente..."
                />
              </div>

              <div>
                <h3 className="mb-3 text-sm font-semibold">Filtrar por País</h3>
                <CountryCombobox
                  isOpen={filterCountryComboboxOpen}
                  setIsOpen={setFilterCountryComboboxOpen}
                  selectedCountry={paisFilter}
                  onSelect={(countryName) =>
                    setClientFilter("pais", countryName)
                  }
                  countries={countries}
                  showAllOption={true}
                />
              </div>

              <div>
                <h3 className="mb-3 text-sm font-semibold">
                  Filtrar por Capital
                </h3>
                <Input
                  placeholder="Digite o valor do capital..."
                  value={capitalFilter}
                  onChange={(e) => setClientFilter("capital", e.target.value)}
                />
              </div>
              {/* Side by Side KYC Status and Nível de Risco Filters */}
              <div>
                <h3 className="mb-3 text-sm font-semibold">
                  Filtrar por Status
                </h3>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Label className="py-2 block mb-2">
                      KYC Status (múltiplas seleções)
                    </Label>
                    <div className="space-y-2">
                      {['Pendente', 'Aprovado', 'Rejeitado'].map((status) => (
                        <div key={status} className="flex items-center space-x-2">
                          <Checkbox
                            id={`kyc-${status}`}
                            checked={kycStatusFilter.includes(status)}
                            onCheckedChange={(checked) => {
                              const newFilter = checked
                                ? [...kycStatusFilter, status]
                                : kycStatusFilter.filter(s => s !== status);
                              setClientFilter('kycStatus', newFilter as any);
                            }}
                          />
                          <label htmlFor={`kyc-${status}`} className="text-sm cursor-pointer">
                            {status}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1">
                    <Label className="py-2 block mb-2">
                      Nível de Risco (múltiplas seleções)
                    </Label>
                    <div className="space-y-2">
                      {['Baixo', 'Medio', 'Alto'].map((risco) => (
                        <div key={risco} className="flex items-center space-x-2">
                          <Checkbox
                            id={`risco-${risco}`}
                            checked={nivelDeRiscoFilter.includes(risco)}
                            onCheckedChange={(checked) => {
                              const newFilter = checked
                                ? [...nivelDeRiscoFilter, risco]
                                : nivelDeRiscoFilter.filter(r => r !== risco);
                              setClientFilter('nivelDeRisco', newFilter as any);
                            }}
                          />
                          <label htmlFor={`risco-${risco}`} className="text-sm cursor-pointer">
                            {risco}
                          </label>
                        </div>
                      ))}
                    </div>
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
