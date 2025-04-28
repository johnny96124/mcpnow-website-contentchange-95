
import { useState, useEffect } from "react";
import { Plus, Info, X } from "lucide-react";
import { SearchIcon } from "lucide-react"; // Changed from importing Search to SearchIcon
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
    // Mark hosts onboarding as seen
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
    handleProfileChange: updateProfileInHook, // Renamed to avoid conflict
  } = useHostProfiles();

  const {
    configDialog,
    openConfigDialog,
    setDialogOpen,
    resetConfigDialog
  } = useConfigDialog(mockJsonConfig);

  const { toast } = useToast();

  const filteredHosts = hostsList.filter(host => host.name.toLowerCase().includes(searchQuery.toLowerCase()));
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
      // Update host config status
      setHostsList(prev => prev.map(host => host.id === configDialog.hostId ? {
        ...host,
        configPath,
        configStatus: 'configured',
        connectionStatus: 'connected'
      } : host));
      
      // Auto-create a profile for this host
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
    setHostsList(prev => [...prev, ...newHosts]);
    setSelectedHostId(newHosts[0].id);
    
    toast({
      title: "Hosts Added",
      description: `Successfully added ${newHosts.length} new host${newHosts.length > 1 ? 's' : ''}`
    });
  };

  const handleAddServersToHost = () => {
    // This function now opens the server selection dialog in HostDetailView
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
    // Don't delete a profile if it's the only one
    if (profilesList.length <= 1) {
      toast({
        title: "Cannot delete profile",
        description: "You must have at least one profile",
        type: "error"
      });
      return;
    }
    
    // Remove the profile
    setProfilesList(prev => prev.filter(p => p.id !== profileId));
    
    // If the deleted profile was selected, select another one
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

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hosts</h1>
          <p className="text-muted-foreground">
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
            onClick={() => setSearchQuery("")}
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
          
          <Card className="border-2 border-dashed bg-muted/20 hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setUnifiedHostDialogOpen(true)}>
            <CardContent className="p-4 text-center space-y-2">
              <Plus className="h-6 w-6 mx-auto text-muted-foreground" />
              <p className="text-sm font-medium">Add New Host</p>
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
            />
          ) : (
            <div className="border border-dashed rounded-md p-8 text-center space-y-3">
              <Info className="h-8 w-8 mx-auto text-muted-foreground" />
              <h3 className="text-lg font-medium">No Host Selected</h3>
              <p className="text-muted-foreground">
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
