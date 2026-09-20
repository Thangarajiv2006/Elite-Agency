import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import type { WorkerState } from "@/constants/types";
import type { RootState } from "@/reducers";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Mail, Phone, MapPin, User } from "lucide-react";
import WorkerOrdersList from "./WorkerOrdersList";
import WorkerAttendance from "./WorkerAttendance";

const WorkerDetailsMain = () => {
  const { id } = useParams();
  const workers = useSelector((state: RootState) => state.worker);
  const worker = workers.find((worker: WorkerState) => worker._id === id);

  if (!worker) return null;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card className=" transition-all hover:shadow-md">
          <CardHeader className=" border-b ">
            <CardTitle className="text-[13px] font-semibold flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-primary" /> Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 py-2 space-x-2 flex gap-5 justify-between ">
            <div className="flex flex-col">
              <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">
                Full Name
              </span>
              <span className="font-medium text-sm text-foreground/90">
                {worker.name}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">
                Phone Number
              </span>
              <div className="flex items-center gap-1.5 font-medium text-sm">
                <Phone className="h-3 w-3 text-primary/70" /> {worker.phone}
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">
                Email Address
              </span>
              <div className="flex items-center gap-1.5 font-medium text-sm">
                <Mail className="h-3 w-3 text-primary/70" />{" "}
                {worker.email || (
                  <span className="text-muted-foreground italic">N/A</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="">
          <CardHeader className=" border-b ">
            <CardTitle className="text-[13px] font-semibold flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-primary" /> Address Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col">
                <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">
                  Plot / Door No
                </span>
                <span className="font-medium text-sm text-foreground/90">
                  {worker.address?.plotNo || "N/A"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">
                  Street
                </span>
                <span className="font-medium text-sm text-foreground/90">
                  {worker.address?.street || "N/A"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">
                  Village
                </span>
                <span className="font-medium text-sm text-foreground/90">
                  {worker.address?.village || "N/A"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">
                  District
                </span>
                <span className="font-medium text-sm text-foreground/90">
                  {worker.address?.district || "N/A"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <WorkerAttendance />
      <WorkerOrdersList />
    </>
  );
};

export default WorkerDetailsMain;
