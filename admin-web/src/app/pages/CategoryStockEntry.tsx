import { useEffect, useState } from "react";
import HomeLayout from "../layout/HomeLayout";
import { useSelector } from "react-redux";
import type { RootState } from "@/reducers";
import { useAppDispatch } from "@/hooks";
import {
  fetchProductsByCategory,
  createCategoryStockEntry,
  setSelectedCategory,
  getStockHistory,
} from "@/actions/stock.action";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { History } from "lucide-react";
import { Sheet } from "@/components/ui/sheet";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import {
  StockHistoryTable,
  StockHistoryDetails,
  StockUpdateForm,
  StockHeader,
} from "@/components/category";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { Empty } from "@/components";
import type { stockState } from "@/constants/types";

const CategoryStockEntry = () => {
  const dispatch = useAppDispatch();
  const categoryList = useSelector((state: RootState) => state.category);
  const {
    history,
    historyTotal,
    historyPage,
    historyTotalPages,
    products,
    selectedCategory,
    loading,
    historyLoading,
  } = useSelector((state: RootState) => state.stock);

  const [date, setDate] = useState<DateRange | undefined>();

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [activeEntryDetails, setActiveEntryDetails] = useState<
    stockState["history"][0] | null
  >(null);

  const handleCategoryChange = (categoryId: string) => {
    dispatch(setSelectedCategory(categoryId));
  };

  const formattedStart = date?.from
    ? format(date.from, "yyyy-MM-dd")
    : undefined;
  const formattedEnd = date?.to ? format(date.to, "yyyy-MM-dd") : undefined;

  useEffect(() => {
    if (selectedCategory) {
      dispatch(
        getStockHistory(selectedCategory, 1, 15, formattedStart, formattedEnd),
      );
    }
  }, [selectedCategory, date, dispatch]);

  const handlePageChange = (page: number) => {
    if (selectedCategory) {
      dispatch(
        getStockHistory(
          selectedCategory,
          page,
          15,
          formattedStart,
          formattedEnd,
        ),
      );
    }
  };

  const handleRefresh = () => {
    if (selectedCategory) {
      dispatch(
        getStockHistory(
          selectedCategory,
          historyPage,
          15,
          formattedStart,
          formattedEnd,
        ),
      );
    }
  };

  const openSheet = () => {
    if (!selectedCategory) {
      toast.error("Please select a category first!");
      return;
    }
    setIsSheetOpen(true);
    dispatch(fetchProductsByCategory(selectedCategory, ""));
  };

  const handleSheetSearch = (q: string) => {
    if (selectedCategory) {
      dispatch(fetchProductsByCategory(selectedCategory, q));
    }
  };

  const submitStockUpdates = async (
    payload: { productId: string; quantity: number }[],
  ) => {
    if (!selectedCategory) return;
    const res = (await dispatch(
      createCategoryStockEntry({
        categoryId: selectedCategory,
        products: payload,
      }),
    )) as any;

    if (res?.data?.success) {
      toast.success("Stock entry logged successfully!");
      setIsSheetOpen(false);
      handleRefresh();
    } else {
      toast.error(res?.data?.message || "Failed to log stock");
    }
  };

  return (
    <HomeLayout>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <div className="space-y-6">
          <StockHeader
            refresh={handleRefresh}
            isLoading={historyLoading}
            openSheet={openSheet}
          />

          <div className="flex flex-col sm:flex-row gap-4 items-end mb-6">
            <div className="w-full sm:w-[300px]">
              <label className="text-xs font-semibold mb-1.5 text-muted-foreground block">
                Category Target
              </label>
              <Select
                onValueChange={handleCategoryChange}
                value={selectedCategory || ""}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryList.map((cat: any) => (
                    <SelectItem key={cat._id!} value={cat._id!}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-auto flex flex-wrap flex-col">
              <label className="text-xs font-semibold mb-1.5 text-muted-foreground block">
                Date Range
              </label>
              <DatePickerWithRange date={date} setDate={setDate} />
            </div>
          </div>

          {!selectedCategory ? (
            <div className="flex items-center justify-center p-12 text-muted-foreground border-2 border-dashed rounded-lg bg-muted/5">
              Please specify a category filter parameter globally mapping
              entries.
            </div>
          ) : historyTotal === 0 ? (
            <div className="flex items-center justify-center py-20 h-[50vh]">
              <Empty
                title="No Registry Validated"
                description="Unable to find matching timestamps mapping to historical logs for this category."
                icon={<History className="h-10 w-10 text-primary/50" />}
                refresh={handleRefresh}
                isLoading={historyLoading}
              />
            </div>
          ) : (
            <div className="">
              <StockHistoryTable
                history={history}
                historyLoading={historyLoading}
                currentPage={historyPage}
                totalPages={historyTotalPages}
                onPageChange={handlePageChange}
                onViewDetails={(entry) => setActiveEntryDetails(entry)}
              />
            </div>
          )}
        </div>

        <StockUpdateForm
          isOpen={isSheetOpen}
          products={products}
          loading={loading}
          onSearch={handleSheetSearch}
          onSubmit={submitStockUpdates}
        />

        <StockHistoryDetails
          entry={activeEntryDetails}
          onClose={() => setActiveEntryDetails(null)}
        />
      </Sheet>
    </HomeLayout>
  );
};

export default CategoryStockEntry;
