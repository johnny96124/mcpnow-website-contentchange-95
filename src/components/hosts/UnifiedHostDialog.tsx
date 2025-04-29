
import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, Plus, Check } from "lucide-react";
import { type Host } from "@/data/mockData";

interface UnifiedHostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddHosts: (hosts: Host[]) => void;
}

export function UnifiedHostDialog({ open, onOpenChange, onAddHosts }: UnifiedHostDialogProps) {
  const [mode, setMode] = useState<"scan" | "manual">("scan");
  const [isScanning, setIsScanning] = useState(false);
  const [scannedHosts, setScannedHosts] = useState<Host[]>([]);
  const [selectedHosts, setSelectedHosts] = useState<string[]>([]);
  const [manualHostName, setManualHostName] = useState("");
  const [configPath, setConfigPath] = useState("");
  const { toast } = useToast();

  // Only scan automatically when the dialog opens initially, not on every mode change
  useEffect(() => {
    if (open && mode === "scan" && scannedHosts.length === 0 && !isScanning) {
      handleScanForHosts();
    }
  }, [open]);

  const handleModeChange = (newMode: "scan" | "manual") => {
    // Only change the mode without triggering additional effects
    setMode(newMode);
  };

  const handleScanForHosts = () => {
    // Don't scan if already scanning
    if (isScanning) return;
    
    setIsScanning(true);
    
    // Use setTimeout to simulate network request but with minimal delay
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
      
      toast({
        title: "Hosts discovered",
        description: `Found ${mockHosts.length} hosts on your network.`,
      });
    }, 500); // Reduced from 2000ms to 500ms for faster response
  };

  const validateConfigPath = (path: string) => {
    return path.startsWith("/") && path.endsWith(".json");
  };

  const handleAddManualHost = () => {
    if (!manualHostName.trim()) {
      toast({
        title: "Invalid host name",
        description: "Please enter a valid host name",
        variant: "destructive"
      });
      return;
    }

    if (!validateConfigPath(configPath)) {
      toast({
        title: "Invalid config path",
        description: "Config path must start with / and end with .json",
        variant: "destructive"
      });
      return;
    }

    const newHost: Host = {
      id: `host-${Date.now()}`,
      name: manualHostName,
      icon: "🖥️",
      configPath,
      configStatus: "configured",
      connectionStatus: "connected",
      profileId: `profile-${Date.now()}`
    };

    const defaultProfileName = `${manualHostName} Default`;
    
    const newHostWithProfile = {
      ...newHost,
      defaultProfileName
    };

    onAddHosts([newHostWithProfile]);
    onOpenChange(false);
  };

  const handleConfirmScannedHosts = () => {
    const hostsToAdd = scannedHosts.filter(host => selectedHosts.includes(host.id))
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
    onOpenChange(false);
  };

  const toggleSelectAll = () => {
    if (selectedHosts.length === scannedHosts.length) {
      setSelectedHosts([]);
    } else {
      setSelectedHosts(scannedHosts.map(host => host.id));
    }
  };

  // Only reset state when closing the dialog, not on each render
  const handleDialogOpenChange = (newOpenState: boolean) => {
    if (!newOpenState) {
      // Only reset when closing
      setScannedHosts([]);
      setSelectedHosts([]);
      setManualHostName("");
      setConfigPath("");
      setMode("scan");
      setIsScanning(false);
    }
    onOpenChange(newOpenState);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Host</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <RadioGroup
            value={mode}
            onValueChange={handleModeChange}
            className="grid grid-cols-2 gap-4"
          >
            <div className={`relative rounded-lg border p-4 cursor-pointer ${mode === 'scan' ? 'border-primary bg-primary/5' : ''}`}>
              <RadioGroupItem value="scan" id="scan" className="absolute right-4 top-4" />
              <Label htmlFor="scan" className="font-medium mb-2 block">Scan for Hosts</Label>
              <p className="text-sm text-muted-foreground">
                Automatically discover hosts on your network
              </p>
            </div>
            <div className={`relative rounded-lg border p-4 cursor-pointer ${mode === 'manual' ? 'border-primary bg-primary/5' : ''}`}>
              <RadioGroupItem value="manual" id="manual" className="absolute right-4 top-4" />
              <Label htmlFor="manual" className="font-medium mb-2 block">Add Manually</Label>
              <p className="text-sm text-muted-foreground">
                Configure a host manually with custom settings
              </p>
            </div>
          </RadioGroup>

          {mode === "scan" ? (
            <div className="space-y-4">
              {isScanning ? (
                <div className="text-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary" />
                  <p className="mt-2 text-sm text-muted-foreground">Scanning for hosts...</p>
                </div>
              ) : (
                <>
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
                      <p className="text-sm text-muted-foreground">No hosts found. Try scanning again or add manually.</p>
                      <Button variant="outline" onClick={handleScanForHosts} className="mt-4">
                        Scan Again
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hostName">Host Name <span className="text-destructive">*</span></Label>
                <Input
                  id="hostName"
                  value={manualHostName}
                  onChange={(e) => setManualHostName(e.target.value)}
                  placeholder="Enter host name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="configPath">Config Path <span className="text-destructive">*</span></Label>
                <Input
                  id="configPath"
                  value={configPath}
                  onChange={(e) => setConfigPath(e.target.value)}
                  placeholder="/path/to/config.json"
                />
                <p className="text-xs text-muted-foreground">
                  Path must start with / and end with .json
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {mode === "scan" ? (
            <Button 
              onClick={handleConfirmScannedHosts}
              disabled={selectedHosts.length === 0}
            >
              Add Selected Hosts
            </Button>
          ) : (
            <Button onClick={handleAddManualHost}>
              <Plus className="h-4 w-4 mr-2" />
              Add Host
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
