import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { stockState } from "@/constants/types";

interface Props {
  entry: stockState["history"][0] | null;
  onClose: () => void;
}

export const StockHistoryDetails = ({ entry, onClose }: Props) => {
  if (!entry) return null;

  return (
    <Dialog open={!!entry} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto w-[95vw]">
        <DialogHeader className="mb-2 shrink-0">
          <DialogTitle>Stock Update Diagnostics Tracking</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-6 text-sm text-foreground bg-muted p-4 rounded-md border">
            <div>
              <span className="font-semibold uppercase text-xs text-muted-foreground block mb-0.5">
                Timestamp Context
              </span>
              <span className="font-medium tracking-tight">
                {new Date(entry.createdAt).toLocaleString()}
              </span>
            </div>
            <div>
              <span className="font-semibold uppercase text-xs text-muted-foreground block mb-0.5">
                Total Products Impacted
              </span>
              <span className="font-medium tracking-tight">
                {entry.products.length} mappings
              </span>
            </div>
          </div>
          <div className="border rounded-md shadow-sm">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Identified Product Link</TableHead>
                  <TableHead className="text-right">
                    Incremental Addition
                  </TableHead>
                  <TableHead className="text-right text-muted-foreground">
                    Original Cap
                  </TableHead>
                  <TableHead className="text-right font-medium">
                    Reconciled Cap
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entry.products.map((p, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">
                      {p.product.name}
                    </TableCell>
                    <TableCell className="text-right text-primary font-bold">
                      +{p.quantity}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {p.previousStock}
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {p.updatedStock}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
