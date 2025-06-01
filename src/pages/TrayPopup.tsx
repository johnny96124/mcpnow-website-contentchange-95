
import { useState, useEffect } from "react";
import { 
  ExternalLink, 
  ChevronDown,
  ChevronUp,
  User,
  AlertTriangle,
  Server
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusIndicator } from "@/components/status/StatusIndicator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { profiles, hosts, serverInstances, serverDefinitions } from "@/data/mockData";
import { NoSearchResults } from "@/components/servers/NoSearchResults";
import { HostRefreshHint } from "@/components/hosts/HostRefreshHint";
import { ServerErrorDialog } from "@/components/hosts/ServerErrorDialog";
import { Dialog } from "@/components/ui/dialog";

interface InstanceStatus {
  id: string;
  definitionId: string;
  name: string;
  status: 'running' | 'connecting' | 'error' | 'stopped';
  enabled: boolean;
}

const TrayPopup = () => {
  const displayHosts = [
    ...hosts, 
    {
      id: "cline-host",
      name: "Cline",
      type: 'external' as const,
      icon: "🔄",
      connectionStatus: 'disconnected' as const,
      configStatus: 'configured' as const,
      configPath: "/path/to/config.json",
      profileId: ""
    }
  ];

  const [selectedProfileIds, setSelectedProfileIds] = useState<Record<string, string>>(
    displayHosts.reduce((acc, host) => {
      if ('profileId' in host && host.profileId) {
        acc[host.id] = host.profileId;
      }
      return acc;
    }, {} as Record<string, string>)
  );

  const [instanceStatuses, setInstanceStatuses] = useState<Record<string, InstanceStatus[]>>({});
  
  const [showHostRefreshHint, setShowHostRefreshHint] = useState(false);
  const [lastChangedHostId, setLastChangedHostId] = useState<string | null>(null);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [currentErrorServer, setCurrentErrorServer] = useState<string>("");
  const [expandedHosts, setExpandedHosts] = useState<Record<string, boolean>>({});

  const handleProfileChange = (hostId: string, profileId: string) => {
    setSelectedProfileIds(prev => ({
      ...prev,
      [hostId]: profileId
    }));
    
    initializeProfileInstances(hostId, profileId);
    
    const profile = profiles.find(p => p.id === profileId);
    toast.success(`Profile changed to ${profile?.name}`);

    // Only show refresh hint on the host that was changed and if it's connected
    const host = displayHosts.find(h => h.id === hostId);
    const isConnected = host?.connectionStatus === 'connected';
    
    if (isConnected) {
      setLastChangedHostId(hostId);
      setShowHostRefreshHint(true);
      
      const timer = setTimeout(() => {
        setShowHostRefreshHint(false);
        setLastChangedHostId(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  };

  const initializeProfileInstances = (hostId: string, profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    if (!profile) return;
    
    const profileInstanceIds = profile.instances;
    
    // Create mock instances for demo purposes - generating 5 instances for first profile
    let initialInstances: InstanceStatus[] = [];
    
    if (profileId === profiles[0]?.id) {
      // Generate 5 servers for the first profile to demonstrate expand/collapse
      initialInstances = [
        {
          id: "server-1",
          definitionId: serverDefinitions[0]?.id || "",
          name: "Database Server",
          status: 'running',
          enabled: true
        },
        {
          id: "server-2",
          definitionId: serverDefinitions[0]?.id || "",
          name: "Authentication Server",
          status: 'running',
          enabled: true
        },
        {
          id: "server-3",
          definitionId: serverDefinitions[1]?.id || "",
          name: "API Gateway",
          status: 'error',
          enabled: true
        },
        {
          id: "server-4",
          definitionId: serverDefinitions[1]?.id || "",
          name: "Web Server",
          status: 'stopped',
          enabled: false
        },
        {
          id: "server-5",
          definitionId: serverDefinitions[2]?.id || "",
          name: "Message Queue",
          status: 'connecting',
          enabled: true
        }
      ];
    } else {
      // For other profiles, use the original logic
      initialInstances = profileInstanceIds
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
    }
    
    setInstanceStatuses(prev => ({
      ...prev,
      [hostId]: initialInstances
    }));
    
    initialInstances.forEach((instance, index) => {
      setTimeout(() => {
        setInstanceStatuses(prev => {
          const hostInstances = [...(prev[hostId] || [])];
          const instanceIndex = hostInstances.findIndex(i => i.id === instance.id);
          
          if (instanceIndex !== -1) {
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
      }, 1000 + (index * 500));
    });
  };

  const toggleInstanceEnabled = (hostId: string, instanceId: string) => {
    setInstanceStatuses(prev => {
      const hostInstances = [...(prev[hostId] || [])];
      const instanceIndex = hostInstances.findIndex(i => i.id === instanceId);
      
      if (instanceIndex !== -1) {
        hostInstances[instanceIndex] = {
          ...hostInstances[instanceIndex],
          enabled: !hostInstances[instanceIndex].enabled,
          status: !hostInstances[instanceIndex].enabled ? 'connecting' : 'stopped'
        };
        
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
    
    toast.success(`Server instance ${instanceStatuses[hostId]?.find(i => i.id === instanceId)?.enabled ? 'disabled' : 'enabled'}`);
  };

  const handleShowErrorDialog = (serverName: string) => {
    setCurrentErrorServer(serverName);
    setErrorDialogOpen(true);
  };

  const toggleExpandHost = (hostId: string) => {
    setExpandedHosts(prev => ({
      ...prev,
      [hostId]: !prev[hostId]
    }));
  };

  const getInstanceStatusCounts = (hostId: string) => {
    if (!instanceStatuses[hostId]) return { active: 0, connecting: 0, error: 0, total: 0 };
    
    // Count all instances, not just enabled ones
    const instances = instanceStatuses[hostId];
    
    return {
      active: instances.filter(i => i.status === 'running').length,
      connecting: instances.filter(i => i.status === 'connecting').length,
      error: instances.filter(i => i.status === 'error').length,
      total: instances.length
    };
  };

  useEffect(() => {
    displayHosts.forEach(host => {
      const profileId = selectedProfileIds[host.id];
      if (profileId) {
        initializeProfileInstances(host.id, profileId);
      }
    });
  }, []);
  
  const openDashboard = () => {
    window.open("/", "_blank");
  };

  return (
    <div className="w-[420px] p-2 bg-background rounded-lg shadow-lg animate-fade-in max-h-[53vh]">
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
      
      <ScrollArea className="h-full max-h-[calc(53vh-60px)]">
        <div className="pr-3">
          <div className="space-y-3">
            {displayHosts.map(host => {
              const profileId = selectedProfileIds[host.id] || '';
              const profile = profiles.find(p => p.id === profileId);
              const isConnected = host.connectionStatus === 'connected';
              const instances = instanceStatuses[host.id] || [];
              const isExpanded = expandedHosts[host.id] || false;
              const visibleInstances = isExpanded ? instances : instances.slice(0, 3);
              const hasMoreInstances = instances.length > 3;
              const statusCounts = getInstanceStatusCounts(host.id);
              const shouldShowHostRefreshHint = showHostRefreshHint && lastChangedHostId === host.id && isConnected;
              
              return (
                <Card key={host.id} className="overflow-hidden shadow-sm">
                  <div className="flex items-center justify-between p-3 bg-card">
                    <div className="flex items-center gap-2">
                      <div className="bg-slate-900 text-white p-1 rounded w-8 h-8 flex items-center justify-center">
                        {host.icon || host.name.substring(0, 1)}
                      </div>
                      <h3 className="font-medium">{host.name}</h3>
                    </div>
                    <StatusIndicator 
                      status={isConnected ? 'active' : 'inactive'} 
                      label={isConnected ? 'Connected' : 'Disconnected'}
                      className={!isConnected ? "text-neutral-500" : ""}
                    />
                  </div>
                  
                  {/* Only show profile content if the host is connected */}
                  {isConnected && (
                    <div className="p-3 pt-2">
                      {shouldShowHostRefreshHint && profileId && (
                        <HostRefreshHint className="mb-3" />
                      )}
                      
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Profile:</span>
                        <Select
                          value={profileId}
                          onValueChange={(value) => handleProfileChange(host.id, value)}
                        >
                          <SelectTrigger className="h-8 flex-1">
                            <SelectValue placeholder="Select profile">
                              {profile && (
                                <span>{profile.name}</span>
                              )}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {profiles.map(profile => (
                              <SelectItem key={profile.id} value={profile.id}>
                                {profile.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Only show servers if host is connected and profile is selected */}
                      {profileId && instances.length > 0 && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs text-muted-foreground">Servers:</p>
                            <div className="flex items-center gap-2 text-xs">
                              {statusCounts.active > 0 && (
                                <div className="flex items-center gap-1.5">
                                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                  <span>{statusCounts.active} active</span>
                                </div>
                              )}
                              {statusCounts.connecting > 0 && (
                                <div className="flex items-center gap-1.5">
                                  <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                                  <span>{statusCounts.connecting} connecting</span>
                                </div>
                              )}
                              {statusCounts.error > 0 && (
                                <div className="flex items-center gap-1.5">
                                  <div className="h-2 w-2 rounded-full bg-red-500"></div>
                                  <span>{statusCounts.error} error</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="space-y-2">
                            {visibleInstances.map((instance) => {
                              const status = instance.status;
                              const isError = status === 'error';
                              
                              return (
                                <div key={instance.id} className="flex items-center justify-between">
                                  <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <StatusIndicator 
                                      status={
                                        status === 'running' ? 'active' : 
                                        status === 'connecting' ? 'warning' :
                                        status === 'error' ? 'error' : 'inactive'
                                      } 
                                    />
                                    <span className="text-xs font-medium truncate">{instance.name}</span>
                                    {isError && (
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-5 w-5 text-red-600 p-0"
                                        onClick={() => handleShowErrorDialog(instance.name)}
                                      >
                                        <AlertTriangle className="h-3 w-3" />
                                      </Button>
                                    )}
                                  </div>
                                  
                                  <Switch 
                                    checked={instance.enabled} 
                                    onCheckedChange={() => toggleInstanceEnabled(host.id, instance.id)}
                                  />
                                </div>
                              );
                            })}
                          </div>
                          
                          {hasMoreInstances && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full mt-2 text-xs flex items-center justify-center gap-1"
                              onClick={() => toggleExpandHost(host.id)}
                            >
                              {isExpanded ? (
                                <>
                                  <ChevronUp className="h-3 w-3" />
                                  <span>Collapse</span>
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="h-3 w-3" />
                                  <span>Show {instances.length - 3} more servers</span>
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      )}
                      
                      {!profileId && (
                        <div className="mt-3">
                          <NoSearchResults 
                            entityName="profile"
                            title="Select a profile"
                            message="Select a profile to connect mcp server to host"
                            icon={<User className="h-12 w-12 text-muted-foreground mb-4" />}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </ScrollArea>
      
      <ServerErrorDialog 
        open={errorDialogOpen}
        onOpenChange={setErrorDialogOpen}
        serverName={currentErrorServer}
        errorMessage="Failed to connect to server. The endpoint is not responding or is not properly configured."
        onRetry={() => Promise.resolve(false)}
      />
    </div>
  );
};

export default TrayPopup;
