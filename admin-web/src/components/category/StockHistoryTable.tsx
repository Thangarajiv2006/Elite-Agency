import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import type { stockState } from "@/constants/types";
import { Spinner } from "@/components/ui/spinner";
import DynamicPagination from "@/components/Pagination";

interface Props {
  history: stockState["history"];
  historyLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onViewDetails: (entry: stockState["history"][0]) => void;
}

export const StockHistoryTable = ({
  history,
  historyLoading,
  currentPage,
  totalPages,
  onPageChange,
  onViewDetails,
}: Props) => {
  return (
    <div className="space-y-4">
      <div className="rounded-md border overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Tracking Date</TableHead>
              <TableHead>Impacted Items Grid</TableHead>
              <TableHead>Cumulative Injection</TableHead>
              <TableHead className="text-right">Actions Breakout</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {historyLoading && history.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <Spinner />
                </TableCell>
              </TableRow>
            ) : history.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  No tracking logs discovered returning valid payloads locally.
                </TableCell>
              </TableRow>
            ) : (
              history.map((entry) => {
                const totalAffected = entry.products.length;
                const totalQty = entry.products.reduce(
                  (acc, curr) => acc + curr.quantity,
                  0,
                );
                return (
                  <TableRow key={entry._id}>
                    <TableCell>
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </TableCell>

                    <TableCell>{totalAffected} unique items</TableCell>
                    <TableCell className="font-semibold">
                      +{totalQty} cumulative units added
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDetails(entry)}
                        className="px-4"
                      >
                        <Eye className="h-4 w-4 mr-2 text-primary" /> Details
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      {totalPages > 0 && (
        <DynamicPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};
