
import React, { useState, useEffect } from "react";
import { 
  FileText, Server, Trash2, AlertTriangle, 
  CheckCircle, Info, Plus, ChevronDown, MoreHorizontal, 
  ExternalLink, ArrowRight, Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { StatusIndicator } from "@/components/status/StatusIndicator";
import { EndpointLabel } from "@/components/status/EndpointLabel";
import { toast } from "@/hooks/use-toast";
import { 
  Host, Profile, ServerInstance, 
  ConnectionStatus, serverDefinitions, EndpointType 
} from "@/data/mockData";
import { ConfigHighlightDialog } from "./ConfigHighlightDialog";
import { ProfileDropdown } from "./ProfileDropdown";
import { ServerListEmpty } from "./ServerListEmpty";
import { ServerItem } from "./ServerItem";
import { ServerSelectionDialog } from "./ServerSelectionDialog";

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
  onDeleteProfile
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [serverSelectionDialogOpen, setServerSelectionDialogOpen] = useState(false);

  const selectedProfile = profiles.find(p => p.id === selectedProfileId);
  
  const profileServers = serverInstances.filter(
    server => selectedProfile?.instances.includes(server.id)
  );

  const filteredServers = profileServers.filter(server => 
    server.name.toLowerCase().includes(searchQuery.toLowerCase())
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
      
      // Simulate connection success/failure after a delay
      setTimeout(() => {
        const success = Math.random() > 0.3; // 70% chance of success
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

  const handleDeleteHost = () => {
    if (window.confirm(`Are you sure you want to delete host ${host.name}?`)) {
      onDeleteHost(host.id);
    }
  };

  const showConfigFile = () => {
    setConfigDialogOpen(true);
  };

  // If the host needs configuration first
  if (host.configStatus === "unknown") {
    return (
      <div className="space-y-6">
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
          
          <div className="flex gap-2">
            <Button variant="outline" className="text-destructive hover:text-destructive" onClick={handleDeleteHost}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Host
            </Button>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-6">
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-muted/30 p-3 rounded-full">
            <span className="text-2xl">{host.icon || '🖥️'}</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold">{host.name}</h2>
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
              {host.configPath && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs text-muted-foreground" 
                  onClick={showConfigFile}
                >
                  View Config
                </Button>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="text-destructive hover:text-destructive" onClick={handleDeleteHost}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Host
          </Button>
        </div>
      </div>
      
      {/* Server list card */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CardTitle className="text-lg">Connected Servers</CardTitle>
              {selectedProfile && (
                <ProfileDropdown 
                  profiles={profiles} 
                  currentProfileId={selectedProfileId} 
                  onProfileChange={onProfileChange}
                  onCreateProfile={onCreateProfile}
                  onDeleteProfile={onDeleteProfile}
                />
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-[240px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search servers..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-8"
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
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Server list or empty state */}
          {profileServers.length > 0 ? (
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="h-10 px-4 text-left text-sm font-medium text-muted-foreground">Server</th>
                    <th className="h-10 px-4 text-left text-sm font-medium text-muted-foreground">Type</th>
                    <th className="h-10 px-4 text-left text-sm font-medium text-muted-foreground">Status</th>
                    <th className="h-10 px-4 text-left text-sm font-medium text-muted-foreground">Load</th>
                    <th className="h-10 px-4 text-center text-sm font-medium text-muted-foreground">Active</th>
                    <th className="h-10 px-4 text-right text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredServers.map(server => (
                    <ServerItem 
                      key={server.id}
                      server={server}
                      hostConnectionStatus={host.connectionStatus}
                      onStatusChange={handleServerStatusChange}
                      load={getServerLoad(server.id)}
                      onRemoveFromProfile={(serverId) => {
                        // Implementation for removing server from profile
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
        </CardContent>
      </Card>
      
      {/* Server Selection Dialog */}
      <ServerSelectionDialog 
        open={serverSelectionDialogOpen} 
        onOpenChange={setServerSelectionDialogOpen}
        onAddServers={(servers) => {
          // Implementation for adding servers to profile
          toast({
            title: "Servers added",
            description: `${servers.length} server(s) added to profile`,
            type: "success"
          });
        }}
      />
      
      {/* Config Highlight Dialog */}
      <ConfigHighlightDialog
        open={configDialogOpen}
        onOpenChange={setConfigDialogOpen}
        configPath={host.configPath || ""}
      />
    </div>
  );
};

// Helper component for the search icon
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
