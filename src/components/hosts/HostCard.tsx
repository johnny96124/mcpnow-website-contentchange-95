import { useState, useEffect } from "react";
import { CircleCheck, CircleX, CircleMinus, FilePlus, Settings2, PlusCircle, RefreshCw, ChevronDown, FileCheck } from "lucide-react";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

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
  onFixConfig: (hostId: string) => void;
}

export function HostCard({ 
  host, 
  profileId, 
  onProfileChange, 
  onOpenConfigDialog,
  onCreateConfig,
  onFixConfig
}: HostCardProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [instanceStatuses, setInstanceStatuses] = useState<InstanceStatus[]>([]);
  const navigate = useNavigate();
  
  const isHostDisconnected = host.connectionStatus === 'disconnected' || host.connectionStatus === 'unknown';
  
  const getProfileConnectionStatus = () => {
    if (!instanceStatuses.length) return 'disconnected';
    
    const connectedCount = instanceStatuses.filter(i => i.status === 'connected' && i.enabled).length;
    const totalEnabledInstances = instanceStatuses.filter(i => i.enabled).length;
    
    if (connectedCount === 0) return 'error';
    if (connectedCount === totalEnabledInstances) return 'connected';
    return 'warning'; // Partially connected
  };
  
  const getDefinitionName = (definitionId: string) => {
    const definition = serverDefinitions.find(def => def.id === definitionId);
    return definition ? definition.name : 'Unknown';
  };
  
  const getConfigStatusInfo = () => {
    if (host.configStatus === 'configured') {
      return { 
        icon: <FileCheck className="h-4 w-4 text-green-500" />,
        text: 'Correctly configured', 
        color: 'bg-green-100 text-green-800 border-green-200'
      };
    } else {
      return { 
        icon: <CircleMinus className="h-4 w-4 text-gray-500" />,
        text: 'No config', 
        color: 'bg-gray-100 text-gray-800 border-gray-200'
      };
    }
  };
  
  useEffect(() => {
    if (profileId) {
      const profile = profiles.find(p => p.id === profileId);
      
      if (profile) {
        setIsConnecting(true);
        
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
        
        initialStatuses.forEach((instance, index) => {
          setTimeout(() => {
            setInstanceStatuses(prev => {
              const newStatuses = [...prev];
              const instanceIndex = newStatuses.findIndex(i => i.id === instance.id);
              
              if (instanceIndex !== -1) {
                const success = Math.random() > 0.2;
                newStatuses[instanceIndex] = {
                  ...newStatuses[instanceIndex],
                  status: success ? 'connected' : 'error'
                };
              }
              
              return newStatuses;
            });
            
            if (index === initialStatuses.length - 1) {
              setIsConnecting(false);
            }
          }, 1000 + (index * 500));
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
          return {
            ...instance,
            enabled: !instance.enabled
          };
        }
        return instance;
      });
    });
  };

  const handleSelectInstance = (instanceId: string, definitionId: string) => {
    const definitionInstances = instanceStatuses.filter(i => i.definitionId === definitionId);
    
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
    
    setTimeout(() => {
      setInstanceStatuses(prev => {
        return prev.map(instance => {
          if (instance.id === instanceId) {
            const success = Math.random() > 0.2;
            return {
              ...instance,
              status: success ? 'connected' : 'error'
            };
          }
          return instance;
        });
      });
    }, 1000);
  };
  
  const getInstancesByDefinition = () => {
    const definitionMap = new Map<string, InstanceStatus[]>();
    
    instanceStatuses.forEach(instance => {
      const defInstances = definitionMap.get(instance.definitionId) || [];
      defInstances.push(instance);
      definitionMap.set(instance.definitionId, defInstances);
    });
    
    return definitionMap;
  };
  
  const profileConnectionStatus = getProfileConnectionStatus();
  const selectedProfile = profiles.find(p => p.id === profileId);
  const instancesByDefinition = getInstancesByDefinition();
  const configStatusInfo = getConfigStatusInfo();
  
  const needsConfig = host.configStatus === 'misconfigured' || host.configStatus === 'unknown';
  
  return (
    <Card className="overflow-hidden flex flex-col h-[400px]">
      <CardHeader className="bg-muted/50 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {host.icon && <span className="text-xl">{host.icon}</span>}
            <h3 className="font-medium text-lg">{host.name}</h3>
            
            <Badge variant="outline" className={cn("ml-2 text-xs flex items-center gap-1", configStatusInfo.color)}>
              {configStatusInfo.icon}
              {configStatusInfo.text}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <StatusIndicator 
              status={
                isConnecting ? 'warning' :
                host.connectionStatus === 'connected' ? 'active' : 
                host.connectionStatus === 'disconnected' ? 'inactive' : 
                host.connectionStatus === 'misconfigured' || host.configStatus === 'misconfigured' ? 'inactive' : 
                host.configStatus === 'unknown' ? 'warning' : 'inactive'
              } 
              label={
                isConnecting ? 'Connecting' :
                host.connectionStatus === 'connected' ? 'Connected' : 
                host.connectionStatus === 'disconnected' ? 'Disconnected' : 
                host.connectionStatus === 'misconfigured' || host.configStatus === 'misconfigured' ? 'Disconnected' : 'Unknown'
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
                    {!isHostDisconnected && (
                      <StatusIndicator 
                        status={
                          isConnecting ? 'warning' :
                          profileConnectionStatus === 'connected' ? 'active' : 
                          profileConnectionStatus === 'warning' ? 'warning' : 
                          'error'
                        } 
                      />
                    )}
                    <span>{selectedProfile.name}</span>
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {profiles.map(profile => (
                <SelectItem key={profile.id} value={profile.id}>
                  <div className="flex items-center gap-2">
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
                <label className="text-sm font-medium">Server Instances</label>
                <ScrollArea className="h-[140px] border rounded-md p-1">
                  <div className="space-y-1">
                    {Array.from(instancesByDefinition.entries()).map(([definitionId, instances]) => {
                      const displayInstance = instances[0];
                      
                      return (
                        <div key={definitionId} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                          <div className="flex items-center gap-2">
                            <StatusIndicator 
                              status={
                                isHostDisconnected ? 'none' :
                                !displayInstance.enabled ? 'inactive' :
                                displayInstance.status === 'connected' ? 'active' :
                                displayInstance.status === 'connecting' ? 'warning' :
                                displayInstance.status === 'error' ? 'error' : 'inactive'
                              }
                            />
                            <div className="text-sm">
                              <span className="font-medium">{displayInstance.definitionName}</span>
                              
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-6 px-1 py-0 ml-1"
                                  >
                                    <span className="text-xs text-muted-foreground">
                                      {displayInstance.name.split('-').pop()}
                                    </span>
                                    <ChevronDown className="h-3 w-3 ml-1" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-48 p-1">
                                  <div className="space-y-1">
                                    {instances.map(instance => (
                                      <Button
                                        key={instance.id}
                                        variant={displayInstance.id === instance.id ? "secondary" : "ghost"}
                                        size="sm"
                                        className={cn(
                                          "w-full justify-start text-xs",
                                          displayInstance.id === instance.id && "font-medium"
                                        )}
                                        onClick={() => handleSelectInstance(instance.id, definitionId)}
                                      >
                                        {instance.name.split('-').pop()}
                                      </Button>
                                    ))}
                                  </div>
                                </PopoverContent>
                              </Popover>
                            </div>
                            {!isHostDisconnected && displayInstance.status === 'connecting' && (
                              <RefreshCw className="h-3 w-3 animate-spin text-muted-foreground" />
                            )}
                          </div>
                          {!isHostDisconnected && (
                            <Switch 
                              checked={displayInstance.enabled} 
                              onCheckedChange={() => toggleInstanceEnabled(displayInstance.id)}
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
      </CardContent>
      
      <Separator className="mt-auto" />
      
      <CardFooter className="mt-2">
        <div className="flex justify-end w-full">
          {profileId && (
            host.configStatus === 'configured' ? (
              <Button 
                variant="outline"
                onClick={() => onOpenConfigDialog(host.id)}
                disabled={!host.configPath}
                className="flex items-center gap-2"
              >
                <FilePlus className="h-4 w-4" />
                View Config
              </Button>
            ) : (
              <Button 
                variant="default"
                onClick={() => onFixConfig(host.id)}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Update Config
              </Button>
            )
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
