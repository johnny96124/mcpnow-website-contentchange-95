
import { useState } from "react";
import { Check, ChevronDown, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
    
    // Close dialog and show toast
    setProfileChangeDialog(prev => ({ ...prev, isOpen: false }));
    toast.success("Profile configuration updated successfully");
  };

  const getStatusForProfile = (profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    if (!profile) return "inactive";
    if (!profile.enabled) return "inactive";
    
    // Check if any instances are running
    const profileInstances = serverInstances.filter(
      inst => profile.instances.includes(inst.id)
    );
    
    if (profileInstances.some(inst => inst.status === "error")) return "error";
    if (profileInstances.some(inst => inst.status === "running")) return "active";
    return "inactive";
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
    
    // This would be where you'd make an API call to actually change the active instance
    console.log(`Changed instance for ${definitionId} to ${instanceId} in profile ${profileId}`);
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

  // Filter to only show connected/active hosts
  const activeHosts = hosts.filter(h => 
    h.connectionStatus === 'connected' || h.profileId
  );

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
      
      <ScrollArea className="h-full max-h-[calc(80vh-60px)]">
        <div className="pr-3">
          {activeHosts.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <p>No active connections</p>
            </div>
          ) : (
            <div className="space-y-2">
              {activeHosts.map(host => {
                const currentProfileId = selectedProfileIds[host.id] || '';
                const currentProfile = profiles.find(p => p.id === currentProfileId);
                const serverDefsInProfile = getServerDefinitionsInProfile(currentProfileId);
                
                return (
                  <Card key={host.id} className="overflow-hidden">
                    <CardHeader className="p-3 pb-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{host.icon}</span>
                          <h3 className="font-medium truncate" title={host.name}>{host.name}</h3>
                        </div>
                        <StatusIndicator 
                          status={host.connectionStatus === 'connected' ? 'active' : 'inactive'} 
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium">Profile:</span>
                        <Select
                          value={currentProfileId}
                          onValueChange={(value) => handleProfileChange(host.id, value)}
                        >
                          <SelectTrigger className="w-48 h-8 text-sm">
                            <SelectValue placeholder="Select profile">
                              {currentProfile && (
                                <div className="flex items-center gap-2">
                                  <StatusIndicator 
                                    status={getStatusForProfile(currentProfile.id)} 
                                  />
                                  <span className="truncate max-w-[120px]" title={currentProfile.name}>{currentProfile.name}</span>
                                </div>
                              )}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {profiles.map(profile => (
                              <SelectItem key={profile.id} value={profile.id}>
                                <div className="flex items-center gap-2">
                                  <StatusIndicator 
                                    status={getStatusForProfile(profile.id)} 
                                  />
                                  <span className="truncate max-w-[120px]" title={profile.name}>{profile.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {currentProfile && serverDefsInProfile.length > 0 && (
                        <div className="mt-2 bg-muted rounded-md p-2">
                          <p className="text-xs text-muted-foreground mb-1">Active server instances:</p>
                          <ul className="text-xs space-y-1">
                            {serverDefsInProfile.map(definition => {
                              const instancesForDef = getInstancesForDefinition(currentProfileId, definition.id);
                              
                              // Get the currently active instance for this definition in this profile
                              const activeInstanceId = 
                                (activeInstances[currentProfileId]?.[definition.id]) || 
                                (instancesForDef[0]?.id);
                              
                              const activeInstance = instancesForDef.find(inst => inst.id === activeInstanceId) || instancesForDef[0];
                              
                              if (!activeInstance) return null;
                              
                              return (
                                <li key={definition.id} className="flex items-center justify-between">
                                  <div className="flex items-center gap-1">
                                    <StatusIndicator 
                                      status={
                                        activeInstance.status === 'running' ? 'active' : 
                                        activeInstance.status === 'error' ? 'error' : 'inactive'
                                      } 
                                    />
                                    <span className="truncate max-w-[120px]" title={definition.name}>{definition.name}</span>
                                  </div>
                                  
                                  {/* Direct instance selection dropdown */}
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="h-6 text-xs px-2 py-1 flex items-center gap-1 bg-secondary hover:bg-secondary/80"
                                      >
                                        <span className="truncate max-w-[80px]" title={activeInstance.name.split('-').pop()}>
                                          {activeInstance.name.split('-').pop()}
                                        </span>
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
                                          disabled={instance.id === activeInstanceId}
                                        >
                                          <div className="flex items-center gap-1">
                                            <StatusIndicator 
                                              status={
                                                instance.status === 'running' ? 'active' : 
                                                instance.status === 'error' ? 'error' : 'inactive'
                                              } 
                                            />
                                            <span className="truncate max-w-[120px]" title={instance.name.split('-').pop()}>
                                              {instance.name.split('-').pop()}
                                            </span>
                                          </div>
                                          {instance.id === activeInstanceId && (
                                            <Check className="h-3 w-3 flex-shrink-0" />
                                          )}
                                        </DropdownMenuItem>
                                      ))}
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </li>
                              );
                            })}
                          </ul>
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
        hostId={profileChangeDialog.hostId}
        profileId={profileChangeDialog.profileId}
      />
    </div>
  );
};

export default TrayPopup;
