
import { useState, useEffect } from "react";
import { PlusCircle, Search, RefreshCw, Settings2, ArrowDown } from "lucide-react";
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
  const [newHostFound, setNewHostFound] = useState<Host | null>(null);
  
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

  // Handler for viewing the configuration
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

  // Handler for new host configuration creation
  const handleCreateConfigDialog = (hostId: string) => {
    const host = hostsList.find(h => h.id === hostId);
    if (host) {
      // For hosts without config path, create a new default path
      const defaultConfigPath = `/Users/user/.mcp/hosts/${host.name.toLowerCase().replace(/\s+/g, '-')}.json`;
      openConfigDialog(hostId, defaultConfigPath, undefined, true, false, false, false, false, true);
      
      // Clear the new host found state once we've opened the dialog
      if (newHostFound && newHostFound.id === hostId) {
        setNewHostFound(null);
      }
    }
  };

  // Handler for updating existing configs
  const handleUpdateConfigDialog = (hostId: string) => {
    const host = hostsList.find(h => h.id === hostId);
    if (host) {
      const profileId = hostProfiles[host.id] || '';
      const profileEndpoint = getProfileEndpoint(profileId);
      
      if (host.configPath) {
        openConfigDialog(hostId, host.configPath, profileEndpoint, true, false, false, false, true);
      } else {
        const defaultConfigPath = `/Users/user/.mcp/hosts/${host.name.toLowerCase().replace(/\s+/g, '-')}.json`;
        openConfigDialog(hostId, defaultConfigPath, profileEndpoint, true, false, false, false, true);
      }
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
      setNewHostFound(newHost);
      
      toast({
        title: "Host discovered",
        description: "A new local host has been found and added to your hosts list.",
      });
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
    setNewHostFound(host);
    
    toast({
      title: "Host Added",
      description: `${newHost.name} has been added successfully`,
    });
  };

  // Updated handler for saving configurations
  const handleUpdateConfig = (config: string, configPath: string) => {
    if (configDialog.hostId) {
      setHostsList(prev => prev.map(host => 
        host.id === configDialog.hostId
          ? { 
              ...host, 
              configPath,
              configStatus: 'configured',
              connectionStatus: configDialog.isNewHost ? 'disconnected' : 'connected'
            }
          : host
      ));
      
      // If this was a new host, show a toast guiding to the next step
      if (configDialog.isNewHost) {
        toast({
          title: "Configuration created",
          description: "Now please select a profile to use with this host.",
        });
      }
    }
    
    resetConfigDialog();
  };

  // Effect to automatically open the config dialog for new hosts
  useEffect(() => {
    if (newHostFound) {
      // Slight delay to ensure the UI has updated
      const timer = setTimeout(() => {
        handleCreateConfigDialog(newHostFound.id);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [newHostFound]);

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
      
      {newHostFound && (
        <Alert className="bg-blue-50 border-blue-200">
          <div className="flex items-start">
            <div className="flex-1">
              <AlertTitle className="text-blue-800 flex items-center gap-2">
                New Host Found: {newHostFound.name}
              </AlertTitle>
              <AlertDescription className="text-blue-700">
                <div className="space-y-2">
                  <p>A new host has been discovered. Please follow these steps to set it up:</p>
                  <ol className="list-decimal ml-4 space-y-1">
                    <li className="font-medium">Create a configuration file for this host</li>
                    <li>Select a profile to use with this host</li>
                  </ol>
                </div>
              </AlertDescription>
            </div>
            <Button 
              variant="default" 
              size="sm" 
              className="bg-blue-500 hover:bg-blue-600"
              onClick={() => handleCreateConfigDialog(newHostFound.id)}
            >
              Configure Now
            </Button>
          </div>
        </Alert>
      )}
      
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
              isNewHost={newHostFound && newHostFound.id === host.id}
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
        isNewHost={configDialog.isNewHost}
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
