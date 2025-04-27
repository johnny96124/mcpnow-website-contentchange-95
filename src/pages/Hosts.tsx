
import { useState, useEffect } from "react";
import { PlusCircle, Search, RefreshCw, FileText, Info, ScanLine, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { hosts as initialHosts, type Host, type ServerDefinition, Profile, ServerInstance } from "@/data/mockData";
import { ConfigFileDialog } from "@/components/hosts/ConfigFileDialog";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { markHostsOnboardingAsSeen } from "@/utils/localStorage";
import { Card, CardContent } from "@/components/ui/card";
import { AddHostDialog } from "@/components/hosts/AddHostDialog";
import { AddServerToHostDialog } from "@/components/hosts/AddServerToHostDialog";
import { HostDetailView } from "@/components/hosts/HostDetailView";
import { ProfileSelector } from "@/components/hosts/ProfileSelector";
import { ProfileChangesDialog } from "@/components/hosts/ProfileChangesDialog";
import { useConfigDialog } from "@/hooks/useConfigDialog";
import { useHostProfiles } from "@/hooks/useHostProfiles";
import { serverInstances as initialServerInstances, profiles as initialProfiles } from "@/data/mockData";

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
  const [hostsList, setHostsList] = useState<Host[]>(initialHosts);
  const [addHostDialogOpen, setAddHostDialogOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [addServerDialogOpen, setAddServerDialogOpen] = useState(false);
  const [profileSelectorOpen, setProfileSelectorOpen] = useState(false);
  const [unsavedChangesDialogOpen, setUnsavedChangesDialogOpen] = useState(false);
  const [selectedHostId, setSelectedHostId] = useState<string | null>(null);
  const [serverInstances, setServerInstances] = useState<ServerInstance[]>(initialServerInstances);
  const [profilesList, setProfilesList] = useState<Profile[]>(initialProfiles);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [addedServers, setAddedServers] = useState<ServerInstance[]>([]);
  const [removedServers, setRemovedServers] = useState<ServerInstance[]>([]);
  const [targetProfileId, setTargetProfileId] = useState<string | null>(null);

  const {
    hostProfiles,
    handleProfileChange,
    getProfileById
  } = useHostProfiles();

  const {
    configDialog,
    openConfigDialog,
    setDialogOpen,
    resetConfigDialog
  } = useConfigDialog(mockJsonConfig);

  const {
    toast
  } = useToast();

  const filteredHosts = hostsList.filter(host => host.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const selectedHost = selectedHostId ? hostsList.find(h => h.id === selectedHostId) : null;
  const selectedProfileId = selectedHost ? hostProfiles[selectedHost.id] || "" : "";
  const selectedProfile = selectedProfileId ? profilesList.find(p => p.id === selectedProfileId) : null;

  useEffect(() => {
    if (hostsList.length > 0 && !selectedHostId) {
      setSelectedHostId(hostsList[0].id);
    }
  }, [hostsList, selectedHostId]);

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

      // Open profile selector after configuration
      setProfileSelectorOpen(true);
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
        setSelectedHostId(newId);
        toast({
          title: "Host discovered",
          description: "A new local host has been found and added to your hosts list."
        });
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
      ...newHost
    };
    setHostsList([...hostsList, host]);
    setSelectedHostId(id);
    toast({
      title: "Host Added",
      description: `${newHost.name} has been added successfully`
    });
  };

  const handleAddServersToHost = (host: Host) => {
    setAddServerDialogOpen(true);
  };
  
  const handleImportByProfile = (host: Host) => {
    if (hasUnsavedChanges) {
      setUnsavedChangesDialogOpen(true);
    } else {
      setProfileSelectorOpen(true);
    }
  };
  
  const handleAddServers = (newServers: ServerInstance[]) => {
    if (selectedProfileId && selectedHost) {
      // Find profile and add servers to it
      setProfilesList(prev => prev.map(profile => {
        if (profile.id === selectedProfileId) {
          // Get existing server IDs
          const existingIds = profile.instances;
          // Get new server IDs that don't already exist
          const newIds = newServers.filter(s => !existingIds.includes(s.id)).map(s => s.id);
          
          if (newIds.length > 0) {
            // Add new servers to instances list
            setHasUnsavedChanges(true);
            setAddedServers(prev => [...prev, ...newServers]);
            return {
              ...profile,
              instances: [...existingIds, ...newIds]
            };
          }
        }
        return profile;
      }));
      
      toast({
        title: "Servers Added",
        description: `Added ${newServers.length} servers to profile "${selectedProfile?.name}". Save changes to apply.`,
      });
    } else {
      // If no profile is selected, create a new one
      const newProfileId = `profile-${Date.now()}`;
      const newProfile: Profile = {
        id: newProfileId,
        name: `${selectedHost?.name || 'New'} Profile`,
        endpoint: "http://localhost:8008/mcp",
        endpointType: "HTTP_SSE",
        enabled: true,
        instances: newServers.map(s => s.id)
      };
      
      setProfilesList([...profilesList, newProfile]);
      handleProfileChange(selectedHost!.id, newProfileId);
      
      toast({
        title: "Profile Created",
        description: `New profile created with ${newServers.length} servers`
      });
    }
    
    // Update host if needed
    if (selectedHost?.configStatus === "unknown") {
      setHostsList(prev => prev.map(h => h.id === selectedHost.id ? {
        ...h,
        configStatus: "configured",
        connectionStatus: "connected"
      } : h));
    }
    
    setAddServerDialogOpen(false);
  };

  const handleServerStatusChange = (serverId: string, status: 'running' | 'stopped' | 'error' | 'connecting') => {
    setServerInstances(prev => prev.map(server => server.id === serverId ? {
      ...server,
      status
    } : server));
    
    // Mark profile as having unsaved changes
    setHasUnsavedChanges(true);
  };
  
  const handleSaveProfileChanges = () => {
    setHasUnsavedChanges(false);
    setAddedServers([]);
    setRemovedServers([]);
    
    toast({
      title: "Profile Saved",
      description: `Changes to profile "${selectedProfile?.name}" have been saved.`
    });
  };
  
  const handleSelectProfile = (profileId: string) => {
    if (selectedHost) {
      handleProfileChange(selectedHost.id, profileId);
      setProfileSelectorOpen(false);
      
      toast({
        title: "Profile Changed",
        description: `Profile has been changed to "${profilesList.find(p => p.id === profileId)?.name}"`
      });
    }
  };
  
  const handleCreateProfile = (profileName: string) => {
    const newProfileId = `profile-${Date.now()}`;
    const newProfile: Profile = {
      id: newProfileId,
      name: profileName,
      endpoint: "http://localhost:8008/mcp",
      endpointType: "HTTP_SSE",
      enabled: true,
      instances: []
    };
    
    setProfilesList([...profilesList, newProfile]);
    
    if (selectedHost) {
      handleProfileChange(selectedHost.id, newProfileId);
    }
    
    toast({
      title: "Profile Created",
      description: `New profile "${profileName}" has been created`
    });
    
    setProfileSelectorOpen(false);
  };
  
  const handleSaveProfileChangesWithOption = (createNew: boolean, profileName?: string) => {
    if (createNew && profileName) {
      // Create new profile based on current one
      const currentProfile = profilesList.find(p => p.id === selectedProfileId);
      if (currentProfile && selectedHost) {
        const newProfileId = `profile-${Date.now()}`;
        const newProfile: Profile = {
          ...currentProfile,
          id: newProfileId,
          name: profileName,
          instances: currentProfile.instances
        };
        
        setProfilesList([...profilesList, newProfile]);
        handleProfileChange(selectedHost.id, newProfileId);
        
        toast({
          title: "New Profile Created",
          description: `Created new profile "${profileName}" with your changes`
        });
      }
    } else {
      // Just save current profile
      toast({
        title: "Profile Updated",
        description: `Changes to "${selectedProfile?.name}" have been saved`
      });
    }
    
    setHasUnsavedChanges(false);
    setAddedServers([]);
    setRemovedServers([]);
    setUnsavedChangesDialogOpen(false);
    
    // If we were trying to change profiles, complete that action
    if (targetProfileId) {
      handleProfileChange(selectedHost!.id, targetProfileId);
      setTargetProfileId(null);
    }
  };
  
  const handleDiscardChanges = () => {
    // Revert any changes by refreshing the profiles from server
    // In this mock, we would normally reload from the API
    
    setHasUnsavedChanges(false);
    setAddedServers([]);
    setRemovedServers([]);
    setUnsavedChangesDialogOpen(false);
    
    toast({
      title: "Changes Discarded",
      description: "Profile changes have been discarded"
    });
    
    // If we were trying to change profiles, complete that action
    if (targetProfileId) {
      handleProfileChange(selectedHost!.id, targetProfileId);
      setTargetProfileId(null);
    }
  };
  
  const handleDeleteHost = (hostId: string) => {
    setHostsList(prev => prev.filter(h => h.id !== hostId));
    
    if (selectedHostId === hostId) {
      // Select another host if available
      const remainingHosts = hostsList.filter(h => h.id !== hostId);
      setSelectedHostId(remainingHosts.length > 0 ? remainingHosts[0].id : null);
    }
    
    toast({
      title: "Host Deleted",
      description: "The host has been removed successfully"
    });
  };

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
      
      {/* Host search */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search hosts..."
          className="pl-8 w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button 
            className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
            onClick={() => setSearchQuery("")}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      
      {/* Main content area */}
      <div className="grid gap-6 md:grid-cols-4">
        {/* Hosts list sidebar */}
        <div className="space-y-4">
          {filteredHosts.length > 0 ? (
            <div className="space-y-2">
              {filteredHosts.map(host => (
                <Card 
                  key={host.id}
                  className={`cursor-pointer transition-colors hover:bg-muted/50 ${selectedHostId === host.id ? 'border-primary bg-primary/5' : ''}`}
                  onClick={() => {
                    if (hasUnsavedChanges) {
                      setTargetProfileId(hostProfiles[host.id] || "");
                      setUnsavedChangesDialogOpen(true);
                    } else {
                      setSelectedHostId(host.id);
                    }
                  }}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-muted/30 p-2 rounded-full">
                        <span className="text-xl">{host.icon || '🖥️'}</span>
                      </div>
                      <div>
                        <p className="font-medium">{host.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {host.connectionStatus === "connected" 
                            ? "Connected" 
                            : host.configStatus === "unknown"
                              ? "Needs setup"
                              : "Disconnected"}
                        </p>
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${
                      host.connectionStatus === "connected" 
                        ? 'bg-green-500' 
                        : host.connectionStatus === "misconfigured" 
                          ? 'bg-red-500' 
                          : 'bg-amber-500'
                    }`} />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : searchQuery ? (
            <div className="text-center py-8 border border-dashed rounded-md">
              <p className="text-muted-foreground mb-2">No results for "{searchQuery}"</p>
              <Button variant="link" onClick={() => setSearchQuery("")}>Clear search</Button>
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed rounded-md space-y-2">
              <div className="text-4xl mb-2">🔍</div>
              <h3 className="font-medium">No hosts found</h3>
              <p className="text-muted-foreground text-sm px-4">
                Scan your network to discover hosts or add one manually
              </p>
            </div>
          )}
          
          {/* Add host card */}
          <Card className="border-2 border-dashed bg-muted/20 hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setAddHostDialogOpen(true)}>
            <CardContent className="p-4 text-center space-y-2">
              <PlusCircle className="h-6 w-6 mx-auto text-muted-foreground" />
              <p className="text-sm font-medium">Add New Host</p>
            </CardContent>
          </Card>
          
          {/* Scanning card */}
          {isScanning && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
                  <p className="text-sm">Scanning for hosts...</p>
                </div>
                <div className="mt-3">
                  <div className="h-1 w-full bg-muted overflow-hidden rounded-full">
                    <div className="h-full bg-primary animate-pulse rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Host detail area */}
        <div className="md:col-span-3">
          {selectedHost ? (
            <HostDetailView 
              host={selectedHost}
              profiles={profilesList}
              serverInstances={serverInstances}
              selectedProfileId={selectedProfileId}
              onCreateConfig={handleCreateConfigDialog}
              onProfileChange={handleImportByProfile}
              onAddServersToHost={handleAddServersToHost}
              onImportByProfile={handleImportByProfile}
              onDeleteHost={handleDeleteHost}
              onServerStatusChange={handleServerStatusChange}
              onSaveProfileChanges={handleSaveProfileChanges}
            />
          ) : (
            <div className="border border-dashed rounded-md p-8 text-center space-y-3">
              <Info className="h-8 w-8 mx-auto text-muted-foreground" />
              <h3 className="text-lg font-medium">No Host Selected</h3>
              <p className="text-muted-foreground">
                Select a host from the list or add a new host to get started
              </p>
              <Button onClick={() => setAddHostDialogOpen(true)}>Add Host</Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Dialogs */}
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
      
      <AddServerToHostDialog
        open={addServerDialogOpen}
        onOpenChange={setAddServerDialogOpen}
        onAddServers={handleAddServers}
        profiles={profilesList}
      />
      
      <ProfileSelector 
        open={profileSelectorOpen}
        onOpenChange={setProfileSelectorOpen}
        profiles={profilesList}
        serverInstances={serverInstances}
        onSelectProfile={handleSelectProfile}
        onCreateProfile={handleCreateProfile}
        hasUnsavedChanges={hasUnsavedChanges}
        currentProfileId={selectedProfileId}
      />
      
      <ProfileChangesDialog
        open={unsavedChangesDialogOpen}
        onOpenChange={setUnsavedChangesDialogOpen}
        currentProfileName={selectedProfile?.name || "Unknown Profile"}
        addedServers={addedServers}
        removedServers={removedServers}
        onSaveChanges={handleSaveProfileChangesWithOption}
        onDiscardChanges={handleDiscardChanges}
      />
    </div>
  );
};

export default Hosts;
