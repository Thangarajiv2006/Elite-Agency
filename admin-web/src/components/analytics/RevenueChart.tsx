import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { formatCurrency } from "@/utils/formatCurrency";

interface RevenueChartProps {
  data: any[];
}

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--primary))",
  },
};

const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  return (
    <Card className="col-span-full xl:col-span-1 border shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Revenue Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        {data && data.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="period"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `₹${formatCurrency(value).split('.')[0]}`}
                />
                <Tooltip content={<ChartTooltipContent formatter={(value) => `₹${formatCurrency(Number(value))}`} />} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-revenue)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            No Revenue Data Available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
