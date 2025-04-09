
import React, { useState } from "react";
import { 
  Terminal, 
  XCircle, 
  RefreshCcw, 
  AlertCircle,
  FileText,
  Clock,
  ExternalLink
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatusIndicator } from "@/components/status/StatusIndicator";
import { EndpointLabel } from "@/components/status/EndpointLabel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { RuntimeInstance, ServerInstance, ServerDefinition, Profile } from "@/data/mockData";

// Dialog component for runtime logs
import { RuntimeLogsDialog } from "@/components/servers/RuntimeLogsDialog";

interface RuntimeInstancesListProps {
  runtimeInstances: RuntimeInstance[];
  serverInstances: ServerInstance[];
  serverDefinitions: ServerDefinition[];
  profiles: Profile[];
  hosts: { id: string; name: string; icon?: string; }[];
  onReconnect: (runtimeId: string) => void;
  onDisconnect: (runtimeId: string) => void;
}

export function RuntimeInstancesList({ 
  runtimeInstances, 
  serverInstances, 
  serverDefinitions, 
  profiles,
  hosts,
  onReconnect,
  onDisconnect
}: RuntimeInstancesListProps) {
  const [logsOpen, setLogsOpen] = useState<boolean>(false);
  const [selectedRuntime, setSelectedRuntime] = useState<RuntimeInstance | null>(null);
  
  const getInstanceById = (id: string) => serverInstances.find(i => i.id === id);
  const getDefinitionById = (id: string) => serverDefinitions.find(d => d.id === id);
  const getProfileById = (id: string) => profiles.find(p => p.id === id);
  const getHostById = (id: string) => hosts.find(h => h.id === id);
  
  const formatTimeDiff = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000); // seconds
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };
  
  const handleViewLogs = (runtime: RuntimeInstance) => {
    setSelectedRuntime(runtime);
    setLogsOpen(true);
  };

  if (runtimeInstances.length === 0) {
    return null;
  }
  
  return (
    <>
      <Card className="mb-6">
        <CardHeader className="border-b bg-muted/30 pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Terminal className="h-4 w-4" />
            Active Runtime Instances
            <Badge variant="outline" className="ml-2 font-normal">
              {runtimeInstances.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 divide-y">
            {runtimeInstances.map(runtime => {
              const instance = getInstanceById(runtime.instanceId);
              const definition = instance ? getDefinitionById(instance.definitionId) : null;
              const profile = getProfileById(runtime.profileId);
              const host = getHostById(runtime.hostId);
              
              if (!instance || !definition || !profile || !host) return null;
              
              return (
                <div key={runtime.id} className="p-4 hover:bg-muted/20 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <StatusIndicator 
                        status={runtime.status} 
                        label={runtime.status.charAt(0).toUpperCase() + runtime.status.slice(1)} 
                      />
                      <div className="font-medium">{instance.name}</div>
                      <EndpointLabel type={definition.type} compact />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8"
                              onClick={() => handleViewLogs(runtime)}
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              Logs
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>View runtime logs</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      {runtime.status === 'failed' && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 text-blue-600"
                                onClick={() => onReconnect(runtime.id)}
                              >
                                <RefreshCcw className="h-4 w-4 mr-1" />
                                Reconnect
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Retry connecting</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      
                      {(runtime.status === 'connected' || runtime.status === 'connecting') && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-8 text-red-600"
                                onClick={() => onDisconnect(runtime.id)}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Disconnect
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Stop this runtime instance</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-2 grid grid-cols-4 text-sm text-muted-foreground">
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">Profile</span>
                      <span>{profile.name}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">Host</span>
                      <span className="flex items-center gap-1">
                        {host.icon && <span>{host.icon}</span>}
                        {host.name}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">Started</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTimeDiff(runtime.startedAt)}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">Requests</span>
                      <span>{runtime.requestCount}</span>
                    </div>
                  </div>
                  
                  {runtime.status === 'failed' && runtime.errorMessage && (
                    <div className="mt-2 text-sm flex items-start gap-1.5 text-red-600">
                      <AlertCircle className="h-4 w-4 mt-0.5" />
                      <span>{runtime.errorMessage}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <RuntimeLogsDialog
        open={logsOpen}
        onOpenChange={setLogsOpen}
        runtime={selectedRuntime}
        instance={selectedRuntime ? getInstanceById(selectedRuntime.instanceId) : null}
        definition={selectedRuntime && getInstanceById(selectedRuntime.instanceId) 
          ? getDefinitionById(getInstanceById(selectedRuntime.instanceId)!.definitionId)
          : null}
      />
    </>
  );
}
