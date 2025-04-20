
import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { MainSidebar } from "@/components/sidebar/MainSidebar";
import { AddInstanceDialog } from "@/components/servers/AddInstanceDialog";
import { useServerContext } from "@/context/ServerContext";
import { InstanceFormValues } from "@/components/servers/AddInstanceDialog";
import { toast } from "sonner";
import { hasSeenOnboarding } from "@/utils/localStorage";

const DefaultLayout = () => {
  const { showAddInstanceDialog, selectedServer, closeAddInstanceDialog } = useServerContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  
  useEffect(() => {
    // Check if user needs to be redirected to onboarding
    if (location.pathname === '/' && !hasSeenOnboarding()) {
      navigate('/dashboard/new-user');
    }
    
    setCheckingOnboarding(false);
  }, [navigate, location.pathname]);
  
  const handleCreateInstance = (data: InstanceFormValues) => {
    toast.success(`Instance created: ${data.name}`, {
      position: "top-right",
      duration: 3000,
    });
    closeAddInstanceDialog();
  };
  
  if (checkingOnboarding) {
    return null;
  }
  
  return (
    <div className="flex h-screen bg-background">
      <MainSidebar />
      <div className="flex-1 overflow-auto">
        <div className="container py-6 h-full">
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
