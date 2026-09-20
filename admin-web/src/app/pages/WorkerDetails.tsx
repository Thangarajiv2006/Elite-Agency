import React, { useEffect, useRef, useState } from "react";
import HomeLayout from "../layout/HomeLayout";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import type { WorkerState } from "@/constants/types";
import type { RootState } from "@/reducers";
import { Sheet } from "@/components/ui/sheet";
import {
  WorkerDetailsHeader,
  WorkerDetailsMain,
  WorkerInput,
} from "@/components/workers";
import { useAppDispatch } from "@/hooks";
import { deleteWorker, updateWorker } from "@/actions/worker.action";
import { toast } from "sonner";

const WorkerDetails = () => {
  const { id } = useParams();
  const workers = useSelector((state: RootState) => state.worker);
  const worker = workers.find((worker: WorkerState) => worker._id === id);
  const [workerForm, setWorkerForm] = useState<WorkerState>(
    worker || {
      name: "",
      email: "",
      phone: "",
      address: {
        plotNo: "",
        street: "",
        village: "",
        district: "",
      },
    },
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (
      id === "plotNo" ||
      id === "street" ||
      id === "village" ||
      id === "district"
    ) {
      setWorkerForm((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [id]: value,
        },
      }));
    } else {
      setWorkerForm((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const handleUpdateWorker = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    const res = (await dispatch(
      updateWorker({ _id: id, ...workerForm }),
    )) as any;
    if (res?.data?.status === "success") {
      closeRef.current?.click();
      toast.success(res.data.message);
    } else if (res?.data?.status === "error") {
      toast.error(res.data.message);
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (isLoading) return;
    setIsLoading(true);
    const res = (await dispatch(deleteWorker(id!))) as any;
    if (res?.data?.status === "success") {
      navigate("/workers", {
        state: {
          status: "success",
          message: "Account Deleted Successfully",
        },
      });
    } else if (res?.data?.status === "error") {
      toast.error(res.data.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!worker)
      navigate("/workers", {
        state: {
          status: "error",
          message: "Worker not found",
        },
      });
  }, []);

  return (
    <HomeLayout>
      <Sheet>
        <div className="">
          <WorkerDetailsHeader
            isLoading={isLoading}
            handleDelete={handleDelete}
          />
          <WorkerDetailsMain />
        </div>
        <WorkerInput
          title="Update Worker"
          description="Update the worker details below. You can modify this information at any time."
          isLoading={isLoading}
          submitHandler={handleUpdateWorker}
          handleInputChange={handleInputChange}
          closeRef={closeRef}
          buttonTitle="Update Worker"
          defaultValues={worker}
        />
      </Sheet>
    </HomeLayout>
  );
};

export default WorkerDetails;
