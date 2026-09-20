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
import type { WorkerState } from "@/constants/types";

interface WorkerInputProps {
  title: string;
  description: string;
  submitHandler: (e: React.FormEvent<HTMLFormElement>) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  closeRef: React.RefObject<HTMLButtonElement | null>;
  defaultValues?: WorkerState;
  buttonTitle: string;
}

const WorkerInput = ({
  title,
  description,
  submitHandler,
  handleInputChange,
  isLoading,
  closeRef,
  defaultValues,
  buttonTitle,
}: WorkerInputProps) => {
  return (
    <SheetContent className="overflow-y-auto sm:max-w-xl w-full flex flex-col justify-between">
      <SheetHeader className="mb-4">
        <SheetTitle className="text-lg">{title}</SheetTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </SheetHeader>

      <form
        className="flex flex-col flex-1 justify-between"
        onSubmit={submitHandler}
      >
        <div className="space-y-6 px-1 sm:px-5 pb-4 flex flex-col">
          {/* Basic Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase text-muted-foreground border-b pb-1">
              Basic Info
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="name">Worker Name</Label>
                <Input
                  onChange={handleInputChange}
                  id="name"
                  className="h-8 text-sm"
                  required
                  defaultValue={defaultValues?.name}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  onChange={handleInputChange}
                  id="phone"
                  type="number"
                  className="h-8 text-sm"
                  pattern="^\d{10}$"
                  title="10-digit mobile number"
                  required
                  defaultValue={defaultValues?.phone}
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  onChange={handleInputChange}
                  id="email"
                  className="h-8 text-sm"
                  defaultValue={defaultValues?.email}
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
                <Label htmlFor="plotNo">Plot/Door No</Label>
                <Input
                  onChange={handleInputChange}
                  id="plotNo"
                  className="h-8 text-sm"
                  required
                  defaultValue={defaultValues?.address?.plotNo}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="street">Street</Label>
                <Input
                  onChange={handleInputChange}
                  id="street"
                  className="h-8 text-sm"
                  required
                  defaultValue={defaultValues?.address?.street}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="village">Village</Label>
                <Input
                  onChange={handleInputChange}
                  id="village"
                  className="h-8 text-sm"
                  required
                  defaultValue={defaultValues?.address?.village}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="district">District</Label>
                <Input
                  onChange={handleInputChange}
                  id="district"
                  className="h-8 text-sm"
                  required
                  defaultValue={defaultValues?.address?.district}
                />
              </div>
            </div>
          </div>
        </div>

        <SheetFooter className="mt-2 pt-4 border-t px-1 sm:px-5">
          <Button type="submit" size="sm" disabled={isLoading}>
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

export default WorkerInput;
