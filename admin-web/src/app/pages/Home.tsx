import { useEffect, useState } from "react";
import HomeLayout from "../layout/HomeLayout";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  fetchRevenue,
  fetchTopProducts,
  fetchCustomers,
  fetchPayments,
  fetchStatus,
  fetchRecentInvoices,
} from "@/actions/analytics.action";
import {
  KPIBox,
  RevenueChart,
  ProductChart,
  PaymentChart,
  CustomerChart,
  StatusChart,
  RecentInvoices,
  FloatingAICopilot,
} from "@/components/analytics";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import BreadCrumbs from "@/components/BreadCrumbs";
import type { DateRange } from "react-day-picker";
import { format, subDays } from "date-fns";
import { DollarSign, FileText, Users, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";  
import { formatCurrency } from "@/utils/formatCurrency";

const Home = () => {
  const dispatch = useAppDispatch();
  const {
    revenue,
    products,
    customers,
    payments,
    status,
    recentInvoices,
    loading,
  } = useAppSelector((state) => state.analytics);

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const loadDashboardData = () => {
    const startDate = dateRange?.from
      ? format(dateRange.from, "yyyy-MM-dd")
      : undefined;
    const endDate = dateRange?.to
      ? format(dateRange.to, "yyyy-MM-dd")
      : undefined;

    dispatch(fetchRevenue("daily", startDate, endDate));
    dispatch(fetchTopProducts(startDate, endDate, 10));
    dispatch(fetchCustomers(startDate, endDate));
    dispatch(fetchPayments(startDate, endDate));
    dispatch(fetchStatus(startDate, endDate));
    dispatch(fetchRecentInvoices(10));
  };

  useEffect(() => {
    loadDashboardData();
  }, [dateRange]);

  // Derived KPIs
  const totalRevenue = revenue?.totalRevenue || 0;

  const statusValues = Object.values(status || {}) as number[];
  const totalInvoices = statusValues.reduce((sum, val) => sum + val, 0) || 0;

  const totalCustomers = customers?.totalCustomers || 0;

  const paymentValues = Object.values(payments || {}) as number[];
  const totalPayments = paymentValues.reduce((sum, val) => sum + val, 0) || 0;

  // Convert Status object to array for chart
  const statusChartData = Object.entries(status || {}).map(([key, value]) => ({
    status: key.toUpperCase(),
    count: value,
  }));

  // Convert Payments object to array for chart
  const paymentChartData = Object.entries(payments || {}).map(
    ([key, value]) => ({
      method: key,
      amount: value,
    }),
  );

  return (
    <HomeLayout>
      <div className="flex flex-col gap-6 p-1 sm:p-2 w-full pt-6">
        {/* Header & Filters */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex sm:items-center justify-between gap-4 flex-col sm:flex-row">
            <div className="flex flex-col gap-1">
              <BreadCrumbs
                breadcrumbs={[{ label: "Analytics Dashboard", link: "/" }]}
              />
              <p className="text-sm text-muted-foreground">
                Overview of your store's performance
              </p>
            </div>
            <div className="flex items-center gap-2">
              <DatePickerWithRange date={dateRange} setDate={setDateRange} />
              <Button
                variant="outline"
                onClick={loadDashboardData}
                className="flex items-center gap-2"
                disabled={loading}
              >
                <RefreshCcw
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {loading && !totalRevenue ? (
            Array(4)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-[120px] rounded-xl" />
              ))
          ) : (
            <>
              <KPIBox
                title="Total Revenue"
                value={`₹${formatCurrency(totalRevenue)}`}
                icon={<DollarSign />}
              />
              <KPIBox
                title="Total Invoices"
                value={totalInvoices.toLocaleString()}
                icon={<FileText />}
              />
              <KPIBox
                title="Active Customers"
                value={totalCustomers.toLocaleString()}
                icon={<Users />}
              />
              <KPIBox
                title="Total Processed"
                value={`₹${formatCurrency(totalPayments)}`}
                icon={<CreditCard />}
              />
            </>
          )}
        </div>

        {/* Main Charts area */}
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
          {/* Revenue spans 4 columns on large screens */}
          <div className="lg:col-span-4">
            {loading && (!revenue || !revenue.data?.length) ? (
              <Skeleton className="h-[380px] rounded-xl" />
            ) : (
              <RevenueChart data={revenue?.data || []} />
            )}
          </div>

          {/* Top Products spans 3 columns on large screens */}
          <div className="lg:col-span-3">
            {loading && !products?.length ? (
              <Skeleton className="h-[380px] rounded-xl" />
            ) : (
              <ProductChart data={products || []} />
            )}
          </div>
        </div>

        {/* Secondary Charts row */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {loading && Object.keys(status || {}).length === 0 ? (
            <Skeleton className="h-[320px] rounded-xl" />
          ) : (
            <StatusChart data={statusChartData} />
          )}

          {loading && Object.keys(payments || {}).length === 0 ? (
            <Skeleton className="h-[320px] rounded-xl" />
          ) : (
            <PaymentChart data={paymentChartData} />
          )}

          {loading && (!customers || Object.keys(customers).length === 0) ? (
            <Skeleton className="h-[320px] rounded-xl" />
          ) : (
            <CustomerChart
              data={{
                newCustomers: customers?.newCustomers || 0,
                returningCustomers: customers?.repeatCustomers || 0,
              }}
            />
          )}
        </div>

        {/* Recent Invoices */}
        <div>
          {loading && !recentInvoices?.length ? (
            <Skeleton className="h-[400px] rounded-xl" />
          ) : (
            <RecentInvoices data={recentInvoices || []} />
          )}
        </div>
        <FloatingAICopilot dateRange={dateRange} />
      </div>
    </HomeLayout>
  );
};

export default Home;
