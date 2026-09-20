import React, { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { fetchAttendance, logAttendance } from "@/actions/attendance.action";
import { useParams } from "react-router-dom";
import { format, startOfMonth, endOfMonth, isSameDay } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, CheckCircle2, XCircle, Clock, Plane } from "lucide-react";
import { toast } from "sonner";

const statusConfig: any = {
  PRESENT: {
    label: "Present",
    color: "bg-green-500",
    hoverColor: "hover:bg-green-600",
    icon: <CheckCircle2 className="h-3 w-3" />,
    lightColor: "bg-green-100 text-green-700",
  },
  ABSENT: {
    label: "Absent",
    color: "bg-red-500",
    hoverColor: "hover:bg-red-600",
    icon: <XCircle className="h-3 w-3" />,
    lightColor: "bg-red-100 text-red-700",
  },
  HALF_DAY: {
    label: "Half Day",
    color: "bg-yellow-500",
    hoverColor: "hover:bg-yellow-600",
    icon: <Clock className="h-3 w-3" />,
    lightColor: "bg-yellow-100 text-yellow-700",
  },
  LEAVE: {
    label: "Leave",
    color: "bg-blue-500",
    hoverColor: "hover:bg-blue-600",
    icon: <Plane className="h-3 w-3" />,
    lightColor: "bg-blue-100 text-blue-700",
  },
};

export default function WorkerAttendance() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { logs, loading } = useAppSelector((state) => state.attendance);
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());

  useEffect(() => {
    if (id) {
      const month = selectedMonth.getMonth() + 1;
      const year = selectedMonth.getFullYear();
      dispatch(fetchAttendance(id, month, year));
    }
  }, [id, selectedMonth, dispatch]);

  const handleStatusChange = async (date: Date, status: string) => {
    if (!id) return;
    try {
      const res = await dispatch(
        logAttendance({
          workerId: id,
          date: format(date, "yyyy-MM-dd"),
          status,
        })
      ) as any;
      if (res?.data?.success) {
        toast.success(`Marked as ${statusConfig[status].label}`);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to log attendance");
    }
  };

  const dayModifiers = {
    present: logs
      .filter((l) => l.status === "PRESENT")
      .map((l) => new Date(l.date)),
    absent: logs
      .filter((l) => l.status === "ABSENT")
      .map((l) => new Date(l.date)),
    halfDay: logs
      .filter((l) => l.status === "HALF_DAY")
      .map((l) => new Date(l.date)),
    leave: logs
      .filter((l) => l.status === "LEAVE")
      .map((l) => new Date(l.date)),
  };

  const dayModifiersStyles = {
    present: { backgroundColor: "rgba(34, 197, 94, 0.2)", color: "#166534", fontWeight: "bold" },
    absent: { backgroundColor: "rgba(239, 68, 68, 0.2)", color: "#991b1b", fontWeight: "bold" },
    halfDay: { backgroundColor: "rgba(234, 179, 8, 0.2)", color: "#854d0e", fontWeight: "bold" },
    leave: { backgroundColor: "rgba(59, 130, 246, 0.2)", color: "#1e40af", fontWeight: "bold" },
  };

  const summary = {
    PRESENT: logs.filter((l) => l.status === "PRESENT").length,
    ABSENT: logs.filter((l) => l.status === "ABSENT").length,
    HALF_DAY: logs.filter((l) => l.status === "HALF_DAY").length,
    LEAVE: logs.filter((l) => l.status === "LEAVE").length,
  };

  return (
    <Card className="mt-4 shadow-sm border-muted">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-primary" />
            Worker Attendance - {format(selectedMonth, "MMMM yyyy")}
          </CardTitle>
          <div className="flex gap-2">
            {Object.entries(statusConfig).map(([key, config]: [string, any]) => (
              <div key={key} className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/30 border border-muted/50">
                <div className={`h-2 w-2 rounded-full ${config.color}`} />
                <span className="text-[10px] font-bold uppercase tracking-tight text-muted-foreground">
                  {config.label}: <span className="text-foreground ml-0.5">{summary[key as keyof typeof summary]}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-8 items-start justify-center">
          <div className="border rounded-xl p-4 bg-muted/10 shadow-inner">
            <Calendar
              mode="single"
              selected={undefined}
              onMonthChange={setSelectedMonth}
              month={selectedMonth}
              modifiers={dayModifiers}
              modifiersStyles={dayModifiersStyles}
              className="rounded-md"
              components={{
                DayButton: ({ day, modifiers, ...props }: any) => {
                  const dayLog = logs.find((l) => isSameDay(new Date(l.date), day.date));
                  const status = dayLog?.status;

                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const isFuture = day.date > today;

                  return (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild disabled={isFuture}>
                        <button
                          {...props}
                          disabled={isFuture}
                          className={`
                            relative h-10 w-10 p-0 font-normal aria-selected:opacity-100 rounded-lg transition-all flex items-center justify-center
                            ${isFuture ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}
                            ${!isFuture && status ? statusConfig[status].hoverColor + " hover:text-white" : !isFuture ? "hover:bg-muted" : ""}
                            ${status ? statusConfig[status].color + " text-white font-bold" : ""}
                          `}
                        >
                          <time dateTime={format(day.date, "yyyy-MM-dd")}>
                            {format(day.date, "d")}
                          </time>
                        </button>
                      </DropdownMenuTrigger>
                      {!isFuture && (
                        <DropdownMenuContent align="center" className="w-32">
                          <div className="px-2 py-1.5 text-[10px] font-bold text-muted-foreground uppercase border-b mb-1">
                            Set Status
                          </div>
                          {Object.entries(statusConfig).map(([key, config]: [string, any]) => (
                            <DropdownMenuItem
                              key={key}
                              onClick={() => handleStatusChange(day.date, key)}
                              className="flex items-center gap-2 cursor-pointer transition-colors"
                            >
                              <div className={`h-2 w-2 rounded-full ${config.color}`} />
                              <span className="text-xs font-medium">{config.label}</span>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      )}
                    </DropdownMenu>
                  );
                },
              }}
            />
          </div>

          <div className="flex-1 w-full space-y-4">
            <div className="bg-primary/5 rounded-xl p-5 border border-primary/10">
              <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-4">
                Monthly Performance Insights
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(statusConfig).map(([key, config]: [string, any]) => (
                  <div 
                    key={key} 
                    className={`p-4 rounded-xl border flex flex-col gap-1 transition-all hover:scale-[1.02] ${config.lightColor} border-current/20 shadow-sm`}
                  >
                    <div className="flex items-center justify-between">
                      {config.icon}
                      <span className="text-xs font-black opacity-30 tracking-tighter">
                        {Math.round((summary[key as keyof typeof summary] / 30) * 100)}%
                      </span>
                    </div>
                    <div className="text-xl font-black mt-1">
                      {summary[key as keyof typeof summary]}
                    </div>
                    <div className="text-[10px] font-extrabold uppercase opacity-80 letter-spacing-widest">
                      Total {config.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="text-[11px] text-muted-foreground bg-muted/20 p-4 rounded-xl italic border border-dashed border-muted-foreground/20">
              Tip: Click on any date in the calendar to log or update the worker's attendance status for that specific day.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
