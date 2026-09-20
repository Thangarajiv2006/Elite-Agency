import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { formatCurrency } from "@/utils/formatCurrency";

interface RecentInvoicesProps {
  data: any[];
}

const RecentInvoices: React.FC<RecentInvoicesProps> = ({ data }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return (
          <Badge className="bg-emerald-500 hover:bg-emerald-600">PAID</Badge>
        );
      case "PARTIAL":
        return <Badge className="bg-blue-500 hover:bg-blue-600">PARTIAL</Badge>;
      case "PENDING":
      case "UNPAID":
        return (
          <Badge className="bg-amber-500 hover:bg-amber-600">UNPAID</Badge>
        );
      case "CANCELLED":
        return <Badge variant="destructive">CANCELLED</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Card className="col-span-full border shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Recent Invoices</CardTitle>
      </CardHeader>
      <CardContent>
        {data && data.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice No</TableHead>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((invoice: any) => (
                  <TableRow key={invoice.invoiceId || invoice._id}>
                    <TableCell className="font-medium text-primary">
                      {invoice.invoiceId ||
                        invoice._id?.toString().slice(-6)?.toUpperCase()}
                    </TableCell>
                    <TableCell>{invoice.customerName || "Walk-in"}</TableCell>
                    <TableCell>
                      {invoice.createdAt
                        ? format(new Date(invoice.createdAt), "MMM dd, yyyy")
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(invoice.status || invoice.paymentStatus)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ₹{formatCurrency(invoice.totalAmount || 0)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex p-6 items-center justify-center text-muted-foreground">
            No Recent Invoices Found
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentInvoices;
