
import { useState, useEffect } from "react";
import { CircleCheck, CircleX, CircleMinus, FilePlus, Settings2, PlusCircle, RefreshCw } from "lucide-react";
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
  
  const profileConnectionStatus = getProfileConnectionStatus();
  const selectedProfile = profiles.find(p => p.id === profileId);
  
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
                    <StatusIndicator 
                      status={
                        isConnecting ? 'warning' :
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
                <label className="text-sm font-medium">Server Instances</label>
                <ScrollArea className="h-[140px] border rounded-md p-1">
                  <div className="space-y-1">
                    {instanceStatuses.map(instance => (
                      <div key={instance.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <div className="flex items-center gap-2">
                          <StatusIndicator 
                            status={
                              !instance.enabled ? 'inactive' :
                              instance.status === 'connected' ? 'active' :
                              instance.status === 'connecting' ? 'warning' :
                              instance.status === 'error' ? 'error' : 'inactive'
                            }
                          />
                          <div className="text-sm">
                            <span className="font-medium">{instance.definitionName}</span>
                            {' - '}
                            <span className="text-muted-foreground">{instance.name}</span>
                          </div>
                          {instance.status === 'connecting' && (
                            <RefreshCw className="h-3 w-3 animate-spin text-muted-foreground" />
                          )}
                        </div>
                        <Switch 
                          checked={instance.enabled} 
                          onCheckedChange={() => toggleInstanceEnabled(instance.id)}
                        />
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
