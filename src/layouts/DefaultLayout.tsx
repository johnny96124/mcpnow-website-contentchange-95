
import { Outlet } from "react-router-dom";
import { MainSidebar } from "@/components/sidebar/MainSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

const DefaultLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <MainSidebar />
        <SidebarInset>
          <main className="flex-1 overflow-auto">
            <div className="container py-6">
              <Outlet />
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DefaultLayout;
