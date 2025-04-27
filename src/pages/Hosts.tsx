
import { useState, useEffect } from "react";
import { PlusCircle, Search, RefreshCw, ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { hosts, profiles, ServerDefinition, Host, Profile, ServerInstance, serverInstances } from "@/data/mockData";
import { ConfigFileDialog } from "@/components/hosts/ConfigFileDialog";
import { useToast } from "@/hooks/use-toast";
import { HostSearch } from "@/components/hosts/HostSearch";
import { NoSearchResults } from "@/components/hosts/NoSearchResults";
import { useConfigDialog } from "@/hooks/useConfigDialog";
import { useHostProfiles } from "@/hooks/useHostProfiles";
import { AddHostDialog } from "@/components/hosts/AddHostDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { markHostsOnboardingAsSeen } from "@/utils/localStorage";
import { Card, CardContent } from "@/components/ui/card";
import { HostDetailView } from "@/components/hosts/HostDetailView";

const mockJsonConfig = {
  "mcpServers": {
    "mcpnow": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/mcpnow", "http://localhost:8008/mcp"]
    }
  }
};

const Hosts = () => {
  useEffect(() => {
    markHostsOnboardingAsSeen();
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [hostsList, setHostsList] = useState<Host[]>(hosts);
  const [profilesList, setProfilesList] = useState<Profile[]>(profiles);
  const [serverInstancesList, setServerInstancesList] = useState<ServerInstance[]>(serverInstances);
  const [addHostDialogOpen, setAddHostDialogOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedHostId, setSelectedHostId] = useState<string | null>(hostsList[0]?.id || null);
  
  const {
    hostProfiles,
    handleProfileChange,
    getProfileById,
    addInstanceToProfile,
  } = useHostProfiles();

  const {
    configDialog,
    openConfigDialog,
    setDialogOpen,
    resetConfigDialog
  } = useConfigDialog(mockJsonConfig);

  const { toast } = useToast();

  const filteredHosts = hostsList.filter(host => 
    host.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const clearSearch = () => setSearchQuery("");

  const handleCreateConfigDialog = (hostId: string) => {
    const host = hostsList.find(h => h.id === hostId);
    if (host) {
      const defaultConfigPath = `/Users/user/.mcp/hosts/${host.name.toLowerCase().replace(/\s+/g, '-')}.json`;
      openConfigDialog(hostId, defaultConfigPath, 'http://localhost:8008/mcp', true, true, false, false, true, true);
    }
  };

  const handleUpdateConfig = (config: string, configPath: string) => {
    if (configDialog.hostId) {
      setHostsList(prev => prev.map(host => host.id === configDialog.hostId ? {
        ...host,
        configPath,
        configStatus: 'configured',
        connectionStatus: 'connected'
      } : host));
      toast({
        title: "Configuration complete",
        description: "Now you can select a profile for this host to connect to."
      });
    }
    resetConfigDialog();
  };

  const handleScanForHosts = () => {
    setIsScanning(true);
    setTimeout(() => {
      const foundHost = Math.random() > 0.5;
      if (foundHost) {
        const newId = `host-${Date.now()}`;
        const newHost: Host = {
          id: newId,
          name: "Local Host",
          icon: "💻",
          connectionStatus: "disconnected",
          configStatus: "unknown"
        };
        setHostsList(prevHosts => [...prevHosts, newHost]);
        toast({
          title: "Host discovered",
          description: "A new local host has been found and added to your hosts list."
        });
        setSelectedHostId(newId);
      } else {
        toast({
          title: "No hosts found",
          description: "No new hosts were discovered on your network.",
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
    connectionStatus: "connected" | "disconnected" | "misconfigured";
  }) => {
    const id = `host-${Date.now()}`;
    const host: Host = {
      id,
      ...newHost,
    };
    setHostsList([...hostsList, host]);
    setSelectedHostId(id);
    toast({
      title: "Host Added",
      description: `${newHost.name} has been added successfully`
    });
  };

  const handleDeleteHost = (hostId: string) => {
    setHostsList(prev => prev.filter(h => h.id !== hostId));
    if (selectedHostId === hostId) {
      setSelectedHostId(hostsList.find(h => h.id !== hostId)?.id || null);
    }
    toast({
      title: "Host Deleted",
      description: "The host has been removed successfully"
    });
  };

  const handleServerStatusChange = (serverId: string, status: string) => {
    setServerInstancesList(prev => prev.map(server => 
      server.id === serverId ? { ...server, status } : server
    ));

    toast({
      title: status === "running" ? "Server Started" : "Server Stopped",
      description: `Server ${status === "running" ? "is now running" : "has been stopped"}`
    });
  };

  const handleSaveProfile = (updatedProfile: Profile, newName?: string) => {
    // Create a new profile if newName is provided
    if (newName && newName !== updatedProfile.name) {
      const newProfile: Profile = {
        ...updatedProfile,
        id: `profile-${Date.now()}`,
        name: newName
      };
      setProfilesList(prev => [...prev, newProfile]);
      
      // If this was for a host, update the host's profile
      if (selectedHostId) {
        handleProfileChange(selectedHostId, newProfile.id);
      }
      
      toast({
        title: "New Profile Created",
        description: `${newName} has been created successfully`
      });
    } else {
      // Update existing profile
      setProfilesList(prev => prev.map(p => 
        p.id === updatedProfile.id ? updatedProfile : p
      ));
      
      toast({
        title: "Profile Updated",
        description: `${updatedProfile.name} has been updated successfully`
      });
    }
  };

  const handleCreateProfile = (name: string, initialInstances: string[] = []) => {
    const newProfile: Profile = {
      id: `profile-${Date.now()}`,
      name,
      endpoint: "http://localhost:8008/mcp",
      endpointType: "HTTP_SSE",
      enabled: true,
      instances: initialInstances
    };
    
    setProfilesList(prev => [...prev, newProfile]);
    
    toast({
      title: "Profile Created",
      description: `${name} has been created successfully`
    });
    
    return newProfile;
  };

  const selectedHost = hostsList.find(h => h.id === selectedHostId);

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hosts</h1>
          <p className="text-muted-foreground">
            Manage host connections and profile associations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleScanForHosts} disabled={isScanning}>
            {isScanning ? <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Scanning...
              </> : <>
                <ScanLine className="h-4 w-4 mr-2" />
                Scan for Hosts
              </>}
          </Button>
          <Button onClick={() => setAddHostDialogOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Host Manually
          </Button>
        </div>
      </div>
      
      <HostSearch searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      {filteredHosts.length > 0 ? (
        <div className="flex gap-6">
          {/* Hosts sidebar */}
          <div className="w-[260px] space-y-2">
            <h2 className="text-lg font-medium mb-2">Hosts</h2>
            <div className="space-y-1.5">
              {filteredHosts.map(host => (
                <button
                  key={host.id}
                  className={`w-full text-left rounded-md px-3 py-2 text-sm flex items-center gap-2 ${
                    selectedHostId === host.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                  onClick={() => setSelectedHostId(host.id)}
                >
                  <span className="text-base">{host.icon || '🖥️'}</span>
                  <span>{host.name}</span>
                </button>
              ))}
            </div>
            
            <Button 
              variant="outline" 
              className="w-full mt-2"
              onClick={() => setAddHostDialogOpen(true)}
            >
              <PlusCircle className="h-4 w-4 mr-1.5" />
              Add Host
            </Button>
          </div>
          
          {/* Main content */}
          <div className="flex-1">
            {selectedHost ? (
              <HostDetailView
                host={selectedHost}
                profiles={profilesList}
                serverInstances={serverInstancesList}
                serverDefinitions={ServerDefinition}
                currentProfileId={hostProfiles[selectedHost.id] || null}
                onProfileChange={handleProfileChange}
                onConfigureHost={handleCreateConfigDialog}
                onDeleteHost={handleDeleteHost}
                onServerStatusChange={handleServerStatusChange}
                onSaveProfile={handleSaveProfile}
                onCreateProfile={handleCreateProfile}
              />
            ) : (
              <Card>
                <CardContent className="p-6 flex flex-col items-center justify-center min-h-[300px]">
                  <p className="text-muted-foreground mb-4">Select a host to view details</p>
                  <Button onClick={() => setAddHostDialogOpen(true)}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Host
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      ) : (
        searchQuery ? <NoSearchResults query={searchQuery} onClear={clearSearch} /> : (
          <Card className="border-2 border-dashed bg-muted/50">
            <CardContent className="p-6 h-[300px] flex flex-col items-center justify-center text-center space-y-5">
              <div className="rounded-full bg-primary/10 p-4">
                <PlusCircle className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">No Hosts Found</h3>
                <p className="text-muted-foreground">
                  Start by adding a host or scanning your network
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 mt-2">
                <Button onClick={handleScanForHosts} disabled={isScanning} variant="outline" className="gap-2">
                  {isScanning ? <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Scanning...
                    </> : <>
                      <ScanLine className="h-4 w-4" />
                      Scan for Hosts
                    </>}
                </Button>
                <Button onClick={() => setAddHostDialogOpen(true)} className="gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Add Host Manually
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      )}
      
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
