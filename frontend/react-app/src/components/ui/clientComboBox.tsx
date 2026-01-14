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
import { Button } from "@/components/ui/button";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { type Client } from "@/types/globalTypes";

interface ClientComboboxProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedClientId: string;
  onSelect: (clientId: string, clientName: string) => void;
  clients: Client[];
  showAllOption?: boolean;
  placeholder?: string;
}

/**
 * Renders a client selection combobox component with search by name or CPF/CNPJ
 * @param isOpen - Whether the combobox popover is open
 * @param setIsOpen - Function to set the open state
 * @param selectedClientId - Currently selected client ID
 * @param onSelect - Callback when a client is selected (receives clientId and clientName)
 * @param clients - Array of clients to display
 * @param showAllOption - Whether to show "Todos" option (for filters)
 * @param placeholder - Custom placeholder text
 */
export const ClientCombobox = ({
  isOpen,
  setIsOpen,
  selectedClientId,
  onSelect,
  clients,
  showAllOption = false,
  placeholder = "Selecione um cliente...",
}: ClientComboboxProps) => {
  // Find the selected client to display their name
  const selectedClient = clients.find((client) => client.id === selectedClientId);
  const displayText = selectedClient 
    ? `${selectedClient.nome} - ${selectedClient.cpfCnpj}`
    : selectedClientId 
    ? selectedClientId 
    : showAllOption 
    ? "Todos" 
    : placeholder;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className="w-full justify-between"
        >
          {displayText}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Buscar por nome ou CPF/CNPJ..." />
          <CommandList className="max-h-[300px] overflow-y-auto">
            <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
            <CommandGroup>
              {showAllOption && (
                <CommandItem
                  value="todos"
                  onSelect={() => {
                    onSelect("", "");
                    setIsOpen(false);
                  }}
                >
                  <CheckIcon
                    className={`mr-2 h-4 w-4 ${
                      selectedClientId === "" ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  Todos
                </CommandItem>
              )}
              {clients.map((client) => (
                <CommandItem
                  key={client.id}
                  value={`${client.nome} ${client.cpfCnpj}`}
                  onSelect={() => {
                    onSelect(client.id, client.nome);
                    setIsOpen(false);
                  }}
                >
                  <CheckIcon
                    className={`mr-2 h-4 w-4 ${
                      selectedClientId === client.id ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <div className="flex flex-col">
                    <span className={`font-medium ${
                      !client.isActive ? "text-red-600" : ""
                    }`}>
                      {client.nome}{!client.isActive ? " (inativo)" : ""}
                    </span>
                    <span className={`text-xs ${
                      !client.isActive ? "text-red-400" : "text-gray-500"
                    }`}>{client.cpfCnpj}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
