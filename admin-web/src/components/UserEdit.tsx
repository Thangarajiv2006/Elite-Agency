import React, { useRef, useState } from "react";
import {
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { CardDescription } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import type { AuthState } from "@/constants/types";
import type { RootState } from "@/reducers";
import { Spinner } from "./ui/spinner";
import { useAppDispatch } from "@/hooks";
import { updateProfile } from "@/actions/auth.action";
import { toast } from "sonner";

const UserEdit = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const user = auth.user as AuthState["user"];

  const [formData, setFormData] = useState<AuthState["user"]>(user);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    const res = await dispatch(updateProfile(formData));
    if (res?.data.status === "error") {
      toast.error(res?.data.message);
    } else if (res?.data.status === "success") {
      cancelButtonRef.current?.click();
      toast.success("Profile updated successfully");
    }
    setIsLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    setFormData((prev) => {
      if (!prev) return null;

      return {
        ...prev,
        [id]: value,
      };
    });
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    setFormData((prev) => {
      if (!prev) return null;

      return {
        ...prev,
        address: {
          ...prev.address,
          [id]: value,
        },
      };
    });
  };

  return (
    <SheetContent className="overflow-y-auto sm:max-w-xl w-full flex flex-col justify-between">
      <SheetHeader className="mb-4">
        <SheetTitle className="text-lg">Edit Profile</SheetTitle>
        <CardDescription className="text-sm">
          Update your agency information. Email cannot be changed.
        </CardDescription>
      </SheetHeader>

      <form
        onSubmit={handleSave}
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
                <Label className="text-xs" htmlFor="agencyName">
                  Agency Name
                </Label>
                <Input
                  id="agencyName"
                  className="h-8 text-sm"
                  defaultValue={user?.agencyName}
                  required
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs" htmlFor="name">
                  Owner Name
                </Label>
                <Input
                  id="name"
                  className="h-8 text-sm"
                  defaultValue={user?.name}
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
                  defaultValue={user?.email}
                  disabled
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
                  defaultValue={user?.phone}
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
                  defaultValue={user?.pan}
                  pattern="^[A-Z]{5}[0-9]{4}[A-Z]{1}$"
                  title="Valid PAN format (e.g., ABCDE1234F)"
                  required
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
                  defaultValue={user?.gst}
                  pattern="^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$"
                  title="Valid GST format (e.g., 22ABCDE1234F1Z5)"
                  required
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
                  defaultValue={user?.fssai}
                  pattern="^\d{14}$"
                  title="14-digit FSSAI number"
                  required
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
                <Label className="text-xs" htmlFor="plotNo">
                  Plot/Door No
                </Label>
                <Input
                  onChange={handleAddressChange}
                  id="plotNo"
                  className="h-8 text-sm"
                  defaultValue={user?.address?.plotNo}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs" htmlFor="street">
                  Street
                </Label>
                <Input
                  onChange={handleAddressChange}
                  id="street"
                  className="h-8 text-sm"
                  defaultValue={user?.address?.street}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs" htmlFor="village">
                  Village/Area
                </Label>
                <Input
                  onChange={handleAddressChange}
                  id="village"
                  className="h-8 text-sm"
                  defaultValue={user?.address?.village}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs" htmlFor="district">
                  District
                </Label>
                <Input
                  onChange={handleAddressChange}
                  id="district"
                  className="h-8 text-sm"
                  defaultValue={user?.address?.district}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs" htmlFor="state">
                  State
                </Label>
                <Input
                  onChange={handleAddressChange}
                  id="state"
                  className="h-8 text-sm"
                  defaultValue={user?.address?.state}
                  required
                />
              </div>
              <div className="flex justify-between">
                <div className="space-y-1.5 w-[48%]">
                  <Label className="text-xs" htmlFor="pinCode">
                    PIN Code
                  </Label>
                  <Input
                    onChange={handleAddressChange}
                    id="pinCode"
                    className="h-8 text-sm"
                    defaultValue={user?.address?.pinCode}
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
                    onChange={handleAddressChange}
                    id="stateCode"
                    className="h-8 text-sm"
                    defaultValue={user?.address?.stateCode}
                    pattern="^\d{2}$"
                    title="2-digit State code"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <SheetFooter className="mt-2 pt-4 border-t px-1 sm:px-5">
          <Button type="submit" size="sm">
            {isLoading ? <Spinner /> : "Save Changes"}
          </Button>
          <SheetClose asChild>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              ref={cancelButtonRef}
            >
              Cancel
            </Button>
          </SheetClose>
        </SheetFooter>
      </form>
    </SheetContent>
  );
};

export default UserEdit;
