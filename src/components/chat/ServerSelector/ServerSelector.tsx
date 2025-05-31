
import React, { useState, useEffect } from 'react';
import { Check, ChevronDown, Server, Users, Loader2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
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

  // 当选择的服务器发生变化时，尝试连接
  useEffect(() => {
    if (selectedServers.length > 0) {
      connectToServers(selectedServers);
    } else {
      // 清空连接状态
      setConnectionStates({});
    }
  }, [selectedServers]);

  const connectToServers = async (serverIds: string[]) => {
    setIsConnecting(true);
    
    // 重置连接状态为连接中
    const initialStates: ServerConnectionState = {};
    serverIds.forEach(serverId => {
      initialStates[serverId] = 'connecting';
    });
    setConnectionStates(initialStates);

    // 模拟异步连接过程
    for (const serverId of serverIds) {
      try {
        // 模拟连接延迟
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        
        // 随机模拟连接成功或失败
        const success = Math.random() > 0.3; // 70% 成功率
        
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
      
      // 移除未选中服务器的连接状态
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

  const getDisplayText = () => {
    if (selectedProfile) {
      const profile = profiles.find(p => p.id === selectedProfile);
      return profile?.name || 'Unknown Profile';
    }
    
    if (selectedServers.length === 0) {
      return 'Select servers...';
    }
    
    if (selectedServers.length === 1) {
      const server = servers.find(s => s.id === selectedServers[0]);
      return server?.name || 'Unknown Server';
    }
    
    return `${selectedServers.length} servers selected`;
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

  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-medium mb-2 block">MCP Servers</label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span className="truncate">{getDisplayText()}</span>
              <ChevronDown className="h-4 w-4 ml-2 flex-shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80" align="start">
            {profiles.length > 0 && (
              <>
                <DropdownMenuLabel className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Profiles
                </DropdownMenuLabel>
                {profiles.map((profile) => (
                  <DropdownMenuItem
                    key={profile.id}
                    onClick={() => handleProfileSelect(profile.id)}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{profile.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {profile.serverIds.length} servers
                      </Badge>
                    </div>
                    {selectedProfile === profile.id && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
              </>
            )}
            
            <DropdownMenuLabel className="flex items-center gap-2">
              <Server className="h-4 w-4" />
              Individual Servers
            </DropdownMenuLabel>
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
                  
                  {/* 只为选中的服务器显示连接状态 */}
                  {isSelected && connectionStatus && (
                    <div className="flex items-center gap-2 ml-2">
                      {getConnectionStatusIcon(server.id)}
                      <span className="text-xs text-muted-foreground">
                        {getConnectionStatusText(server.id)}
                      </span>
                    </div>
                  )}
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
      
      {/* 选中服务器的状态展示 */}
      {selectedServers.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">
            Selected Servers ({selectedServers.length})
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
                  
                  {connectionStatus && (
                    <div className="flex items-center gap-1">
                      {getConnectionStatusIcon(serverId)}
                      <span className="text-xs text-muted-foreground">
                        {getConnectionStatusText(serverId)}
                      </span>
                    </div>
                  )}
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
    </div>
  );
};
