
import { useState, useEffect } from "react";
import { CircleCheck, CircleX, CircleMinus, FilePlus, Settings2, PlusCircle, RefreshCw, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusIndicator } from "@/components/status/StatusIndicator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { profiles, serverInstances, serverDefinitions, EndpointType } from "@/data/mockData";
import { EndpointLabel } from "@/components/status/EndpointLabel";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { FileText } from "lucide-react";

interface InstanceStatus {
  id: string;
  name: string;
  definitionId: string;
  definitionName: string;
  status: 'connected' | 'connecting' | 'error' | 'disconnected';
  enabled: boolean;
  errorMessage?: string;
  requestCount: number;
  startedAt: Date;
  lastActivityAt?: Date;
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
  onViewLogs?: (instanceId: string, hostId: string) => void;
}

export function HostCard({ 
  host, 
  profileId, 
  onProfileChange, 
  onOpenConfigDialog,
  onCreateConfig,
  onViewLogs
}: HostCardProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [instanceStatuses, setInstanceStatuses] = useState<InstanceStatus[]>([]);
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
  
  // Get definition type from id
  const getDefinitionType = (definitionId: string) => {
    const definition = serverDefinitions.find(def => def.id === definitionId);
    return definition ? definition.type : 'Custom';
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
              enabled: instance.enabled,
              requestCount: 0,
              startedAt: new Date(),
              lastActivityAt: undefined,
              errorMessage: undefined
            } : null;
          })
          .filter(Boolean) as InstanceStatus[];
          
        setInstanceStatuses(initialStatuses);
        
        // Simulate connecting instances with different timings
        initialStatuses.forEach((instance, index) => {
          setTimeout(() => {
            setInstanceStatuses(prev => {
              const newStatuses = [...prev];
              const instanceIndex = newStatuses.findIndex(i => i.id === instance.id);
              
              if (instanceIndex !== -1) {
                // Randomly determine connection status (mostly successful)
                const success = Math.random() > 0.2;
                const now = new Date();
                
                if (success) {
                  newStatuses[instanceIndex] = {
                    ...newStatuses[instanceIndex],
                    status: 'connected',
                    requestCount: Math.floor(Math.random() * 15) + 1,
                    lastActivityAt: new Date(now.getTime() - Math.floor(Math.random() * 300000))
                  };
                } else {
                  newStatuses[instanceIndex] = {
                    ...newStatuses[instanceIndex],
                    status: 'error',
                    errorMessage: `Failed to connect: ${Math.random() > 0.5 ? 'Connection timeout' : 'Invalid endpoint configuration'}`
                  };
                }
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
          if (instance.enabled) {
            // If disabling, set to disconnected
            return {
              ...instance,
              enabled: false,
              status: 'disconnected'
            };
          } else {
            // If enabling, set to connecting and simulate connection process
            setTimeout(() => {
              setInstanceStatuses(prevState => {
                return prevState.map(inst => {
                  if (inst.id === instanceId && inst.status === 'connecting') {
                    const success = Math.random() > 0.2;
                    return {
                      ...inst,
                      status: success ? 'connected' : 'error',
                      errorMessage: success ? undefined : 'Failed to connect: Connection refused',
                      requestCount: success ? Math.floor(Math.random() * 10) : 0
                    };
                  }
                  return inst;
                });
              });
            }, 1500);
            
            return {
              ...instance,
              enabled: true,
              status: 'connecting',
              startedAt: new Date()
            };
          }
        }
        return instance;
      });
    });
  };
  
  const handleViewInstanceLogs = (instanceId: string) => {
    if (onViewLogs) {
      onViewLogs(instanceId, host.id);
    }
  };
  
  const profileConnectionStatus = getProfileConnectionStatus();
  const selectedProfile = profiles.find(p => p.id === profileId);
  
  // Format time diff for "last seen" display
  const formatTimeDiff = (date?: Date) => {
    if (!date) return 'Never';
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000); // seconds
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };
  
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
                isConnecting ? 'connecting' :
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
                    <StatusIndicator 
                      status={
                        isConnecting ? 'connecting' :
                        profileConnectionStatus === 'connected' ? 'active' : 
                        profileConnectionStatus === 'warning' ? 'warning' : 
                        'error'
                      } 
                    />
                    <span>{selectedProfile.name}</span>
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {profiles.map(profile => (
                <SelectItem key={profile.id} value={profile.id}>
                  <div className="flex items-center gap-2">
                    <StatusIndicator status={profile.enabled ? 'active' : 'inactive'} />
                    <span>{profile.name}</span>
                  </div>
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
        
        {profileId && (
          <>
            {instanceStatuses.length > 0 && (
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Runtime Instances</label>
                  {isConnecting && (
                    <span className="text-xs flex items-center text-muted-foreground">
                      <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                      Connecting...
                    </span>
                  )}
                </div>
                <ScrollArea className="h-[180px] border rounded-md p-1">
                  <div className="space-y-2">
                    {instanceStatuses.map(instance => (
                      <div key={instance.id} className="p-2 bg-muted/50 rounded">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <StatusIndicator 
                              status={
                                !instance.enabled ? 'disconnected' :
                                instance.status === 'connected' ? 'connected' :
                                instance.status === 'connecting' ? 'connecting' :
                                instance.status === 'error' ? 'failed' : 'disconnected'
                              }
                            />
                            <div className="text-sm font-medium">
                              {instance.definitionName}
                              <EndpointLabel 
                                type={getDefinitionType(instance.definitionId) as EndpointType} 
                                compact 
                                className="ml-2" 
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {instance.status === 'connected' && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-6 w-6" 
                                      onClick={() => handleViewInstanceLogs(instance.id)}
                                    >
                                      <FileText className="h-3.5 w-3.5" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>View logs</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                            <Switch 
                              checked={instance.enabled} 
                              onCheckedChange={() => toggleInstanceEnabled(instance.id)}
                              className="data-[state=checked]:bg-green-500"
                            />
                          </div>
                        </div>
                        
                        <div className="text-xs text-muted-foreground flex flex-col">
                          <div className="flex justify-between">
                            <span>{instance.name}</span>
                            {instance.status === 'connected' && (
                              <span>{instance.requestCount} requests</span>
                            )}
                          </div>
                          
                          {instance.status === 'connected' && instance.lastActivityAt && (
                            <div className="text-right">
                              Last activity: {formatTimeDiff(instance.lastActivityAt)}
                            </div>
                          )}
                          
                          {instance.status === 'error' && instance.errorMessage && (
                            <div className="flex items-center gap-1 text-red-500 mt-1">
                              <AlertCircle className="h-3 w-3" />
                              <span>{instance.errorMessage}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
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
