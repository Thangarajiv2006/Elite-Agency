import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { fetchOrders } from "@/actions/order.action";
import { Empty } from "@/components";
import { RefreshCcw, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";
import PaginationCompo from "@/components/Pagination";
import { orderConstants } from "@/constants/action.constant";
import { formatCurrency } from "@/utils/formatCurrency";

const ShopOrdersList = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { orders, loading, currentPage, totalPages, totalOrders, totalGrandTotal, totalPaidAmount, totalDueAmount } =
    useAppSelector((state) => state.order);

  const [paymentStatus, setPaymentStatus] = useState<string>("ALL");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    if (id) {
      loadOrders(1);
    }
  }, [paymentStatus, dateRange, debouncedSearch, id]);

  const loadOrders = (page: number) => {
    const startDate = dateRange?.from
      ? format(dateRange.from, "yyyy-MM-dd")
      : undefined;
    const endDate = dateRange?.to
      ? format(dateRange.to, "yyyy-MM-dd")
      : undefined;

    dispatch(
      fetchOrders(
        page,
        orderConstants.QUERY_PER_PAGE,
        paymentStatus,
        startDate,
        endDate,
        debouncedSearch,
        undefined,
        id,
      ),
    );
  };

  const refresh = () => {
    loadOrders(currentPage || 1);
  };

  const handlePageChange = (page: number) => {
    loadOrders(page);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return <Badge className="bg-green-600 hover:bg-green-700">PAID</Badge>;
      case "PARTIAL":
        return (
          <Badge
            variant="secondary"
            className="bg-orange-200 text-orange-800 hover:bg-orange-300"
          >
            PARTIAL
          </Badge>
        );
      case "UNPAID":
        return <Badge variant="destructive">UNPAID</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="mt-8 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[15px] font-semibold flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          Orders Handled By Shop
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={refresh}
          className="flex items-center gap-2"
          disabled={loading}
        >
          <RefreshCcw
            className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-card p-4 rounded-xl border shadow-sm items-center">
        <div className="w-full sm:w-[260px]">
          <Input
            placeholder="Search by invoice..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-[260px]">
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
        </div>
        <div className="w-full sm:w-[200px]">
          <Select value={paymentStatus} onValueChange={setPaymentStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Payment Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="PAID">Paid</SelectItem>
              <SelectItem value="PARTIAL">Partial</SelectItem>
              <SelectItem value="UNPAID">Unpaid</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="ml-auto">
          <Button
            variant="outline"
            onClick={() => {
              setDateRange(undefined);
              setPaymentStatus("ALL");
              setSearch("");
            }}
          >
            Clear Filters
          </Button>
        </div>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        {orders.length === 0 ? (
          <div className="py-6">
            <Empty
              title="No Orders Found"
              description="No orders found for this shop matching your filters in the system."
              icon={<FileText />}
              refresh={refresh}
              isLoading={loading}
              onAdd={() => navigate("/orders/create")}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">S.No</TableHead>
                  <TableHead>Invoice No</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Worker Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Grand Total</TableHead>
                  <TableHead className="text-right">Paid</TableHead>
                  <TableHead className="text-right">Due</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order: any, index: number) => (
                  <TableRow
                    key={order._id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => navigate(`/orders/${order._id}`)}
                  >
                    <TableCell>{(currentPage - 1) * 10 + index + 1}</TableCell>
                    <TableCell className="font-medium text-primary">
                      <div>
                        {order.invoiceNo || order._id.slice(-6).toUpperCase()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        {new Date(
                          order.invoiceDate || order.createdAt,
                        ).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {order.customerDetails?.customerName || "Walk-in"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{order.worker?.name}</div>
                    </TableCell>
                    <TableCell>
                      <div>{getStatusBadge(order.paymentStatus)}</div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      <div>₹{formatCurrency(order.grandTotal || 0)}</div>
                    </TableCell>
                    <TableCell className="text-right text-green-600">
                      <div>₹{formatCurrency(order.paidAmount || 0)}</div>
                    </TableCell>
                    <TableCell className="text-right text-destructive font-semibold">
                      <div>₹{formatCurrency(Math.max(0, order.dueAmount || 0))}</div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow className="bg-muted/80 font-bold hover:bg-muted/80">
                  <TableCell colSpan={6} className="text-right uppercase tracking-wider text-xs">
                    Total summary ({totalOrders} records)
                  </TableCell>
                  <TableCell className="text-right text-base text-white">
                    ₹{formatCurrency(totalGrandTotal || 0)}
                  </TableCell>
                  <TableCell className="text-right text-green-500 text-base">
                    ₹{formatCurrency(totalPaidAmount || 0)}
                  </TableCell>
                  <TableCell className="text-right text-destructive text-base">
                    ₹{formatCurrency(totalDueAmount || 0)}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        )}
      </div>

      {!loading && totalOrders > 0 && (
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * 10 + 1} to{" "}
            {Math.min(currentPage * 10, totalOrders)} of {totalOrders} entries
          </div>

          <PaginationCompo
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default ShopOrdersList;
