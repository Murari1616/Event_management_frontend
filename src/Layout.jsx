// @ts-nocheck
import React, { useEffect, useState } from "react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import AppSidebar from "./components/AppSidebar";
import { Bell, Calendar } from "lucide-react";
import { Outlet } from "react-router-dom";
import AppDropdown from "./components/AppDropdown";
import { initializeSocket } from "./lib/socket";
import { useToast } from "./hooks/use-toast";
import { subscribeUserToPush } from "./lib/pushNotification";
import UnApprovedRents from "./pages/rent/UnApprovedRents";

const Layout = () => {
  const [notificationCount, setNotificationCount] = useState(0);
  const [shake, setShake] = useState(false);
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const owner = localStorage.getItem('owner') == 100;
  const { toast } = useToast();
  useEffect(() => {
    initializeSocket((data) => {
      setNotificationCount((prev) => prev + 1);
      setShake(true);
      toast({
        title: 'Info',
        description: `${data.customerName} has placed a new order`,
        variant: "success"
      });
      setTimeout(() => setShake(false), 6000);
    });
    subscribeUserToPush();
  }, []);

  const handleClick = () => {
    setNotificationCount(0);
    setNotifOpen(true);
  };
  return (
    <div className="h-[99vh] w-full">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex justify-between sticky top-0 bg-white dark:bg-black dark:text-white dark:border-b dark:border-gray-600 h-14 shrink-0 items-center gap-2 px-4 font-poppins z-10">
            <div className="flex gap-3">
              <SidebarTrigger
              />
            </div>
            <div className="flex items-center gap-8 mr-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-[15px] w-[15px] text-blue" />
                <span className="text-xs font-poppins text-blue">{new Date().toDateString()}</span>
              </div>
              <div className="relative cursor-pointer" onClick={handleClick}>
                {owner &&
                  <Bell className={`w-[18px] h-[18px] text-blue ${shake ? "animate-shake" : ""}`} />
                }
                {notificationCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full shadow">
                    {notificationCount}
                  </span>
                )}
              </div>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 bg-gray-100 dark:bg-black dark:text-white">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
      {notifOpen &&
        <UnApprovedRents onClose={() => setNotifOpen(false)} />
      }
    </div>
  );
};

export default Layout;
