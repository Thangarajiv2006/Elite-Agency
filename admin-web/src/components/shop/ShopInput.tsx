import React from "react";
import {
  SheetClose,
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
import type { shopState } from "@/constants/types";

interface ShopInputProps {
  title: string;
  description: string;
  submitHandler: (e: React.FormEvent<HTMLFormElement>) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  closeRef: React.RefObject<HTMLButtonElement | null>;
  defaultValues?: shopState["shops"][0];
  buttonTitle: string;
}

const ShopInput = ({
  title,
  description,
  submitHandler,
  handleInputChange,
  isLoading,
  closeRef,
  defaultValues,
  buttonTitle,
}: ShopInputProps) => {
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
          {/* Basic Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase text-muted-foreground border-b pb-1">
              Basic Info
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs" htmlFor="shopName">
                  Shop Name
                </Label>
                <Input
                  id="shopName"
                  className="h-8 text-sm"
                  defaultValue={defaultValues?.shopName}
                  required
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs" htmlFor="ownerName">
                  Owner Name
                </Label>
                <Input
                  id="ownerName"
                  className="h-8 text-sm"
                  defaultValue={defaultValues?.ownerName}
                  required
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs" htmlFor="email">
                  Email
                </Label>
                <Input
                  id="email"
                  defaultValue={defaultValues?.email}
                  className="bg-muted/50 border-dashed h-8 text-sm"
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs" htmlFor="phone">
                  Phone
                </Label>
                <Input
                  onChange={handleInputChange}
                  id="phone"
                  className="h-8 text-sm"
                  defaultValue={defaultValues?.phone}
                  pattern="^\d{10}$"
                  title="10-digit phone number"
                  required
                />
              </div>
            </div>
          </div>

          {/* Business IDs */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase text-muted-foreground border-b pb-1">
              Business IDs
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs" htmlFor="pan">
                  PAN
                </Label>
                <Input
                  onChange={handleInputChange}
                  id="pan"
                  className="h-8 text-sm uppercase"
                  defaultValue={defaultValues?.pan}
                  pattern="^[A-Z]{5}[0-9]{4}[A-Z]{1}$"
                  title="Valid PAN format (e.g., ABCDE1234F)"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs" htmlFor="gst">
                  GST
                </Label>
                <Input
                  onChange={handleInputChange}
                  id="gst"
                  className="h-8 text-sm uppercase"
                  defaultValue={defaultValues?.gst}
                  pattern="^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$"
                  title="Valid GST format (e.g., 22ABCDE1234F1Z5)"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs" htmlFor="fssai">
                  FSSAI
                </Label>
                <Input
                  onChange={handleInputChange}
                  id="fssai"
                  className="h-8 text-sm"
                  defaultValue={defaultValues?.fssai}
                  pattern="^\d{14}$"
                  title="14-digit FSSAI number"
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase text-muted-foreground border-b pb-1">
              Address
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs" htmlFor="village">
                  Village/Area
                </Label>
                <Input
                  onChange={handleInputChange}
                  id="village"
                  className="h-8 text-sm"
                  defaultValue={defaultValues?.address?.village}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs" htmlFor="district">
                  District
                </Label>
                <Input
                  onChange={handleInputChange}
                  id="district"
                  className="h-8 text-sm"
                  defaultValue={defaultValues?.address?.district}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs" htmlFor="state">
                  State
                </Label>
                <Input
                  onChange={handleInputChange}
                  id="state"
                  className="h-8 text-sm"
                  defaultValue={defaultValues?.address?.state}
                  required
                />
              </div>
              <div className="flex justify-between">
                <div className="space-y-1.5 w-[48%]">
                  <Label className="text-xs" htmlFor="pinCode">
                    PIN Code
                  </Label>
                  <Input
                    onChange={handleInputChange}
                    id="pinCode"
                    className="h-8 text-sm"
                    defaultValue={defaultValues?.address?.pinCode}
                    pattern="^\d{6}$"
                    title="6-digit PIN code"
                    required
                  />
                </div>
                <div className="space-y-1.5 w-[48%]">
                  <Label className="text-xs" htmlFor="stateCode">
                    State Code
                  </Label>
                  <Input
                    onChange={handleInputChange}
                    id="stateCode"
                    className="h-8 text-sm"
                    defaultValue={defaultValues?.address?.stateCode}
                    pattern="^\d{2}$"
                    title="2-digit State code"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs" htmlFor="landmark">
                Landmark (Optional)
              </Label>
              <Input
                onChange={handleInputChange}
                id="landmark"
                className="h-8 text-sm"
                defaultValue={defaultValues?.address?.landmark}
              />
            </div>
          </div>
        </div>

        <SheetFooter className="mt-2 pt-4 border-t px-1 sm:px-5">
          <Button type="submit" size="sm">
            {isLoading ? <Spinner /> : buttonTitle}
          </Button>
          <SheetClose asChild>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              ref={closeRef}
            >
              Cancel
            </Button>
          </SheetClose>
        </SheetFooter>
      </form>
    </SheetContent>
  );
};

export default ShopInput;
