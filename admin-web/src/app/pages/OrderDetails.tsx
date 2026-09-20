import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HomeLayout from "../layout/HomeLayout";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { fetchOrderById } from "@/actions/order.action";
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
import BreadCrumbs from "@/components/BreadCrumbs";
import { Button } from "@/components/ui/button";
import { CreditCard, Printer } from "lucide-react";
import PaymentModal from "@/components/orders/PaymentModal";
import { format } from "date-fns";
import InvoicePrint from "@/components/orders/InvoicePrint";
import { formatCurrency } from "@/utils/formatCurrency";

export default function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { selectedOrder, loading, error } = useAppSelector(
    (state) => state.order,
  );
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderById(id));
    }
  }, [id, dispatch]);

  if (loading && !selectedOrder) {
    return (
      <HomeLayout>
        <div className="flex flex-col items-center justify-center h-96 gap-4">
          <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          <p className="text-muted-foreground font-medium animate-pulse">
            Fetching order details...
          </p>
        </div>
      </HomeLayout>
    );
  }

  if (error || !selectedOrder) {
    return (
      <HomeLayout>
        <div className="flex flex-col items-center justify-center h-96 text-center px-4">
          <div className="h-16 w-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl font-bold">!</span>
          </div>
          <h2 className="text-xl font-bold mb-2">Order Not Found</h2>
          <p className="text-muted-foreground mb-6 max-w-sm">
            {error ||
              "We couldn't find the order you're looking for. It may have been deleted or the ID might be incorrect."}
          </p>
          <Button onClick={() => navigate("/orders")}>
            Return to Orders Ledger
          </Button>
        </div>
      </HomeLayout>
    );
  }

  const getStatusBadge = (status: string) => {
    if (status === "PAID") return <Badge className="bg-green-600">PAID</Badge>;
    if (status === "PARTIAL")
      return (
        <Badge variant="secondary" className="bg-orange-200 text-orange-800">
          PARTIAL
        </Badge>
      );
    return <Badge variant="destructive">UNPAID</Badge>;
  };

  return (
    <>
      <InvoicePrint order={selectedOrder} />
      <div className="print:hidden">
        <HomeLayout>
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex sm:items-center justify-between gap-4 flex-col sm:flex-row">
              <div className="flex flex-col gap-1">
                <BreadCrumbs
                  breadcrumbs={[
                    { label: "Orders Ledger", link: "/orders" },
                    {
                      label: `Invoice #${selectedOrder?.invoiceNo || (selectedOrder?._id ? selectedOrder._id.slice(-6).toUpperCase() : "...")}`,
                      link: `/orders/${selectedOrder?._id}`,
                    },
                  ]}
                />
                <div className="flex items-center gap-3">
                  <p className="text-sm text-muted-foreground">
                    Created on{" "}
                    {format(new Date(selectedOrder.createdAt), "PPP")}
                  </p>
                  {getStatusBadge(selectedOrder.paymentStatus)}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => window.print()}>
                  <Printer className="h-4 w-4 mr-2" /> Print
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column: Details & Products */}
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Shop Name</p>
                      <p className="font-medium">
                        {selectedOrder.shop?.shopName || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Contact Info
                      </p>
                      <p className="font-medium">
                        {selectedOrder.shop?.mobile || "N/A"}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="font-medium">
                        {selectedOrder.shop?.address?.village},{" "}
                        {selectedOrder.shop?.address?.district}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Order Items</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead className="text-right">Price</TableHead>
                          <TableHead className="text-right">Qty</TableHead>
                          <TableHead className="text-right">Disc.</TableHead>
                          <TableHead className="text-right">Net</TableHead>
                          <TableHead className="text-right">GST</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedOrder.orderedProducts?.map(
                          (item: any, i: number) => (
                            <TableRow key={i}>
                              <TableCell className="font-medium">
                                {item.product?.name}
                                <div className="text-xs text-muted-foreground">
                                  HSN: {item.product?.HSN}
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                ₹{formatCurrency(item.product?.sellingPrice || 0)}
                              </TableCell>
                              <TableCell className="text-right">
                                {item.quantity}
                              </TableCell>
                              <TableCell className="text-right text-green-600">
                                {item.discount > 0 ? `-₹${formatCurrency(item.discount)}` : "-"}
                              </TableCell>
                              <TableCell className="text-right">
                                ₹{formatCurrency(item.netPrice || 0)}
                              </TableCell>
                              <TableCell className="text-right">
                                ₹{formatCurrency(item.taxAmount || 0)}
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                ₹{formatCurrency(item.totalAmount || 0)}
                              </TableCell>
                            </TableRow>
                          ),
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Financials & Payments */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{formatCurrency(selectedOrder.subTotal || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Total Tax (GST)
                      </span>
                      <span>₹{formatCurrency(selectedOrder.totalGST || 0)}</span>
                    </div>
                    <div className="flex justify-between border-b pb-3">
                      <span className="text-muted-foreground">Round Off</span>
                      <span>
                        {selectedOrder.roundOff >= 0 ? "+" : ""}{" "}
                        {formatCurrency(selectedOrder.roundOff || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-1">
                      <span>Grand Total</span>
                      <span>₹{formatCurrency(selectedOrder.grandTotal || 0)}</span>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3 bg-muted/20 p-4 rounded-lg border">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Paid Amount</span>
                      <span className="text-green-600 font-medium">
                        ₹{formatCurrency(selectedOrder.paidAmount || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground font-semibold">
                        Due Amount
                      </span>
                      <span className="text-destructive font-bold text-lg">
                        ₹{formatCurrency(Math.max(0, selectedOrder.dueAmount || 0))}
                      </span>
                    </div>
                  </div>

                  {selectedOrder.dueAmount > 0 && (
                    <Button
                      className="w-full mt-6"
                      onClick={() => setIsPaymentModalOpen(true)}
                    >
                      <CreditCard className="mr-2 h-4 w-4" /> Add Payment
                    </Button>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Payment History</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {selectedOrder.payments &&
                  selectedOrder.payments.length > 0 ? (
                    <Table className="text-sm">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Mode</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedOrder.payments.map((p: any) => (
                          <TableRow key={p._id}>
                            <TableCell>
                              {format(new Date(p.date), "dd/MM/yy")}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-[10px]">
                                {p.method}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-medium text-green-600">
                                +₹{formatCurrency(p.amount)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="p-6 text-center text-muted-foreground text-sm">
                      No payments recorded yet.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {isPaymentModalOpen && (
            <PaymentModal
              orderId={selectedOrder._id}
              dueAmount={selectedOrder.dueAmount}
              isOpen={isPaymentModalOpen}
              onClose={() => setIsPaymentModalOpen(false)}
            />
          )}
        </HomeLayout>
      </div>
    </>
  );
}
