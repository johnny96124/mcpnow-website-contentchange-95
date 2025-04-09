
import { useState, useEffect } from "react";
import { CircleCheck, CircleX, CircleMinus, FilePlus, Settings2, PlusCircle, RefreshCw, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusIndicator } from "@/components/status/StatusIndicator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { profiles, serverInstances, serverDefinitions } from "@/data/mockData";
import { EndpointLabel } from "@/components/status/EndpointLabel";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface InstanceStatus {
  id: string;
  name: string;
  definitionId: string;
  definitionName: string;
  status: 'connected' | 'connecting' | 'error' | 'disconnected';
  enabled: boolean;
}

interface HostCardProps {
  host: {
    id: string;
    name: string;
    icon?: string;
    connectionStatus: 'connected' | 'disconnected' | 'misconfigured' | 'unknown' | 'connecting';
    configStatus: 'configured' | 'misconfigured' | 'unknown';
    configPath?: string;
    profileId?: string;
  };
  profileId: string;
  onProfileChange: (hostId: string, profileId: string) => void;
  onOpenConfigDialog: (hostId: string) => void;
  onCreateConfig: (hostId: string, profileId: string) => void;
}

export function HostCard({ 
  host, 
  profileId, 
  onProfileChange, 
  onOpenConfigDialog,
  onCreateConfig
}: HostCardProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [instanceStatuses, setInstanceStatuses] = useState<InstanceStatus[]>([]);
  const [activeInstances, setActiveInstances] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  
  // Calculate overall profile connection status based on instance statuses
  const getProfileConnectionStatus = () => {
    if (!instanceStatuses.length) return 'disconnected';
    
    const connectedCount = instanceStatuses.filter(i => i.status === 'connected' && i.enabled).length;
    const totalEnabledInstances = instanceStatuses.filter(i => i.enabled).length;
    
    if (connectedCount === 0) return 'error';
    if (connectedCount === totalEnabledInstances) return 'connected';
    return 'warning'; // Partially connected
  };
  
  // Get definition name from id
  const getDefinitionName = (definitionId: string) => {
    const definition = serverDefinitions.find(def => def.id === definitionId);
    return definition ? definition.name : 'Unknown';
  };
  
  // Simulate connection process when profile changes
  useEffect(() => {
    if (profileId) {
      const profile = profiles.find(p => p.id === profileId);
      
      if (profile) {
        // Reset instance statuses
        setIsConnecting(true);
        
        // Create initial instance statuses all in connecting state
        const initialStatuses: InstanceStatus[] = profile.instances
          .map(instanceId => {
            const instance = serverInstances.find(s => s.id === instanceId);
            return instance ? {
              id: instance.id,
              name: instance.name,
              definitionId: instance.definitionId,
              definitionName: getDefinitionName(instance.definitionId),
              status: 'connecting',
              enabled: true
            } : null;
          })
          .filter(Boolean) as InstanceStatus[];
          
        setInstanceStatuses(initialStatuses);
        
        // Initialize active instances
        const newActiveInstances: Record<string, string> = {};
        initialStatuses.forEach(instance => {
          if (!newActiveInstances[instance.definitionId]) {
            newActiveInstances[instance.definitionId] = instance.id;
          }
        });
        setActiveInstances(newActiveInstances);
        
        // Simulate connecting instances with different timings
        initialStatuses.forEach((instance, index) => {
          setTimeout(() => {
            setInstanceStatuses(prev => {
              const newStatuses = [...prev];
              const instanceIndex = newStatuses.findIndex(i => i.id === instance.id);
              
              if (instanceIndex !== -1) {
                // Randomly determine connection status (mostly successful)
                const success = Math.random() > 0.2;
                newStatuses[instanceIndex] = {
                  ...newStatuses[instanceIndex],
                  status: success ? 'connected' : 'error'
                };
              }
              
              return newStatuses;
            });
            
            // After the last instance, set connecting to false
            if (index === initialStatuses.length - 1) {
              setIsConnecting(false);
            }
          }, 1000 + (index * 500)); // Stagger the connections
        });
      }
    } else {
      setInstanceStatuses([]);
      setActiveInstances({});
    }
  }, [profileId]);
  
  const handleProfileChange = (newProfileId: string) => {
    if (newProfileId === "add-new-profile") {
      navigate("/profiles");
    } else {
      onProfileChange(host.id, newProfileId);
    }
  };
  
  const toggleInstanceEnabled = (instanceId: string) => {
    setInstanceStatuses(prev => {
      return prev.map(instance => {
        if (instance.id === instanceId) {
          return {
            ...instance,
            enabled: !instance.enabled
          };
        }
        return instance;
      });
    });
  };
  
  const handleInstanceChange = (definitionId: string, instanceId: string) => {
    // Set the new active instance for this definition
    setActiveInstances(prev => ({
      ...prev,
      [definitionId]: instanceId
    }));
    
    // Find the instance in the status list and set to connecting
    setInstanceStatuses(prev => {
      return prev.map(instance => {
        if (instance.id === instanceId) {
          return {
            ...instance,
            status: 'connecting'
          };
        }
        return instance;
      });
    });
    
    // Simulate connection process
    setTimeout(() => {
      setInstanceStatuses(prev => {
        return prev.map(instance => {
          if (instance.id === instanceId) {
            return {
              ...instance,
              status: Math.random() > 0.2 ? 'connected' : 'error'
            };
          }
          return instance;
        });
      });
    }, 1500);
  };
  
  // Group instances by definition
  const getInstancesByDefinition = () => {
    if (!profileId || !instanceStatuses.length) return [];
    
    const definitionMap = new Map<string, {
      definitionId: string;
      definitionName: string;
      instances: InstanceStatus[];
    }>();
    
    instanceStatuses.forEach(instance => {
      if (!definitionMap.has(instance.definitionId)) {
        definitionMap.set(instance.definitionId, {
          definitionId: instance.definitionId,
          definitionName: instance.definitionName,
          instances: []
        });
      }
      
      definitionMap.get(instance.definitionId)?.instances.push(instance);
    });
    
    return Array.from(definitionMap.values());
  };
  
  const profileConnectionStatus = getProfileConnectionStatus();
  const selectedProfile = profiles.find(p => p.id === profileId);
  const isConnected = host.connectionStatus === 'connected';
  const instancesByDefinition = getInstancesByDefinition();
  
  return (
    <Card className="overflow-hidden flex flex-col h-[400px]">
      <CardHeader className="bg-muted/50 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {host.icon && <span className="text-xl">{host.icon}</span>}
            <h3 className="font-medium text-lg">{host.name}</h3>
          </div>
          <div className="flex items-center gap-2">
            <StatusIndicator 
              status={
                isConnecting ? 'warning' :
                host.connectionStatus === 'connected' ? 'active' : 
                host.connectionStatus === 'disconnected' ? 'inactive' : 
                host.connectionStatus === 'misconfigured' ? 'error' : 'warning'
              } 
              label={
                isConnecting ? 'Connecting' :
                host.connectionStatus === 'connected' ? 'Connected' : 
                host.connectionStatus === 'disconnected' ? 'Disconnected' : 
                host.connectionStatus === 'misconfigured' ? 'Misconfigured' : 'Unknown'
              }
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-4 flex-1">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Associated Profile</label>
          </div>
          <Select
            value={profileId}
            onValueChange={handleProfileChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a profile">
                {selectedProfile && (
                  <div className="flex items-center gap-2">
                    {/* Only show status indicator when connected */}
                    {isConnected && (
                      <StatusIndicator 
                        status={
                          isConnecting ? 'warning' :
                          profileConnectionStatus === 'connected' ? 'active' : 
                          profileConnectionStatus === 'warning' ? 'warning' : 
                          'error'
                        } 
                      />
                    )}
                    <span className="truncate">{selectedProfile.name}</span>
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {profiles.map(profile => (
                <SelectItem key={profile.id} value={profile.id}>
                  {/* No status indicators in dropdown */}
                  <span className="truncate">{profile.name}</span>
                </SelectItem>
              ))}
              <SelectItem value="add-new-profile" className="text-primary font-medium">
                <div className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" />
                  <span>Add New Profile</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {profileId && isConnected && (
          <>
            {instancesByDefinition.length > 0 && (
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Server Instances</label>
                <ScrollArea className="h-[140px] border rounded-md p-1">
                  <div className="space-y-1">
                    {instancesByDefinition.map(({ definitionId, definitionName, instances }) => {
                      const activeInstanceId = activeInstances[definitionId] || instances[0]?.id;
                      const activeInstance = instances.find(i => i.id === activeInstanceId);
                      
                      return (
                        <div key={definitionId} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                          <div className="flex items-center gap-2">
                            {activeInstance && (
                              <StatusIndicator 
                                status={
                                  !activeInstance.enabled ? 'inactive' :
                                  activeInstance.status === 'connected' ? 'active' :
                                  activeInstance.status === 'connecting' ? 'warning' :
                                  activeInstance.status === 'error' ? 'error' : 'inactive'
                                }
                              />
                            )}
                            <div className="flex flex-col">
                              <span className="text-xs font-medium truncate">{definitionName}</span>
                              
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button className="flex items-center text-xs text-muted-foreground gap-1 hover:text-foreground">
                                    <span className="truncate max-w-[120px]">
                                      {activeInstance?.name || 'Select instance'}
                                    </span>
                                    <ChevronDown className="h-3 w-3" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="w-48">
                                  {instances.map(instance => (
                                    <DropdownMenuItem
                                      key={instance.id}
                                      className={cn(
                                        "text-xs",
                                        instance.id === activeInstanceId && "bg-accent"
                                      )}
                                      onClick={() => handleInstanceChange(definitionId, instance.id)}
                                      disabled={instance.id === activeInstanceId}
                                    >
                                      <span className="truncate">{instance.name}</span>
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            {activeInstance?.status === 'connecting' && (
                              <RefreshCw className="h-3 w-3 animate-spin text-muted-foreground ml-auto" />
                            )}
                          </div>
                          
                          {activeInstance && (
                            <Switch 
                              checked={activeInstance.enabled} 
                              onCheckedChange={() => toggleInstanceEnabled(activeInstanceId)}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>
            )}
          </>
        )}
        
        {!profileId && (
          <div className="flex items-center justify-center p-4 border-2 border-dashed rounded-md">
            <p className="text-muted-foreground text-center">
              Select a profile to view connection details
            </p>
          </div>
        )}
        
        {/* Empty state when disconnected */}
        {profileId && !isConnected && (
          <div className="flex items-center justify-center p-4 border-2 border-dashed rounded-md">
            <p className="text-muted-foreground text-center">
              Host is disconnected. Server instances will be displayed when connected.
            </p>
          </div>
        )}
      </CardContent>
      
      <Separator className="mt-auto" />
      
      <CardFooter className="mt-2">
        <div className="flex justify-end w-full">
          {profileId && (
            !host.configPath ? (
              <Button 
                onClick={() => onCreateConfig(host.id, profileId)}
                disabled={!profileId}
              >
                <Settings2 className="h-4 w-4 mr-2" />
                Create Config
              </Button>
            ) : (
              <Button 
                variant="outline" 
                onClick={() => onOpenConfigDialog(host.id)}
                disabled={!host.configPath}
              >
                <FilePlus className="h-4 w-4 mr-2" />
                View Config
              </Button>
            )
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
