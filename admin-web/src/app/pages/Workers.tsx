import React, { useEffect, useRef, useState } from "react";
import HomeLayout from "../layout/HomeLayout";
import { Empty } from "@/components";
import { User } from "lucide-react";
import { Sheet } from "@/components/ui/sheet";
import { useSelector } from "react-redux";
import type { RootState } from "@/reducers";
import { createWorker, getWorkers } from "@/actions/worker.action";
import { useAppDispatch } from "@/hooks";
import type { WorkerState } from "@/constants/types";
import { toast } from "sonner";
import { WorkerHeader, WorkerInput, WorkerTable } from "@/components/workers";

const Workers = () => {
  const worker = useSelector((state: RootState) => state.worker);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const hasFetched = useRef<boolean>(false);
  const [workerForm, setWorkerForm] = useState<WorkerState>({
    name: "",
    email: "",
    phone: "",
    address: {
      plotNo: "",
      street: "",
      village: "",
      district: "",
    },
  });
  const closeRef = useRef<HTMLButtonElement>(null);

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

  const refresh = async () => {
    if (isLoading) return;
    setIsLoading(true);
    await dispatch(getWorkers());
    setIsLoading(false);
  };

  const addWorker = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    const res: any = await dispatch(createWorker(workerForm));
    if (res.data.status === "success") {
      closeRef.current?.click();
      toast.success(res.data.message);
      setWorkerForm({
        name: "",
        email: "",
        phone: "",
        address: {
          plotNo: "",
          street: "",
          village: "",
          district: "",
        },
      });
    } else if (res.data.status === "error") {
      toast.error(res.data.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (worker.length === 0 && !hasFetched.current) {
      hasFetched.current = true;
      refresh();
    }
  }, []);

  return (
    <HomeLayout>
      <Sheet>
        <div className="">
          {!worker || worker.length === 0 ? (
            <div className="flex items-center justify-center h-[100vh]">
              <Empty
                title="No Workers Yet"
                description="You haven't created any workers yet. Get started by creating your first worker."
                icon={<User />}
                refresh={refresh}
                isLoading={isLoading}
              />
            </div>
          ) : (
            <div className="">
              <WorkerHeader refresh={refresh} isLoading={isLoading} />
              <div className="">
                <WorkerTable />
              </div>
            </div>
          )}
        </div>
        <WorkerInput
          title="New Worker"
          description="Fill in the details to register a new worker. You can update this information later if needed."
          isLoading={isLoading}
          submitHandler={addWorker}
          handleInputChange={handleInputChange}
          closeRef={closeRef}
          buttonTitle="Create Worker"
        />
      </Sheet>
    </HomeLayout>
  );
};

export default Workers;
