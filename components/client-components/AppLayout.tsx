"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <div className="">
          <div className="flex h-14 items-center px-4 gap-4">
            <SidebarTrigger />
            <div className="flex-1" />
          </div>
        </div>
        <div className="flex-1">{children}</div>
      </main>
    </SidebarProvider>
  );
}

