// @ts-nocheck

import { useState } from "react";
import { ChevronsUpDown, KeyRoundIcon, LayoutDashboardIcon, LogOutIcon } from "lucide-react";
import ProfileIcon from "../../src/assets/images/profile_icon.png";
import { Link, useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

export default function AppSwitcher() {
  const [selectedValue, setSelectedValue] = useState("Select an option");
  const navigate = useNavigate();
  
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground bg-white outline-none focus:outline-none focus:ring-0 ">
              <div className="rounded-lg h-12 w-12">
                <img src={ProfileIcon} className=" h-full w-full rounded-full object-contain" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">Murari Kunchapu</span>
                <span className="text-slate-600 text-xs">{selectedValue}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]" align="start">
            {/* Updating the selected value on click */}
            {/* <DropdownMenuItem
              onClick={() => {
                setSelectedValue("Home");
                navigate("/pages");
              }}
            >
              Home
            </DropdownMenuItem> */}
            <Link to="/pages/resetPassword">
              <DropdownMenuItem>
                <KeyRoundIcon />
                Change Password
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem
              onClick={() => {
                setSelectedValue("Dashboard Mode");
                localStorage.setItem("mode", "dashboard");
                window.location.reload();
              }}
            >
              <LayoutDashboardIcon />
              Dashboard Mode
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                localStorage.clear();
                navigate("/");
              }}
            >
              <LogOutIcon />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
