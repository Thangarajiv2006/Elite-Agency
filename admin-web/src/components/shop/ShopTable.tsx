import { useEffect, useState } from "react";
import type { RootState } from "@/reducers";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useNavigate } from "react-router-dom";
import DynamicPagination from "../Pagination";
import { getShops } from "@/actions/shop.action";
import { useAppDispatch } from "@/hooks";
import { useSelector } from "react-redux";
import { ComboboxBasic } from "../ComboBox";
import { shopConstants } from "@/constants/action.constant";

const ShopTable = () => {
  const { shops, district, village, currentPage, totalPages } = useSelector(
    (state: RootState) => state.shop,
  );
  const nav = useNavigate();
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [selectedVillage, setSelectedVillage] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const handlePageChange = (page: number) => {
    dispatch(
      getShops(
        page,
        shopConstants.QUERY_PER_PAGE,
        selectedVillage,
        selectedDistrict,
        debouncedSearch,
      ),
    );
  };

  useEffect(() => {
    dispatch(
      getShops(
        1,
        shopConstants.QUERY_PER_PAGE,
        selectedVillage,
        selectedDistrict,
        debouncedSearch,
      ),
    );
  }, [selectedVillage, selectedDistrict, debouncedSearch, dispatch]);
  return (
    <div>
      <div className="flex justify-end">
        <Input
          placeholder="Search by mobile, owner or shop name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/4"
        />
      </div>
      <Table className="border rounded-lg  overflow-hidden shadow-sm mt-2">
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>S.No</TableHead>
            <TableHead>Shop Name</TableHead>
            <TableHead>Owner Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>
              <ComboboxBasic
                className="w-[150px] text-xs"
                placeholder="Village"
                data={["All", ...village].map((item) => ({
                  label: item,
                  value: item,
                }))}
                handleChange={(val) => {
                  if (val === "All") {
                    setSelectedVillage("");
                  } else if (val !== null) {
                    setSelectedVillage(val);
                  }
                }}
              />
            </TableHead>
            <TableHead>
              <ComboboxBasic
                className="w-[150px] text-xs"
                placeholder="District"
                data={["All", ...district].map((item) => ({
                  label: item,
                  value: item,
                }))}
                handleChange={(val) => {
                  if (val === "All") {
                    setSelectedVillage("");
                    setSelectedDistrict("");
                  } else if (val !== null) {
                    setSelectedVillage("");
                    setSelectedDistrict(val);
                  }
                }}
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shops.length ? (
            shops.map((item, index) => (
              <TableRow
                onClick={() => nav(`/shops/${item._id}`)}
                key={item._id}
                className="cursor-pointer"
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.shopName}</TableCell>
                <TableCell>{item.ownerName}</TableCell>
                <TableCell>{item.phone}</TableCell>
                <TableCell>{item.address.village}</TableCell>
                <TableCell>{item.address.district}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={10} className="text-center">
                No Shops Found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <DynamicPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ShopTable;
