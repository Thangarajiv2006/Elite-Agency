import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useSelector } from "react-redux";
import type { RootState } from "@/reducers";
import { useNavigate } from "react-router-dom";
import { Input } from "../ui/input";

const WorkerTable = () => {
  const worker = useSelector((state: RootState) => state.worker);
  const nav = useNavigate();
  const [search, setSearch] = useState<string>("");

  const filteredWorker = worker.filter((item) => {
    return (
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase()) ||
      item.phone.toString().includes(search.toLowerCase()) ||
      item.address?.plotNo?.toLowerCase().includes(search.toLowerCase()) ||
      item.address?.street?.toLowerCase().includes(search.toLowerCase()) ||
      item.address?.village?.toLowerCase().includes(search.toLowerCase()) ||
      item.address?.district?.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div>
      <div className="flex justify-end">
        <Input
          placeholder="Search workers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/4"
        />
      </div>
      <Table className="border rounded-lg  overflow-hidden shadow-sm mt-2">
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>S.No</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Mobile</TableHead>
            <TableHead>Plot No</TableHead>
            <TableHead>Street</TableHead>
            <TableHead>Village</TableHead>
            <TableHead>District</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredWorker.length ? (
            filteredWorker.map((item, index) => (
              <TableRow
                onClick={() => nav(`/workers/${item._id}`)}
                key={item._id}
                className="cursor-pointer"
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.email || "N/A"}</TableCell>
                <TableCell>{item.phone}</TableCell>
                <TableCell>{item.address?.plotNo}</TableCell>
                <TableCell>{item.address?.street}</TableCell>
                <TableCell>{item.address?.village}</TableCell>
                <TableCell>{item.address?.district}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center">
                No workers found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default WorkerTable;
