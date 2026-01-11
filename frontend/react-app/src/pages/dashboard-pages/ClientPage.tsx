/* IF WE HAD MORE TIME
  1) The filter dialog could allow for multiple names/ids/KYC statuses/etc.

*/

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  type Client,
  type CPF,
  type CNPJ,
  type CpfCnpj,
  isCPF,
  isCNPJ,
  validateCpfCnpj,
  currencies,
  formatCurrency,
} from "@/types/globalTypes";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
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
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogTrigger,
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

// Types and functions are imported from @/types/globalTypes

const initialClientData: Client[] = [
  {
    id: "123456",
    nome: "Fulano",
    // sobrenome: "Ciclano",
    cpfCnpj: validateCpfCnpj("123.456.789-00")!,
    pais: "Brasil",
    kycStatus: "Aprovado",
    nivelDeRisco: "Baixo",
    income: 5000.7,
    // incomeCurrency: "BRL",
  },
];


/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   -------- API IMPLEMENTATION HERE --------
   XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

// API Base URL - Update this when backend is ready
const API_BASE_URL = "http://localhost:5131/api/v1/clients";

/**
 * Maps a backend client object to the Client type used in the frontend.
 * @param backendClient any : the client in the backend database
 * @returns Client : the mapped client to the parameters used in the frontend
 */
  const mapBackendClient = (backendClient: any): Client => {
console.log("Full Backend Client Object:", backendClient);
console.log("Backend Government ID:", backendClient.governmentId);
      return {
      id: backendClient.id || "none",
      nome: backendClient.name || "none",
      cpfCnpj: validateCpfCnpj(backendClient.governmentId) || "000.000.000-00",
      pais: backendClient.country || "none",
      kycStatus: (backendClient.kycStatus === 0)? "Pendente"
        : (backendClient.kycStatus === 1)? "Aprovado"
        : (backendClient.kycStatus === 2)? "Rejeitado"
        : "Pendente",
      nivelDeRisco: (backendClient.riskLevel === 0)? "Baixo"
        : (backendClient.riskLevel === 1)? "Medio"
        : (backendClient.riskLevel === 2)? "Alto"
        : "Medio",
      income: backendClient.income,
    }
  }

/**
 * Maps a frontend client object to the backend client format.
 * @param client Client : frontend client
 * @returns any : backend client
 */
const reverseMapBackendClient = (client: Client): any => {
  return {
    id: client.id,
    name: client.nome,
    governmentId: client.cpfCnpj,
    country: client.pais,
    kycStatus: (client.kycStatus === "Pendente")? 0
      : (client.kycStatus === "Aprovado")? 1
      : (client.kycStatus === "Rejeitado")? 2
      : 0,
    riskLevel: (client.nivelDeRisco === "Baixo")? 0
      : (client.nivelDeRisco === "Medio")? 1
      : (client.nivelDeRisco === "Alto")? 2
      : 1,
    income: client.income,
  }
}

// API helper functions
const clientsApi = {
  // Fetch all clients
  getAll: async (): Promise<Client[]> => {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) throw new Error("Failed to fetch clients");
const rawData = await response.json();
console.log("Raw API Response from getAll:", rawData);
    return rawData.map(mapBackendClient);
  },

  // Create new client
  create: async (client: Omit<Client, "id">): Promise<Client> => {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reverseMapBackendClient(client as Client)),
    });
    if (!response.ok) throw new Error("Failed to create client");
    return mapBackendClient(await response.json());
  },

  // Update client
  update: async (id: string, client: Client): Promise<Client> => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reverseMapBackendClient(client as Client)),
    });
    if (!response.ok) throw new Error("Failed to update client");
    const rawClient = await response.json();
    return mapBackendClient(rawClient);
  },

  // Delete client
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete client");
  },
};
/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ------------------ END ------------------
   XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

/* -----------------------------------------
   ---------- Currency Combobox ------------
   ----------------------------------------- */

/**
 * Creates a Currency Combobox using Popover and Command components.
 */
function CurrencyCombobox({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? currencies.find((currency) => currency.value === value)?.label
            : "Selecione a moeda..."}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Buscar moeda..." />
          <CommandList>
            <CommandEmpty>Nenhuma moeda encontrada.</CommandEmpty>
            <CommandGroup>
              {currencies.map((currency) => (
                <CommandItem
                  key={currency.value}
                  value={currency.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <CheckIcon
                    className={
                      value === currency.value ? "opacity-100" : "opacity-0"
                    }
                  />
                  {currency.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
/* -----------------------------------------
   ------------------ END ------------------
   ----------------------------------------- */


/* 00000000000000000000000000000000000000000
   ---------- CLIENT PAGE START ------------
   00000000000000000000000000000000000000000 */

export default function ClientPage() {
  const [clientData, setClientData] = useState<Client[]>([]); // Where all the information of our customers are
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editedClient, setEditedClient] = useState<Client | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [newClient, setNewClient] = useState<Partial<Client>>({
    nome: "",
    // sobrenome: "",
    cpfCnpj: "" as CpfCnpj,
    pais: "",
    kycStatus: "Pendente",
    nivelDeRisco: "Medio",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --------------------------------------
  // Column visibility state
  // We are using this in the filter dialog
  // --------------------------------------
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    nome: true,
    sobrenome: true,
    cpfCnpj: true,
    pais: true,
    capital: true,
    kycStatus: true,
    nivelDeRisco: true,
  });
  const [nameFilter, setNameFilter] = useState("");
  const [sobrenomeFilter, setSobrenomeFilter] = useState("");
  const [idFilter, setIdFilter] = useState("");
  const [cpfCnpjFilter, setCpfCnpjFilter] = useState("");
  const [paisFilter, setPaisFilter] = useState("");
  const [capitalFilter, setCapitalFilter] = useState("");
  const [kycStatusFilter, setKycStatusFilter] = useState("");
  const [nivelDeRiscoFilter, setNivelDeRiscoFilter] = useState("");
  /**
   * Toggles the visibility of a table column
   */
  const toggleColumn = (column: keyof typeof visibleColumns) => {
    setVisibleColumns(prev => ({ ...prev, [column]: !prev[column] }));
  };
  // --------------------------------------
  // END Column visibility state
  // --------------------------------------

/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ------- Fetch Clients from API --------
   XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */
  // Fetch clients on component mount
  useEffect(() => {
    fetchClients();
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
/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ------------ END FETCHING -------------
   XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */

  /**
   * Opens the side sheet when trying to view/edit a client.
   * @param client Client
   */
  const handleOpenSheet = (client: Client) => {
    setSelectedClient(client);
    setEditedClient({ ...client });
    setIsOpen(true);
  };

  /**
   * Saves the edited client data within the sheet to the API and updates the table
   */
  const handleSave = async () => {
    if (editedClient) {
      const validated = validateCpfCnpj(editedClient.cpfCnpj);
      if (!validated) {
        alert("CPF/CNPJ inválido. Use 000.000.000-00 ou 00.000.000/0000-00");
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const updatedClient = await clientsApi.update(editedClient.id, {
          ...editedClient,
          cpfCnpj: validated,
        });
        setClientData(
          clientData.map((c) => (c.id === updatedClient.id ? updatedClient : c))
        );
        setIsOpen(false);
      } catch (err) {
        setError("Erro ao salvar cliente");
        alert("Erro ao salvar cliente");
      } finally {
        setIsLoading(false);
      }
    }
  };

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
        await clientsApi.delete(clientToDelete);
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
    if (
      !newClient.nome ||
      // !newClient.sobrenome ||
      !newClient.cpfCnpj ||
      !newClient.pais
    ) {
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
        // sobrenome: newClient.sobrenome,
        cpfCnpj: validated,
        pais: newClient.pais,
        kycStatus: newClient.kycStatus || "Pendente",
        ...(newClient.income !== undefined && {
          income: newClient.income,
          // incomeCurrency: newClient.incomeCurrency,
        }),
        nivelDeRisco: newClient.nivelDeRisco || "Medio", // <<<< TODO using backend api
      };

      const createdClient = await clientsApi.create(clientToAdd);
      setClientData([...clientData, createdClient]);
      setAddDialogOpen(false);
      setNewClient({
        nome: "",
        // sobrenome: "",
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
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Clientes</h2>

          {error && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800">
              {error}
            </div>
          )}

{/* --------------------------------------- */}
{/* Add Client Button and Loading Indicator */}
{/* --------------------------------------- */}

          <div className="mb-4 flex gap-2">
            <Button onClick={() => setAddDialogOpen(true)} disabled={isLoading}>
              Adicionar Cliente
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

          {isLoading && clientData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Carregando clientes...
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  {visibleColumns.id && <TableHead>ID</TableHead>}
                  {visibleColumns.nome && <TableHead>Nome</TableHead>}
                  {visibleColumns.cpfCnpj && <TableHead>CPF/CNPJ</TableHead>}
                  {visibleColumns.pais && <TableHead>País</TableHead>}
                  {visibleColumns.capital && <TableHead>Capital</TableHead>}
                  {visibleColumns.kycStatus && <TableHead>KYC Status</TableHead>}
                  {visibleColumns.nivelDeRisco && <TableHead>Nível de Risco</TableHead>}
                  <TableHead className="w-32">Ações</TableHead>
                  <TableHead className="w-24">Remover</TableHead>
                </TableRow>
              </TableHeader>

{/* --------------Table Body--------------- */}
              <TableBody>
                {clientData
                  .filter((client) => {
                    const nomeSearch = nameFilter.toLowerCase();
                    const idSearch = idFilter.toLowerCase();
                    const cpfCnpjSearch = cpfCnpjFilter.toLowerCase();
                    const paisSearch = paisFilter.toLowerCase();
                    const capitalSearch = capitalFilter.toLowerCase();
                    
                    // Check if capital filter matches income or income
                    const capitalMatch = capitalSearch === "" || 
                      (client.income?.toString().toLowerCase().includes(capitalSearch));
                    
                    // Check KYC Status filter
                    const kycMatch = kycStatusFilter === "" || client.kycStatus === kycStatusFilter;
                    
                    // Check Nível de Risco filter
                    const riscoMatch = nivelDeRiscoFilter === "" || client.nivelDeRisco === nivelDeRiscoFilter;
                    
                    return (
console.log('Filtering Client:', client),
                      client.id?.toLowerCase().includes(idSearch) &&
                      client.nome?.toLowerCase().includes(nomeSearch) &&
                      // client.sobrenome.toLowerCase().includes(sobrenomeSearch) &&
                      client.cpfCnpj?.toLowerCase().includes(cpfCnpjSearch) &&
                      client.pais?.toLowerCase().includes(paisSearch) &&
                      capitalMatch &&
                      kycMatch &&
                      riscoMatch
                    );
                  })
                  .map((client) => (
                  <TableRow key={client.id}>
                    {visibleColumns.id && <TableCell>{client.id}</TableCell>}
                    {visibleColumns.nome && <TableCell>{client.nome}</TableCell>}
                    {visibleColumns.cpfCnpj && <TableCell>{client.cpfCnpj}</TableCell>}
                    {visibleColumns.pais && <TableCell>{client.pais}</TableCell>}
                    {/* Re Add = ${client.incomeCurrency || ''} as a condition*/}
                    {/* Re Add = ${client.incomeCurrency || ''} as a condition*/}
                    {visibleColumns.capital && (
                      <TableCell>
                        {isCPF(client.cpfCnpj) && client.income
                          ? `${formatCurrency(client.income)}/month`
                          : isCNPJ(client.cpfCnpj) && client.income
                          ? `${formatCurrency(client.income)}`
                          : '-'}
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
                        onClick={() => handleOpenSheet(client)}
                      >
                        Ver/Editar
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
          )}
        </div>
      </div>
{/* --------------------------------------- */}
{/* ------------------END------------------ */}
{/* --------------------------------------- */}

{/* --------------------------------------- */}
{/* ----------Ver/Editar Cliente----------- */}
{/* --------------------------------------- */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Detalhes do Cliente</SheetTitle>
            <SheetDescription>
              Visualize e edite as informações do cliente
            </SheetDescription>
          </SheetHeader>

          {editedClient && (
            <div className="space-y-4 p-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={editedClient.nome}
                  onChange={(e) =>
                    setEditedClient({ ...editedClient, nome: e.target.value })
                  }
                />
              </div>

              {/* <div className="space-y-2">
                <Label htmlFor="sobrenome">Sobrenome</Label>
                <Input
                  id="sobrenome"
                  value={editedClient.sobrenome}
                  onChange={(e) =>
                    setEditedClient({
                      ...editedClient,
                      sobrenome: e.target.value,
                    })
                  }
                />
              </div> */}

              <div className="space-y-2">
                <Label htmlFor="cpfCnpj">CPF/CNPJ</Label>
                <Input
                  id="cpfCnpj"
                  value={editedClient.cpfCnpj}
                  onChange={(e) =>
                    setEditedClient({
                      ...editedClient,
                      cpfCnpj: validateCpfCnpj(e.target.value)!,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pais">País</Label>
                <Input
                  id="pais"
                  value={editedClient.pais}
                  onChange={(e) =>
                    setEditedClient({ ...editedClient, pais: e.target.value })
                  }
                />
              </div>

              {isCPF(editedClient.cpfCnpj) && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="income">Renda Mensal</Label>
                    <Input
                      id="income"
                      type="number"
                      value={editedClient.income || ""}
                      onChange={(e) =>
                        setEditedClient({
                          ...editedClient,
                          income: e.target.value
                            ? parseFloat(e.target.value)
                            : undefined,
                        })
                      }
                      placeholder="0.00"
                    />
                  </div>
                  {/* <div className="space-y-2">
                    <Label htmlFor="incomeCurrency">
                      Moeda da Renda Mensal
                    </Label>
                    <CurrencyCombobox
                      value={editedClient.incomeCurrency || ""}
                      onChange={(val) =>
                        setEditedClient({
                          ...editedClient,
                          incomeCurrency: val,
                        })
                      }
                    />
                  </div> */}
                </>
              )}

              {isCNPJ(editedClient.cpfCnpj) && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="income">Capital Social</Label>
                    <Input
                      id="income"
                      type="number"
                      value={editedClient.income || ""}
                      onChange={(e) =>
                        setEditedClient({
                          ...editedClient,
                          income: e.target.value
                            ? parseFloat(e.target.value)
                            : undefined,
                        })
                      }
                      placeholder="0.00"
                    />
                  </div>
                  {/* <div className="space-y-2">
                    <Label htmlFor="incomeCurrency">
                      Moeda do Capital Social
                    </Label>
                    <CurrencyCombobox
                      value={editedClient.incomeCurrency || ""}
                      onChange={(val) =>
                        setEditedClient({
                          ...editedClient,
                          incomeCurrency: val,
                        })
                      }
                    />
                  </div> */}
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="kycStatus">KYC Status</Label>
                <NativeSelect
                  id="kycStatus"
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="nivelDeRisco">Nível de Risco</Label>
                <NativeSelect
                  id="nivelDeRisco"
                  value={editedClient.nivelDeRisco}
                  onChange={(e) =>
                    setEditedClient({
                      ...editedClient,
                      nivelDeRisco: e.target.value as Client["nivelDeRisco"],
                    })
                  }
                >
                  <NativeSelectOption value="Baixo">
                    Baixo
                  </NativeSelectOption>
                  <NativeSelectOption value="Medio">
                    Medio
                  </NativeSelectOption>
                  <NativeSelectOption value="Alto">
                    Alto
                  </NativeSelectOption>
                </NativeSelect>
              </div>
            </div>
          )}

          <SheetFooter className="flex justify-between">

            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar alterações"}
            </Button>

            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>

            <Button
              variant="destructive"
              onClick={() => {
                if (editedClient) {
                  handleDelete(editedClient.id);
                  setIsOpen(false);
                }
              }}
              disabled={isLoading}
            >
              Remover Cliente
            </Button>
            
          </SheetFooter>
        </SheetContent>
      </Sheet>
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

            {/* <div className="space-y-2">
              <Label htmlFor="new-sobrenome">Sobrenome *</Label>
              <Input
                id="new-sobrenome"
                value={newClient.sobrenome || ""}
                onChange={(e) =>
                  setNewClient({ ...newClient, sobrenome: e.target.value })
                }
              />
            </div> */}

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
              <Input
                id="new-pais"
                value={newClient.pais || ""}
                onChange={(e) =>
                  setNewClient({ ...newClient, pais: e.target.value })
                }
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
                {/* <div className="space-y-2">
                  <Label htmlFor="new-incomeCurrency">
                    Moeda da Renda Mensal
                  </Label>
                  <CurrencyCombobox
                    value={newClient.incomeCurrency || ""}
                    onChange={(val) =>
                      setNewClient({ ...newClient, incomeCurrency: val })
                    }
                  />
                </div> */}
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
                {/* <div className="space-y-2">
                  <Label htmlFor="new-incomeCurrency">
                    Moeda do Capital Social
                  </Label>
                  <CurrencyCombobox
                    value={newClient.incomeCurrency || ""}
                    onChange={(val) =>
                      setNewClient({
                        ...newClient,
                        incomeCurrency: val,
                      })
                    }
                  />
                </div> */}
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
            <DialogDescription>
              Filtre e Pesquise clientes
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-6 max-h-[60vh] overflow-y-auto">
            <div>
              <h3 className="mb-3 text-sm font-semibold">Filtrar por ID</h3>
              <Input
                placeholder="Digite o ID..."
                value={idFilter}
                onChange={(e) => setIdFilter(e.target.value)}
              />
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold">Filtrar por CPF/CNPJ</h3>
              <Input
                placeholder="Digite o CPF ou CNPJ..."
                value={cpfCnpjFilter}
                onChange={(e) => setCpfCnpjFilter(e.target.value)}
              />
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold">Filtrar por País</h3>
              <Input
                placeholder="Digite o país..."
                value={paisFilter}
                onChange={(e) => setPaisFilter(e.target.value)}
              />
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold">Filtrar por Capital</h3>
              <Input
                placeholder="Digite o valor do capital..."
                value={capitalFilter}
                onChange={(e) => setCapitalFilter(e.target.value)}
              />
            </div>
{/* Side by Side KYC Status and Nível de Risco Filters */}
            <div>
              <h3 className="mb-3 text-sm font-semibold">Filtrar por Status</h3>
              <div className="flex gap-3">
                <div className="flex-1">
                  <Label htmlFor="kycStatusFilter" className="py-2">KYC Status</Label>
                  <NativeSelect
                    id="kycStatusFilter"
                    value={kycStatusFilter}
                    onChange={(e) => setKycStatusFilter(e.target.value)}
                  >
                    <NativeSelectOption value="">Todos</NativeSelectOption>
                    <NativeSelectOption value="Pendente">Pendente</NativeSelectOption>
                    <NativeSelectOption value="Em Análise">Em Análise</NativeSelectOption>
                    <NativeSelectOption value="Aprovado">Aprovado</NativeSelectOption>
                    <NativeSelectOption value="Rejeitado">Rejeitado</NativeSelectOption>
                  </NativeSelect>
                </div>
                <div className="flex-1">
                  <Label htmlFor="nivelDeRiscoFilter" className="py-2">Nível de Risco</Label>
                  <NativeSelect
                    id="nivelDeRiscoFilter"
                    value={nivelDeRiscoFilter}
                    onChange={(e) => setNivelDeRiscoFilter(e.target.value)}
                  >
                    <NativeSelectOption value="">Todos</NativeSelectOption>
                    <NativeSelectOption value="Baixo">Baixo</NativeSelectOption>
                    <NativeSelectOption value="Medio">Medio</NativeSelectOption>
                    <NativeSelectOption value="Alto">Alto</NativeSelectOption>
                  </NativeSelect>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold">Filtrar por Nome</h3>
              <div className="space-y-2">
                <Input
                  placeholder="Digite o nome..."
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                />
                <Input
                  placeholder="Digite o sobrenome..."
                  value={sobrenomeFilter}
                  onChange={(e) => setSobrenomeFilter(e.target.value)}
                />
              </div>
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
                  id="col-nome"
                  checked={visibleColumns.nome}
                  onCheckedChange={() => toggleColumn('nome')}
                />
                <label htmlFor="col-nome" className="text-sm cursor-pointer">
                  Nome
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="col-sobrenome"
                  checked={visibleColumns.sobrenome}
                  onCheckedChange={() => toggleColumn('sobrenome')}
                />
                <label htmlFor="col-sobrenome" className="text-sm cursor-pointer">
                  Sobrenome
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="col-cpfCnpj"
                  checked={visibleColumns.cpfCnpj}
                  onCheckedChange={() => toggleColumn('cpfCnpj')}
                />
                <label htmlFor="col-cpfCnpj" className="text-sm cursor-pointer">
                  CPF/CNPJ
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="col-pais"
                  checked={visibleColumns.pais}
                  onCheckedChange={() => toggleColumn('pais')}
                />
                <label htmlFor="col-pais" className="text-sm cursor-pointer">
                  País
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="col-capital"
                  checked={visibleColumns.capital}
                  onCheckedChange={() => toggleColumn('capital')}
                />
                <label htmlFor="col-capital" className="text-sm cursor-pointer">
                  Capital
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="col-kycStatus"
                  checked={visibleColumns.kycStatus}
                  onCheckedChange={() => toggleColumn('kycStatus')}
                />
                <label htmlFor="col-kycStatus" className="text-sm cursor-pointer">
                  KYC Status
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="col-nivelDeRisco"
                  checked={visibleColumns.nivelDeRisco}
                  onCheckedChange={() => toggleColumn('nivelDeRisco')}
                />
                <label htmlFor="col-nivelDeRisco" className="text-sm cursor-pointer">
                  Nível de Risco
                </label>
              </div>
            </div>
          </div>
        </div>

          <DialogFooter>
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
