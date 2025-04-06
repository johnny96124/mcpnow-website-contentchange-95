
import { Outlet } from "react-router-dom";
import { MainSidebar } from "@/components/sidebar/MainSidebar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DefaultLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => !prev);
  };

  return (
    <div className="flex min-h-screen">
      <div className={`relative transition-all duration-300 ease-in-out ${
        isSidebarCollapsed ? "w-[70px]" : "w-[250px]"
      }`}>
        <MainSidebar collapsed={isSidebarCollapsed} />
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute -right-3 top-5 rounded-full border shadow-sm bg-background z-10"
          onClick={toggleSidebar}
        >
          {isSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      <main className="flex-1 overflow-auto">
        <div className="container py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DefaultLayout;
