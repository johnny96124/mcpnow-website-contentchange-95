
import { useState } from "react";
import { serverDefinitions, serverInstances, type Profile } from "@/data/mockData";
import { EndpointLabel } from "@/components/status/EndpointLabel";
import { ServerLogo } from "@/components/servers/ServerLogo";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { AlertCircle, MoreVertical, Wrench, History, ExternalLink } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { ServerDebugDialog } from "@/components/new-layout/ServerDebugDialog";
import { ServerHistoryDialog } from "@/components/new-layout/ServerHistoryDialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ConnectedServersListProps {
  profile: Profile | null;
  hostStatus: string;
}

export function ConnectedServersList({ profile, hostStatus }: ConnectedServersListProps) {
  const [activeInstances, setActiveInstances] = useState<Record<string, boolean>>({});
  const [serverStatuses, setServerStatuses] = useState<Record<string, 'connected' | 'connecting' | 'disconnected' | 'error'>>({});
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  const [showDebugDialog, setShowDebugDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [selectedServer, setSelectedServer] = useState<any>(null);
  
  if (!profile) {
    return (
      <div className="rounded-lg border bg-muted/30 flex flex-col items-center justify-center p-8">
        <div className="text-4xl mb-4">🔌</div>
        <h3 className="text-lg font-medium mb-2">No Profile Selected</h3>
        <p className="text-muted-foreground text-center max-w-md">
          Select a profile from the dropdown to view and manage connected servers
        </p>
      </div>
    );
  }
  
  // Filter server instances for this profile
  const profileInstances = profile.instances ? 
    serverInstances.filter(instance => profile.instances.includes(instance.id)) : [];
  
  const handleToggleServer = (serverId: string, isActive: boolean) => {
    // If host is disconnected, don't allow toggling
    if (hostStatus !== "connected") {
      toast.error("Host is not connected. Cannot toggle server.");
      return;
    }
    
    setActiveInstances(prev => ({
      ...prev,
      [serverId]: isActive
    }));
    
    if (isActive) {
      // Simulate connecting and then connected state
      setServerStatuses(prev => ({
        ...prev,
        [serverId]: 'connecting'
      }));
      
      // Simulate connection success/failure
      setTimeout(() => {
        const success = Math.random() > 0.3; // 70% success rate
        
        if (success) {
          setServerStatuses(prev => ({
            ...prev,
            [serverId]: 'connected'
          }));
          toast.success(`Server connected successfully`);
        } else {
          setServerStatuses(prev => ({
            ...prev,
            [serverId]: 'error'
          }));
          setServerErrors(prev => ({
            ...prev,
            [serverId]: "Failed to connect: Connection refused"
          }));
          setActiveInstances(prev => ({
            ...prev,
            [serverId]: false
          }));
          toast.error(`Failed to connect server`);
        }
      }, 1500);
    } else {
      // Set to disconnected immediately when turning off
      setServerStatuses(prev => ({
        ...prev,
        [serverId]: 'disconnected'
      }));
      toast.success(`Server disconnected`);
    }
  };
  
  const handleRemoveServer = (instanceId: string) => {
    // In a real app this would make an API call
    toast.success("Server removed from profile");
  };
  
  const handleOpenDebug = (server: any) => {
    setSelectedServer(server);
    setShowDebugDialog(true);
  };
  
  const handleOpenHistory = (server: any) => {
    setSelectedServer(server);
    setShowHistoryDialog(true);
  };
  
  const renderStatus = (instanceId: string) => {
    const status = serverStatuses[instanceId] || 'disconnected';
    
    switch (status) {
      case 'connected':
        return <span className="text-green-600 text-sm font-medium">Connected</span>;
      case 'connecting':
        return <span className="text-amber-600 text-sm font-medium">Connecting...</span>;
      case 'error':
        return (
          <div className="flex items-center gap-1">
            <span className="text-destructive text-sm font-medium">Error</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertCircle className="h-4 w-4 text-destructive cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="w-80">
                  <p>{serverErrors[instanceId] || "Unknown error"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      default:
        return <span className="text-muted-foreground text-sm font-medium">Disconnected</span>;
    }
  };
  
  if (profileInstances.length === 0) {
    return (
      <div className="rounded-lg border bg-muted/30 flex flex-col items-center justify-center p-12">
        <div className="text-4xl mb-4">🔌</div>
        <h3 className="text-xl font-medium mb-2">No Servers Connected</h3>
        <p className="text-muted-foreground text-center max-w-md mb-6">
          Add servers to this profile to manage them through this host
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {hostStatus !== "connected" && (
        <Alert variant="warning" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Host is not connected. Server controls are disabled until the host connection is restored.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid gap-3">
        {profileInstances.map(instance => {
          const definition = serverDefinitions.find(def => def.id === instance.definitionId);
          return (
            <div 
              key={instance.id}
              className="flex items-center justify-between p-4 border rounded-lg bg-card hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <ServerLogo name={instance.name} />
                
                <div>
                  <div className="font-medium">{instance.name}</div>
                  <div className="flex items-center gap-2 mt-1">
                    {definition && (
                      <EndpointLabel type={definition.type} className="mr-2" />
                    )}
                    {renderStatus(instance.id)}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Switch 
                  checked={activeInstances[instance.id] || false}
                  onCheckedChange={(checked) => handleToggleServer(instance.id, checked)}
                  disabled={hostStatus !== "connected"}
                />
                
                <div className="flex items-center gap-1.5">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleOpenDebug(instance)}
                          className="h-8 w-8"
                        >
                          <Wrench className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Debug Tools</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleOpenHistory(instance)}
                          className="h-8 w-8"
                        >
                          <History className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Message History</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleRemoveServer(instance.id)}>
                        Remove from profile
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        View parameters
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center">
                        Server details
                        <ExternalLink className="ml-2 h-3 w-3" />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Dialogs */}
      <ServerDebugDialog 
        open={showDebugDialog}
        onOpenChange={setShowDebugDialog}
        server={selectedServer}
      />
      
      <ServerHistoryDialog 
        open={showHistoryDialog}
        onOpenChange={setShowHistoryDialog}
        server={selectedServer}
      />
    </div>
  );
}
