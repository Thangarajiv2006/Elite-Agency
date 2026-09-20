"use client";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { img } from "@/constants/asset";

export function TeamSwitcher() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <img src={img.logo} alt="Soda" className="size-5 rounded" />
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">Deoplexis</span>
            <span className="truncate text-xs">IT Services</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
