import React from "react";
import BreadCrumbs from "../BreadCrumbs";
import { SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { RefreshCcw } from "lucide-react";

const ShopHeader = ({
  refresh,
  isLoading,
}: {
  refresh: () => void;
  isLoading: boolean;
}) => {
  const brudCrumb = [{ label: "Shops", link: "/shops" }];
  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex sm:items-center justify-between gap-4 flex-col sm:flex-row">
        <div className="flex flex-col gap-1">
          <BreadCrumbs breadcrumbs={brudCrumb} />
          <p className="text-sm text-muted-foreground">
            Manage your shops and view their details.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <SheetTrigger asChild>
            <Button>Add New</Button>
          </SheetTrigger>
          <Button
            variant="outline"
            onClick={refresh}
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            <RefreshCcw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShopHeader;
