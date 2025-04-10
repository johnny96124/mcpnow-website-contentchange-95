
import { useState, useCallback, useMemo, memo } from "react";
import { PlusCircle, Search, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { hosts } from "@/data/mockData";
import { ConfigFileDialog } from "@/components/hosts/ConfigFileDialog";
import { useToast } from "@/hooks/use-toast";
import { HostCard } from "@/components/hosts/HostCard";
import { HostSearch } from "@/components/hosts/HostSearch";
import { NoSearchResults } from "@/components/hosts/NoSearchResults";
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

// Create a memoized host card component to prevent unnecessary re-renders
const MemoizedHostCard = memo(HostCard);

const Hosts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [hostsList, setHostsList] = useState<Host[]>(hosts);
  const [addHostDialogOpen, setAddHostDialogOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [createConfigOpen, setCreateConfigOpen] = useState(false);
  const [currentHostId, setCurrentHostId] = useState<string | null>(null);
  const [currentProfileId, setCurrentProfileId] = useState<string | null>(null);
  const [configPath, setConfigPath] = useState("");
  
  const { hostProfiles, handleProfileChange } = useHostProfiles();
  const { configDialog, openConfigDialog, setDialogOpen, resetConfigDialog } = useConfigDialog(mockJsonConfig);
  const { toast } = useToast();
  
  const filteredHosts = useMemo(() => 
    hostsList.filter(host => 
      host.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [hostsList, searchQuery]
  );

  const clearSearch = useCallback(() => setSearchQuery(""), []);

  const getProfileEndpoint = useCallback((profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    return profile ? profile.endpoint : null;
  }, []);

  // Updated to handle view mode
  const handleOpenConfigDialog = useCallback((hostId: string) => {
    const host = hostsList.find(h => h.id === hostId);
    if (host && host.configPath) {
      const profileId = hostProfiles[host.id] || '';
      const profileEndpoint = getProfileEndpoint(profileId);
      
      const needsUpdate = host.configStatus === 'misconfigured';
      
      openConfigDialog(hostId, host.configPath, profileEndpoint, needsUpdate, false, true);
    } else {
      toast({
        title: "No config file",
        description: "This host doesn't have a configuration file yet. Please create one first.",
        variant: "destructive"
      });
    }
  }, [hostsList, hostProfiles, getProfileEndpoint, openConfigDialog, toast]);

  // New function to handle fixing config
  const handleFixConfigDialog = useCallback((hostId: string) => {
    const host = hostsList.find(h => h.id === hostId);
    if (host && host.configPath) {
      const profileId = hostProfiles[host.id] || '';
      const profileEndpoint = getProfileEndpoint(profileId);
      
      openConfigDialog(hostId, host.configPath, profileEndpoint, true, false, false, true);
    }
  }, [hostsList, hostProfiles, getProfileEndpoint, openConfigDialog]);
  
  const handleCreateConfig = useCallback((hostId: string, profileId: string) => {
    const host = hostsList.find(h => h.id === hostId);
    
    if (host) {
      setCurrentHostId(hostId);
      setCurrentProfileId(profileId);
      
      const defaultConfigPath = `/Users/user/.mcp/hosts/${host.name.toLowerCase().replace(/\s+/g, '-')}.json`;
      setConfigPath(defaultConfigPath);
      setCreateConfigOpen(true);
    }
  }, [hostsList]);
  
  const handleConfirmCreateConfig = useCallback(() => {
    if (currentHostId && currentProfileId) {
      // Update the host with the new config
      setHostsList(prev => prev.map(host => 
        host.id === currentHostId 
          ? { 
              ...host, 
              configPath, 
              configStatus: 'configured',
              connectionStatus: 'connected'
            } 
          : host
      ));
      
      toast({
        title: "Configuration created",
        description: `Config file created at ${configPath}`,
      });
      
      setCreateConfigOpen(false);
      
      setTimeout(() => {
        setCurrentHostId(null);
        setCurrentProfileId(null);
        setConfigPath("");
      }, 100);
    }
  }, [currentHostId, currentProfileId, configPath, toast]);

  const handleScanForHosts = useCallback(() => {
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
  }, [toast]);

  const handleAddHost = useCallback((newHost: {
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
    
    setHostsList(prev => [...prev, host]);
    
    toast({
      title: "Host Added",
      description: `${newHost.name} has been added successfully`,
    });
  }, [toast]);

  const generateDefaultConfig = useCallback((profileId: string) => {
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
  }, []);

  // Updated handler for fixing configs
  const handleFixConfig = useCallback((config: string, configPath: string) => {
    if (configDialog.hostId) {
      setHostsList(prev => prev.map(host => 
        host.id === configDialog.hostId
          ? { 
              ...host, 
              configStatus: 'configured',
              connectionStatus: 'connected'  // Update connection status when config is fixed
            }
          : host
      ));
    }
    
    resetConfigDialog();
    
    toast({
      title: "Configuration fixed",
      description: "The configuration has been updated to match the profile.",
    });
  }, [configDialog.hostId, resetConfigDialog, toast]);

  // Prepare the skeleton component for scanning state outside render
  const ScanningHostSkeleton = useMemo(() => (
    <div className="border rounded-lg overflow-hidden shadow-sm h-[400px]">
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
  ), []);

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
      
      {filteredHosts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredHosts.map(host => (
            <MemoizedHostCard
              key={host.id}
              host={host}
              profileId={hostProfiles[host.id] || ''}
              onProfileChange={handleProfileChange}
              onOpenConfigDialog={handleOpenConfigDialog}
              onCreateConfig={handleCreateConfig}
              onFixConfig={handleFixConfigDialog}
            />
          ))}
          
          {isScanning && ScanningHostSkeleton}
        </div>
      ) : (
        <NoSearchResults query={searchQuery} onClear={clearSearch} />
      )}
      
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
      
      <ConfigFileDialog
        open={configDialog.isOpen}
        onOpenChange={setDialogOpen}
        configPath={configDialog.configPath}
        initialConfig={configDialog.configContent}
        onSave={handleFixConfig}
        profileEndpoint={configDialog.profileEndpoint}
        needsUpdate={configDialog.needsUpdate}
        allowPathEdit={configDialog.allowPathEdit}
        isViewOnly={configDialog.isViewOnly}
        isFixMode={configDialog.isFixMode}
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
