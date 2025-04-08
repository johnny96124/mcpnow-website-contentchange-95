import { useState, useEffect } from "react";
import { Check, ChevronDown, ExternalLink, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { profiles, hosts, serverInstances, serverDefinitions, type Status, type ConnectionStatus } from "@/data/mockData";
import { StatusIndicator } from "@/components/status/StatusIndicator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProfileChangeConfirmDialog } from "@/components/tray/ProfileChangeConfirmDialog";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { NoSearchResults } from "@/components/hosts/NoSearchResults";

interface InstanceStatus {
  status: 'connected' | 'connecting' | 'error' | 'disconnected';
  enabled: boolean;
}

const TrayPopup = () => {
  const [selectedProfileIds, setSelectedProfileIds] = useState<Record<string, string>>(
    hosts.reduce((acc, host) => {
      if (host.profileId) {
        acc[host.id] = host.profileId;
      }
      return acc;
    }, {} as Record<string, string>)
  );

  // Track active instances for each profile and definition combination
  const [activeInstances, setActiveInstances] = useState<Record<string, Record<string, string>>>({});
  
  // Track instance status including connection state and enabled state
  const [instanceStatuses, setInstanceStatuses] = useState<Record<string, Record<string, InstanceStatus>>>({});

  // Track search query
  const [searchQuery, setSearchQuery] = useState("");
  
  // State for profile change confirmation dialog
  const [profileChangeDialog, setProfileChangeDialog] = useState({
    isOpen: false,
    hostId: "",
    profileId: "",
    profileName: "",
  });

  // Track connection status for profiles
  const [isConnecting, setIsConnecting] = useState<Record<string, boolean>>({});

  // Filter hosts based on search query
  const filteredHosts = hosts.filter(host => 
    host.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (host.connectionStatus === 'connected' || host.profileId)
  );

  const handleProfileChange = (hostId: string, profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    if (profile) {
      // Open confirmation dialog instead of immediately changing
      setProfileChangeDialog({
        isOpen: true,
        hostId,
        profileId,
        profileName: profile.name,
      });
    }
  };
  
  const confirmProfileChange = () => {
    const { hostId, profileId } = profileChangeDialog;
    
    // Actually perform the profile change
    setSelectedProfileIds(prev => ({
      ...prev,
      [hostId]: profileId
    }));

    // Set connecting state for this host's profile
    setIsConnecting(prev => ({
      ...prev,
      [hostId]: true
    }));
    
    // Initialize instance statuses for the new profile
    initializeInstanceStatuses(hostId, profileId);
    
    // Close dialog and show toast
    setProfileChangeDialog(prev => ({ ...prev, isOpen: false }));
    toast.success("Profile configuration updated successfully");
  };

  const initializeInstanceStatuses = (hostId: string, profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    if (!profile) return;

    const initialStatuses: Record<string, InstanceStatus> = {};
    
    // Get all definitions in this profile
    const definitionsInProfile = getServerDefinitionsInProfile(profileId);
    
    // For each definition, set all instances to connecting
    definitionsInProfile.forEach(definition => {
      initialStatuses[definition.id] = {
        status: 'connecting',
        enabled: true
      };
    });
    
    // Update instance statuses for this host
    setInstanceStatuses(prev => ({
      ...prev,
      [hostId]: initialStatuses
    }));
    
    // Simulate connection process
    simulateConnectionProcess(hostId, profileId, initialStatuses);
  };

  const simulateConnectionProcess = (
    hostId: string, 
    profileId: string, 
    initialStatuses: Record<string, InstanceStatus>
  ) => {
    const definitions = Object.keys(initialStatuses);
    
    // Simulate connecting with different timings
    definitions.forEach((definitionId, index) => {
      setTimeout(() => {
        setInstanceStatuses(prev => {
          const hostStatuses = { ...(prev[hostId] || {}) };
          const currentStatus = hostStatuses[definitionId];
          
          // Only update if enabled and status exists
          if (currentStatus && currentStatus.enabled) {
            // Random success chance (80% success)
            const success = Math.random() > 0.2;
            hostStatuses[definitionId] = {
              ...currentStatus,
              status: success ? 'connected' : 'error'
            };
          }
          
          return {
            ...prev,
            [hostId]: hostStatuses
          };
        });
        
        // After the last definition, set connecting to false
        if (index === definitions.length - 1) {
          setTimeout(() => {
            setIsConnecting(prev => ({
              ...prev,
              [hostId]: false
            }));
          }, 300);
        }
      }, 1000 + (index * 500)); // Stagger the connections
    });
  };

  const getStatusForProfile = (hostId: string, profileId: string) => {
    if (isConnecting[hostId]) return "connecting";
    
    const hostStatuses = instanceStatuses[hostId];
    if (!hostStatuses) return "inactive";
    
    const definitionStatuses = Object.values(hostStatuses);
    const enabledStatuses = definitionStatuses.filter(status => status.enabled);
    
    if (enabledStatuses.length === 0) return "inactive";
    
    const connectedCount = enabledStatuses.filter(status => status.status === 'connected').length;
    const errorCount = enabledStatuses.filter(status => status.status === 'error').length;
    
    if (connectedCount === enabledStatuses.length) return "active";
    if (errorCount === enabledStatuses.length) return "error";
    return "warning";
  };

  const handleInstanceToggle = (hostId: string, definitionId: string) => {
    setInstanceStatuses(prev => {
      const hostStatuses = { ...(prev[hostId] || {}) };
      const currentStatus = hostStatuses[definitionId];
      
      if (currentStatus) {
        hostStatuses[definitionId] = {
          ...currentStatus,
          enabled: !currentStatus.enabled,
          // If turning on, set to connecting, otherwise keep status
          status: !currentStatus.enabled ? 'connecting' : currentStatus.status
        };
      }
      
      return {
        ...prev,
        [hostId]: hostStatuses
      };
    });
    
    // If enabling, simulate connection
    const currentStatus = instanceStatuses[hostId]?.[definitionId];
    if (currentStatus && !currentStatus.enabled) {
      setTimeout(() => {
        setInstanceStatuses(prev => {
          const hostStatuses = { ...(prev[hostId] || {}) };
          const currentStatus = hostStatuses[definitionId];
          
          if (currentStatus) {
            // Random success chance (80% success)
            const success = Math.random() > 0.2;
            
            hostStatuses[definitionId] = {
              ...currentStatus,
              status: success ? 'connected' : 'error'
            };
          }
          
          return {
            ...prev,
            [hostId]: hostStatuses
          };
        });
      }, 1500);
    }
  };

  const handleInstanceChange = (profileId: string, definitionId: string, instanceId: string) => {
    setActiveInstances(prev => {
      const profileInstances = {...(prev[profileId] || {})};
      profileInstances[definitionId] = instanceId;
      
      return {
        ...prev,
        [profileId]: profileInstances
      };
    });
    
    // Update connecting status for this instance
    const affectedHosts = hosts.filter(h => 
      selectedProfileIds[h.id] === profileId
    ).map(h => h.id);
    
    // Set the affected hosts' statuses for this definition to connecting
    affectedHosts.forEach(hostId => {
      setInstanceStatuses(prev => {
        const hostStatuses = { ...(prev[hostId] || {}) };
        if (hostStatuses[definitionId] && hostStatuses[definitionId].enabled) {
          hostStatuses[definitionId] = {
            ...hostStatuses[definitionId],
            status: 'connecting'
          };
        }
        
        return {
          ...prev,
          [hostId]: hostStatuses
        };
      });
    });
    
    // Simulate instance activation
    setTimeout(() => {
      affectedHosts.forEach(hostId => {
        setInstanceStatuses(prev => {
          const hostStatuses = { ...(prev[hostId] || {}) };
          if (hostStatuses[definitionId] && hostStatuses[definitionId].enabled) {
            // 90% success chance for instance changes
            const success = Math.random() > 0.1;
            hostStatuses[definitionId] = {
              ...hostStatuses[definitionId],
              status: success ? 'connected' : 'error'
            };
          }
          
          return {
            ...prev,
            [hostId]: hostStatuses
          };
        });
      });
    }, 1200);
    
    toast.success("Server instance activated");
  };

  const getInstancesForDefinition = (profileId: string, definitionId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    if (!profile) return [];
    
    // Get all instances tied to this profile
    return serverInstances
      .filter(instance => 
        profile.instances.includes(instance.id) && 
        instance.definitionId === definitionId
      );
  };

  const getServerDefinitionsInProfile = (profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    if (!profile) return [];
    
    // Get profile instances
    const profileInstanceIds = profile.instances;
    const profileInstances = serverInstances.filter(inst => profileInstanceIds.includes(inst.id));
    
    // Get unique definition IDs from these instances
    const definitionIds = [...new Set(profileInstances.map(inst => inst.definitionId))];
    
    // Return the actual definition objects
    return serverDefinitions.filter(def => definitionIds.includes(def.id));
  };

  const openDashboard = () => {
    window.open("/", "_blank");
  };

  // Initialize connection statuses on first load
  useEffect(() => {
    // Initialize statuses for each host
    hosts.forEach(host => {
      if (host.profileId) {
        initializeInstanceStatuses(host.id, host.profileId);
      }
    });
  }, []);

  return (
    <div className="w-80 p-2 bg-background rounded-lg shadow-lg animate-fade-in max-h-[80vh]">
      <div className="flex items-center justify-between p-2 mb-2">
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/0ad4c791-4d08-4e94-bbeb-3ac78aae67ef.png" 
            alt="MCP Now Logo" 
            className="h-6 w-6" 
          />
          <h2 className="font-medium">MCP Now</h2>
        </div>
        <Button 
          size="sm" 
          variant="ghost"
          className="text-xs flex items-center gap-1"
          onClick={openDashboard}
        >
          <span>Open Dashboard</span>
          <ExternalLink className="h-3 w-3" />
        </Button>
      </div>
      
      <div className="mb-2 px-1">
        <input
          type="text"
          placeholder="Search hosts..."
          className="w-full px-3 py-1 text-sm border rounded-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <ScrollArea className="h-full max-h-[calc(80vh-94px)]">
        <div className="pr-3">
          {filteredHosts.length === 0 ? (
            searchQuery ? (
              <NoSearchResults 
                query={searchQuery} 
                onClear={() => setSearchQuery("")} 
              />
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                <p>No active connections</p>
              </div>
            )
          ) : (
            <div className="space-y-2">
              {filteredHosts.map(host => {
                const currentProfileId = selectedProfileIds[host.id] || '';
                const currentProfile = profiles.find(p => p.id === currentProfileId);
                const serverDefsInProfile = getServerDefinitionsInProfile(currentProfileId);
                const isHostConnecting = isConnecting[host.id];
                const profileStatus = getStatusForProfile(host.id, currentProfileId);
                
                return (
                  <Card key={host.id} className="overflow-hidden">
                    <CardHeader className="p-3 pb-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{host.icon}</span>
                          <h3 className="font-medium">{host.name}</h3>
                        </div>
                        <StatusIndicator 
                          status={
                            isHostConnecting ? 'warning' :
                            host.connectionStatus === 'connected' ? 'active' : 'inactive'
                          } 
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium">Profile:</span>
                        <Select
                          value={currentProfileId}
                          onValueChange={(value) => {
                            if (value === "add-new-profile") {
                              window.open("/profiles", "_blank");
                            } else {
                              handleProfileChange(host.id, value);
                            }
                          }}
                        >
                          <SelectTrigger className="w-48 h-8 text-sm">
                            <SelectValue placeholder="Select profile">
                              {currentProfile && (
                                <div className="flex items-center gap-2">
                                  <StatusIndicator 
                                    status={
                                      isHostConnecting ? 'warning' :
                                      profileStatus === 'active' ? 'active' :
                                      profileStatus === 'warning' ? 'warning' :
                                      profileStatus === 'error' ? 'error' : 'inactive'
                                    } 
                                  />
                                  <span className="truncate max-w-[120px]">{currentProfile.name}</span>
                                </div>
                              )}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {profiles.map(profile => (
                              <SelectItem key={profile.id} value={profile.id}>
                                <div className="flex items-center gap-2">
                                  <StatusIndicator 
                                    status={profile.enabled ? 'active' : 'inactive'} 
                                  />
                                  <span className="truncate max-w-[120px]">{profile.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                            <SelectItem value="add-new-profile" className="text-primary font-medium">
                              <div className="flex items-center gap-2">
                                <span>+ Add New Profile</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {currentProfile && serverDefsInProfile.length > 0 && (
                        <div className="mt-2 bg-muted rounded-md p-2">
                          <p className="text-xs text-muted-foreground mb-1">Server instances:</p>
                          <ScrollArea className="max-h-[105px]">
                            <ul className="text-xs space-y-1">
                              {serverDefsInProfile.map(definition => {
                                const instancesForDef = getInstancesForDefinition(currentProfileId, definition.id);
                                
                                // Get the currently active instance for this definition in this profile
                                const activeInstanceId = 
                                  (activeInstances[currentProfileId]?.[definition.id]) || 
                                  (instancesForDef[0]?.id);
                                
                                const activeInstance = instancesForDef.find(inst => inst.id === activeInstanceId) || instancesForDef[0];
                                
                                const instanceStatus = instanceStatuses[host.id]?.[definition.id] || {
                                  status: 'disconnected',
                                  enabled: false
                                };
                                
                                if (!activeInstance) return null;
                                
                                return (
                                  <li key={definition.id} className="flex items-center justify-between p-1 bg-background rounded">
                                    <div className="flex flex-col flex-1 min-w-0 mr-2">
                                      <div className="flex items-center gap-1">
                                        <StatusIndicator 
                                          status={
                                            !instanceStatus.enabled ? 'inactive' :
                                            instanceStatus.status === 'connected' ? 'active' :
                                            instanceStatus.status === 'connecting' ? 'warning' :
                                            instanceStatus.status === 'error' ? 'error' : 'inactive'
                                          } 
                                        />
                                        <span className="font-medium truncate">{definition.name}</span>
                                        {instanceStatus.status === 'connecting' && (
                                          <RefreshCw className="h-3 w-3 animate-spin text-muted-foreground ml-1" />
                                        )}
                                      </div>
                                      
                                      <div className="ml-4 text-muted-foreground truncate">
                                        {activeInstance.name.split('-').pop()}
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                      <Switch 
                                        checked={instanceStatus.enabled} 
                                        onCheckedChange={() => handleInstanceToggle(host.id, definition.id)}
                                        className="h-3 w-7"
                                      />
                                      
                                      {/* Instance selection dropdown */}
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="h-6 text-xs px-2 py-1 flex items-center gap-1 bg-secondary hover:bg-secondary/80"
                                            disabled={!instanceStatus.enabled}
                                          >
                                            <ChevronDown className="h-3 w-3 flex-shrink-0" />
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-40 bg-popover shadow-lg">
                                          {instancesForDef.map(instance => (
                                            <DropdownMenuItem
                                              key={instance.id}
                                              className={cn(
                                                "text-xs flex items-center justify-between",
                                                instance.id === activeInstanceId && "bg-accent"
                                              )}
                                              onClick={() => handleInstanceChange(currentProfileId, definition.id, instance.id)}
                                              disabled={instance.id === activeInstanceId || !instanceStatus.enabled}
                                            >
                                              <div className="flex items-center gap-1">
                                                <StatusIndicator 
                                                  status={
                                                    instance.status === 'running' ? 'active' : 
                                                    instance.status === 'error' ? 'error' : 'inactive'
                                                  } 
                                                />
                                                <span className="truncate max-w-[120px]">{instance.name.split('-').pop()}</span>
                                              </div>
                                              {instance.id === activeInstanceId && (
                                                <Check className="h-3 w-3 flex-shrink-0" />
                                              )}
                                            </DropdownMenuItem>
                                          ))}
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </div>
                                  </li>
                                );
                              })}
                            </ul>
                          </ScrollArea>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </ScrollArea>
      
      <ProfileChangeConfirmDialog
        open={profileChangeDialog.isOpen}
        onOpenChange={(open) => setProfileChangeDialog(prev => ({ ...prev, isOpen: open }))}
        onConfirm={confirmProfileChange}
        profileName={profileChangeDialog.profileName}
      />
    </div>
  );
};

export default TrayPopup;
