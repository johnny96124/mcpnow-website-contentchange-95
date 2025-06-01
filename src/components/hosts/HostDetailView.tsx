
import React, { useState, lazy } from "react";
import { 
  FileText, Server, AlertTriangle, 
  CheckCircle, Info, Plus, ChevronDown, 
  ExternalLink, ArrowRight, Settings, MoreHorizontal, Trash2, MessageSquare
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
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";

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
  onCreateProfile: (profileName: string) => string;
  onDeleteProfile: (profileId: string) => void;
  onAddServersToProfile: (servers: ServerInstance[]) => void;
  onStartAIChat?: () => void;
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
  onStartAIChat
}) => {
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [serverSelectionDialogOpen, setServerSelectionDialogOpen] = useState(false);
  const [deleteHostDialogOpen, setDeleteHostDialogOpen] = useState(false);
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

  const handleConfirmDeleteHost = () => {
    onDeleteHost(host.id);
    setDeleteHostDialogOpen(false);
  };

  // Import MCPNowHostView component only when needed
  const MCPNowHostView = React.lazy(() => import('./MCPNowHostView').then(module => ({ default: module.MCPNowHostView })));

  // If this is an MCP Now host, render the special view
  if (host.type === 'mcpnow') {
    return (
      <React.Suspense fallback={<div>Loading...</div>}>
        <MCPNowHostView 
          host={host}
          profiles={profiles}
          serverInstances={serverInstances}
          selectedProfileId={selectedProfileId}
          onProfileChange={onProfileChange}
          onServerStatusChange={onServerStatusChange}
          onSaveProfileChanges={onSaveProfileChanges}
          onCreateProfile={onCreateProfile}
          onDeleteProfile={onDeleteProfile}
          onAddServersToProfile={onAddServersToProfile}
        />
      </React.Suspense>
    );
  }

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

  const isMCPNowHost = host.type === 'mcpnow';

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-muted/30 p-3 rounded-full">
            <span className="text-2xl">{host.icon || '🖥️'}</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold">{host.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <div className={`w-3 h-3 rounded-full ${
                host.connectionStatus === "connected" 
                  ? 'bg-green-500' 
                  : 'bg-neutral-400'
              }`} />
              <span className="text-sm text-muted-foreground">
                {host.connectionStatus === "connected" ? "Connected" : "Disconnected"}
              </span>
              {isMCPNowHost && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                  Built-in
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          {isMCPNowHost && onStartAIChat && (
            <Button onClick={onStartAIChat} className="bg-blue-600 hover:bg-blue-700">
              <MessageSquare className="h-4 w-4 mr-2" />
              Start AI Chat
            </Button>
          )}
          <Button variant="outline" onClick={() => onDeleteHost(host.id)}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Host
          </Button>
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
          {/* Only show Add Servers button when there is at least one server */}
          {profileServers.length > 0 && (
            <Button 
              onClick={() => setServerSelectionDialogOpen(true)} 
              className="whitespace-nowrap"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Servers
            </Button>
          )}
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
                    onRemoveFromProfile={(serverId) => {
                      toast({
                        title: "Server removed",
                        description: `${server.name} has been removed from this profile`,
                      });
                    }}
                  />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <ServerListEmpty onAddServers={() => setServerSelectionDialogOpen(true)} />
        )}
      </div>
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
