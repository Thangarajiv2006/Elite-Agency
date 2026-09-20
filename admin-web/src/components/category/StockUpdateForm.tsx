import { useState, useEffect } from "react";
import {
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Save, Search } from "lucide-react";
import type { stockState } from "@/constants/types";

interface Props {
  products: stockState["products"];
  loading: boolean;
  onSearch: (s: string) => void;
  onSubmit: (
    productsPayload: { productId: string; quantity: number }[],
  ) => void;
  isOpen: boolean;
}

export const StockUpdateForm = ({
  products,
  loading,
  onSearch,
  onSubmit,
  isOpen,
}: Props) => {
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [localSearch, setLocalSearch] = useState("");

  // Clear state when sheet is opened/closed
  useEffect(() => {
    if (isOpen) {
      setQuantities({});
      setLocalSearch("");
      onSearch("");
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(localSearch);
    }, 500);
    return () => clearTimeout(handler);
  }, [localSearch, onSearch]);

  const handleQuantityChange = (productId: string, value: string) => {
    const qty = parseInt(value, 10);
    setQuantities((prev) => {
      const newQuantities = { ...prev };
      if (isNaN(qty) || qty <= 0) {
        delete newQuantities[productId];
      } else {
        newQuantities[productId] = qty;
      }
      return newQuantities;
    });
  };

  const handleSave = () => {
    const payload = Object.entries(quantities).map(([productId, quantity]) => ({
      productId,
      quantity,
    }));
    onSubmit(payload);
  };

  const totalUpdated = Object.keys(quantities).length;
  const totalQuantity = Object.values(quantities).reduce(
    (acc, curr) => acc + curr,
    0,
  );

  return (
    <SheetContent
      side="right"
      className="sm:max-w-2xl lg:max-w-4xl w-full overflow-y-auto flex flex-col p-5"
    >
      <SheetTitle>Add Generic Stock Entry</SheetTitle>
      <SheetDescription>
        Increment bulk quantities mapped comprehensively across the dynamic
        filter context efficiently.
      </SheetDescription>

      <div className="relative w-full sm:w-[300px] mb-4 shrink-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Filter products..."
          className="pl-8"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
        />
      </div>

      <div className="rounded-md border overflow-y-auto flex-1 min-h-[300px] shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50 sticky top-0 z-10 shadow-sm">
            <TableRow>
              <TableHead className="py-2 h-10">
                Product Dependency Link
              </TableHead>
              <TableHead className="py-2 h-10">Acquisition Price</TableHead>
              <TableHead className="py-2 h-10">Stagnant Metric Stock</TableHead>
              <TableHead className="py-2 h-10 w-[150px]">
                Add Units Queue
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  <Spinner />
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground"
                >
                  No available target bounds tracking currently found.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow
                  key={product._id}
                  className={
                    quantities[product._id!]
                      ? "bg-primary/5 border-l-2 border-l-primary"
                      : ""
                  }
                >
                  <TableCell className="py-2 font-semibold">
                    {product.name}
                  </TableCell>
                  <TableCell className="py-2 text-muted-foreground">
                    ₹{product.costPrice}
                  </TableCell>
                  <TableCell className="py-2 font-medium">
                    {product.stock || 0}{" "}
                    <span className="text-xs uppercase tracking-widest text-muted-foreground">
                      {product.unit}
                    </span>
                  </TableCell>
                  <TableCell className="py-2">
                    <Input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={quantities[product._id!] || ""}
                      onChange={(e) =>
                        handleQuantityChange(product._id!, e.target.value)
                      }
                      className="w-full text-right font-medium h-8"
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-muted/20 border rounded-lg shrink-0">
        <div className="text-sm">
          Updating Queue Targets{" "}
          <span className="font-semibold text-primary">{totalUpdated}</span> |
          Incremental Volume Delta{" "}
          <span className="font-semibold">{totalQuantity}</span>
        </div>
        <Button
          onClick={handleSave}
          disabled={loading || totalUpdated === 0}
          className="w-full sm:w-auto font-semibold px-6 shadow-sm"
        >
          {loading ? <Spinner /> : <Save className="h-4 w-4 mr-2" />}
          Commit Action State
        </Button>
      </div>
    </SheetContent>
  );
};
