"use client";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

interface ComboProps {
  className?: string;
  placeholder?: string;
  data: {
    label: string;
    value: string;
  }[];
  handleChange: (value: string | null) => void;
}

export function ComboboxBasic({
  className,
  placeholder,
  data,
  handleChange,
}: ComboProps) {
  return (
    <Combobox onValueChange={handleChange}>
      <ComboboxInput
        className={`w-full h-8 ${className}`}
        placeholder={placeholder}
      />
      <ComboboxContent>
        {data.length === 0 && <ComboboxEmpty>No items found.</ComboboxEmpty>}
        <ComboboxList>
          {data.map(({ label, value }) => (
            <ComboboxItem className={`${className}`} key={value} value={value}>
              {label}
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
