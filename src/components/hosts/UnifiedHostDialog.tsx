
import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, Plus, Check } from "lucide-react";
import { type Host } from "@/data/mockData";

interface UnifiedHostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddHosts: (hosts: Host[]) => void;
}

export function UnifiedHostDialog({ open, onOpenChange, onAddHosts }: UnifiedHostDialogProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedHosts, setScannedHosts] = useState<Host[]>([]);
  const [selectedHosts, setSelectedHosts] = useState<string[]>([]);
  const { toast } = useToast();

  // Scan automatically when the dialog opens
  useEffect(() => {
    if (open && !isScanning && scannedHosts.length === 0) {
      handleScanForHosts();
    }
  }, [open]);

  const handleScanForHosts = () => {
    if (isScanning) return;
    
    setIsScanning(true);
    
    // Simulate scanning with minimal delay
    setTimeout(() => {
      const mockHosts: Host[] = [
        {
          id: `host-${Date.now()}-1`,
          name: "Local Development Host",
          icon: "💻",
          configPath: "/Users/dev/.mcp/hosts/local-dev.json",
          configStatus: "configured",
          connectionStatus: "connected"
        },
        {
          id: `host-${Date.now()}-2`,
          name: "Test Environment",
          icon: "🧪",
          configPath: "/Users/dev/.mcp/hosts/test-env.json",
          configStatus: "configured",
          connectionStatus: "connected"
        },
        {
          id: `host-${Date.now()}-3`,
          name: "Production Server",
          icon: "🚀",
          configPath: "/Users/dev/.mcp/hosts/prod.json",
          configStatus: "configured",
          connectionStatus: "connected"
        }
      ];
      
      setScannedHosts(mockHosts);
      setIsScanning(false);
    }, 500);
  };

  const toggleSelectAll = () => {
    if (selectedHosts.length === scannedHosts.length) {
      setSelectedHosts([]);
    } else {
      setSelectedHosts(scannedHosts.map(host => host.id));
    }
  };

  const handleConfirmScannedHosts = () => {
    const hostsToAdd = scannedHosts
      .filter(host => selectedHosts.includes(host.id))
      .map(host => ({
        ...host,
        profileId: `profile-${Date.now()}-${host.id}`,
        defaultProfileName: `${host.name} Default`
      }));

    if (hostsToAdd.length === 0) {
      toast({
        title: "No hosts selected",
        description: "Please select at least one host to add",
        variant: "destructive"
      });
      return;
    }

    onAddHosts(hostsToAdd);
    handleDialogOpenChange(false);
  };

  const handleAddHostManually = () => {
    handleDialogOpenChange(false);
    // Trigger the manual host dialog via custom event
    setTimeout(() => {
      document.dispatchEvent(new CustomEvent('openManualHostDialog'));
    }, 100);
  };

  // Reset state when closing the dialog
  const handleDialogOpenChange = (newOpenState: boolean) => {
    if (!newOpenState) {
      setScannedHosts([]);
      setSelectedHosts([]);
      setIsScanning(false);
    }
    onOpenChange(newOpenState);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Discovered Hosts</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {isScanning ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="mt-2 text-sm text-muted-foreground">Scanning for hosts...</p>
            </div>
          ) : (
            <>
              <div className="text-sm text-muted-foreground mb-4">
                Below are the hosts discovered on your local network:
              </div>
              
              {scannedHosts.length > 0 ? (
                <div className="space-y-2">
                  {scannedHosts.length > 1 && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={toggleSelectAll}
                      className="w-full mb-2"
                    >
                      {selectedHosts.length === scannedHosts.length ? 'Deselect All' : 'Select All'}
                    </Button>
                  )}
                  {scannedHosts.map((host) => (
                    <div
                      key={host.id}
                      className={`flex items-start space-x-4 p-4 rounded-lg border cursor-pointer ${
                        selectedHosts.includes(host.id) ? 'border-primary bg-primary/5' : ''
                      }`}
                      onClick={() => {
                        setSelectedHosts(prev =>
                          prev.includes(host.id)
                            ? prev.filter(id => id !== host.id)
                            : [...prev, host.id]
                        );
                      }}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{host.icon}</span>
                          <p className="font-medium">{host.name}</p>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {host.configPath}
                        </p>
                      </div>
                      <div className="h-5 w-5 border rounded flex items-center justify-center">
                        {selectedHosts.includes(host.id) && <Check className="h-3 w-3 text-primary" />}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">No hosts found. Try scanning again.</p>
                  <Button variant="outline" onClick={handleScanForHosts} className="mt-4">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Scan Again
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={handleAddHostManually}
            className="sm:order-1 order-2 w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Host Manually
          </Button>
          <Button 
            onClick={handleConfirmScannedHosts}
            disabled={selectedHosts.length === 0}
            className="sm:order-2 order-1 w-full sm:w-auto"
          >
            Add Selected Hosts
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
