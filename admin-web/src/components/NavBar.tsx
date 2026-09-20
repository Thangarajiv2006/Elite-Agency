"use client";

import * as React from "react";
import { ChartArea, FileBox, ShoppingCart, Store, User } from "lucide-react";

import { NavUser } from "@/components/NavBar/nav-user";
import { TeamSwitcher } from "@/components/NavBar/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import Categories from "./NavBar/Categories";

// This is sample data.

const Navbar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const { open, setOpen } = useSidebar();

  return (
    <Sidebar
      onClick={() => !open && setOpen(true)}
      collapsible="icon"
      {...props}
    >
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip={"Analytics"}>
              <Link to="/">
                <ChartArea />
                <span>Analytics</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <Categories />
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip={"Shops"}>
              <Link to="/shops">
                <Store />
                <span>Shops</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip={"Workers"}>
              <Link to="/workers">
                <User />
                <span>Workers</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip={"Update Stocks"}>
              <Link to="/update-stocks">
                <FileBox />
                <span>Update Stocks</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip={"Orders"}>
              <Link to="/orders">
                <ShoppingCart />
                <span>Orders</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
export default Navbar;
