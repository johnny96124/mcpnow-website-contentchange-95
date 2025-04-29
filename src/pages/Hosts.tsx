
import { useState, useEffect, useCallback } from "react";
import { Plus, Info, X } from "lucide-react";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { hosts as initialHosts, type Host, type Profile, ServerInstance } from "@/data/mockData";
import { ConfigFileDialog } from "@/components/hosts/ConfigFileDialog";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { HostDetailView } from "@/components/hosts/HostDetailView";
import { useConfigDialog } from "@/hooks/useConfigDialog";
import { useHostProfiles } from "@/hooks/useHostProfiles";
import { serverInstances as initialServerInstances, profiles as initialProfiles } from "@/data/mockData";
import { UnifiedHostDialog } from "@/components/hosts/UnifiedHostDialog";

// Move this outside component to prevent recreating on each render
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
    const markHostsOnboardingAsSeen = () => {
      localStorage.setItem('hostsOnboardingSeen', 'true');
    };
    markHostsOnboardingAsSeen();
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [hostsList, setHostsList] = useState<Host[]>(initialHosts);
  const [unifiedHostDialogOpen, setUnifiedHostDialogOpen] = useState(false);
  const [selectedHostId, setSelectedHostId] = useState<string | null>(null);
  const [serverInstances, setServerInstances] = useState<ServerInstance[]>(initialServerInstances);
  const [profilesList, setProfilesList] = useState<Profile[]>(initialProfiles);

  const {
    hostProfiles,
    handleProfileChange: updateProfileInHook,
  } = useHostProfiles();

  const {
    configDialog,
    openConfigDialog,
    setDialogOpen,
    resetConfigDialog
  } = useConfigDialog(mockJsonConfig);

  const { toast } = useToast();

  // Memoize filtered hosts to prevent re-renders
  const filteredHosts = hostsList.filter(host => host.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const selectedHost = selectedHostId ? hostsList.find(h => h.id === selectedHostId) : null;
  const selectedProfileId = selectedHost ? hostProfiles[selectedHost.id] || "" : "";

  // Select the first host if none is selected
  useEffect(() => {
    if (hostsList.length > 0 && !selectedHostId) {
      setSelectedHostId(hostsList[0].id);
    }
  }, [hostsList, selectedHostId]);

  // Use useCallback for event handlers to prevent recreation on each render
  const handleCreateConfigDialog = useCallback((hostId: string) => {
    const host = hostsList.find(h => h.id === hostId);
    if (host) {
      const defaultConfigPath = `/Users/user/.mcp/hosts/${host.name.toLowerCase().replace(/\s+/g, '-')}.json`;
      openConfigDialog(hostId, defaultConfigPath, 'http://localhost:8008/mcp', true, true, false, false, true, true);
    }
  }, [hostsList, openConfigDialog]);

  const handleUpdateConfig = useCallback((config: string, configPath: string) => {
    if (configDialog.hostId) {
      setHostsList(prev => prev.map(host => host.id === configDialog.hostId ? {
        ...host,
        configPath,
        configStatus: 'configured',
        connectionStatus: 'connected'
      } : host));
      
      const host = hostsList.find(h => h.id === configDialog.hostId);
      if (host) {
        const profileId = handleCreateProfile(`${host.name} Profile`);
        updateProfileInHook(host.id, profileId);
        
        toast({
          title: "Configuration complete",
          description: "Host has been configured and is ready to use.",
          type: "success"
        });
      }
    }
    resetConfigDialog();
  }, [configDialog.hostId, hostsList, resetConfigDialog, toast, updateProfileInHook]);

  const handleAddHosts = useCallback((newHosts: Host[]) => {
    const hostsWithProfiles = newHosts.map(host => {
      const profileId = handleCreateProfile(host.defaultProfileName || `${host.name} Profile`);
      
      return {
        ...host,
        profileId
      };
    });

    setHostsList(prev => [...prev, ...hostsWithProfiles]);
    
    setSelectedHostId(hostsWithProfiles[0].id);
    
    hostsWithProfiles.forEach(host => {
      if (host.profileId) {
        updateProfileInHook(host.id, host.profileId);
      }
    });
    
    toast({
      title: "Hosts Added",
      description: `Successfully added ${newHosts.length} new host${newHosts.length > 1 ? 's' : ''}`
    });
  }, [toast, updateProfileInHook]);

  const handleAddServersToHost = useCallback(() => {
    toast({
      title: "Add servers",
      description: "Select servers to add to this profile"
    });
  }, [toast]);
  
  const handleServerStatusChange = useCallback((serverId: string, status: 'running' | 'stopped' | 'error' | 'connecting') => {
    setServerInstances(prev => prev.map(server => server.id === serverId ? {
      ...server,
      status
    } : server));
  }, []);
  
  const handleSaveProfileChanges = useCallback(() => {
    toast({
      title: "Profile Saved",
      description: "Changes to profile have been saved."
    });
  }, [toast]);
  
  const handleProfileChange = useCallback((profileId: string) => {
    if (selectedHost) {
      updateProfileInHook(selectedHost.id, profileId);
      
      toast({
        title: "Profile Changed",
        description: `Profile has been changed to "${profilesList.find(p => p.id === profileId)?.name}"`
      });
    }
  }, [selectedHost, updateProfileInHook, toast, profilesList]);
  
  // Optimize profile creation to avoid unnecessary re-renders
  const handleCreateProfile = useCallback((profileName: string) => {
    const newProfileId = `profile-${Date.now()}`;
    const newProfile: Profile = {
      id: newProfileId,
      name: profileName,
      endpoint: "http://localhost:8008/mcp",
      endpointType: "HTTP_SSE",
      enabled: true,
      instances: []
    };
    
    setProfilesList(prev => [...prev, newProfile]);
    
    toast({
      title: "Profile Created",
      description: `New profile "${profileName}" has been created`
    });
    
    return newProfileId;
  }, [toast]);
  
  const handleDeleteProfile = useCallback((profileId: string) => {
    if (profilesList.length <= 1) {
      toast({
        title: "Cannot delete profile",
        description: "You must have at least one profile",
        type: "error"
      });
      return;
    }
    
    setProfilesList(prev => prev.filter(p => p.id !== profileId));
    
    if (selectedHost && hostProfiles[selectedHost.id] === profileId) {
      const otherProfile = profilesList.find(p => p.id !== profileId);
      if (otherProfile) {
        updateProfileInHook(selectedHost.id, otherProfile.id);
      }
    }
    
    toast({
      title: "Profile Deleted",
      description: "The profile has been deleted"
    });
  }, [profilesList, selectedHost, hostProfiles, toast, updateProfileInHook]);
  
  const handleDeleteHost = useCallback((hostId: string) => {
    setHostsList(prev => prev.filter(h => h.id !== hostId));
    
    if (selectedHostId === hostId) {
      const remainingHosts = hostsList.filter(h => h.id !== hostId);
      setSelectedHostId(remainingHosts.length > 0 ? remainingHosts[0].id : null);
    }
    
    toast({
      title: "Host Deleted",
      description: "The host has been removed successfully"
    });
  }, [hostsList, selectedHostId, toast]);

  // Optimize adding servers to profiles
  const handleAddServersToProfile = useCallback((servers: ServerInstance[]) => {
    // First, make sure we have the servers in the serverInstances state
    const newServerIds = servers.map(server => server.id);
    
    // Add any new servers that aren't already in the list
    const newServers = servers.filter(server => 
      !serverInstances.some(existingServer => existingServer.id === server.id)
    );
    
    if (newServers.length > 0) {
      setServerInstances(prev => [...prev, ...newServers]);
    }
    
    // Get the selected profile
    if (selectedProfileId) {
      // Add the server IDs to the profile's instances
      setProfilesList(prev => prev.map(profile => {
        if (profile.id === selectedProfileId) {
          // Add server IDs that aren't already in the profile
          const updatedInstances = [
            ...profile.instances,
            ...newServerIds.filter(id => !profile.instances.includes(id))
          ];
          
          return {
            ...profile,
            instances: updatedInstances
          };
        }
        return profile;
      }));
      
      toast({
        title: "Servers added",
        description: `${servers.length} server(s) added to profile`
      });
    }
  }, [serverInstances, selectedProfileId, toast]);

  // Clear search handler
  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Hosts</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage host connections and server associations
          </p>
        </div>
        <Button onClick={() => setUnifiedHostDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Host
        </Button>
      </div>
      
      <div className="relative">
        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
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
            onClick={handleClearSearch}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      
      <div className="grid gap-6 md:grid-cols-4">
        <div className="space-y-4">
          {filteredHosts.length > 0 ? (
            <div className="space-y-2">
              {filteredHosts.map(host => (
                <Card 
                  key={host.id}
                  className={`cursor-pointer transition-colors hover:bg-muted/50 ${selectedHostId === host.id ? 'border-primary bg-primary/5' : ''}`}
                  onClick={() => setSelectedHostId(host.id)}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-muted/30 p-2 rounded-full">
                        <span className="text-xl">{host.icon || '🖥️'}</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{host.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {host.connectionStatus === "connected" 
                            ? "Connected" 
                            : "Disconnected"}
                        </p>
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${
                      host.connectionStatus === "connected" 
                        ? 'bg-green-500' 
                        : 'bg-neutral-400'
                    }`} />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border border-dashed rounded-md">
              <p className="text-sm text-muted-foreground mb-2">No results for "{searchQuery}"</p>
              <Button variant="link" onClick={handleClearSearch} className="text-xs">Clear search</Button>
            </div>
          )}
          
          <Card className="border-2 border-dashed bg-muted/20 hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setUnifiedHostDialogOpen(true)}>
            <CardContent className="p-4 text-center space-y-2">
              <Plus className="h-6 w-6 mx-auto text-muted-foreground" />
              <p className="text-xs font-medium">Add New Host</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-3">
          {selectedHost ? (
            <HostDetailView 
              host={selectedHost}
              profiles={profilesList}
              serverInstances={serverInstances}
              selectedProfileId={selectedProfileId}
              onCreateConfig={handleCreateConfigDialog}
              onProfileChange={handleProfileChange}
              onAddServersToHost={handleAddServersToHost}
              onDeleteHost={handleDeleteHost}
              onServerStatusChange={handleServerStatusChange}
              onSaveProfileChanges={handleSaveProfileChanges}
              onCreateProfile={handleCreateProfile}
              onDeleteProfile={handleDeleteProfile}
              onAddServersToProfile={handleAddServersToProfile}
            />
          ) : (
            <div className="border border-dashed rounded-md p-8 text-center space-y-3">
              <Info className="h-8 w-8 mx-auto text-muted-foreground" />
              <h3 className="text-base font-medium">No Host Selected</h3>
              <p className="text-sm text-muted-foreground">
                Select a host from the list or add a new host to get started
              </p>
              <Button onClick={() => setUnifiedHostDialogOpen(true)}>Add Host</Button>
            </div>
          )}
        </div>
      </div>
      
      <UnifiedHostDialog 
        open={unifiedHostDialogOpen}
        onOpenChange={setUnifiedHostDialogOpen}
        onAddHosts={handleAddHosts}
      />
      
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
    </div>
  );
};

export default Hosts;
