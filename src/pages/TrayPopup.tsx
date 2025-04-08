
import { useState, useEffect } from "react";
import { Check, ChevronDown, ExternalLink, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { profiles, hosts, serverInstances, serverDefinitions } from "@/data/mockData";
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

interface InstanceStatus {
  id: string;
  definitionId: string;
  name: string;
  status: 'running' | 'connecting' | 'error' | 'stopped';
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
  
  // State for profile change confirmation dialog
  const [profileChangeDialog, setProfileChangeDialog] = useState({
    isOpen: false,
    hostId: "",
    profileId: "",
    profileName: "",
  });
  
  // Track instance status for each profile
  const [instanceStatuses, setInstanceStatuses] = useState<Record<string, InstanceStatus[]>>({});
  
  // Track expanded state for instance lists
  const [expandedHosts, setExpandedHosts] = useState<Record<string, boolean>>({});

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
    
    // Simulate connecting to new instances
    initializeProfileInstances(hostId, profileId);
    
    // Close dialog and show toast
    setProfileChangeDialog(prev => ({ ...prev, isOpen: false }));
    toast.success("Profile configuration updated successfully");
  };

  // Initialize instance statuses for a host's profile
  const initializeProfileInstances = (hostId: string, profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    if (!profile) return;
    
    // Get all instances for this profile
    const profileInstanceIds = profile.instances;
    
    // Create initial instance statuses all in connecting state
    const initialInstances: InstanceStatus[] = profileInstanceIds
      .map(instanceId => {
        const instance = serverInstances.find(s => s.id === instanceId);
        return instance ? {
          id: instance.id,
          definitionId: instance.definitionId,
          name: instance.name,
          status: 'connecting',
          enabled: instance.enabled
        } : null;
      })
      .filter(Boolean) as InstanceStatus[];
    
    // Update statuses
    setInstanceStatuses(prev => ({
      ...prev,
      [hostId]: initialInstances
    }));
    
    // Simulate connecting instances with different timings
    initialInstances.forEach((instance, index) => {
      setTimeout(() => {
        setInstanceStatuses(prev => {
          const hostInstances = [...(prev[hostId] || [])];
          const instanceIndex = hostInstances.findIndex(i => i.id === instance.id);
          
          if (instanceIndex !== -1) {
            // Match the original instance status from serverInstances
            const originalInstance = serverInstances.find(s => s.id === instance.id);
            hostInstances[instanceIndex] = {
              ...hostInstances[instanceIndex],
              status: originalInstance?.status || 'stopped'
            };
          }
          
          return {
            ...prev,
            [hostId]: hostInstances
          };
        });
      }, 1000 + (index * 500)); // Stagger the connections
    });
  };

  // Toggle instance enabled state
  const toggleInstanceEnabled = (hostId: string, instanceId: string) => {
    setInstanceStatuses(prev => {
      const hostInstances = [...(prev[hostId] || [])];
      const instanceIndex = hostInstances.findIndex(i => i.id === instanceId);
      
      if (instanceIndex !== -1) {
        hostInstances[instanceIndex] = {
          ...hostInstances[instanceIndex],
          enabled: !hostInstances[instanceIndex].enabled,
          // If enabling, set to connecting first
          status: !hostInstances[instanceIndex].enabled ? 'connecting' : 'stopped'
        };
        
        // If enabling, simulate connection after a delay
        if (!hostInstances[instanceIndex].enabled) {
          setTimeout(() => {
            setInstanceStatuses(prevState => {
              const updatedHostInstances = [...(prevState[hostId] || [])];
              const idx = updatedHostInstances.findIndex(i => i.id === instanceId);
              
              if (idx !== -1 && updatedHostInstances[idx].status === 'connecting') {
                updatedHostInstances[idx] = {
                  ...updatedHostInstances[idx],
                  status: Math.random() > 0.2 ? 'running' : 'error'
                };
              }
              
              return {
                ...prevState,
                [hostId]: updatedHostInstances
              };
            });
          }, 1500);
        }
      }
      
      return {
        ...prev,
        [hostId]: hostInstances
      };
    });
    
    // Show toast
    toast.success(`Server instance ${!instanceStatuses[hostId]?.find(i => i.id === instanceId)?.enabled ? 'enabled' : 'disabled'}`);
  };

  // Handle instance selection
  const handleInstanceChange = (hostId: string, definitionId: string, instanceId: string) => {
    setActiveInstances(prev => {
      const hostInstances = {...(prev[hostId] || {})};
      hostInstances[definitionId] = instanceId;
      
      return {
        ...prev,
        [hostId]: hostInstances
      };
    });
    
    // This would be where you'd make an API call to actually change the active instance
    console.log(`Changed instance for ${definitionId} to ${instanceId} for host ${hostId}`);
    toast.success("Server instance activated");
  };

  // Toggle expanded state for instance list
  const toggleExpanded = (hostId: string) => {
    setExpandedHosts(prev => ({
      ...prev,
      [hostId]: !prev[hostId]
    }));
  };

  // Group instances by definition for a host
  const getInstancesByDefinition = (hostId: string) => {
    const profileId = selectedProfileIds[hostId];
    if (!profileId) return [];
    
    const profile = profiles.find(p => p.id === profileId);
    if (!profile) return [];
    
    const hostStatusInstances = instanceStatuses[hostId] || [];
    const result: Array<{
      definition: typeof serverDefinitions[0],
      instances: typeof serverInstances,
      activeInstanceId: string,
      status: InstanceStatus | undefined
    }> = [];
    
    // Get all definition IDs for instances in this profile
    const definitionIds = new Set<string>();
    hostStatusInstances.forEach(instance => {
      definitionIds.add(instance.definitionId);
    });
    
    // For each definition, get its instances
    definitionIds.forEach(defId => {
      const definition = serverDefinitions.find(d => d.id === defId);
      if (!definition) return;
      
      // Get instances for this definition in this profile
      const definitionInstances = serverInstances.filter(instance => 
        instance.definitionId === defId && 
        profile.instances.includes(instance.id)
      );
      
      // Get the active instance ID for this definition
      const activeInstanceId = activeInstances[hostId]?.[defId] || definitionInstances[0]?.id || '';
      
      // Get status for this definition
      const status = hostStatusInstances.find(s => s.definitionId === defId);
      
      result.push({
        definition,
        instances: definitionInstances,
        activeInstanceId,
        status
      });
    });
    
    return result;
  };

  // Initialize instances for hosts with selected profiles on component mount
  useEffect(() => {
    hosts.forEach(host => {
      const profileId = selectedProfileIds[host.id];
      if (profileId) {
        initializeProfileInstances(host.id, profileId);
      }
    });
  }, []);
  
  const openDashboard = () => {
    window.open("/", "_blank");
  };

  // Filter to only show connected/active hosts
  const activeHosts = hosts.filter(h => 
    h.connectionStatus === 'connected' || h.profileId
  );
  
  return (
    <div className="w-[360px] p-2 bg-background rounded-lg shadow-lg animate-fade-in max-h-[80vh]">
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
      
      <ScrollArea className="h-full max-h-[calc(80vh-60px)]">
        <div className="pr-3">
          {activeHosts.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <p>No active connections</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeHosts.map(host => {
                const profileId = selectedProfileIds[host.id] || '';
                const profile = profiles.find(p => p.id === profileId);
                const isExpanded = expandedHosts[host.id] || false;
                const instanceGroups = getInstancesByDefinition(host.id);
                
                // Count total instances to determine if we need expand/collapse button
                const totalInstances = instanceGroups.length;
                const showExpandCollapse = totalInstances > 2;
                
                // Get the instances to display (all if expanded, only first 2 if collapsed)
                const displayInstances = isExpanded ? instanceGroups : instanceGroups.slice(0, 2);
                
                return (
                  <Card key={host.id} className="overflow-hidden shadow-sm">
                    <div className="flex items-center justify-between p-3 bg-card">
                      <div className="flex items-center gap-2">
                        <div className="bg-slate-900 text-white p-1 rounded w-8 h-8 flex items-center justify-center">
                          {host.icon ? <span className="text-lg">{host.icon}</span> : host.name.substring(0, 1)}
                        </div>
                        <h3 className="font-medium">{host.name}</h3>
                      </div>
                      <StatusIndicator 
                        status={host.connectionStatus === 'connected' ? 'active' : 'inactive'} 
                        label={host.connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
                      />
                    </div>
                    
                    <div className="p-3 pt-2">
                      {/* Profile selector */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Profile:</span>
                        <Select
                          value={profileId}
                          onValueChange={(value) => handleProfileChange(host.id, value)}
                        >
                          <SelectTrigger className="h-8 flex-1">
                            <SelectValue placeholder="Select profile">
                              {profile && (
                                <div className="flex items-center gap-2">
                                  <StatusIndicator 
                                    status={profile.enabled ? 'active' : 'inactive'} 
                                  />
                                  <span>{profile.name}</span>
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
                                  <span>{profile.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Server instances */}
                      {profileId && displayInstances.length > 0 && (
                        <div className="mt-3 bg-slate-50 rounded-md p-3">
                          <p className="text-xs text-muted-foreground mb-2">Active server instances:</p>
                          <div className="space-y-2">
                            {displayInstances.map(({ definition, instances, activeInstanceId, status }) => (
                              <div key={definition.id} className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                  <span className="text-sm font-medium">{definition.name}</span>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  {/* Instance selector */}
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="h-8 text-xs px-2 py-1 flex items-center gap-1"
                                      >
                                        <StatusIndicator 
                                          status={
                                            !status?.enabled ? 'inactive' :
                                            status.status === 'running' ? 'active' : 
                                            status.status === 'connecting' ? 'warning' :
                                            status.status === 'error' ? 'error' : 'inactive'
                                          } 
                                        />
                                        <span className="truncate max-w-[120px]">
                                          {instances.find(i => i.id === activeInstanceId)?.name.split('-').pop() || 'Select'}
                                        </span>
                                        <ChevronDown className="h-3 w-3" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-40">
                                      {instances.map(instance => (
                                        <DropdownMenuItem
                                          key={instance.id}
                                          className={cn(
                                            "text-xs flex items-center justify-between",
                                            instance.id === activeInstanceId && "bg-accent"
                                          )}
                                          onClick={() => handleInstanceChange(host.id, definition.id, instance.id)}
                                          disabled={instance.id === activeInstanceId}
                                        >
                                          <div className="flex items-center gap-1">
                                            <StatusIndicator 
                                              status={
                                                !status?.enabled ? 'inactive' :
                                                instance.status === 'running' ? 'active' : 
                                                instance.status === 'error' ? 'error' : 'inactive'
                                              } 
                                            />
                                            <span className="truncate max-w-[120px]">{instance.name.split('-').pop()}</span>
                                          </div>
                                          {instance.id === activeInstanceId && (
                                            <Check className="h-3 w-3" />
                                          )}
                                        </DropdownMenuItem>
                                      ))}
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                  
                                  {/* Toggle switch */}
                                  <Switch 
                                    checked={status?.enabled || false} 
                                    onCheckedChange={() => toggleInstanceEnabled(host.id, instances.find(i => i.id === activeInstanceId)?.id || '')}
                                  />
                                </div>
                              </div>
                            ))}
                            
                            {/* Expand/Collapse button */}
                            {showExpandCollapse && (
                              <div className="flex justify-end mt-1">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-xs text-primary flex items-center gap-1 h-6 px-2"
                                  onClick={() => toggleExpanded(host.id)}
                                >
                                  {isExpanded ? (
                                    <>
                                      <span>Collapse</span>
                                      <ChevronUp className="h-3 w-3" />
                                    </>
                                  ) : (
                                    <>
                                      <span>View all</span>
                                      <ChevronDown className="h-3 w-3" />
                                    </>
                                  )}
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* Empty state for no profile */}
                      {!profileId && (
                        <div className="mt-3 p-4 border-2 border-dashed rounded-md text-center text-muted-foreground">
                          <p className="text-sm">Select a profile to view server instances</p>
                        </div>
                      )}
                      
                      {/* Empty state for no instances */}
                      {profileId && displayInstances.length === 0 && (
                        <div className="mt-3 p-4 border-2 border-dashed rounded-md text-center text-muted-foreground">
                          <p className="text-sm">No server instances available</p>
                        </div>
                      )}
                    </div>
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
