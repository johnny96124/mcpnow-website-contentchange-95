
import { useState, useEffect } from "react";
import { CircleCheck, CircleX, CircleMinus, FilePlus, Settings2, PlusCircle, RefreshCw, ChevronDown, FileCheck, FileText, AlertCircle, Trash2, X, Filter } from "lucide-react";
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogContent, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

type InstanceStatusType = 'connected' | 'connecting' | 'error' | 'disconnected';

interface InstanceStatus {
  id: string;
  name: string;
  definitionId: string;
  definitionName: string;
  status: InstanceStatusType;
  enabled: boolean;
  errorMessage?: string;
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
  onCreateConfig: (hostId: string, profileId?: string) => void;
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
  const [selectedErrorInstance, setSelectedErrorInstance] = useState<InstanceStatus | null>(null);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<InstanceStatusType | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const isHostDisconnected = host.connectionStatus === 'disconnected' || host.connectionStatus === 'unknown';
  const needsConfiguration = host.configStatus === 'unknown' || host.configStatus === 'misconfigured';
  
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

  const getInstanceStatusCounts = () => {
    const enabledInstances = instanceStatuses.filter(instance => instance.enabled);
    
    return {
      connected: enabledInstances.filter(instance => instance.status === 'connected').length,
      connecting: enabledInstances.filter(instance => instance.status === 'connecting').length,
      error: enabledInstances.filter(instance => instance.status === 'error').length,
      total: enabledInstances.length
    };
  };

  // Add filter handler
  const handleFilterByStatus = (status: InstanceStatusType | null) => {
    setStatusFilter(status === statusFilter ? null : status);
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
              enabled: true,
              errorMessage: ''
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
                const errorMessages = [
                  "Connection timeout. Check network settings and try again.",
                  "Authentication failed. Invalid credentials provided.",
                  "Connection refused. Server might be down or unreachable.",
                  "Failed to establish secure connection. Check SSL configuration.",
                  "Port access denied. Check firewall settings."
                ];
                
                const newStatus = success ? 'connected' : 'error';
                const newEnabled = success || newStatuses[instanceIndex].enabled;
                
                // Automatically turn off switch if error occurs
                if (newStatus === 'error') {
                  newStatuses[instanceIndex] = {
                    ...newStatuses[instanceIndex],
                    status: newStatus,
                    enabled: false, // Automatically disable on error
                    errorMessage: errorMessages[Math.floor(Math.random() * errorMessages.length)]
                  };
                  
                  // Show toast notification about error
                  toast({
                    variant: "destructive",
                    title: `Connection error: ${newStatuses[instanceIndex].definitionName}`,
                    description: "Instance has been disabled due to connection error."
                  });
                } else {
                  newStatuses[instanceIndex] = {
                    ...newStatuses[instanceIndex],
                    status: newStatus,
                    errorMessage: ''
                  };
                }
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
            const errorMessages = [
              "Connection timeout. Check network settings and try again.",
              "Authentication failed. Invalid credentials provided.",
              "Connection refused. Server might be down or unreachable.",
              "Failed to establish secure connection. Check SSL configuration.",
              "Port access denied. Check firewall settings."
            ];
            
            const newStatus = success ? 'connected' : 'error';
            
            // If error occurred, automatically disable the instance
            const newEnabled = newStatus === 'error' ? false : instance.enabled;
            
            if (newStatus === 'error' && instance.enabled) {
              // Show toast notification about error and auto-disable
              toast({
                variant: "destructive",
                title: `Connection error: ${instance.definitionName}`,
                description: "Instance has been disabled due to connection error."
              });
            }
            
            return {
              ...instance,
              status: newStatus,
              enabled: newEnabled,
              errorMessage: success ? '' : errorMessages[Math.floor(Math.random() * errorMessages.length)]
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

  const handleShowError = (instance: InstanceStatus) => {
    setSelectedErrorInstance(instance);
    setIsErrorDialogOpen(true);
  };

  const handleDeleteHost = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteHost = () => {
    toast({
      title: "Host deleted",
      description: `${host.name} has been removed successfully`
    });
    setIsDeleteDialogOpen(false);
  };
  
  const profileConnectionStatus = getProfileConnectionStatus();
  const selectedProfile = profiles.find(p => p.id === profileId);
  const instancesByDefinition = getInstancesByDefinition();
  const statusCounts = getInstanceStatusCounts();
  
  // Filter instances by status if a filter is active
  const filteredInstancesByDefinition = new Map(instancesByDefinition);
  if (statusFilter !== null) {
    Array.from(filteredInstancesByDefinition.keys()).forEach(defId => {
      const instances = filteredInstancesByDefinition.get(defId) || [];
      const filteredInstances = instances.filter(instance => 
        (instance.status === statusFilter) && 
        (statusFilter !== 'connected' || instance.enabled)
      );
      
      if (filteredInstances.length === 0) {
        filteredInstancesByDefinition.delete(defId);
      } else {
        filteredInstancesByDefinition.set(defId, filteredInstances);
      }
    });
  }
  
  if (needsConfiguration) {
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
                status="inactive" 
                label="No Config"
                useIcon={true}
              />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-4 flex-1 flex flex-col justify-center">
          <div className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium text-lg">Host Configuration Required</h3>
              <p className="text-muted-foreground">
                This host needs to be configured before you can connect it to a profile.
              </p>
            </div>
            
            <Button 
              onClick={() => onCreateConfig(host.id)}
              className="bg-blue-500 hover:bg-blue-600 text-white"
              size="lg"
            >
              <FilePlus className="h-4 w-4 mr-2" />
              Create Configuration
            </Button>
          </div>
        </CardContent>

        <Separator className="mt-auto" />
        
        <CardFooter className="mt-2 justify-between">
          <Button 
            variant="outline" 
            size="sm"
            className="text-destructive"
            onClick={handleDeleteHost}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Host
          </Button>
        </CardFooter>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Host</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this host? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button variant="destructive" onClick={confirmDeleteHost}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    );
  }
  
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
                !profileId ? 'inactive' :
                isConnecting ? 'warning' :
                host.connectionStatus === 'connected' ? 'active' : 
                host.connectionStatus === 'disconnected' ? 'inactive' : 
                host.connectionStatus === 'misconfigured' || host.configStatus === 'misconfigured' ? 'inactive' : 
                host.configStatus === 'unknown' ? 'warning' : 'inactive'
              } 
              label={
                !profileId ? 'Disconnected' :
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
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Server Instances</label>
                  <div className="flex items-center gap-2 text-xs">
                    <StatusIndicator 
                      status="active"
                      label={`${statusCounts.connected} active`}
                      isClickable={true}
                      onClick={() => handleFilterByStatus('connected')}
                      className={statusFilter === 'connected' ? "bg-accent" : ""}
                    />
                    {statusCounts.connecting > 0 && (
                      <StatusIndicator 
                        status="warning"
                        label={`${statusCounts.connecting} connecting`}
                        isClickable={true}
                        onClick={() => handleFilterByStatus('connecting')}
                        className={statusFilter === 'connecting' ? "bg-accent" : ""}
                      />
                    )}
                    {statusCounts.error > 0 && (
                      <StatusIndicator 
                        status="error"
                        label={`${statusCounts.error} error`}
                        isClickable={true}
                        onClick={() => handleFilterByStatus('error')}
                        className={statusFilter === 'error' ? "bg-accent" : ""}
                      />
                    )}
                    {statusFilter !== null && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-5 w-5 rounded-full" 
                        onClick={() => setStatusFilter(null)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
                <ScrollArea className="h-[140px] border rounded-md p-1">
                  {filteredInstancesByDefinition.size > 0 ? (
                    <div className="space-y-1">
                      {Array.from(filteredInstancesByDefinition.entries()).map(([definitionId, instances]) => {
                        const displayInstance = instances[0];
                        const hasError = displayInstance.status === 'error';
                        
                        return (
                          <div 
                            key={definitionId} 
                            className={cn(
                              "flex items-center justify-between p-2 rounded",
                              hasError ? "bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800" : "bg-muted/50"
                            )}
                          >
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
                              <div className="text-sm flex items-center">
                                <span className="font-medium truncate max-w-[100px] md:max-w-[150px] lg:max-w-[180px]">
                                  {displayInstance.definitionName}
                                </span>
                                
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="h-6 px-1 py-0 ml-1"
                                    >
                                      <span className="text-xs text-muted-foreground hidden md:block">
                                        {displayInstance.name}
                                      </span>
                                      <span className="text-xs text-muted-foreground block md:hidden truncate max-w-[60px]">
                                        {displayInstance.name.split('-').pop()}
                                      </span>
                                      <ChevronDown className="h-3 w-3 ml-1 shrink-0" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent 
                                    align="start"
                                    className="w-auto min-w-[180px] p-1 max-h-[200px] overflow-y-auto"
                                  >
                                    {instances.map(instance => (
                                      <DropdownMenuItem
                                        key={instance.id}
                                        className={cn(
                                          "w-full text-xs cursor-pointer",
                                          displayInstance.id === instance.id && "bg-accent font-medium"
                                        )}
                                        onClick={() => handleSelectInstance(instance.id, definitionId)}
                                      >
                                        <div className="flex items-center gap-2">
                                          {displayInstance.id === instance.id && (
                                            <CircleCheck className="h-3 w-3 text-primary shrink-0" />
                                          )}
                                          <span>{instance.name}</span>
                                        </div>
                                      </DropdownMenuItem>
                                    ))}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                              {!isHostDisconnected && displayInstance.status === 'connecting' && (
                                <RefreshCw className="h-3 w-3 animate-spin text-muted-foreground shrink-0" />
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {hasError && (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="h-6 px-1 py-0 text-red-600 hover:text-red-700 hover:bg-red-100"
                                  onClick={() => handleShowError(displayInstance)}
                                >
                                  <AlertCircle className="h-3.5 w-3.5" />
                                  <span className="ml-1 text-xs">View Error</span>
                                </Button>
                              )}
                              {!isHostDisconnected && (
                                <Switch 
                                  checked={displayInstance.enabled} 
                                  onCheckedChange={() => toggleInstanceEnabled(displayInstance.id)}
                                  className="shrink-0"
                                  disabled={hasError}
                                />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground text-sm">
                        {statusFilter !== null 
                          ? `No ${statusFilter} instances found` 
                          : "No instances found"}
                      </p>
                    </div>
                  )}
                </ScrollArea>
              </div>
            )}
          </>
        )}
        
        {!profileId && (
          <div className="flex items-center justify-center p-4 border-2 border-dashed rounded-md">
            <p className="text-muted-foreground text-center">
              Select a profile to connect mcp server to host
            </p>
          </div>
        )}
      </CardContent>
      
      <Separator className="mt-auto" />
      
      <CardFooter className="mt-2 justify-between">
        <Button 
          variant="outline" 
          size="sm"
          className="text-destructive"
          onClick={handleDeleteHost}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Host
        </Button>
        
        <Button 
          variant="outline"
          onClick={() => onOpenConfigDialog(host.id)}
          disabled={!host.configPath}
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          View Config
        </Button>
      </CardFooter>

      <Dialog open={isErrorDialogOpen} onOpenChange={setIsErrorDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-600">
              <AlertCircle className="h-5 w-5 mr-2" />
              Connection Error
            </DialogTitle>
            <DialogDescription>
              Error details for {selectedErrorInstance?.definitionName} - {selectedErrorInstance?.name}
            </DialogDescription>
          </DialogHeader>
          
          <Alert variant="destructive" className="mt-2">
            <AlertTitle className="font-medium">Connection Failed</AlertTitle>
            <AlertDescription className="mt-2">
              {selectedErrorInstance?.errorMessage || "Unknown error occurred"}
            </AlertDescription>
          </Alert>
          
          <div className="mt-4 text-sm text-muted-foreground">
            <p>Try the following:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Check your network connection</li>
              <li>Verify server configuration</li>
              <li>Ensure the host is running and accessible</li>
              <li>Check credentials if authentication failed</li>
            </ul>
          </div>
          
          <DialogFooter className="mt-4">
            <Button onClick={() => setIsErrorDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Host</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this host? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={confirmDeleteHost}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
