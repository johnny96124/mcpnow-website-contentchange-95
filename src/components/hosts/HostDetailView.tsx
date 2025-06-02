
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { 
  Host, Profile, ServerInstance
} from "@/data/mockData";
import { CollapsibleServerManagement } from "./CollapsibleServerManagement";
import { ConfigRequired } from "./ConfigRequired";
import { MCPNowHostView } from "./MCPNowHostView";

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
  const { toast } = useToast();

  const handleConfig = () => {
    if (host.id) {
      onCreateConfig(host.id);
    }
  };

  const handleRemove = () => {
    if (host.id) {
      onDeleteHost(host.id);
    }
  };

  const getServerLoad = (serverId: string) => {
    return Math.floor(Math.random() * 90) + 10;
  };

  // For MCP Now (built-in host)
  if (host.name === "MCP Now" || host.type === "mcpnow") {
    return (
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
        onStartAIChat={onStartAIChat}
      />
    );
  }

  // Convert the status-based callback to enabled-based for CollapsibleServerManagement
  const handleServerStatusToggle = (serverId: string, enabled: boolean) => {
    onServerStatusChange(serverId, enabled ? 'connecting' : 'stopped');
  };

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardContent className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold">{host.name}</h2>
            <p className="text-sm text-muted-foreground">
              {host.description || 'No description provided.'}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleRemove}>
                Delete Host
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardContent>
      </Card>

      {host.configStatus !== 'configured' ? (
        <ConfigRequired onConfig={handleConfig} />
      ) : (
        <CollapsibleServerManagement
          profiles={profiles}
          serverInstances={serverInstances}
          selectedProfileId={selectedProfileId}
          onProfileChange={onProfileChange}
          onCreateProfile={onCreateProfile}
          onDeleteProfile={onDeleteProfile}
          onServerStatusChange={handleServerStatusToggle}
          onAddServers={onAddServersToHost}
          onRemoveFromProfile={(serverId) => {
            const server = serverInstances.find(s => s.id === serverId);
            toast({
              title: "Server removed",
              description: `${server?.name} has been removed from this profile`,
            });
          }}
          getServerLoad={getServerLoad}
          hostConnectionStatus={host.connectionStatus}
        />
      )}
    </div>
  );
};
