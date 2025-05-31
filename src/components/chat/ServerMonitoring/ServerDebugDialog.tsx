
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ServerConnectionInfo, ServerMessage } from '../types/chat';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface ServerDebugDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serverInfo: ServerConnectionInfo | null;
  messages: ServerMessage[];
  onHealthCheck: () => Promise<boolean>;
}

export const ServerDebugDialog: React.FC<ServerDebugDialogProps> = ({
  open,
  onOpenChange,
  serverInfo,
  messages,
  onHealthCheck
}) => {
  if (!serverInfo) return null;

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

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case 'request': return 'text-blue-600';
      case 'response': return 'text-green-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span>服务器调试 - {serverInfo.name}</span>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${getStatusColor(serverInfo.status)}`} />
              <Badge variant="outline">{getStatusText(serverInfo.status)}</Badge>
            </div>
          </DialogTitle>
          <DialogDescription>
            查看服务器连接信息和通信历史
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="connection" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="connection">连接信息</TabsTrigger>
            <TabsTrigger value="messages">消息历史</TabsTrigger>
          </TabsList>

          <TabsContent value="connection" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">基本信息</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">服务器ID:</span>
                    <span className="font-mono">{serverInfo.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">类型:</span>
                    <Badge variant="secondary">{serverInfo.type}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">状态:</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(serverInfo.status)}`} />
                      <span>{getStatusText(serverInfo.status)}</span>
                    </div>
                  </div>
                  {serverInfo.responseTime && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">响应时间:</span>
                      <span>{serverInfo.responseTime}ms</span>
                    </div>
                  )}
                  {serverInfo.lastHealthCheck && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">最后检查:</span>
                      <span>{formatDistanceToNow(serverInfo.lastHealthCheck, { locale: zhCN, addSuffix: true })}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">连接操作</h4>
                <div className="space-y-2">
                  <Button 
                    onClick={onHealthCheck}
                    disabled={serverInfo.status === 'starting'}
                    className="w-full"
                  >
                    {serverInfo.status === 'starting' ? '检查中...' : '健康检查'}
                  </Button>
                  {serverInfo.errorMessage && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600">{serverInfo.errorMessage}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium mb-2">配置信息</h4>
              <ScrollArea className="h-32 w-full border rounded-lg p-3">
                <pre className="text-xs text-muted-foreground">
                  {JSON.stringify(serverInfo.configuration, null, 2)}
                </pre>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="messages">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">通信记录</h4>
                <Badge variant="outline">{messages.length} 条消息</Badge>
              </div>
              
              <ScrollArea className="h-96 w-full border rounded-lg">
                <div className="p-4 space-y-3">
                  {messages.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      暂无通信记录
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div key={message.id} className="border rounded-lg p-3 space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={getMessageTypeColor(message.type)}>
                              {message.type.toUpperCase()}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(message.timestamp, { locale: zhCN, addSuffix: true })}
                            </span>
                          </div>
                        </div>
                        <div className="text-sm">
                          {message.content}
                        </div>
                        {message.data && (
                          <details className="text-xs">
                            <summary className="cursor-pointer text-muted-foreground">
                              查看详细数据
                            </summary>
                            <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-x-auto">
                              {JSON.stringify(message.data, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
