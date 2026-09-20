import { useState, useEffect, useMemo } from "react";
import HomeLayout from "../layout/HomeLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import BreadCrumbs from "@/components/BreadCrumbs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Trash2,
  Search,
  ShoppingCart,
  User as UserIcon,
  CreditCard,
  Box,
  Check,
  UserCheck,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { createOrder } from "@/actions/order.action";
import { toast } from "sonner";
import axios from "@/helpers/axios";
import { useNavigate, useLocation } from "react-router-dom";
import { formatCurrency } from "@/utils/formatCurrency";

export default function CreateOrder() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading: submitting } = useAppSelector((state) => state.order);

  const [search, setSearch] = useState("");
  const [productSearchOptions, setProductSearchOptions] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  const [shopSearch, setShopSearch] = useState("");
  const [shopSearchOptions, setShopSearchOptions] = useState<any[]>([]);
  const [searchingShop, setSearchingShop] = useState(false);
  const [selectedShop, setSelectedShop] = useState<any>(null);

  // Form State
  const [shopId, setShopId] = useState("");
  const [paymentMode, setPaymentMode] = useState("CASH");
  const [initialPaymentAmount, setInitialPaymentAmount] = useState<number | "">(
    "",
  );
  const [initialPaymentMethod, setInitialPaymentMethod] = useState("CASH");
  const [initialPaymentReference, setInitialPaymentReference] = useState("");

  const [orderItems, setOrderItems] = useState<any[]>([]);

  const [workers, setWorkers] = useState<any[]>([]);
  const [workerId, setWorkerId] = useState("");

  // Confirmation State
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [readyPayload, setReadyPayload] = useState<any>(null);

  // Fetch workers on mount
  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const res = await axios.get("/worker");
        if (res.data?.status === "success" && res.data.worker) {
          setWorkers(res.data.worker);
        }
      } catch (error) {
        console.error("Failed to fetch workers:", error);
      }
    };
    fetchWorkers();
  }, []);

  // Debounced shop search
  useEffect(() => {
    if (location.state?.presetShop) {
      const presetShop = location.state.presetShop;
      setSelectedShop(presetShop);
      setShopId(presetShop._id);
    }
  }, [location.state?.presetShop]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (shopSearch.trim()) {
        setSearchingShop(true);
        try {
          const res = await axios.get(`/shop?search=${shopSearch}&limit=10`);
          if (res.data?.shops) {
            setShopSearchOptions(res.data.shops);
          }
        } catch (error) {
          console.error(error);
        }
        setSearchingShop(false);
      } else {
        setShopSearchOptions([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [shopSearch]);

  const handleSelectShop = (shop: any) => {
    setSelectedShop(shop);
    setShopId(shop._id);
    setShopSearch("");
    setShopSearchOptions([]);
  };

  // Debounced product search
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (search.trim()) {
        setSearching(true);
        try {
          const res = await axios.get(`/product?search=${search}&limit=10`);
          if (res.data?.products) {
            setProductSearchOptions(res.data.products);
          }
        } catch (error) {
          console.error(error);
        }
        setSearching(false);
      } else {
        setProductSearchOptions([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const addProductToOrder = (product: any) => {
    // Check if already in list
    if (orderItems.some((item) => item.product._id === product._id)) {
      toast.error("Product already added, please increase its quantity.");
      return;
    }

    const newItem = {
      product,
      quantity: 1,
      free: 0,
      discount: 0,
    };
    setOrderItems([...orderItems, newItem]);
    setSearch("");
    setProductSearchOptions([]);
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...orderItems];
    newItems[index][field] = value;
    setOrderItems(newItems);
  };

  const removeItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  // Calculations
  const calculations = useMemo(() => {
    let subTotal = 0;
    let totalGST = 0;

    const items = orderItems.map((item) => {
      const q = item.quantity || 0;
      const sp = item.product.sellingPrice || 0;
      const cgst = item.product.CGST || 0;
      const sgst = item.product.SGST || 0;
      const discount = item.discount || 0;

      const totalTaxPercent = cgst + sgst;

      const base = sp * q;
      const priceBeforeTax = base - (base * discount) / 100;

      const taxAmount = (priceBeforeTax * totalTaxPercent) / 100;
      const totalAmount = priceBeforeTax + taxAmount;

      subTotal += priceBeforeTax;
      totalGST += taxAmount;

      return {
        ...item,
        netPrice: priceBeforeTax,
        taxAmount,
        totalAmount,
      };
    });

    const grandTotalUnrounded = subTotal + totalGST;
    const grandTotal = Math.round(grandTotalUnrounded);
    const roundOff = grandTotal - grandTotalUnrounded;

    return {
      items,
      subTotal,
      totalGST,
      grandTotal,
      roundOff,
    };
  }, [orderItems]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!shopId) return toast.error("Please select a shop/customer.");
    if (!workerId || workerId === "none")
      return toast.error("Please assign a worker to this order.");
    if (orderItems.length === 0)
      return toast.error("Please add at least one product.");
    if (orderItems.some((i) => !i.quantity || Number(i.quantity) <= 0))
      return toast.error("Quantities must be greater than 0");

    // Verify Stock Availability
    for (const item of orderItems) {
      const totalQty = Number(item.quantity || 0) + Number(item.free || 0);
      if (totalQty > Number(item.product.stock || 0)) {
        return toast.error(
          `Stock Alert: ${item.product.name} (Need: ${totalQty}, Available: ${item.product.stock || 0})`,
        );
      }
    }

    const orderedProducts = calculations.items.map((item) => ({
      productId: item.product._id,
      product: {
        name: item.product.name,
        costPrice: Number(item.product.costPrice) || 0,
        sellingPrice: Number(item.product.sellingPrice) || 0,
        MRP: Number(item.product.MRP) || 0,
        HSN: item.product.HSN,
        CGST: item.product.CGST,
        SGST: item.product.SGST,
        unit: item.product.unit,
      },
      quantity: Number(item.quantity),
      free: Number(item.free) || 0,
      discount: Number(item.discount) || 0,
      netPrice: item.netPrice,
      taxAmount: item.taxAmount,
      totalAmount: item.totalAmount,
    }));

    const payload: any = {
      shopId,
      workerId,
      paymentMode,
      orderedProducts,
    };

    if (
      paymentMode === "CREDIT" &&
      initialPaymentAmount &&
      initialPaymentAmount > 0
    ) {
      payload.initialPayment = {
        amount: Number(initialPaymentAmount),
        method: initialPaymentMethod,
        reference: initialPaymentReference,
      };
    }

    setReadyPayload(payload);
    setIsConfirmDialogOpen(true);
  };

  const executeOrder = async () => {
    if (!readyPayload) return;

    try {
      const res = await dispatch(createOrder(readyPayload));
      toast.success("Order created successfully!");
      setIsConfirmDialogOpen(false);
      console.log(res);
      if (res?.data?.data?._id) {
        navigate(`/orders/${res.data.data._id}`, {
          state: { status: "success", message: "Order created successfully!" },
        });
      }
    } catch (error: any) {
      console.log("Create order error:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to create order. See console.",
      );
      setIsConfirmDialogOpen(false);
    }
  };

  return (
    <HomeLayout>
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex sm:items-center justify-between gap-3 flex-col sm:flex-row">
          <div className="flex flex-col gap-0.5">
            <BreadCrumbs
              breadcrumbs={[
                { label: "Orders Ledger", link: "/orders" },
                { label: "Point of Sale", link: "/orders/create" },
              ]}
            />
            <p className="text-xs text-muted-foreground">
              Dynamic order workspace for creating structured invoices quickly.
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col lg:flex-row gap-5 items-start pb-10"
      >
        {/* Left Canvas: Product Area (70%) */}
        <div className="w-full lg:w-[68%] space-y-5">
          {/* Awesome Product Search Hero Component */}
          <div className="relative">
            <div className="relative flex items-center bg-card rounded-xl border px-4 py-2 h-[52px]">
              <Search className="mr-3 h-5 w-5 text-muted-foreground" />
              <input
                placeholder="Scan barcode, type product name, or enter HSN..."
                className="flex h-full w-full bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground/60 placeholder:font-normal disabled:cursor-not-allowed disabled:opacity-50"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {searching && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                  <div className="h-3.5 w-3.5 rounded-full border-2 border-primary/80 border-t-transparent animate-spin"></div>
                  <span className="text-[11px] text-muted-foreground font-medium">
                    Searching...
                  </span>
                </div>
              )}
            </div>

            {/* Search Dropdown Popover */}
            {productSearchOptions.length > 0 && (
              <div className="absolute top-[60px] left-0 right-0 z-50 bg-card border rounded-xl shadow-md max-h-[350px] overflow-auto">
                <div className="p-1.5 space-y-1">
                  {productSearchOptions.map((p) => (
                    <div
                      key={p._id}
                      className="px-3 py-2 rounded-lg hover:bg-accent hover:text-accent-foreground cursor-pointer flex justify-between items-center group/item"
                      onClick={() => addProductToOrder(p)}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 bg-primary/10 text-primary rounded-md flex items-center justify-center shrink-0">
                          <Box className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-sm group-hover/item:text-primary transition-colors">
                            {p.name}
                          </div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">
                            HSN: {p.HSN} | Instock: {p.stock} {p.unit}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="text-sm font-bold">
                          ₹{formatCurrency(p.sellingPrice)}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          MRP ₹{p.MRP}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Cart Table Area */}
          <div className="bg-card rounded-xl border shadow-sm overflow-hidden flex flex-col min-h-[350px]">
            <div className="bg-muted/30 px-4 py-3 border-b flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold text-sm tracking-tight">
                Shopping Cart
              </h3>
              <Badge
                variant="secondary"
                className="ml-2 font-mono text-[10px] py-0"
              >
                {orderItems.length} items
              </Badge>
            </div>

            {orderItems.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-muted-foreground h-full min-h-[250px]">
                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-3">
                  <Box className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <p className="text-base font-medium text-foreground">
                  Your cart is empty
                </p>
                <p className="mt-1 text-xs max-w-xs">
                  Use the search bar above to find and add products to this
                  invoice.
                </p>
              </div>
            ) : (
              <div className="flex-1 overflow-x-auto">
                <Table className="min-w-[750px]">
                  <TableHeader>
                    <TableRow className="bg-muted/10 hover:bg-muted/10 border-b">
                      <TableHead className="py-2.5 pl-4 text-xs font-semibold h-auto">
                        Product Description
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-right w-[80px] h-auto">
                        Rate (₹)
                      </TableHead>
                      <TableHead className="text-xs font-semibold w-[75px] text-center h-auto">
                        Qty
                      </TableHead>
                      <TableHead className="text-xs font-semibold w-[75px] text-center h-auto">
                        Free
                      </TableHead>
                      <TableHead className="text-xs font-semibold w-[80px] text-center h-auto">
                        Disc (%)
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-right h-auto">
                        Net Price
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-right h-auto">
                        Tax
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-right pr-4 h-auto">
                        Total
                      </TableHead>
                      <TableHead className="w-[40px] h-auto"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {calculations.items.map((item, index) => (
                      <TableRow
                        key={item.product._id}
                        className="group/row hover:bg-accent/40"
                      >
                        <TableCell className="pl-4 py-2">
                          <div className="font-semibold text-sm">
                            {item.product.name}
                          </div>
                          <div className="text-[10px] text-muted-foreground mt-1 font-medium flex items-center gap-1.5 border border-muted/50 w-fit px-1.5 py-0.5 rounded-md bg-muted/20">
                            <span>
                              {item.product.CGST + item.product.SGST}% GST
                            </span>
                            <span className="opacity-50 text-[8px]">•</span>
                            <span
                              className={`${Number(item.quantity || 0) + Number(item.free || 0) > Number(item.product.stock || 0) ? "text-destructive font-bold" : ""}`}
                            >
                              Stock: {item.product.stock || 0}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-xs font-medium text-muted-foreground">
                          {formatCurrency(item.product.sellingPrice)}
                        </TableCell>
                        <TableCell className="p-1">
                          <Input
                            type="number"
                            min="1"
                            className="h-8 w-full text-xs text-center font-medium bg-background shadow-none focus-visible:ring-1 focus-visible:border-primary transition-all rounded-md px-1"
                            value={item.quantity}
                            onChange={(e) =>
                              updateItem(index, "quantity", e.target.value)
                            }
                          />
                        </TableCell>
                        <TableCell className="p-1">
                          <Input
                            type="number"
                            min="0"
                            className="h-8 w-full text-xs text-center bg-background shadow-none focus-visible:ring-1 transition-all rounded-md text-muted-foreground px-1"
                            value={item.free}
                            onChange={(e) =>
                              updateItem(index, "free", e.target.value)
                            }
                          />
                        </TableCell>
                        <TableCell className="p-1">
                          <div className="relative">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-[10px] font-semibold">
                              %
                            </span>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              className="h-8 w-full pl-5 text-xs text-right font-medium text-green-600 bg-background shadow-none focus-visible:ring-1 transition-all rounded-md px-2"
                              value={item.discount}
                              onChange={(e) =>
                                updateItem(index, "discount", e.target.value)
                              }
                            />
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-xs font-medium tabular-nums px-2">
                          {formatCurrency(item.netPrice)}
                        </TableCell>
                        <TableCell className="text-right text-[11px] text-muted-foreground tabular-nums px-2">
                          {formatCurrency(item.taxAmount)}
                        </TableCell>
                        <TableCell className="text-right pr-4 text-sm font-bold tabular-nums">
                          ₹{formatCurrency(item.totalAmount)}
                        </TableCell>
                        <TableCell className="pr-2 py-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive shrink-0 h-7 w-7"
                            onClick={() => removeItem(index)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: Checkout & Customer (32% width, Sticky) */}
        <div className="w-full lg:w-[32%] sticky top-6 flex flex-col gap-5">
          {/* Customer Selection Card */}
          <Card className="border shadow-sm rounded-xl">
            <CardHeader className="bg-muted/20 border-b pb-3 pt-4 px-4">
              <CardTitle className="text-sm flex items-center gap-1.5">
                <UserIcon className="h-3.5 w-3.5 text-primary" />
                Billing Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-4">
              {selectedShop ? (
                <div className="flex flex-col relative border bg-muted/5 rounded-xl p-3">
                  <div className="flex justify-between items-start mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 bg-primary/20 text-primary rounded-full flex items-center justify-center font-bold text-[10px] ring-2 ring-background">
                        {selectedShop.shopName.charAt(0).toUpperCase()}
                      </div>
                      <h3 className="font-bold text-sm text-foreground leading-none">
                        {selectedShop.shopName}
                      </h3>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        setSelectedShop(null);
                        setShopId("");
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="ml-9 space-y-0.5 mt-0.5">
                    <div className="text-xs font-medium">
                      {selectedShop.ownerName}{" "}
                      <span className="text-muted-foreground mx-1">•</span>{" "}
                      <span className="tabular-nums opacity-90">
                        {selectedShop.mobile}
                      </span>
                    </div>
                    <div className="text-[11px] text-muted-foreground flex leading-snug">
                      {selectedShop.address?.village},{" "}
                      {selectedShop.address?.district}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <Label className="uppercase text-[9px] tracking-wider text-muted-foreground font-bold mb-1.5 block">
                    SELECT CUSTOMER (*)
                  </Label>
                  <div className="flex items-center border rounded-lg px-2.5 h-10 w-full bg-background focus-within:ring-1 focus-within:ring-primary">
                    <Search className="mr-2 h-3.5 w-3.5 shrink-0 opacity-50" />
                    <input
                      placeholder="Search name or mobile..."
                      className="flex h-full w-full bg-transparent py-2 text-xs outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                      value={shopSearch}
                      onChange={(e) => setShopSearch(e.target.value)}
                    />
                    {searchingShop && (
                      <span className="opacity-50 text-[9px] font-medium uppercase tracking-wider">
                        Wait
                      </span>
                    )}
                  </div>
                  {shopSearchOptions.length > 0 && (
                    <div className="absolute top-12 left-0 right-0 z-100 bg-popover border rounded-xl shadow-md max-h-56 overflow-auto">
                      <div className="p-1 space-y-0.5">
                        {shopSearchOptions.map((s: any) => (
                          <div
                            key={s._id}
                            className="px-2.5 py-2 rounded-md hover:bg-accent cursor-pointer flex flex-col"
                            onClick={() => handleSelectShop(s)}
                          >
                            <div className="flex justify-between items-center w-full">
                              <span className="font-semibold text-xs">
                                {s.shopName}
                              </span>
                              <span className="text-[10px] font-mono">
                                {s.mobile}
                              </span>
                            </div>
                            <div className="text-[10px] text-muted-foreground mt-0.5 opacity-80">
                              {s.ownerName} • {s.address?.village}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Assigned Worker Card */}
          <Card className="border shadow-sm rounded-xl bg-card">
            <CardHeader className="border-b pb-3 pt-3.5 px-4 bg-muted/10">
              <CardTitle className="text-sm flex items-center gap-1.5">
                <UserCheck className="h-3.5 w-3.5" />
                Assigned Personnel
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground flex justify-between items-center">
                  <span>
                    Order Handled By{" "}
                    <span className="text-destructive font-bold">*</span>
                  </span>
                </Label>
                <Select value={workerId} onValueChange={setWorkerId}>
                  <SelectTrigger className="h-10 w-full bg-background font-medium focus:ring-1 focus:ring-primary shadow-sm">
                    <SelectValue placeholder="System requires an assigned worker..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value="none"
                      disabled
                      className="text-muted-foreground"
                    >
                      Select an active worker
                    </SelectItem>
                    {workers.map((w: any) => (
                      <SelectItem
                        key={w._id}
                        value={w._id}
                        className="font-semibold cursor-pointer"
                      >
                        {w.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Payment Details & Summary combined in one Premium Card */}
          <Card className="border overflow-hidden shadow-sm rounded-xl relative">
            <CardHeader className="border-b px-4 py-3.5 bg-muted/10">
              <CardTitle className="text-sm flex items-center gap-1.5">
                <CreditCard className="h-4 w-4" />
                Checkout Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-5">
              <div className="space-y-2">
                <Label className="uppercase text-[9px] tracking-wider text-muted-foreground font-bold">
                  PAYMENT TYPE
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={paymentMode === "CASH" ? "default" : "outline"}
                    className="h-9 text-xs"
                    onClick={() => setPaymentMode("CASH")}
                  >
                    Pay In Full
                  </Button>
                  <Button
                    type="button"
                    variant={paymentMode === "CREDIT" ? "default" : "outline"}
                    className="h-9 text-xs"
                    onClick={() => setPaymentMode("CREDIT")}
                  >
                    Credit / Pay Later
                  </Button>
                </div>
              </div>

              {paymentMode === "CREDIT" && (
                <div className="p-3.5 border rounded-xl bg-muted/5 space-y-3.5">
                  <div className="flex items-center justify-between border-b border-border/50 pb-1.5 mb-1.5">
                    <Label className="text-[11px] font-bold text-foreground">
                      Advanced Payment
                    </Label>
                    <Badge
                      variant="outline"
                      className="text-[9px] uppercase font-semibold py-0 leading-tight"
                    >
                      Optional
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] text-muted-foreground">
                      Amount Collected Setup (₹)
                    </Label>
                    <Input
                      type="number"
                      step="0.01"
                      className="h-8 text-sm font-semibold focus-visible:ring-indigo-500 shadow-none border-border"
                      placeholder="0.00"
                      value={initialPaymentAmount}
                      onChange={(e) =>
                        setInitialPaymentAmount(
                          e.target.value ? Number(e.target.value) : "",
                        )
                      }
                    />
                  </div>
                  {initialPaymentAmount !== "" &&
                    Number(initialPaymentAmount) > 0 && (
                      <div className="grid grid-cols-2 gap-2.5 pt-0.5">
                        <div className="space-y-1">
                          <Label className="text-[11px] text-muted-foreground">
                            Via
                          </Label>
                          <Select
                            value={initialPaymentMethod}
                            onValueChange={setInitialPaymentMethod}
                          >
                            <SelectTrigger className="h-8 text-[11px] font-semibold shadow-none">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="CASH">CASH</SelectItem>
                              <SelectItem value="UPI">UPI APP</SelectItem>
                              <SelectItem value="BANK">BANK / NEFT</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[11px] text-muted-foreground">
                            Ref No.
                          </Label>
                          <Input
                            placeholder="Ex: UTR123..."
                            className="h-8 text-[11px] shadow-none border-border"
                            value={initialPaymentReference}
                            onChange={(e) =>
                              setInitialPaymentReference(e.target.value)
                            }
                          />
                        </div>
                      </div>
                    )}
                </div>
              )}

              {/* Subtotal Breakdowns */}
              <div className="pt-1 space-y-2.5">
                <div className="flex justify-between items-center text-[13px] font-medium">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-mono">
                    ₹{formatCurrency(calculations.subTotal)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[13px] font-medium">
                  <span className="text-muted-foreground flex items-center gap-1">
                    GST Taxes{" "}
                    <Badge
                      variant="secondary"
                      className="h-3.5 text-[8px] px-1 ml-1 bg-muted"
                    >
                      auto
                    </Badge>
                  </span>
                  <span className="font-mono">
                    ₹{formatCurrency(calculations.totalGST)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[13px] font-medium border-b border-border/50 pb-3">
                  <span className="text-muted-foreground">Round Off</span>
                  <span className="font-mono">
                    {calculations.roundOff >= 0 ? "+" : ""}
                    {formatCurrency(calculations.roundOff)}
                  </span>
                </div>

                {/* Beautiful Grand Total Container */}
                <div className="bg-muted/50 -mx-5 px-5 py-3 mt-1.5 border-y">
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-[11px] uppercase font-bold tracking-wider mb-0.5">
                        Grand Total
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        INR (₹) incl. taxes
                      </div>
                    </div>
                    <div className="text-2xl font-extrabold text-foreground tracking-tight flex items-start gap-0.5">
                      <span className="text-sm font-bold mt-1">₹</span>
                      {formatCurrency(calculations.grandTotal)}
                    </div>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 mt-4 text-sm font-bold"
                disabled={submitting || orderItems.length === 0}
              >
                {submitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-3.5 w-3.5 rounded-full border-2 border-background border-t-transparent animate-spin"></div>
                    Finalizing Invoice...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    Complete Order
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Final Invoice</DialogTitle>
            <DialogDescription className="pt-2 text-sm">
              Are you completely sure you want to finalize this order? Once
              generated, this invoice and its stock reductions cannot be
              altered.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-muted/30 p-3 rounded-lg border flex flex-col gap-1.5 mt-2 mb-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Customer:</span>
              <span className="font-semibold">{selectedShop?.shopName}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Items:</span>
              <span className="font-semibold">
                {orderItems.length} Products
              </span>
            </div>
            <div className="flex justify-between text-xs text-primary">
              <span className="font-bold">Grand Total:</span>
              <span className="font-bold">
                ₹{formatCurrency(calculations.grandTotal)}
              </span>
            </div>
          </div>
          <DialogFooter className="mt-2">
            <Button
              variant="outline"
              onClick={() => setIsConfirmDialogOpen(false)}
            >
              Review Again
            </Button>
            <Button onClick={executeOrder} disabled={submitting}>
              {submitting ? "Finalizing..." : "Yes, Generate Invoice"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </HomeLayout>
  );
}
