import React from "react";

import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { Country, getCountries, getCountryCallingCode } from "react-phone-number-input";

import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandShortcut,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ScrollArea,
} from "@/components/ui";
import { cn } from "@/utils";

export interface CountryOption {
  value: Country;
  label: string;
}

export interface CountrySelectProps {
  value: Country;
  disabled?: boolean;
  options?: CountryOption[];
  onChange: (value: Country) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

const CountrySelect: React.FC<CountrySelectProps> = ({
  value,
  disabled,
  options,
  onBlur,
  onChange,
  onFocus,
}) => {
  const { t } = useTranslation();

  const [open, setOpen] = React.useState(false);

  const countries = React.useMemo(() => {
    if (options) {
      return options.map((option) => ({
        value: option.value,
        label: `${option.label}`,
      }));
    }

    return getCountries().map((country) => ({
      value: country,
      label: country,
    }));
  }, [options]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          onFocus={onFocus}
          onBlur={onBlur}
          className="justify-between"
        >
          {value ? countries.find((country) => country.value === value)?.value : t("common:select")}
          <ChevronUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="start" className="p-0">
        <Command>
          <CommandInput placeholder={`${t("common:search")}...`} />
          <CommandEmpty>{t("common:no_data")}</CommandEmpty>
          <CommandGroup>
            <ScrollArea vertical className="h-[calc(var(--radix-popper-available-height)-80px)]">
              {countries.map((country) => (
                <CommandItem
                  key={country.value}
                  onSelect={() => {
                    onChange(country.value);
                    setOpen(false);
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === country.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <span className="truncate">{country.label}</span>
                  <CommandShortcut className="pl-2">
                    +{getCountryCallingCode(country.value)}
                  </CommandShortcut>
                </CommandItem>
              ))}
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export { CountrySelect };
