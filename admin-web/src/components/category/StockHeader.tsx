
import { Button } from "../ui/button";
import { RefreshCcw } from "lucide-react";
import BreadCrumbs from "../BreadCrumbs";

interface StockHeaderProps {
  refresh?: () => void;
  isLoading?: boolean;
  openSheet?: () => void;
}

const StockHeader = ({ refresh, isLoading, openSheet }: StockHeaderProps) => {
  const brudCrumb = [{ label: "Updated Stocks", link: "/update-stocks" }];
  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex sm:items-center justify-between gap-4 flex-col sm:flex-row">
        <div className="flex flex-col gap-1">
          <BreadCrumbs breadcrumbs={brudCrumb} />
          <p className="text-sm text-muted-foreground">
            Track and trace comprehensive bulk stock updates across your categories natively.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {refresh && (
            <>
              {openSheet && (
                <Button onClick={openSheet}>New Entry</Button>
              )}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockHeader;
