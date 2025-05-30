
import React from 'react';
import { Check, ChevronDown, Server, Users } from 'lucide-react';
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
import { MCPServer, MCPProfile } from '../types/chat';

interface ServerSelectorProps {
  servers: MCPServer[];
  profiles: MCPProfile[];
  selectedServers: string[];
  selectedProfile?: string;
  onServersChange: (serverIds: string[]) => void;
  onProfileChange: (profileId?: string) => void;
}

export const ServerSelector: React.FC<ServerSelectorProps> = ({
  servers,
  profiles,
  selectedServers,
  selectedProfile,
  onServersChange,
  onProfileChange,
}) => {
  const handleServerToggle = (serverId: string) => {
    if (selectedServers.includes(serverId)) {
      onServersChange(selectedServers.filter(id => id !== serverId));
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
            {servers.map((server) => (
              <DropdownMenuItem
                key={server.id}
                onClick={() => handleServerToggle(server.id)}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    server.status === 'connected' ? 'bg-green-500' : 'bg-gray-400'
                  }`} />
                  <span>{server.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {server.type}
                  </Badge>
                </div>
                {selectedServers.includes(server.id) && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </DropdownMenuItem>
            ))}
            
            {servers.length === 0 && (
              <div className="p-4 text-center text-muted-foreground text-sm">
                No connected servers available
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {selectedServers.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedServers.map(serverId => {
            const server = servers.find(s => s.id === serverId);
            return server ? (
              <Badge key={serverId} variant="secondary" className="text-xs">
                {server.name}
              </Badge>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
};
