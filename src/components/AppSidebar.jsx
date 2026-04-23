// @ts-nocheck
import React, { useState } from "react";
import { VersionSwitcher } from "@/components/VersionSwitcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
  useSidebar
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { Drill, NotepadText, ReceiptText } from "lucide-react";

function AppSidebar({ ...props }) {
  const location = useLocation();
  const [expanded, setExpanded] = useState(null);
  const { setOpenMobile } = useSidebar();
  const owner = localStorage.getItem('owner') == 100;
  const handleExpand = (title) => {
    setExpanded(expanded === title ? null : title);
  };

  const navMain = [
    {
      title: "Menu",
      url: "#",
      items:
        owner
        ?[
        { title: "Product", url: "/app/product", icon: Drill, isActive: location.pathname === "/app/product-creation" },
        { title: "Rent", url: "/app/rent-list", icon: NotepadText, isActive: location.pathname === "/app/rent-list" },
        // {
        //   title: "Clinic Setup",
        //   url: "#",
        //   icon: PhysioClinics,
        //   Children: [
        //     { title: "Healthcare Providers", url: "/pages/physios-list", icon: Physios, isActive: location.pathname === "/pages/physios-list" },
        //     { title: "Clinics", url: "/pages/physio-clinics-list", icon: PhysioClinics, isActive: location.pathname === "/pages/physio-clinics-list" },
        //     { title: "Healthcare Admins", url: "/pages/admins-list", icon: HealthCareAdmin, isActive: location.pathname === "/pages/admins-list" },
        //   ],
        // },
      ]
      :
      [
        { title: "Rent", url: "/app/rent-creation", icon: NotepadText, isActive: location.pathname === "/app/rent-creation" },
        { title: "Order", url: "/app/order-history", icon: ReceiptText, isActive: location.pathname === "/app/order-history" },
      ]
    },
  ];

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher />
      </SidebarHeader>
      <SidebarContent>
        {navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupContent>
              <SidebarMenu className="gap-3">
                {group.items.map((item, i) => {
                  const IconComponent = item.icon;
                  return (
                    <React.Fragment key={i}>
                      <SidebarMenuItem className="px-[5px]">
                        <Link
                          to={item.url}
                          className={`flex gap-4 items-center px-4 py-2 rounded-md transition-all text-sm ${item.isActive ? "bg-primary-light text-primary" : "text-muted hover:bg-gray-100"
                            }`}
                          onClick={() => {
                            item.Children && handleExpand(item.title);
                            setOpenMobile(false);
                          }}
                        >
                          <IconComponent className={`w-5 h-5 transition-all ${item.isActive ? "text-primary" : "text-gray-500"}`} />
                          {item.title}
                        </Link>
                      </SidebarMenuItem>
                      {item.Children && expanded === item.title && (
                        <div className="ml-6">
                          {item.Children.map((child, j) => (
                            <SidebarMenuItem key={j} className="px-[5px]">
                              <Link
                                onClick={() => setOpenMobile(false)}
                                to={child.url}
                                className={`flex gap-4 items-center px-4 py-2 rounded-md transition-all text-sm ${child.isActive ? "bg-primary-light text-primary" : "text-muted hover:bg-gray-100"
                                  }`}
                              >
                                <child.icon className={`w-5 h-5 transition-all ${child.isActive ? "text-primary" : "text-gray-500"}`} />
                                {child.title}
                              </Link>
                            </SidebarMenuItem>
                          ))}
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        {/* <Link to="./notifications" className="flex gap-5 items-center px-4 py-2 rounded-md transition-all text-muted hover:bg-gray-100">
          <NotificationIcon />
          <span className="text-xs">Notifications</span>
        </Link> */}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export default AppSidebar;
