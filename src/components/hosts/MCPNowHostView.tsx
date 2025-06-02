
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
import { CollapsibleServerManagement } from "./CollapsibleServerManagement";
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
  onStartAIChat?: () => void;
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
  onAddServersToProfile,
  onStartAIChat
}) => {
  const [serverSelectionDialogOpen, setServerSelectionDialogOpen] = useState(false);
  const { toast } = useToast();

  const currentProfile = profiles.find(p => p.id === selectedProfileId);

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

  const handleStartAIChat = () => {
    if (onStartAIChat) {
      onStartAIChat();
      toast({
        title: "AI Chat Started",
        description: "AI chat panel has been opened",
      });
    }
  };

  const getServerLoad = (serverId: string) => {
    return Math.floor(Math.random() * 90) + 10;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Host Header with AI Chat Button */}
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
            
            {/* AI Chat Button */}
            <div className="flex items-center gap-3">
              <Button 
                onClick={handleStartAIChat}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                开始AI对话
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Collapsible Server Management */}
      <CollapsibleServerManagement
        profiles={profiles}
        serverInstances={serverInstances}
        selectedProfileId={selectedProfileId}
        onProfileChange={onProfileChange}
        onCreateProfile={onCreateProfile}
        onDeleteProfile={onDeleteProfile}
        onServerStatusChange={handleServerStatusChange}
        onAddServers={() => setServerSelectionDialogOpen(true)}
        onRemoveFromProfile={(serverId) => {
          const server = serverInstances.find(s => s.id === serverId);
          toast({
            title: "Server removed",
            description: `${server?.name} has been removed from this profile`,
          });
        }}
        getServerLoad={getServerLoad}
        hostConnectionStatus="connected"
      />
      
      <ServerSelectionDialog 
        open={serverSelectionDialogOpen} 
        onOpenChange={setServerSelectionDialogOpen}
        onAddServers={handleAddServers}
      />
    </div>
  );
};
