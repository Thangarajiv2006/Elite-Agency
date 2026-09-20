import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectProps {
  placeHolder: string;
  data: any[];
  emptySlect?: boolean;
}

const SelectItems = ({ placeHolder, data, emptySlect }: SelectProps) => {
  return (
    <Select>
      <SelectTrigger className="w-full max-w-48">
        <SelectValue placeholder={placeHolder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          {emptySlect && <SelectItem value="">All</SelectItem>}
          {data.map((item: any) => (
            <SelectItem value={item.value}>{item.label}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
export default SelectItems;
