import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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

// Create branded types for CPF and CNPJ
type CPF = string & { __brand: "CPF" };
type CNPJ = string & { __brand: "CNPJ" };
type CpfCnpj = CPF | CNPJ;

// Define the Client type
type Client = {
  id: string;
  nome: string;
  sobrenome: string;
  cpfCnpj: CpfCnpj;
  pais: string;
  kycStatus: "Aprovado" | "Pendente" | "Em Análise" | "Rejeitado";
  monthlyIncome?: number; // For CPF clients
  companyCapital?: number; // For CNPJ clients
  monthlyIncomeCurrency?: string; // Currency for monthly income
  companyCapitalCurrency?: string; // Currency for company capital
  // There are two types of currency for clarity reasons
};

// CPF/CNPJ Validation functions
/**
 * Checks if the given value is a valid CPF.
 * @param value String
 * @returns boolean
 */
function isCPF(value: string): value is CPF {
  return /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(value);
}
/**
 * Checks if the given value is a valid CNPJ.
 * @param value String
 * @returns boolean
 */
function isCNPJ(value: string): value is CNPJ {
  return /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(value);
}
/**
 * Uses isCPF and isCNPJ to validate input and renforce types.
 * @param value String
 * @returns CpfCnpj | null
 */
function validateCpfCnpj(value: string): CpfCnpj | null {
  if (isCPF(value)) return value as CPF;
  if (isCNPJ(value)) return value as CNPJ;
  return null;
}

// Currency list
const currencies = [
  { value: "BRL", label: "BRL - Brazilian Real" },
  { value: "USD", label: "USD - US Dollar" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "GBP", label: "GBP - British Pound" },
  { value: "JPY", label: "JPY - Japanese Yen" },
  { value: "CNY", label: "CNY - Chinese Yuan" },
  { value: "CHF", label: "CHF - Swiss Franc" },
  { value: "CAD", label: "CAD - Canadian Dollar" },
  { value: "AUD", label: "AUD - Australian Dollar" },
  { value: "INR", label: "INR - Indian Rupee" },
  { value: "MXN", label: "MXN - Mexican Peso" },
  { value: "ARS", label: "ARS - Argentine Peso" },
  { value: "CLP", label: "CLP - Chilean Peso" },
  { value: "COP", label: "COP - Colombian Peso" },
  { value: "PEN", label: "PEN - Peruvian Sol" },
  { value: "UYU", label: "UYU - Uruguayan Peso" },
  { value: "ZAR", label: "ZAR - South African Rand" },
  { value: "RUB", label: "RUB - Russian Ruble" },
  { value: "KRW", label: "KRW - South Korean Won" },
  { value: "SGD", label: "SGD - Singapore Dollar" },
  { value: "HKD", label: "HKD - Hong Kong Dollar" },
  { value: "NZD", label: "NZD - New Zealand Dollar" },
  { value: "SEK", label: "SEK - Swedish Krona" },
  { value: "NOK", label: "NOK - Norwegian Krone" },
  { value: "DKK", label: "DKK - Danish Krone" },
  { value: "PLN", label: "PLN - Polish Zloty" },
  { value: "TRY", label: "TRY - Turkish Lira" },
  { value: "THB", label: "THB - Thai Baht" },
  { value: "MYR", label: "MYR - Malaysian Ringgit" },
  { value: "IDR", label: "IDR - Indonesian Rupiah" },
];

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

const initialClientData: Client[] = [
  {
    id: "123456",
    nome: "Fulano",
    sobrenome: "Ciclano",
    cpfCnpj: validateCpfCnpj("123.456.789-00")!,
    pais: "Brasil",
    kycStatus: "Aprovado",
    monthlyIncome: 5000,
    monthlyIncomeCurrency: "BRL",
  },
];

// API Base URL - Update this when backend is ready
const API_BASE_URL = "/api/clients";

// API helper functions
const clientsApi = {
  // Fetch all clients
  getAll: async (): Promise<Client[]> => {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) throw new Error("Failed to fetch clients");
    return response.json();
  },

  // Create new client
  create: async (client: Omit<Client, "id">): Promise<Client> => {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(client),
    });
    if (!response.ok) throw new Error("Failed to create client");
    return response.json();
  },

  // Update client
  update: async (id: string, client: Client): Promise<Client> => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(client),
    });
    if (!response.ok) throw new Error("Failed to update client");
    return response.json();
  },

  // Delete client
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete client");
  },
};

export default function ClientPage() {
  const [clientData, setClientData] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editedClient, setEditedClient] = useState<Client | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newClient, setNewClient] = useState<Partial<Client>>({
    nome: "",
    sobrenome: "",
    cpfCnpj: "" as CpfCnpj,
    pais: "",
    kycStatus: "Pendente",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch clients on component mount
  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const clients = await clientsApi.getAll();
      setClientData(clients);
    } catch (err) {
      setError("Erro ao carregar clientes. Usando dados de exemplo.");
      // Fallback to initial data if API fails
      setClientData([initialClientData[0]]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenSheet = (client: Client) => {
    setSelectedClient(client);
    setEditedClient({ ...client });
    setIsOpen(true);
  };

  /**
   * Handles new data for current or new clients
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

  /**
   * Handles adding a new client
   */
  const handleAddClient = async () => {
    if (
      !newClient.nome ||
      !newClient.sobrenome ||
      !newClient.cpfCnpj ||
      !newClient.pais
    ) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

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
        sobrenome: newClient.sobrenome,
        cpfCnpj: validated,
        pais: newClient.pais,
        kycStatus: newClient.kycStatus || "Pendente",
        ...(newClient.monthlyIncome !== undefined && {
          monthlyIncome: newClient.monthlyIncome,
          monthlyIncomeCurrency: newClient.monthlyIncomeCurrency,
        }),
        ...(newClient.companyCapital !== undefined && {
          companyCapital: newClient.companyCapital,
          companyCapitalCurrency: newClient.companyCapitalCurrency,
        }),
      };

      const createdClient = await clientsApi.create(clientToAdd);
      setClientData([...clientData, createdClient]);
      setAddDialogOpen(false);
      setNewClient({
        nome: "",
        sobrenome: "",
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

          <div className="mb-4 flex gap-2">
            <Button onClick={() => setAddDialogOpen(true)} disabled={isLoading}>
              Adicionar Cliente
            </Button>
            {isLoading && (
              <span className="text-sm text-gray-500 self-center">
                Carregando...
              </span>
            )}
          </div>

          {isLoading && clientData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Carregando clientes...
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Sobrenome</TableHead>
                  <TableHead>CPF/CNPJ</TableHead>
                  <TableHead>País</TableHead>
                  <TableHead>KYC Status</TableHead>
                  <TableHead>Ações</TableHead>
                  <TableHead>Remover</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientData.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>{client.id}</TableCell>
                    <TableCell>{client.nome}</TableCell>
                    <TableCell>{client.sobrenome}</TableCell>
                    <TableCell>{client.cpfCnpj}</TableCell>
                    <TableCell>{client.pais}</TableCell>
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

      {/*Ver / Editar Cliente Sheet*/}
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

              <div className="space-y-2">
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
              </div>

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
                    <Label htmlFor="monthlyIncome">Renda Mensal</Label>
                    <Input
                      id="monthlyIncome"
                      type="number"
                      value={editedClient.monthlyIncome || ""}
                      onChange={(e) =>
                        setEditedClient({
                          ...editedClient,
                          monthlyIncome: e.target.value
                            ? parseFloat(e.target.value)
                            : undefined,
                        })
                      }
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monthlyIncomeCurrency">
                      Moeda da Renda Mensal
                    </Label>
                    <CurrencyCombobox
                      value={editedClient.monthlyIncomeCurrency || ""}
                      onChange={(val) =>
                        setEditedClient({
                          ...editedClient,
                          monthlyIncomeCurrency: val,
                        })
                      }
                    />
                  </div>
                </>
              )}

              {isCNPJ(editedClient.cpfCnpj) && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="companyCapital">Capital Social</Label>
                    <Input
                      id="companyCapital"
                      type="number"
                      value={editedClient.companyCapital || ""}
                      onChange={(e) =>
                        setEditedClient({
                          ...editedClient,
                          companyCapital: e.target.value
                            ? parseFloat(e.target.value)
                            : undefined,
                        })
                      }
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyCapitalCurrency">
                      Moeda do Capital Social
                    </Label>
                    <CurrencyCombobox
                      value={editedClient.companyCapitalCurrency || ""}
                      onChange={(val) =>
                        setEditedClient({
                          ...editedClient,
                          companyCapitalCurrency: val,
                        })
                      }
                    />
                  </div>
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
                  <NativeSelectOption value="Em Análise">
                    Em Análise
                  </NativeSelectOption>
                  <NativeSelectOption value="Rejeitado">
                    Rejeitado
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
      {/* ---------------- Adding new Client Dialog ---------------- */}
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
              <Label htmlFor="new-sobrenome">Sobrenome *</Label>
              <Input
                id="new-sobrenome"
                value={newClient.sobrenome || ""}
                onChange={(e) =>
                  setNewClient({ ...newClient, sobrenome: e.target.value })
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
                  <Label htmlFor="new-monthlyIncome">Renda Mensal</Label>
                  <Input
                    id="new-monthlyIncome"
                    type="number"
                    value={newClient.monthlyIncome || ""}
                    onChange={(e) =>
                      setNewClient({
                        ...newClient,
                        monthlyIncome: e.target.value
                          ? parseFloat(e.target.value)
                          : undefined,
                      })
                    }
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-monthlyIncomeCurrency">
                    Moeda da Renda Mensal
                  </Label>
                  <CurrencyCombobox
                    value={newClient.monthlyIncomeCurrency || ""}
                    onChange={(val) =>
                      setNewClient({ ...newClient, monthlyIncomeCurrency: val })
                    }
                  />
                </div>
              </>
            )}

            {newClient.cpfCnpj && isCNPJ(newClient.cpfCnpj as string) && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="new-companyCapital">Capital Social</Label>
                  <Input
                    id="new-companyCapital"
                    type="number"
                    value={newClient.companyCapital || ""}
                    onChange={(e) =>
                      setNewClient({
                        ...newClient,
                        companyCapital: e.target.value
                          ? parseFloat(e.target.value)
                          : undefined,
                      })
                    }
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-companyCapitalCurrency">
                    Moeda do Capital Social
                  </Label>
                  <CurrencyCombobox
                    value={newClient.companyCapitalCurrency || ""}
                    onChange={(val) =>
                      setNewClient({
                        ...newClient,
                        companyCapitalCurrency: val,
                      })
                    }
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
                <NativeSelectOption value="Em Análise">
                  Em Análise
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
    </div>
  );
}
