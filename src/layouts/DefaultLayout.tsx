
import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { MainSidebar } from "@/components/sidebar/MainSidebar";
import { AddInstanceDialog } from "@/components/servers/AddInstanceDialog";
import { useServerContext } from "@/context/ServerContext";
import { InstanceFormValues } from "@/components/servers/AddInstanceDialog";
import { toast } from "sonner";
import { 
  hasSeenOnboarding, 
  hasSeenHostsOnboarding,
  hasSeenServersOnboarding,
  hasSeenProfilesOnboarding
} from "@/utils/localStorage";

const DefaultLayout = () => {
  const { showAddInstanceDialog, selectedServer, closeAddInstanceDialog } = useServerContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  
  useEffect(() => {
    // Check main onboarding
    if (location.pathname === '/' && !hasSeenOnboarding()) {
      navigate('/new-user');
    }
    
    // Check hosts onboarding
    if (location.pathname === '/hosts' && !hasSeenHostsOnboarding()) {
      navigate('/hosts/new-user');
    }
    
    // Check servers onboarding
    if (location.pathname === '/servers' && !hasSeenServersOnboarding()) {
      navigate('/servers/new-user');
    }
    
    // Check profiles onboarding
    if (location.pathname === '/profiles' && !hasSeenProfilesOnboarding()) {
      navigate('/profiles/new-user');
    }
    
    setCheckingOnboarding(false);
  }, [navigate, location.pathname]);
  
  const handleCreateInstance = (data: InstanceFormValues) => {
    toast.success(`Instance created: ${data.name}`, {
      position: "top-right"
    });
    closeAddInstanceDialog();
  };
  
  if (checkingOnboarding) {
    return null; // Don't render anything while checking
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
