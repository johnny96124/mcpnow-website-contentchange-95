
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Search, Server } from "lucide-react";
import { hosts } from "@/data/mockData";
import { StatusIndicator } from "@/components/status/StatusIndicator";

interface HostConfigGuideDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profileName: string;
}

export function HostConfigGuideDialog({
  open,
  onOpenChange,
  profileName,
}: HostConfigGuideDialogProps) {
  const [availableHosts, setAvailableHosts] = useState(hosts.filter(host => 
    !host.profileId && host.connectionStatus === "disconnected"
  ));
  const navigate = useNavigate();
  
  // Simulate fetching available hosts when the dialog opens
  useEffect(() => {
    if (open) {
      // Filter hosts that don't have a profile assigned yet and are disconnected
      setAvailableHosts(hosts.filter(host => 
        !host.profileId && host.connectionStatus === "disconnected"
      ));
    }
  }, [open]);
  
  const handleGoToHostsPage = () => {
    // Close the dialog and navigate to hosts page
    onOpenChange(false);
    navigate("/hosts");
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Configure Hosts</DialogTitle>
          <DialogDescription>
            Your instance has been added to profile <span className="font-medium">{profileName}</span>.
            To start using it, you'll need to configure a host.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="space-y-3 text-sm">
            <p>
              Hosts are computers or devices where your server runs. To use your instance with the profile,
              you need to configure a host to use this profile.
            </p>
            <p>
              You can:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Configure an existing host to use your profile</li>
              <li>Add a new host and configure it</li>
              <li>Scan for available hosts on your network</li>
            </ul>
          </div>
          
          {availableHosts.length > 0 && (
            <div className="space-y-3 border rounded-md p-4 bg-muted/20">
              <h3 className="font-medium">Available Hosts</h3>
              <div className="space-y-2">
                {availableHosts.slice(0, 3).map((host) => (
                  <div key={host.id} className="flex items-center justify-between p-2 border rounded-md bg-background">
                    <div className="flex items-center gap-2">
                      <Server className="h-4 w-4 text-muted-foreground" />
                      <span>{host.name}</span>
                    </div>
                    <StatusIndicator status="disconnected" />
                  </div>
                ))}
                {availableHosts.length > 3 && (
                  <div className="text-sm text-muted-foreground text-center">
                    +{availableHosts.length - 3} more hosts available
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            I'll do this later
          </Button>
          <Button onClick={handleGoToHostsPage}>
            Go to Hosts Page
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
