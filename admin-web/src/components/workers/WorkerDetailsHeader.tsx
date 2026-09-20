import type { WorkerState } from "@/constants/types";
import type { RootState } from "@/reducers";
import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import BreadCrumbs from "../BreadCrumbs";
import { SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { RefreshCcw } from "lucide-react";

const WorkerDetailsHeader = ({
  handleDelete,
  isLoading,
}: {
  handleDelete: () => void;
  isLoading: boolean;
}) => {
  const { id } = useParams();
  const workers = useSelector((state: RootState) => state.worker);
  const worker = workers.find((worker: WorkerState) => worker._id === id);
  const breadcrumbs = [
    { label: "Workers", link: "/workers" },
    { label: `${worker?.name}`, link: `/workers/${id}` },
  ];

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex sm:items-center justify-between gap-4 flex-col sm:flex-row">
        <div className="flex flex-col gap-1">
          <BreadCrumbs breadcrumbs={breadcrumbs} />
          <p className="text-sm text-muted-foreground">
            View and manage your worker details.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <SheetTrigger asChild>
            <Button disabled={isLoading}>Update</Button>
          </SheetTrigger>
          <Button
            disabled={isLoading}
            variant="destructive"
            onClick={handleDelete}
            className="flex items-center gap-2"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkerDetailsHeader;
