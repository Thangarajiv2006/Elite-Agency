import { useState, useEffect } from "react";
import type { RootState } from "@/reducers";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import DynamicPagination from "../Pagination";
import { getProducts, deleteProduct } from "@/actions/product.action";
import { useAppDispatch } from "@/hooks";
import { useSelector } from "react-redux";
import { productConstants } from "@/constants/action.constant";
import { Edit2, Trash2 } from "lucide-react";
import type { productState } from "@/constants/types";

interface ProductTableProps {
  categoryId: string;
  onEditClick: (product: productState["products"][0]) => void;
}

const ProductTable = ({ categoryId, onEditClick }: ProductTableProps) => {
  const { products, currentPage, totalPages } = useSelector(
    (state: RootState) => state.product,
  );
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [stockFilter, setStockFilter] = useState<string>("all");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const handlePageChange = (page: number) => {
    dispatch(
      getProducts(
        categoryId,
        page,
        productConstants.QUERY_PER_PAGE,
        debouncedSearch,
        stockFilter === "low" ? 20 : undefined,
      ),
    );
  };

  useEffect(() => {
    if (categoryId) {
      dispatch(
        getProducts(
          categoryId,
          1,
          productConstants.QUERY_PER_PAGE,
          debouncedSearch,
          stockFilter === "low" ? 20 : undefined,
        ),
      );
    }
  }, [categoryId, debouncedSearch, stockFilter, dispatch]);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };

  return (
    <div>
      <div className="flex justify-end items-center gap-3">
        <Select value={stockFilter} onValueChange={setStockFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Stock" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Products</SelectItem>
            <SelectItem value="low">Low Stock ({"<"} 20)</SelectItem>
          </SelectContent>
        </Select>
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm"
        />
      </div>
      <Table className="border rounded-lg overflow-hidden shadow-sm mt-2">
        <TableHeader className="bg-muted/50 w-full">
          <TableRow>
            <TableHead className="py-2 h-10">S.No</TableHead>
            <TableHead className="py-2 h-10">Name</TableHead>
            <TableHead className="py-2 h-10">Cost Price</TableHead>
            <TableHead className="py-2 h-10">Selling Price</TableHead>
            <TableHead className="py-2 h-10">MRP</TableHead>
            <TableHead className="py-2 h-10">Taxes (C+S)</TableHead>
            <TableHead className="py-2 h-10">Stock</TableHead>
            <TableHead className="py-2 h-10 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length ? (
            products.map((item, index) => (
              <TableRow key={item._id}>
                <TableCell className="py-0.5">
                  {index +
                    1 +
                    (currentPage - 1) * productConstants.QUERY_PER_PAGE}
                </TableCell>
                <TableCell className="py-0.5 font-medium">
                  {item.name}
                </TableCell>
                <TableCell className="py-0.5">₹{item.costPrice}</TableCell>
                <TableCell className="py-0.5">₹{item.sellingPrice}</TableCell>
                <TableCell className="py-0.5">
                  {item.MRP ? `₹${item.MRP}` : "-"}
                </TableCell>
                <TableCell className="py-0.5">
                  {item.CGST}% + {item.SGST}%
                </TableCell>
                <TableCell className="py-0.5">
                  {item.stock || 0} {item.unit}
                </TableCell>
                <TableCell className="py-0.5 text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditClick(item);
                      }}
                    >
                      <Edit2 className="h-4 w-4 text-primary" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => handleDelete(item._id!, e)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center h-24">
                No Products Found. Maybe add a new one?
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="mt-4">
        <DynamicPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default ProductTable;
