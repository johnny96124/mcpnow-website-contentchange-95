
import React from 'react';
import { MoreHorizontal, Settings, BarChart2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { StatusIndicator } from '../status/StatusIndicator';
import { ConnectionStatus } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { serverDefinitions } from '@/data/mockData';
import { EndpointLabel } from '@/components/status/EndpointLabel';

interface ServerItemProps {
  server: {
    id: string;
    name: string;
    type?: string;
    status: 'running' | 'stopped' | 'error' | 'connecting';
  };
  hostConnectionStatus: ConnectionStatus;
  load?: number;
  onStatusChange: (id: string, enabled: boolean) => void;
  onRemoveFromProfile?: (id: string) => void;
}

export const ServerItem = ({
  server,
  hostConnectionStatus,
  load = 50,
  onStatusChange,
  onRemoveFromProfile,
}: ServerItemProps) => {
  const isActive = server.status === 'running';
  const isConnecting = server.status === 'connecting';
  const isError = server.status === 'error';
  const isDisabled = hostConnectionStatus !== 'connected';

  const handleToggleStatus = () => {
    onStatusChange(server.id, !isActive && !isConnecting);
  };

  const getServerTypeLabel = (type?: string) => {
    const serverType = type || 'generic';
    const definition = serverDefinitions.find(def => def.type === serverType);
    return definition?.name || 'Generic Server';
  };

  return (
    <tr className="border-b last:border-0">
      <td className="p-4 align-middle">
        <div className="flex items-center gap-3">
          <div className="bg-muted/50 p-2 rounded-lg">
            <Server className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium">{server.name}</p>
            <p className="text-xs text-muted-foreground">{server.id.substring(0, 8)}</p>
          </div>
        </div>
      </td>
      
      <td className="p-4 align-middle">
        <EndpointLabel type={server.type as any || 'HTTP_SSE'} />
      </td>
      
      <td className="p-4 align-middle">
        <StatusIndicator 
          status={
            server.status === 'running' 
              ? 'active' 
              : server.status === 'connecting' 
                ? 'warning' 
                : server.status === 'error' 
                  ? 'error' 
                  : 'inactive'
          } 
          label={
            server.status === 'running'
              ? 'Connected'
              : server.status === 'connecting'
                ? 'Connecting'
                : server.status === 'error'
                  ? 'Error'
                  : 'Disconnected'
          }
        />
      </td>
      
      <td className="p-4 align-middle text-center">
        <Switch
          checked={isActive || isConnecting}
          onCheckedChange={handleToggleStatus}
          disabled={isDisabled}
          className="data-[state=checked]:bg-blue-600"
        />
      </td>
      
      <td className="p-4 align-middle text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <BarChart2 className="mr-2 h-4 w-4" />
              <span>View Metrics</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <ExternalLink className="mr-2 h-4 w-4" />
              <span>Open Dashboard</span>
            </DropdownMenuItem>
            {onRemoveFromProfile && (
              <DropdownMenuItem 
                className="cursor-pointer text-red-600"
                onClick={() => onRemoveFromProfile(server.id)}
              >
                <span>Remove from Profile</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
};
