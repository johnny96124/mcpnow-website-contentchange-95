
import { useState } from "react";
import { PlusCircle, Search, RefreshCw, FileText, Info, AlertCircle } from "lucide-react";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  const [showNewHostAlert, setShowNewHostAlert] = useState(false);
  const [newHostId, setNewHostId] = useState<string | null>(null);
  const [noHostsFound, setNoHostsFound] = useState(false);
  
  const { hostProfiles, handleProfileChange } = useHostProfiles();
  const { configDialog, openConfigDialog, setDialogOpen, resetConfigDialog } = useConfigDialog(mockJsonConfig);
  const { toast } = useToast();
  
  const filteredHosts = hostsList.filter(host => 
    host.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const clearSearch = () => setSearchQuery("");

  const getProfileEndpoint = (profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    return profile ? profile.endpoint : null;
  };

  // View configuration
  const handleOpenConfigDialog = (hostId: string) => {
    const host = hostsList.find(h => h.id === hostId);
    if (host && host.configPath) {
      const profileId = hostProfiles[host.id] || '';
      const profileEndpoint = getProfileEndpoint(profileId);
      
      openConfigDialog(hostId, host.configPath, profileEndpoint, false, false, true);
    } else {
      toast({
        title: "No config file",
        description: "This host doesn't have a configuration file yet. Please create a configuration first.",
        variant: "destructive"
      });
    }
  };

  // Create a new configuration
  const handleCreateConfigDialog = (hostId: string, profileId?: string) => {
    const host = hostsList.find(h => h.id === hostId);
    if (host) {
      // Determine which profile to use (either passed in or from hostProfiles)
      const selectedProfileId = profileId || hostProfiles[host.id] || '';
      const profileEndpoint = getProfileEndpoint(selectedProfileId);
      
      // Generate a default config path based on host name
      const defaultConfigPath = `/Users/user/.mcp/hosts/${host.name.toLowerCase().replace(/\s+/g, '-')}.json`;
      
      // Open in create mode
      openConfigDialog(
        hostId, 
        defaultConfigPath, 
        profileEndpoint, 
        true,  // needs update 
        true,  // allow path edit
        false, // not view only
        false, // not fix mode
        false, // not update mode
        true   // create mode - new parameter
      );
    }
  };

  // Fix/update an existing configuration
  const handleUpdateConfigDialog = (hostId: string) => {
    const host = hostsList.find(h => h.id === hostId);
    if (host) {
      const profileId = hostProfiles[host.id] || '';
      const profileEndpoint = getProfileEndpoint(profileId);
      
      // For existing config path
      if (host.configPath) {
        openConfigDialog(
          hostId, 
          host.configPath, 
          profileEndpoint, 
          true,  // needs update
          false, // don't allow path edit 
          false, // not view only
          false, // not fix mode
          true   // update mode
        );
      } else {
        // For hosts without config path, create a new default path
        const defaultConfigPath = `/Users/user/.mcp/hosts/${host.name.toLowerCase().replace(/\s+/g, '-')}.json`;
        openConfigDialog(
          hostId, 
          defaultConfigPath, 
          profileEndpoint, 
          true,  // needs update
          true,  // allow path edit
          false, // not view only
          false, // not fix mode
          true,  // update mode
          false  // not create mode
        );
      }
    }
  };

  const handleScanForHosts = () => {
    setIsScanning(true);
    setNoHostsFound(false); // Reset no hosts found state
    
    setTimeout(() => {
      // Simulate a scan - 80% chance to find a host, 20% chance to find nothing
      const hostFound = Math.random() > 0.2;
      
      if (hostFound) {
        const newId = `host-${Date.now()}`;
        const newHost: Host = {
          id: newId,
          name: "Local Host",
          icon: "💻",
          connectionStatus: "disconnected",
          configStatus: "unknown",
        };
        
        setHostsList(prevHosts => [...prevHosts, newHost]);
        setNewHostId(newId);
        setShowNewHostAlert(true);
        
        toast({
          title: "Host discovered",
          description: "A new local host has been found and added to your hosts list.",
        });
      } else {
        setNoHostsFound(true);
        toast({
          title: "No hosts found",
          description: "We couldn't find any hosts on your network.",
          variant: "destructive"
        });
      }
      
      setIsScanning(false);
    }, 2500);
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
    setNewHostId(id);
    setShowNewHostAlert(true);
    
    toast({
      title: "Host Added",
      description: `${newHost.name} has been added successfully`,
    });
  };

  // Handler for updating/creating configs
  const handleUpdateConfig = (config: string, configPath: string) => {
    if (configDialog.hostId) {
      setHostsList(prev => prev.map(host => 
        host.id === configDialog.hostId
          ? { 
              ...host, 
              configPath,
              configStatus: 'configured',
              connectionStatus: 'connected'  // Update connection status when config is fixed
            }
          : host
      ));
      
      // If this was for a newly discovered host, automatically show the host profile selector guidance
      if (newHostId === configDialog.hostId) {
        setTimeout(() => {
          setShowNewHostAlert(false);
          setNewHostId(null);
          
          toast({
            title: "Configuration complete",
            description: "Now you can select a profile for this host to connect to.",
          });
        }, 500);
      }
    }
    
    resetConfigDialog();
  };
  
  const dismissNewHostAlert = () => {
    setShowNewHostAlert(false);
    setNewHostId(null);
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
      
      {showNewHostAlert && newHostId && (
        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-500" />
          <AlertTitle className="text-blue-700">New Host Discovered</AlertTitle>
          <AlertDescription className="text-blue-600 flex items-center justify-between">
            <span>Configure this host to connect it with your profiles</span>
            <Button 
              variant="outline" 
              size="sm"
              className="text-blue-700 border-blue-300 hover:bg-blue-100"
              onClick={() => handleCreateConfigDialog(newHostId)}
            >
              <FileText className="h-4 w-4 mr-2" />
              Configure Host
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      <HostSearch 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery} 
      />
      
      {filteredHosts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredHosts.map(host => (
            <HostCard
              key={host.id}
              host={host}
              profileId={hostProfiles[host.id] || ''}
              onProfileChange={handleProfileChange}
              onOpenConfigDialog={handleOpenConfigDialog}
              onCreateConfig={handleCreateConfigDialog}
              onFixConfig={handleUpdateConfigDialog}
            />
          ))}
          
          {isScanning && (
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
          )}
        </div>
      ) : noHostsFound && !isScanning ? (
        <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed rounded-lg">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-1">No Hosts Found</h3>
          <p className="text-muted-foreground mb-4">
            We couldn't find any hosts on your network. You can try scanning again or add a host manually.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleScanForHosts}>
              <Search className="h-4 w-4 mr-2" />
              Scan Again
            </Button>
            <Button onClick={() => setAddHostDialogOpen(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Host Manually
            </Button>
          </div>
        </div>
      ) : (
        <NoSearchResults query={searchQuery} onClear={clearSearch} />
      )}
      
      <ConfigFileDialog
        open={configDialog.isOpen}
        onOpenChange={setDialogOpen}
        configPath={configDialog.configPath}
        initialConfig={configDialog.configContent}
        onSave={handleUpdateConfig}
        profileEndpoint={configDialog.profileEndpoint}
        needsUpdate={configDialog.needsUpdate}
        allowPathEdit={configDialog.allowPathEdit}
        isViewOnly={configDialog.isViewOnly}
        isFixMode={configDialog.isFixMode}
        isUpdateMode={configDialog.isUpdateMode}
        isCreateMode={configDialog.isCreateMode}
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
