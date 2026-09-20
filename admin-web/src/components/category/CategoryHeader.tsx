import BreadCrumbs from "../BreadCrumbs";
import { Button } from "../ui/button";
import { RefreshCcw } from "lucide-react";

const CategoryHeader = ({
  categoryName,
  isLoading,
  onAddClick,
  refresh,
}: {
  categoryName?: string;
  isLoading: boolean;
  onAddClick: () => void;
  refresh: () => void;
}) => {
  const breadcrumbs = [
    { label: "Categories", link: "#" },
    { label: `${categoryName || "Category Details"}`, link: `#` },
  ];

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex sm:items-center justify-between gap-4 flex-col sm:flex-row">
        <div className="flex flex-col gap-1">
          <BreadCrumbs breadcrumbs={breadcrumbs} />
          <p className="text-sm text-muted-foreground mt-1">
            Manage your products mapped within this category.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {refresh && (
            <>
              <Button onClick={onAddClick}>Add Product</Button>
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

export default CategoryHeader;
