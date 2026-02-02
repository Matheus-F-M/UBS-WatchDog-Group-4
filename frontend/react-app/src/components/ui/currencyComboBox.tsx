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
import { type Currency } from "@/types/globalTypes";

interface CurrencyComboboxProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedCurrency: string;
  onSelect: (currencyCode: string) => void;
  currencies: Currency[];
  showAllOption?: boolean;
}

/**
 * Renders a currency selection combobox component
 * @param isOpen - Whether the combobox popover is open
 * @param setIsOpen - Function to set the open state
 * @param selectedCurrency - Currently selected currency code
 * @param onSelect - Callback when a currency is selected (receives currency code)
 * @param currencies - Array of currencies to display
 * @param showAllOption - Whether to show "Todos" option (for filters)
 */
export const CurrencyCombobox = ({
  isOpen,
  setIsOpen,
  selectedCurrency,
  onSelect,
  currencies,
  showAllOption = false,
}: CurrencyComboboxProps) => {
  // Find the selected currency to display its name
  const selectedCurrencyObj = currencies.find((currency) => currency.codigo === selectedCurrency);
  const displayText = selectedCurrencyObj 
    ? `${selectedCurrencyObj.codigo} - ${selectedCurrencyObj.nome}`
    : selectedCurrency 
    ? selectedCurrency 
    : showAllOption 
    ? "Todos" 
    : "Selecione uma moeda...";

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
          <CommandInput placeholder="Buscar moeda..." />
          <CommandList>
            <CommandEmpty>Nenhuma moeda encontrada.</CommandEmpty>
            <CommandGroup>
              {showAllOption && (
                <CommandItem
                  value="todos"
                  onSelect={() => {
                    onSelect("");
                    setIsOpen(false);
                  }}
                >
                  <CheckIcon
                    className={`mr-2 h-4 w-4 ${
                      selectedCurrency === "" ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  Todos
                </CommandItem>
              )}
              {currencies.map((currency) => (
                <CommandItem
                  key={currency.codigo}
                  value={`${currency.codigo} ${currency.nome}`}
                  onSelect={() => {
                    onSelect(currency.codigo);
                    setIsOpen(false);
                  }}
                >
                  <CheckIcon
                    className={`mr-2 h-4 w-4 ${
                      selectedCurrency === currency.codigo ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{currency.codigo}</span>
                    <span className="text-xs text-gray-500">{currency.nome}</span>
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
