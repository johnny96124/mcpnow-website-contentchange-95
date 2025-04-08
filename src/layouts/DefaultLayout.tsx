
import { Outlet, Link } from "react-router-dom";
import { MainSidebar } from "@/components/sidebar/MainSidebar";
import { AddInstanceDialog } from "@/components/servers/AddInstanceDialog";
import { useServerContext } from "@/context/ServerContext";
import { InstanceFormValues } from "@/components/servers/AddInstanceDialog";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const DefaultLayout = () => {
  const { showAddInstanceDialog, selectedServer, closeAddInstanceDialog } = useServerContext();
  
  const handleCreateInstance = (data: InstanceFormValues) => {
    toast.success(`Instance created: ${data.name}`);
    closeAddInstanceDialog();
  };
  
  return (
    <div className="flex h-screen bg-background">
      <MainSidebar />
      <div className="flex-1 overflow-auto">
        <div className="container py-6 h-full">
          <div className="mb-6 flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link to="/">Dashboard</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/empty-dashboard">Empty Dashboard</Link>
            </Button>
          </div>
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
