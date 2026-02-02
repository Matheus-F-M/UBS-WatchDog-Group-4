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
import { type Country } from "@/types/globalTypes";

interface CountryComboboxProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedCountry: string;
  onSelect: (countryName: string) => void;
  countries: Country[];
  showAllOption?: boolean;
}

/**
 * Renders a country selection combobox component
 * @param isOpen - Whether the combobox popover is open
 * @param setIsOpen - Function to set the open state
 * @param selectedCountry - Currently selected country name
 * @param onSelect - Callback when a country is selected
 * @param countries - Array of countries to display
 * @param showAllOption - Whether to show "Todos" option (for filters)
 */
export const CountryCombobox = ({
  isOpen,
  setIsOpen,
  selectedCountry,
  onSelect,
  countries,
  showAllOption = false,
}: CountryComboboxProps) => {
  // Find the selected country to display its name
  const selectedCountryObj = countries.find((c) => c.codigo === selectedCountry);
  const displayText = selectedCountryObj?.nome || (showAllOption && selectedCountry === "" ? "Todos" : "Selecione um país...");

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
          <CommandInput placeholder="Buscar país..." />
          <CommandList>
            <CommandEmpty>Nenhum país encontrado.</CommandEmpty>
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
                      selectedCountry === "" ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  Todos
                </CommandItem>
              )}
              {countries.map((country) => (
                <CommandItem
                  key={country.codigo}
                  value={country.nome}
                  onSelect={() => {
                    onSelect(country.codigo);
                    setIsOpen(false);
                  }}
                >
                  <CheckIcon
                    className={`mr-2 h-4 w-4 ${
                      selectedCountry === country.codigo ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  {country.nome}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
