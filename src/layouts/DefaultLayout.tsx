
import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { MainSidebar } from "@/components/sidebar/MainSidebar";
import { AddInstanceDialog } from "@/components/servers/AddInstanceDialog";
import { useServerContext } from "@/context/ServerContext";
import { InstanceFormValues } from "@/components/servers/AddInstanceDialog";
import { toast } from "@/components/ui/use-toast";

interface DefaultLayoutProps {
  children: ReactNode;
}

const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  const { showAddInstanceDialog, selectedServer, closeAddInstanceDialog } = useServerContext();
  const location = useLocation();
  
  const handleCreateInstance = (data: InstanceFormValues) => {
    toast({
      title: `Instance created: ${data.name}`,
      description: "The instance was successfully created.",
      type: "success"
    });
    closeAddInstanceDialog();
  };
  
  return (
    <div className="flex h-screen bg-background">
      <MainSidebar />
      <div className="flex-1 overflow-auto">
        <div className="container py-6 h-full">
          {children}
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
