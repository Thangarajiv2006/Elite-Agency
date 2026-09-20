import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

interface CustomerChartProps {
  data: {
    newCustomers: number;
    returningCustomers: number;
  };
}

const COLORS = ['#8b5cf6', '#a78bfa'];

const chartConfig = {
  value: {
    label: "Count",
  },
};

const CustomerChart: React.FC<CustomerChartProps> = ({ data }) => {
  const formattedData = data ? [
    { name: "New", value: data.newCustomers || 0, fill: COLORS[0] },
    { name: "Returning", value: data.returningCustomers || 0, fill: COLORS[1] }
  ] : [];

  const hasData = formattedData.some(d => d.value > 0);

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Customer Insights</CardTitle>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={formattedData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                >
                  {formattedData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltipContent />} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="flex h-[250px] items-center justify-center text-muted-foreground">
            No Customer Data
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CustomerChart;
