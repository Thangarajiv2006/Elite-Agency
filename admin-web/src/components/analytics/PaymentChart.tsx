import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { formatCurrency } from "@/utils/formatCurrency";

interface PaymentChartProps {
  data: any[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const chartConfig = {
  value: {
    label: "Amount",
  },
};

const PaymentChart: React.FC<PaymentChartProps> = ({ data }) => {
  const formattedData = data?.map((item, index) => ({
    name: item.method || "Unknown",
    value: item.amount,
    fill: COLORS[index % COLORS.length]
  })) || [];

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Payment Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        {formattedData.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={formattedData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {formattedData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltipContent formatter={(value) => `₹${formatCurrency(Number(value))}`} />} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="flex h-[250px] items-center justify-center text-muted-foreground">
            No Payment Data
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentChart;
