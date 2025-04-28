import { Outlet } from "react-router-dom";
import AppSidebar from "./sidebar";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import { useAuth } from "@/context/auth-context";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "../ui/sidebar";

import { Separator } from "@radix-ui/react-dropdown-menu";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useAuth();

  if (!user) return null;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator aria-orientation="vertical" className="mr-2 h-4" />
          </div>
        </header>
        {/* <main className="w-full">
          <SidebarTrigger />
          <Outlet />
        </main> */}
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 ">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );

  return (
    <div className="flex w-screen h-screen bg-background">
      {/* Mobile sidebar toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 left-4 z-50 md:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "inset-y-0 left-0 z-40 w-64 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <AppSidebar />
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
