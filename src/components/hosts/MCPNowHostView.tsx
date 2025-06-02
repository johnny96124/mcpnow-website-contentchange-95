
import React, { useState, useCallback } from "react";
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
import { InlineChatPanel } from "./InlineChatPanel";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

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
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [serverPanelSize, setServerPanelSize] = useState(40);
  const [chatPanelSize, setChatPanelSize] = useState(60);
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
    setIsChatOpen(true);
    toast({
      title: "AI Chat Started",
      description: "AI chat panel has been opened",
    });
    if (onStartAIChat) {
      onStartAIChat();
    }
  };

  const handleToggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleRequestMoreSpace = useCallback(() => {
    // Give more space to server management when needed
    const newServerSize = Math.min(70, serverPanelSize + 20);
    const newChatSize = 100 - newServerSize;
    setServerPanelSize(newServerSize);
    setChatPanelSize(newChatSize);
  }, [serverPanelSize]);

  const handlePanelResize = useCallback((sizes: number[]) => {
    const [newServerSize, newChatSize] = sizes;
    setServerPanelSize(newServerSize);
    setChatPanelSize(newChatSize);
  }, []);

  const getServerLoad = (serverId: string) => {
    return Math.floor(Math.random() * 90) + 10;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Host Header with AI Chat Button */}
      <div className="flex-shrink-0 p-6 pb-4">
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
      </div>

      {/* Resizable Content Area */}
      <div className="flex-1 min-h-0 px-6 pb-6">
        {isChatOpen ? (
          <ResizablePanelGroup 
            direction="vertical" 
            className="h-full"
            onLayout={handlePanelResize}
          >
            {/* Server Management Panel */}
            <ResizablePanel 
              defaultSize={serverPanelSize} 
              minSize={25} 
              maxSize={75}
              className="flex flex-col"
            >
              <div className="h-full">
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
                  onRequestMoreSpace={handleRequestMoreSpace}
                />
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle className="my-2" />

            {/* AI Chat Panel */}
            <ResizablePanel 
              defaultSize={chatPanelSize} 
              minSize={25}
              className="flex flex-col"
            >
              <Card className="h-full border-blue-200 dark:border-blue-800 flex flex-col">
                <CardHeader className="pb-3 flex-shrink-0">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-blue-600" />
                      AI Chat
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleToggleChat}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      收起
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 flex-1 min-h-0">
                  <div className="h-full border-t">
                    <InlineChatPanel className="h-full" />
                  </div>
                </CardContent>
              </Card>
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          /* Server Management Only */
          <div className="h-full">
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
          </div>
        )}
      </div>
      
      <ServerSelectionDialog 
        open={serverSelectionDialogOpen} 
        onOpenChange={setServerSelectionDialogOpen}
        onAddServers={handleAddServers}
      />
    </div>
  );
};
