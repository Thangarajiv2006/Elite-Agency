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
} from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

interface ProductChartProps {
  data: any[];
}

const chartConfig = {
  sales: {
    label: "Sales Amount",
    color: "hsl(var(--primary))",
  },
};

const ProductChart: React.FC<ProductChartProps> = ({ data }) => {
  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Top Products</CardTitle>
      </CardHeader>
      <CardContent>
        {data && data.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 0, right: 30, left: 20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tickLine={false} axisLine={false} />
                <YAxis
                  dataKey="productName"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  width={80}
                  tickFormatter={(value) =>
                    value.length > 10 ? `${value.slice(0, 10)}...` : value
                  }
                />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="totalQuantity"
                  fill="var(--color-sales)"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="flex h-[250px] items-center justify-center text-muted-foreground">
            No Product Data
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductChart;
