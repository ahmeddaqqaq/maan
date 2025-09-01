"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

export interface Option {
  label: string;
  value: string | number;
}

interface MultiSelectProps {
  options: Option[];
  selected: (string | number)[];
  onChange: (selected: (string | number)[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select items...",
  className,
  disabled = false,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelectAll = () => {
    const allValues = options.map((option) => option.value);
    onChange(allValues);
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const handleToggle = (value: string | number) => {
    const newSelected = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value];
    onChange(newSelected);
  };

  const selectedCount = selected.length;
  const isAllSelected = selectedCount === options.length && options.length > 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between text-right", className)}
          disabled={disabled}
        >
          <div className="flex flex-wrap gap-1">
            {selectedCount === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : selectedCount === 1 ? (
              <span>{options.find((option) => option.value === selected[0])?.label}</span>
            ) : (
              <span>{selectedCount} عناصر محددة</span>
            )}
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="البحث..." />
          <CommandEmpty>لا توجد نتائج.</CommandEmpty>
          <CommandGroup>
            {/* Select All / Clear All option */}
            <CommandItem
              onSelect={() => {
                if (isAllSelected) {
                  handleClearAll();
                } else {
                  handleSelectAll();
                }
              }}
              className="font-medium"
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  isAllSelected ? "opacity-100" : "opacity-0"
                )}
              />
              {isAllSelected ? "إلغاء تحديد الكل" : "تحديد الكل"}
            </CommandItem>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                onSelect={() => handleToggle(option.value)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selected.includes(option.value) ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}