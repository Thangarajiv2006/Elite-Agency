import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

interface StatusChartProps {
  data: any[];
}

const statusColors: Record<string, string> = {
  PAID: "#10b981", // emerald-500
  PENDING: "#f59e0b", // amber-500
  UNPAID: "#f59e0b", // amber-500
  PARTIAL: "#3b82f6", // blue-500
  CANCELLED: "#ef4444", // red-500
};

const chartConfig = {
  count: {
    label: "Invoices",
    color: "hsl(var(--primary))",
  },
};

const StatusChart: React.FC<StatusChartProps> = ({ data }) => {
  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Invoice Status</CardTitle>
      </CardHeader>
      <CardContent>
        {data && data.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="status"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={statusColors[entry.status] || "hsl(var(--primary))"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="flex h-[250px] items-center justify-center text-muted-foreground">
            No Status Data
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatusChart;
