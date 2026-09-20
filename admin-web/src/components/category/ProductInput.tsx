import React from "react";
import {
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { CardDescription } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import type { productState } from "@/constants/types";

interface ProductInputProps {
  title: string;
  description: string;
  submitHandler: (e: React.FormEvent<HTMLFormElement>) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  defaultValues?: Partial<productState["products"][0]>;
  buttonTitle: string;
  setIsOpen: (isOpen: false) => void;
}

const ProductInput = ({
  title,
  description,
  submitHandler,
  handleInputChange,
  isLoading,
  defaultValues,
  buttonTitle,
  setIsOpen,
}: ProductInputProps) => {
  return (
    <SheetContent className="overflow-y-auto sm:max-w-xl w-full flex flex-col justify-between">
      <SheetHeader className="mb-4">
        <SheetTitle className="text-lg">{title}</SheetTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </SheetHeader>
      <form
        onSubmit={submitHandler}
        className="flex flex-col flex-1 justify-between"
      >
        <div className="space-y-6 px-1 sm:px-5 pb-4">
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase text-muted-foreground border-b pb-1">
              General Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5 md:col-span-2">
                <Label className="text-xs" htmlFor="name">
                  Product Name
                </Label>
                <Input
                  id="name"
                  className="h-8 text-sm"
                  type="text"
                  value={defaultValues?.name || ""}
                  required
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs" htmlFor="unit">
                  Unit (e.g. pcs, kg)
                </Label>
                <Input
                  id="unit"
                  className="h-8 text-sm"
                  type="text"
                  value={defaultValues?.unit || "pcs"}
                  required
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs" htmlFor="HSN">
                  HSN Code
                </Label>
                <Input
                  id="HSN"
                  className="h-8 text-sm"
                  type="text"
                  value={defaultValues?.HSN || ""}
                  required
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase text-muted-foreground border-b pb-1">
              Pricing Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs" htmlFor="costPrice">
                  Cost Price
                </Label>
                <Input
                  onChange={handleInputChange}
                  id="costPrice"
                  type="number"
                  step="any"
                  min="0"
                  className="h-8 text-sm"
                  value={defaultValues?.costPrice || ""}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs" htmlFor="sellingPrice">
                  Selling Price
                </Label>
                <Input
                  onChange={handleInputChange}
                  id="sellingPrice"
                  type="number"
                  step="any"
                  min="0"
                  className="h-8 text-sm"
                  value={defaultValues?.sellingPrice || ""}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs" htmlFor="MRP">
                  MRP
                </Label>
                <Input
                  onChange={handleInputChange}
                  id="MRP"
                  type="number"
                  step="any"
                  min="0"
                  className="h-8 text-sm"
                  value={defaultValues?.MRP || ""}
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase text-muted-foreground border-b pb-1">
              Tax Rates
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs" htmlFor="CGST">
                  CGST (%)
                </Label>
                <Input
                  onChange={handleInputChange}
                  id="CGST"
                  type="number"
                  step="any"
                  min="0"
                  max="100"
                  className="h-8 text-sm"
                  value={defaultValues?.CGST ?? ""}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs" htmlFor="SGST">
                  SGST (%)
                </Label>
                <Input
                  onChange={handleInputChange}
                  id="SGST"
                  type="number"
                  step="any"
                  min="0"
                  max="100"
                  className="h-8 text-sm"
                  value={defaultValues?.SGST ?? ""}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <SheetFooter className="mt-2 pt-4 border-t px-1 sm:px-5">
          <Button type="submit" size="sm">
            {isLoading ? <Spinner /> : buttonTitle}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="destructive"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
        </SheetFooter>
      </form>
    </SheetContent>
  );
};

export default ProductInput;
