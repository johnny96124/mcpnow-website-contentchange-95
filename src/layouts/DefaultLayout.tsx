
import { Outlet } from "react-router-dom";
import { MainSidebar } from "@/components/sidebar/MainSidebar";
import { AddInstanceDialog } from "@/components/servers/AddInstanceDialog";
import { useServerContext } from "@/context/ServerContext";
import { InstanceFormValues } from "@/components/servers/AddInstanceDialog";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DefaultLayout = () => {
  const { showAddInstanceDialog, selectedServer, closeAddInstanceDialog } = useServerContext();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const handleCreateInstance = (data: InstanceFormValues) => {
    toast.success(`Instance created: ${data.name}`);
    closeAddInstanceDialog();
  };
  
  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };
  
  return (
    <div className="flex h-screen bg-background">
      <MainSidebar collapsed={sidebarCollapsed} />
      
      <div className="flex-1 overflow-auto">
        <div className="flex items-center p-2 border-b">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleSidebar}
            className="mr-2"
          >
            {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </Button>
          <div className="text-sm text-muted-foreground">
            MCP Now Dashboard
          </div>
        </div>
        <div className="container py-6 h-[calc(100%-53px)]">
          <Outlet />
        </div>
      </div>
      
      <AddInstanceDialog 
        open={showAddInstanceDialog} 
        onOpenChange={closeAddInstanceDialog} 
        serverDefinition={selectedServer} 
        onCreateInstance={handleCreateInstance}
      />
    </div>
  );
};

export default DefaultLayout;
