
import React, { useState } from "react";
import { 
  MessageSquare, Bot, Server, 
  CheckCircle, Settings, MoreHorizontal,
  ExternalLink, Activity, Zap,
  Users, Database, TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { StatusIndicator } from "@/components/status/StatusIndicator";
import { useToast } from "@/hooks/use-toast";
import { 
  Host, Profile, ServerInstance
} from "@/data/mockData";
import { ProfileDropdown } from "./ProfileDropdown";
import { ServerListEmpty } from "./ServerListEmpty";
import { ServerItem } from "./ServerItem";
import { ServerSelectionDialog } from "./ServerSelectionDialog";
import { InlineChatDialog } from "./InlineChatDialog";
import { Separator } from "@/components/ui/separator";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ModelSelector } from "@/components/chat/InputArea/ModelSelector";
import { ServerSelector } from "@/components/chat/ServerSelector/ServerSelector";
import { MCPServer, MCPProfile } from "@/components/chat/types/chat";

interface MCPNowHostViewProps {
  host: Host;
  profiles: Profile[];
  serverInstances: ServerInstance[];
  selectedProfileId: string;
  onProfileChange: (profileId: string) => void;
  onServerStatusChange: (serverId: string, status: 'running' | 'stopped' | 'error' | 'connecting') => void;
  onSaveProfileChanges: () => void;
  onCreateProfile: (name: string) => string;
  onDeleteProfile: (profileId: string) => void;
  onAddServersToProfile?: (servers: ServerInstance[]) => void;
}

export const MCPNowHostView: React.FC<MCPNowHostViewProps> = ({
  host,
  profiles,
  serverInstances,
  selectedProfileId,
  onProfileChange,
  onServerStatusChange,
  onSaveProfileChanges,
  onCreateProfile,
  onDeleteProfile,
  onAddServersToProfile
}) => {
  const [serverSelectionDialogOpen, setServerSelectionDialogOpen] = useState(false);
  const [chatDialogOpen, setChatDialogOpen] = useState(false);
  const { toast } = useToast();

  const currentProfile = profiles.find(p => p.id === selectedProfileId);
  const profileServers = serverInstances.filter(
    server => currentProfile?.instances.includes(server.id)
  );

  const handleServerStatusChange = (serverId: string, enabled: boolean) => {
    onServerStatusChange(
      serverId, 
      enabled ? 'connecting' : 'stopped'
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
          });
        } else {
          onServerStatusChange(serverId, 'error');
          toast({
            title: "Connection error",
            description: "Failed to connect to server",
            variant: "destructive"
          });
        }
      }, 2000);
    }
  };

  const handleAddServers = (servers: ServerInstance[]) => {
    if (currentProfile && servers.length > 0) {
      if (onAddServersToProfile) {
        onAddServersToProfile(servers);
      } else {
        toast({
          title: "Servers added",
          description: `${servers.length} server(s) added to ${currentProfile.name}`,
        });
        onSaveProfileChanges();
      }
    }
  };

  const getServerLoad = (serverId: string) => {
    return Math.floor(Math.random() * 90) + 10;
  };

  const handleStartAIChat = () => {
    setChatDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Host Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                <span className="text-2xl">{host.icon || '🚀'}</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  {host.name}
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                    Built-in
                  </Badge>
                </h2>
                <div className="flex items-center gap-2">
                  <StatusIndicator status="active" label="Ready for AI Chat" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={handleStartAIChat} className="bg-blue-600 hover:bg-blue-700">
                <MessageSquare className="h-4 w-4 mr-2" />
                Start AI Chat
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Server Profile Management
          </CardTitle>
        </CardHeader>
        <CardContent>
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
            {profileServers.length > 0 && (
              <Button 
                onClick={() => setServerSelectionDialogOpen(true)} 
                className="whitespace-nowrap"
              >
                <Server className="h-4 w-4 mr-2" />
                Add Servers
              </Button>
            )}
          </div>
          
          {profileServers.length > 0 ? (
            <div className="rounded-md border">
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
                      hostConnectionStatus="connected"
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
        </CardContent>
      </Card>
      
      <ServerSelectionDialog 
        open={serverSelectionDialogOpen} 
        onOpenChange={setServerSelectionDialogOpen}
        onAddServers={handleAddServers}
      />

      <InlineChatDialog 
        open={chatDialogOpen} 
        onOpenChange={setChatDialogOpen}
      />
    </div>
  );
};
