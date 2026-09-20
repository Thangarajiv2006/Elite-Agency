import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { addPayment } from "@/actions/order.action";
import { toast } from "sonner";
import { formatCurrency } from "@/utils/formatCurrency";

interface PaymentModalProps {
  orderId: string;
  dueAmount: number;
  isOpen: boolean;
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ orderId, dueAmount, isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const [amount, setAmount] = useState<number | "">("");
  const [method, setMethod] = useState<string>("CASH");
  const [reference, setReference] = useState<string>("");
  const [note, setNote] = useState<string>("");
  
  const { loading } = useAppSelector((state) => state.order);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (amount > dueAmount) {
      toast.error(`Amount cannot exceed the due amount of ₹${formatCurrency(dueAmount)}`);
      return;
    }

    try {
      await dispatch(addPayment(orderId, { 
        amount: Number(amount), 
        method, 
        reference, 
        note 
      }));
      toast.success("Payment added successfully");
      setAmount("");
      setReference("");
      setNote("");
      onClose();
    } catch (error) {
      // Error handled by action
      toast.error("Failed to add payment");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Payment</DialogTitle>
          <DialogDescription>
            Record a new payment for this order. Due amount: ₹{formatCurrency(dueAmount)}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                max={dueAmount}
                value={amount}
                onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : "")}
                className="col-span-3"
                placeholder="Enter amount"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="method" className="text-right">
                Method
              </Label>
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CASH">CASH</SelectItem>
                  <SelectItem value="UPI">UPI</SelectItem>
                  <SelectItem value="BANK">BANK</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reference" className="text-right">
                Reference
              </Label>
              <Input
                id="reference"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="col-span-3"
                placeholder="Transaction ID (optional)"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="note" className="text-right">
                Note
              </Label>
              <Input
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="col-span-3"
                placeholder="Remarks (optional)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !amount || amount > dueAmount}>
              {loading ? "Saving..." : "Save Payment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
