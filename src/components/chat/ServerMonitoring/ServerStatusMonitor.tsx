
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { MCPServer } from '../types/chat';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { RefreshCcw, Bug } from 'lucide-react';

interface ServerStatusMonitorProps {
  servers: MCPServer[];
  onHealthCheck: (serverId: string) => Promise<boolean>;
  onOpenDebug: (serverId: string) => void;
  isHealthChecking: boolean;
}

export const ServerStatusMonitor: React.FC<ServerStatusMonitorProps> = ({
  servers,
  onHealthCheck,
  onOpenDebug,
  isHealthChecking
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'disconnected': return 'bg-red-500';
      case 'starting': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected': return '已连接';
      case 'disconnected': return '已断开';
      case 'starting': return '连接中';
      default: return '未知';
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'connected': return 'default';
      case 'disconnected': return 'destructive';
      case 'starting': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">服务器状态监控</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => Promise.all(servers.map(s => onHealthCheck(s.id)))}
          disabled={isHealthChecking}
        >
          <RefreshCcw className={`h-4 w-4 mr-2 ${isHealthChecking ? 'animate-spin' : ''}`} />
          {isHealthChecking ? '检查中...' : '刷新状态'}
        </Button>
      </div>

      <div className="space-y-2">
        {servers.map((server) => (
          <div key={server.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${getStatusColor(server.status)}`} />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{server.name}</span>
                  <Badge variant={getStatusVariant(server.status)}>
                    {getStatusText(server.status)}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {server.type}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                  {server.responseTime && (
                    <span>响应: {server.responseTime}ms</span>
                  )}
                  {server.lastHealthCheck && (
                    <span>
                      检查: {formatDistanceToNow(server.lastHealthCheck, { locale: zhCN, addSuffix: true })}
                    </span>
                  )}
                </div>
                {server.errorMessage && (
                  <p className="text-xs text-red-600 mt-1">{server.errorMessage}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {server.status === 'disconnected' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onHealthCheck(server.id)}
                  disabled={isHealthChecking}
                >
                  重连
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenDebug(server.id)}
              >
                <Bug className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
