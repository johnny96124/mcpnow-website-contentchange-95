
import React, { useState, useEffect } from 'react';
import { Check, ChevronDown, Server, Users, Loader2, CheckCircle, XCircle, AlertTriangle, Settings, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { MCPServer, MCPProfile } from '../types/chat';
import { EditServerDialog } from '@/components/servers/EditServerDialog';
import { serverDefinitions, ServerDefinition } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

interface ServerSelectorProps {
  servers: MCPServer[];
  profiles: MCPProfile[];
  selectedServers: string[];
  selectedProfile?: string;
  onServersChange: (serverIds: string[]) => void;
  onProfileChange: (profileId?: string) => void;
}

type ConnectionStatus = 'connecting' | 'connected' | 'failed' | 'disconnected';

interface ServerConnectionState {
  [serverId: string]: ConnectionStatus;
}

export const ServerSelector: React.FC<ServerSelectorProps> = ({
  servers,
  profiles,
  selectedServers,
  selectedProfile,
  onServersChange,
  onProfileChange,
}) => {
  const [connectionStates, setConnectionStates] = useState<ServerConnectionState>({});
  const [isConnecting, setIsConnecting] = useState(false);
  const [editServerOpen, setEditServerOpen] = useState(false);
  const [selectedServerForEdit, setSelectedServerForEdit] = useState<ServerDefinition | null>(null);
  const { toast } = useToast();

  // 当选择的服务器发生变化时，尝试连接
  useEffect(() => {
    if (selectedServers.length > 0) {
      connectToServers(selectedServers);
    } else {
      setConnectionStates({});
    }
  }, [selectedServers]);

  const connectToServers = async (serverIds: string[]) => {
    setIsConnecting(true);
    
    const initialStates: ServerConnectionState = {};
    serverIds.forEach(serverId => {
      initialStates[serverId] = 'connecting';
    });
    setConnectionStates(initialStates);

    for (const serverId of serverIds) {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        const success = Math.random() > 0.3;
        
        setConnectionStates(prev => ({
          ...prev,
          [serverId]: success ? 'connected' : 'failed'
        }));
      } catch (error) {
        setConnectionStates(prev => ({
          ...prev,
          [serverId]: 'failed'
        }));
      }
    }
    
    setIsConnecting(false);
  };

  const handleServerToggle = (serverId: string) => {
    if (selectedServers.includes(serverId)) {
      const newSelectedServers = selectedServers.filter(id => id !== serverId);
      onServersChange(newSelectedServers);
      
      setConnectionStates(prev => {
        const newStates = { ...prev };
        delete newStates[serverId];
        return newStates;
      });
    } else {
      onServersChange([...selectedServers, serverId]);
    }
    onProfileChange(undefined); // Clear profile selection when manually selecting servers
  };

  const handleProfileSelect = (profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    if (profile) {
      onServersChange(profile.serverIds);
      onProfileChange(profileId);
    }
  };

  const handleServerConfig = (serverId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const serverDefinition = serverDefinitions.find(def => 
      servers.find(s => s.id === serverId && s.name === def.name)
    );
    
    if (serverDefinition) {
      setSelectedServerForEdit(serverDefinition);
      setEditServerOpen(true);
    }
  };

  const handleUpdateServer = (data: any) => {
    toast({
      title: "Server Updated",
      description: `Server configuration has been updated successfully.`
    });
    setEditServerOpen(false);
  };

  const getConnectionStatusIcon = (serverId: string) => {
    const status = connectionStates[serverId];
    
    switch (status) {
      case 'connecting':
        return <Loader2 className="h-3 w-3 animate-spin text-yellow-500" />;
      case 'connected':
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      case 'failed':
        return <XCircle className="h-3 w-3 text-red-500" />;
      default:
        return null;
    }
  };

  const getConnectionStatusText = (serverId: string) => {
    const status = connectionStates[serverId];
    
    switch (status) {
      case 'connecting':
        return 'Connecting...';
      case 'connected':
        return 'Connected';
      case 'failed':
        return 'Connection Failed';
      default:
        return '';
    }
  };

  const getProfileServers = (profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    if (!profile) return [];
    
    return profile.serverIds.map(serverId => 
      servers.find(s => s.id === serverId)
    ).filter(Boolean) as MCPServer[];
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">MCP Servers</label>
        
        {/* Profile Selection */}
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground font-medium">从 Profile 选择</div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="truncate">
                    {selectedProfile 
                      ? profiles.find(p => p.id === selectedProfile)?.name || 'Unknown Profile'
                      : 'Select from Profile...'
                    }
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 ml-2 flex-shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="start">
              <DropdownMenuLabel>Available Profiles</DropdownMenuLabel>
              {profiles.map((profile) => {
                const profileServers = getProfileServers(profile.id);
                
                return (
                  <DropdownMenuItem
                    key={profile.id}
                    onClick={() => handleProfileSelect(profile.id)}
                    className="flex flex-col items-start p-3 cursor-pointer min-h-fit"
                  >
                    <div className="flex items-center justify-between w-full mb-2">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span className="font-medium">{profile.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {profile.serverIds.length} servers
                        </Badge>
                      </div>
                      {selectedProfile === profile.id && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    
                    {/* Profile Servers Preview */}
                    <div className="w-full mt-1">
                      <div className="text-xs text-muted-foreground mb-1">包含的服务器:</div>
                      <div className="flex flex-wrap gap-1">
                        {profileServers.map((server) => (
                          <Badge key={server.id} variant="outline" className="text-xs">
                            {server.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </DropdownMenuItem>
                );
              })}
              
              {profiles.length === 0 && (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  No profiles available
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Individual Server Selection */}
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground font-medium">单独选择服务器</div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <div className="flex items-center gap-2">
                  <Server className="h-4 w-4" />
                  <span className="truncate">
                    {!selectedProfile && selectedServers.length > 0
                      ? selectedServers.length === 1 
                        ? servers.find(s => s.id === selectedServers[0])?.name || 'Unknown Server'
                        : `${selectedServers.length} servers selected`
                      : 'Select individual servers...'
                    }
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 ml-2 flex-shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="start">
              <DropdownMenuLabel>Individual Servers</DropdownMenuLabel>
              {servers.map((server) => {
                const isSelected = selectedServers.includes(server.id);
                const connectionStatus = connectionStates[server.id];
                
                return (
                  <DropdownMenuItem
                    key={server.id}
                    onClick={(e) => {
                      e.preventDefault();
                      handleServerToggle(server.id);
                    }}
                    className="flex items-center justify-between p-3 cursor-pointer"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => handleServerToggle(server.id)}
                        className="h-4 w-4"
                      />
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          server.status === 'connected' ? 'bg-green-500' : 'bg-gray-400'
                        }`} />
                        <span className="font-medium">{server.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {server.type}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-2">
                      {isSelected && connectionStatus && (
                        <div className="flex items-center gap-2">
                          {getConnectionStatusIcon(server.id)}
                          <span className="text-xs text-muted-foreground">
                            {getConnectionStatusText(server.id)}
                          </span>
                        </div>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-foreground"
                        onClick={(e) => handleServerConfig(server.id, e)}
                      >
                        <Settings className="h-3 w-3" />
                      </Button>
                    </div>
                  </DropdownMenuItem>
                );
              })}
              
              {servers.length === 0 && (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  No connected servers available
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Selected Servers Status Display */}
      {selectedServers.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">
            {selectedProfile ? `Profile: ${profiles.find(p => p.id === selectedProfile)?.name}` : 'Selected Servers'} ({selectedServers.length})
          </div>
          <div className="space-y-1">
            {selectedServers.map(serverId => {
              const server = servers.find(s => s.id === serverId);
              const connectionStatus = connectionStates[serverId];
              
              return server ? (
                <div key={serverId} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {server.name}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {server.type}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {connectionStatus && (
                      <div className="flex items-center gap-1">
                        {getConnectionStatusIcon(serverId)}
                        <span className="text-xs text-muted-foreground">
                          {getConnectionStatusText(serverId)}
                        </span>
                      </div>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-foreground"
                      onClick={(e) => handleServerConfig(serverId, e)}
                    >
                      <Settings className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ) : null;
            })}
          </div>
          
          {isConnecting && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Establishing connections...
            </div>
          )}
        </div>
      )}
      
      <EditServerDialog
        open={editServerOpen}
        onOpenChange={setEditServerOpen}
        serverDefinition={selectedServerForEdit}
        onUpdateServer={handleUpdateServer}
        allowEditAll={true}
      />
    </div>
  );
};
