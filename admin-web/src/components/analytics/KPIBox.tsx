import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KPIBoxProps {
  title: string;
  value: string | number;
  growth?: number;
  icon?: React.ReactNode;
}

const KPIBox: React.FC<KPIBoxProps> = ({ title, value, growth, icon }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {typeof growth !== "undefined" && (
          <p className={`text-xs mt-1 flex items-center ${
            growth > 0 ? "text-green-500" : growth < 0 ? "text-red-500" : "text-muted-foreground"
          }`}>
            {growth > 0 ? (
              <TrendingUp className="h-3 w-3 mr-1" />
            ) : growth < 0 ? (
              <TrendingDown className="h-3 w-3 mr-1" />
            ) : (
              <Minus className="h-3 w-3 mr-1" />
            )}
            {Math.abs(growth)}% from last period
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default KPIBox;
