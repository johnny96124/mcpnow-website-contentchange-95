import { useState, useEffect } from "react";
import { Plus, Info, X } from "lucide-react";
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
import Welcome from "@/components/hosts/Welcome";
import { HostsEmptyState } from "@/components/hosts/HostsEmptyState";

const mockJsonConfig = {
  "mcpServers": {
    "mcpnow": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/mcpnow", "http://localhost:8008/mcp"]
    }
  }
};

const Hosts = () => {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean>(
    localStorage.getItem('hostsOnboardingSeen') === 'true'
  );

  useEffect(() => {
    const markHostsOnboardingAsSeen = () => {
      localStorage.setItem('hostsOnboardingSeen', 'true');
    };
    
    if (hasSeenOnboarding) {
      markHostsOnboardingAsSeen();
    }
  }, [hasSeenOnboarding]);

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

  const filteredHosts = hostsList;
  const selectedHost = selectedHostId ? hostsList.find(h => h.id === selectedHostId) : null;
  const selectedProfileId = selectedHost ? hostProfiles[selectedHost.id] || "" : "";

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
  };

  const handleAddHosts = (newHosts: Host[]) => {
    const hostsWithProfiles = newHosts.map(host => {
      const profileId = handleCreateProfile(host.defaultProfileName || `${host.name} Profile`);
      
      return {
        ...host,
        profileId
      };
    });

    setHostsList(prev => [...prev, ...hostsWithProfiles]);
    
    if (hostsWithProfiles.length > 0) {
      setSelectedHostId(hostsWithProfiles[0].id);
    
      hostsWithProfiles.forEach(host => {
        if (host.profileId) {
          updateProfileInHook(host.id, host.profileId);
        }
      });
      
      // Mark onboarding as seen when a host is added
      if (!hasSeenOnboarding) {
        setHasSeenOnboarding(true);
      }
    }
    
    toast({
      title: "Hosts Added",
      description: `Successfully added ${newHosts.length} new host${newHosts.length > 1 ? 's' : ''}`
    });
  };

  const handleAddServersToHost = () => {
    toast({
      title: "Add servers",
      description: "Select servers to add to this profile"
    });
  };
  
  const handleServerStatusChange = (serverId: string, status: 'running' | 'stopped' | 'error' | 'connecting') => {
    setServerInstances(prev => prev.map(server => server.id === serverId ? {
      ...server,
      status
    } : server));
  };
  
  const handleSaveProfileChanges = () => {
    toast({
      title: "Profile Saved",
      description: "Changes to profile have been saved."
    });
  };
  
  const handleProfileChange = (profileId: string) => {
    if (selectedHost) {
      updateProfileInHook(selectedHost.id, profileId);
      
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
    
    setProfilesList(prev => [...prev, newProfile]);
    
    toast({
      title: "Profile Created",
      description: `New profile "${profileName}" has been created`
    });
    
    return newProfileId;
  };
  
  const handleDeleteProfile = (profileId: string) => {
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
  };
  
  const handleDeleteHost = (hostId: string) => {
    setHostsList(prev => prev.filter(h => h.id !== hostId));
    
    if (selectedHostId === hostId) {
      const remainingHosts = hostsList.filter(h => h.id !== hostId);
      setSelectedHostId(remainingHosts.length > 0 ? remainingHosts[0].id : null);
    }
    
    toast({
      title: "Host Deleted",
      description: "The host has been removed successfully"
    });
  };

  const handleAddServersToProfile = (servers: ServerInstance[]) => {
    const newServerIds = servers.map(server => server.id);
    
    const newServers = servers.filter(server => 
      !serverInstances.some(existingServer => existingServer.id === server.id)
    );
    
    if (newServers.length > 0) {
      setServerInstances(prev => [...prev, ...newServers]);
    }
    
    if (selectedProfileId) {
      setProfilesList(prev => prev.map(profile => {
        if (profile.id === selectedProfileId) {
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
  };

  const handleCompleteOnboarding = () => {
    setHasSeenOnboarding(true);
  };

  // Updated this function to be used when clicking the "Add your First Host" button
  const handleOpenAddHostDialog = () => {
    setUnifiedHostDialogOpen(true);
  };

  // Render appropriate content based on state
  if (!hasSeenOnboarding) {
    return (
      <Welcome 
        onAddHosts={handleOpenAddHostDialog} 
        onSkip={handleCompleteOnboarding}
      />
    );
  }

  if (hostsList.length === 0) {
    return (
      <HostsEmptyState onAddHost={handleOpenAddHostDialog} />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your hosts, profiles, and servers to efficiently configure your MCP environment
          </p>
        </div>
      </div>
      
      {/* Removed search input section */}
      
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
            <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed rounded-lg mb-6">
              <Info className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-1">No hosts found</h3>
              <p className="text-muted-foreground mb-4">
                No hosts were found in your system
              </p>
              <Button variant="outline" onClick={handleOpenAddHostDialog}>
                Add Host
              </Button>
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
