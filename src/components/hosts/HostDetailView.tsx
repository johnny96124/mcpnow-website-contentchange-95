
import React, { useState } from "react";
import { 
  FileText, Server, AlertTriangle, 
  CheckCircle, Info, Plus, ChevronDown, 
  ExternalLink, ArrowRight, Settings, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { StatusIndicator } from "@/components/status/StatusIndicator";
import { EndpointLabel } from "@/components/status/EndpointLabel";
import { useToast } from "@/hooks/use-toast";
import { 
  Host, Profile, ServerInstance, 
  ConnectionStatus, serverDefinitions, EndpointType 
} from "@/data/mockData";
import { ConfigHighlightDialog } from "./ConfigHighlightDialog";
import { ProfileDropdown } from "./ProfileDropdown";
import { ServerListEmpty } from "./ServerListEmpty";
import { ServerItem } from "./ServerItem";
import { ServerSelectionDialog } from "./ServerSelectionDialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

interface HostDetailViewProps {
  host: Host;
  profiles: Profile[];
  serverInstances: ServerInstance[];
  selectedProfileId: string;
  onCreateConfig: (hostId: string) => void;
  onProfileChange: (profileId: string) => void;
  onAddServersToHost: () => void;
  onDeleteHost: (hostId: string) => void;
  onServerStatusChange: (serverId: string, status: 'running' | 'stopped' | 'error' | 'connecting') => void;
  onSaveProfileChanges: () => void;
  onCreateProfile: (name: string) => string;
  onDeleteProfile: (profileId: string) => void;
  onAddServersToProfile?: (servers: ServerInstance[]) => void;
  onDeleteServer?: (serverId: string) => void; // New prop for server deletion
}

export const HostDetailView: React.FC<HostDetailViewProps> = ({
  host,
  profiles,
  serverInstances,
  selectedProfileId,
  onCreateConfig,
  onProfileChange,
  onAddServersToHost,
  onDeleteHost,
  onServerStatusChange,
  onSaveProfileChanges,
  onCreateProfile,
  onDeleteProfile,
  onAddServersToProfile,
  onDeleteServer = () => {} // Default empty function if not provided
}) => {
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [serverSelectionDialogOpen, setServerSelectionDialogOpen] = useState(false);
  const { toast } = useToast();

  const selectedProfile = profiles.find(p => p.id === selectedProfileId);
  
  const profileServers = serverInstances.filter(
    server => selectedProfile?.instances.includes(server.id)
  );

  const handleServerStatusChange = (serverId: string, enabled: boolean) => {
    onServerStatusChange(
      serverId, 
      enabled ? host.connectionStatus === "connected" ? 'connecting' : 'stopped' : 'stopped'
    );
    
    if (enabled) {
      toast({
        title: "Connecting to server",
        description: "Attempting to establish connection"
      });
      
      setTimeout(() => {
        const success = Math.random() > 0.3;
        if (success) {
          onServerStatusChange(serverId, 'running');
          toast({
            title: "Server connected",
            description: "Successfully connected to server",
            type: "success"
          });
        } else {
          onServerStatusChange(serverId, 'error');
          toast({
            title: "Connection error",
            description: "Failed to connect to server",
            type: "error"
          });
        }
      }, 2000);
    }
  };

  const getServerLoad = (serverId: string) => {
    return Math.floor(Math.random() * 90) + 10;
  };

  const showConfigFile = () => {
    setConfigDialogOpen(true);
  };

  // Function to handle server deletion
  const handleDeleteServer = (serverId: string) => {
    if (window.confirm(`Are you sure you want to delete this server?`)) {
      if (onDeleteServer) {
        onDeleteServer(serverId);
        
        // Update the profile to remove the server
        if (selectedProfile) {
          const updatedInstances = selectedProfile.instances.filter(id => id !== serverId);
          // Remove server from profile
          toast({
            title: "Server deleted",
            description: "The server has been removed successfully",
          });
        }
      } else {
        // If no onDeleteServer callback is provided, just show a toast
        toast({
          title: "Server removed",
          description: "The server has been removed from this profile",
        });
      }
    }
  };

  const handleAddServers = (servers: ServerInstance[]) => {
    if (selectedProfile && servers.length > 0) {
      if (onAddServersToProfile) {
        onAddServersToProfile(servers);
      } else {
        toast({
          title: "Servers added",
          description: `${servers.length} server(s) added to ${selectedProfile.name}`,
          type: "success"
        });
      
        onSaveProfileChanges();
      }
    }
  };

  if (host.configStatus === "unknown") {
    return (
      <div className="space-y-6">
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-muted/30 p-3 rounded-full">
                  <span className="text-2xl">{host.icon || '🖥️'}</span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{host.name}</h2>
                  <div className="flex items-center gap-2">
                    <StatusIndicator 
                      status="inactive" 
                      label="Needs Configuration" 
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div className="text-center space-y-4 py-6">
              <div className="mx-auto w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-500" />
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Configuration Required</h3>
                <p className="text-muted-foreground text-sm">
                  This host needs to be configured before you can connect servers to it
                </p>
              </div>
              <Button onClick={() => onCreateConfig(host.id)} className="bg-blue-500 hover:bg-blue-600">
                Configure Host
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white">
        <CardContent className="p-6">
          {/* Host header section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-muted/30 p-3 rounded-full">
                <span className="text-2xl">{host.icon || '🖥️'}</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold">{host.name}</h2>
                  {host.configPath && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-full" 
                            onClick={showConfigFile}
                          >
                            <FileText className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          View Configuration
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <StatusIndicator 
                    status={
                      host.connectionStatus === "connected" 
                        ? "active" 
                        : host.connectionStatus === "misconfigured" 
                          ? "error" 
                          : "inactive"
                    } 
                    label={
                      host.connectionStatus === "connected" 
                        ? "Connected" 
                        : host.connectionStatus === "misconfigured" 
                          ? "Misconfigured" 
                          : "Disconnected"
                    } 
                  />
                </div>
              </div>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          {/* Profile and servers section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <ProfileDropdown 
                  profiles={profiles} 
                  currentProfileId={selectedProfileId} 
                  onProfileChange={onProfileChange}
                  onCreateProfile={onCreateProfile}
                  onDeleteProfile={onDeleteProfile}
                />
              </div>
              <Button 
                onClick={() => setServerSelectionDialogOpen(true)} 
                className="whitespace-nowrap"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Servers
              </Button>
            </div>
            
            {profileServers.length > 0 ? (
              <div className="rounded-md border mt-4">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="h-10 px-4 text-left text-sm font-medium text-muted-foreground">Server</th>
                      <th className="h-10 px-4 text-left text-sm font-medium text-muted-foreground">Type</th>
                      <th className="h-10 px-4 text-left text-sm font-medium text-muted-foreground">Status</th>
                      <th className="h-10 px-4 text-center text-sm font-medium text-muted-foreground">Active</th>
                      <th className="h-10 px-4 text-right text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profileServers.map(server => (
                      <ServerItem 
                        key={server.id}
                        server={server}
                        hostConnectionStatus={host.connectionStatus}
                        onStatusChange={handleServerStatusChange}
                        load={getServerLoad(server.id)}
                        onRemoveFromProfile={handleDeleteServer}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <ServerListEmpty onAddServers={() => setServerSelectionDialogOpen(true)} />
            )}
          </div>
        </CardContent>
      </Card>
      
      <ServerSelectionDialog 
        open={serverSelectionDialogOpen} 
        onOpenChange={setServerSelectionDialogOpen}
        onAddServers={handleAddServers}
      />
      
      <ConfigHighlightDialog
        open={configDialogOpen}
        onOpenChange={setConfigDialogOpen}
        configPath={host.configPath || ""}
      />
    </div>
  );
};

function Search(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
