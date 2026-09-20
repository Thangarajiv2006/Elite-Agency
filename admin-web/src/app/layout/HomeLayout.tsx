import { Navbar } from "@/components";
import { useTheme } from "@/components/ThemeProvider";
import { SidebarProvider } from "@/components/ui/sidebar";

import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast, Toaster } from "sonner";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.status === "success") {
      toast.success(location.state.message);
      location.state.status = "";
      location.state.message = "";
    } else if (location.state?.status === "error") {
      toast.error(location.state.message);
      location.state.status = "";
      location.state.message = "";
    }
  }, []);

  return (
    <SidebarProvider>
      <Navbar />
      <main className="flex-1 h-[100vh] overflow-y-auto p-4">
        {children}
        <Toaster richColors position="top-right" theme={theme} />
      </main>
    </SidebarProvider>
  );
};

export default HomeLayout;
