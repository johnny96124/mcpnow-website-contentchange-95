
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
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [showPathChangeAlert, setShowPathChangeAlert] = useState(false);
  const [newConfigPath, setNewConfigPath] = useState("");
  
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
      // Allow path editing for existing configurations
      openConfigDialog(hostId, host.configPath, profileEndpoint, host.needsUpdate, true);
    } else {
      toast({
        title: "No config file",
        description: "This host doesn't have a configuration file yet. Please create one first.",
        variant: "destructive"
      });
    }
  };
  
  const handleSaveConfig = (config: string, newPath: string) => {
    if (configDialog.hostId) {
      // Check if the path has changed
      if (newPath !== configDialog.configPath) {
        setNewConfigPath(newPath);
        setShowPathChangeAlert(true);
        return;
      }
      
      applyConfigChanges(configDialog.hostId, config, newPath);
    }
  };
  
  const applyConfigChanges = (hostId: string, config: string, path: string) => {
    console.log(`Saving config for host ${hostId} at path ${path}:`, config);
    
    setHostsList(prev => prev.map(host => 
      host.id === hostId 
        ? { ...host, configPath: path, configStatus: 'configured', needsUpdate: false } 
        : host
    ));
    
    toast({
      title: "Configuration saved",
      description: `Config file saved to ${path}`,
    });
    
    // Reset dialog state
    resetConfigDialog();
    setShowPathChangeAlert(false);
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
  
  const handleConfirmCreateConfig = () => {
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
        title: "Configuration created",
        description: `Config file created at ${configPath}`,
      });
      
      setCreateConfigOpen(false);
      
      // Reset state
      setTimeout(() => {
        setCurrentHostId(null);
        setCurrentProfileId(null);
        setConfigPath("");
      }, 100);
    }
  };

  const handleConfirmUpdateConfig = () => {
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
        title: "Configuration updated",
        description: `Config file updated at ${configPath}`,
      });
      
      setUpdateConfigOpen(false);
      
      // Reset state
      setTimeout(() => {
        setCurrentHostId(null);
        setCurrentProfileId(null);
        setConfigPath("");
      }, 100);
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
      
      {/* Path change confirmation dialog */}
      <AlertDialog open={showPathChangeAlert} onOpenChange={setShowPathChangeAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm New Configuration Path</AlertDialogTitle>
            <AlertDialogDescription>
              You've modified the configuration file path. A new configuration file will be created at the specified location.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="my-4 p-2 bg-muted rounded">
            <p className="text-sm font-mono">{newConfigPath}</p>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowPathChangeAlert(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              if (configDialog.hostId) {
                applyConfigChanges(configDialog.hostId, configDialog.configContent, newConfigPath);
              }
            }}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Dialog open={createConfigOpen} onOpenChange={setCreateConfigOpen}>
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
            <Button variant="outline" onClick={() => setCreateConfigOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmCreateConfig}>
              Create Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={updateConfigOpen} onOpenChange={setUpdateConfigOpen}>
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
                You can modify the path where this configuration will be saved.
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
            <Button variant="outline" onClick={() => setUpdateConfigOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmUpdateConfig}>
              Update Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <ConfigFileDialog
        open={configDialog.isOpen}
        onOpenChange={setDialogOpen}
        configPath={configDialog.configPath}
        initialConfig={configDialog.configContent}
        onSave={handleSaveConfig}
        profileEndpoint={configDialog.profileEndpoint}
        needsUpdate={configDialog.needsUpdate}
        allowPathEdit={configDialog.allowPathEdit}
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
