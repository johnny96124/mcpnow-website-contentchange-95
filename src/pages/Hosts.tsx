import { useState } from "react";
import { PlusCircle, Search, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { hosts } from "@/data/mockData";
import { ConfigFileDialog } from "@/components/hosts/ConfigFileDialog";
import { useToast } from "@/hooks/use-toast";
import { HostCard } from "@/components/hosts/HostCard";
import { HostSearch } from "@/components/hosts/HostSearch";
import { useConfigDialog } from "@/hooks/useConfigDialog";
import { useHostProfiles } from "@/hooks/useHostProfiles";
import { AddHostDialog } from "@/components/hosts/AddHostDialog";
import { ConnectionStatus, Host, profiles } from "@/data/mockData";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const mockJsonConfig = {
  "mcpServers": {
    "mcpnow": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/mcpnow",
        "http://localhost:8008/mcp"
      ]
    }
  }
};

const Hosts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [hostsList, setHostsList] = useState<Host[]>(hosts);
  const [addHostDialogOpen, setAddHostDialogOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [createConfigOpen, setCreateConfigOpen] = useState(false);
  const [updateConfigOpen, setUpdateConfigOpen] = useState(false);
  const [currentHostId, setCurrentHostId] = useState<string | null>(null);
  const [currentProfileId, setCurrentProfileId] = useState<string | null>(null);
  const [configPath, setConfigPath] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"create" | "update">("create");
  
  const { hostProfiles, handleProfileChange } = useHostProfiles();
  const { configDialog, openConfigDialog, setDialogOpen, resetConfigDialog } = useConfigDialog(mockJsonConfig);
  const { toast } = useToast();
  
  const filteredHosts = hostsList.filter(host => 
    host.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getProfileEndpoint = (profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    return profile ? profile.endpoint : null;
  };

  const handleOpenConfigDialog = (hostId: string) => {
    const host = hostsList.find(h => h.id === hostId);
    if (host && host.configPath) {
      const profileId = hostProfiles[host.id] || '';
      const profileEndpoint = getProfileEndpoint(profileId);
      openConfigDialog(hostId, host.configPath, profileEndpoint, host.needsUpdate);
    } else {
      toast({
        title: "No config file",
        description: "This host doesn't have a configuration file yet. Please create one first.",
        variant: "destructive"
      });
    }
  };
  
  const handleSaveConfig = (config: string) => {
    if (configDialog.hostId) {
      console.log(`Saving config for host ${configDialog.hostId}:`, config);
      
      setHostsList(prev => prev.map(host => 
        host.id === configDialog.hostId 
          ? { ...host, configStatus: 'configured', needsUpdate: false } 
          : host
      ));
      
      toast({
        title: "Configuration saved",
        description: `Config file saved to ${configDialog.configPath}`,
      });
      
      // Close the dialog and reset its state after successful save
      setTimeout(() => {
        resetConfigDialog();
      }, 300);
    }
  };
  
  const handleAddHost = (newHost: {
    name: string;
    configPath?: string;
    icon?: string;
    configStatus: "configured" | "misconfigured" | "unknown";
    connectionStatus: ConnectionStatus;
  }) => {
    const id = `host-${Date.now()}`;
    const host: Host = {
      id,
      ...newHost
    };
    
    setHostsList([...hostsList, host]);
    
    toast({
      title: "Host Added",
      description: `${newHost.name} has been added successfully`,
    });
    
    // Close the dialog completely
    setAddHostDialogOpen(false);
  };

  const handleCreateConfig = (hostId: string, profileId: string) => {
    const host = hostsList.find(h => h.id === hostId);
    
    if (host) {
      setCurrentHostId(hostId);
      setCurrentProfileId(profileId);
      
      if (host.configPath) {
        setConfigPath(host.configPath);
        setUpdateConfigOpen(true);
      } else {
        const defaultConfigPath = `/Users/user/.mcp/hosts/${host.name.toLowerCase().replace(/\s+/g, '-')}.json`;
        setConfigPath(defaultConfigPath);
        setCreateConfigOpen(true);
      }
    }
  };
  
  const showConfirmDialog = (action: "create" | "update") => {
    setConfirmAction(action);
    setConfirmDialogOpen(true);
    
    // Close the other dialogs to prevent stacking
    setCreateConfigOpen(false);
    setUpdateConfigOpen(false);
  };
  
  const handleConfirmCreateConfig = () => {
    setCreateConfigOpen(false);
    showConfirmDialog("create");
  };

  const handleConfirmUpdateConfig = () => {
    setUpdateConfigOpen(false);
    showConfirmDialog("update");
  };

  const handleConfirmAction = () => {
    if (currentHostId && currentProfileId) {
      setHostsList(prev => prev.map(host => 
        host.id === currentHostId 
          ? { 
              ...host, 
              configPath, 
              configStatus: 'configured',
              needsUpdate: false
            } 
          : host
      ));
      
      toast({
        title: confirmAction === "create" ? "Configuration created" : "Configuration updated",
        description: `Config file ${confirmAction === "create" ? "created" : "updated"} at ${configPath}`,
      });
      
      // Make sure to reset all dialog states and clear temporary data
      setConfirmDialogOpen(false);
      
      // Complete reset of all state variables
      setTimeout(() => {
        setCurrentHostId(null);
        setCurrentProfileId(null);
        setConfigPath("");
      }, 300);
    }
  };

  const handleScanForHosts = () => {
    setIsScanning(true);
    
    setTimeout(() => {
      const newHostId = `host-${Date.now()}`;
      const newHost: Host = {
        id: newHostId,
        name: "Local Host",
        icon: "💻",
        connectionStatus: "disconnected",
        configStatus: "unknown",
      };
      
      setHostsList(prevHosts => [...prevHosts, newHost]);
      setIsScanning(false);
      
      toast({
        title: "Host discovered",
        description: "A new local host has been found and added to your hosts list.",
      });
    }, 2500);
  };

  const generateDefaultConfig = (profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    
    if (!profile) return "{}";
    
    const defaultConfig = {
      mcpServers: {
        mcpnow: {
          command: "npx",
          args: [
            "-y",
            "@modelcontextprotocol/mcpnow",
            profile.endpoint
          ]
        }
      }
    };
    
    return JSON.stringify(defaultConfig, null, 2);
  };

  // Handle Cancel button in any dialog with proper state cleanup
  const handleCancelDialog = () => {
    // Close and reset all dialogs
    setCreateConfigOpen(false);
    setUpdateConfigOpen(false);
    setConfirmDialogOpen(false);
    
    // Complete reset of all state variables with a delay
    setTimeout(() => {
      setCurrentHostId(null);
      setCurrentProfileId(null);
      setConfigPath("");
    }, 300);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hosts</h1>
          <p className="text-muted-foreground">
            Manage host connections and profile associations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleScanForHosts} disabled={isScanning}>
            {isScanning ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Scan for Hosts
              </>
            )}
          </Button>
          <Button onClick={() => setAddHostDialogOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Host Manually
          </Button>
        </div>
      </div>
      
      <HostSearch 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery} 
      />
      
      <div className="grid gap-6 md:grid-cols-2">
        {filteredHosts.map(host => (
          <HostCard
            key={host.id}
            host={host}
            profileId={hostProfiles[host.id] || ''}
            onProfileChange={handleProfileChange}
            onOpenConfigDialog={handleOpenConfigDialog}
            onCreateConfig={handleCreateConfig}
          />
        ))}
        
        {isScanning && (
          <div className="border rounded-lg overflow-hidden shadow-sm">
            <div className="bg-muted/50 p-6 pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-6 w-32" />
                </div>
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-20 w-full" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-1/2" />
                  <Skeleton className="h-9 w-1/2" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <Dialog open={createConfigOpen} onOpenChange={(open) => {
        if (!open) handleCancelDialog();
        else setCreateConfigOpen(open);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Configuration File</DialogTitle>
            <DialogDescription>
              Specify the location where the host configuration file will be created.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="configPath">Configuration File Path</Label>
              <Textarea 
                id="configPath"
                value={configPath}
                onChange={(e) => setConfigPath(e.target.value)}
                rows={2}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                This is the location where the configuration file will be saved.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label>Configuration Preview</Label>
              <pre className="bg-muted p-2 rounded-md text-xs overflow-auto max-h-36">
                {currentProfileId ? generateDefaultConfig(currentProfileId) : "{}"}
              </pre>
              <p className="text-xs text-muted-foreground">
                The configuration will be created with default values based on the selected profile.
                You can edit it after creation.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelDialog}>
              Cancel
            </Button>
            <Button onClick={handleConfirmCreateConfig}>
              Create Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={updateConfigOpen} onOpenChange={(open) => {
        if (!open) handleCancelDialog();
        else setUpdateConfigOpen(open);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Configuration File</DialogTitle>
            <DialogDescription>
              Update the configuration for this host.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="updateConfigPath">Configuration File Path</Label>
              <Textarea 
                id="updateConfigPath"
                value={configPath}
                onChange={(e) => setConfigPath(e.target.value)}
                rows={1}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                You can modify the configuration file path if needed.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label>Configuration Update Preview</Label>
              <pre className="bg-muted p-2 rounded-md text-xs overflow-auto max-h-36">
                {currentProfileId ? generateDefaultConfig(currentProfileId) : "{}"}
              </pre>
              <p className="text-xs text-muted-foreground">
                The mcpnow section of your configuration will be updated to match the current profile settings.
                Other sections of your configuration will remain unchanged.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelDialog}>
              Cancel
            </Button>
            <Button onClick={handleConfirmUpdateConfig}>
              Update Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AlertDialog 
        open={confirmDialogOpen} 
        onOpenChange={(open) => {
          if (!open) handleCancelDialog();
          else setConfirmDialogOpen(open);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction === "create" ? "Create Configuration File" : "Update Configuration File"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will {confirmAction === "create" ? "create" : "update"} a configuration file at:
              <code className="block mt-2 p-2 bg-muted rounded-md text-xs font-mono">
                {configPath}
              </code>
              Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDialog}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAction}>
              {confirmAction === "create" ? "Create File" : "Update File"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <ConfigFileDialog
        open={configDialog.isOpen}
        onOpenChange={(open) => {
          if (!open) {
            setDialogOpen(false);
            setTimeout(() => resetConfigDialog(), 300);
          } else {
            setDialogOpen(open);
          }
        }}
        configPath={configDialog.configPath}
        initialConfig={configDialog.configContent}
        onSave={handleSaveConfig}
        profileEndpoint={configDialog.profileEndpoint}
        needsUpdate={configDialog.needsUpdate}
      />
      
      <AddHostDialog 
        open={addHostDialogOpen}
        onOpenChange={setAddHostDialogOpen}
        onAddHost={handleAddHost}
      />
    </div>
  );
};

export default Hosts;
