
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Server, Wrench } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface ToolCall {
  toolName: string;
  serverId: string;
  serverName: string;
  request: any;
}

interface ToolConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  toolCalls: ToolCall[];
  userMessage: string;
}

export const ToolConfirmDialog: React.FC<ToolConfirmDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  toolCalls,
  userMessage
}) => {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            MCP工具调用确认
          </DialogTitle>
          <DialogDescription>
            AI助手需要调用以下MCP工具来处理您的请求，请确认是否继续执行。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* 用户消息 */}
          <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">您的问题</span>
            </div>
            <p className="text-sm text-blue-800 dark:text-blue-200">"{userMessage}"</p>
          </div>

          {/* 工具调用列表 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Wrench className="h-4 w-4 text-purple-500" />
              <span className="font-medium text-sm">即将调用的工具</span>
              <Badge variant="outline">{toolCalls.length} 个工具</Badge>
            </div>

            {toolCalls.map((tool, index) => (
              <Card key={index} className="border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950/20">
                <CardHeader className="p-3 pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Wrench className="h-4 w-4 text-purple-500" />
                        <span className="font-medium text-sm">{tool.toolName}</span>
                      </div>
                      <Badge variant="outline" className="text-xs flex items-center gap-1">
                        <Server className="h-3 w-3" />
                        {tool.serverName}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="bg-white dark:bg-gray-800 rounded-lg border p-3">
                    <div className="text-xs text-muted-foreground mb-1">请求参数:</div>
                    <pre className="text-xs overflow-x-auto text-gray-600 dark:text-gray-400">
                      {JSON.stringify(tool.request, null, 2)}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 安全提示 */}
          <div className="bg-amber-50 dark:bg-amber-950/20 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-amber-700 dark:text-amber-300 mb-1">
                  安全提醒
                </div>
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  请仔细检查上述工具调用的参数是否符合您的预期。工具调用可能会访问文件、执行搜索或与外部服务交互。
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleCancel}>
            取消
          </Button>
          <Button onClick={handleConfirm}>
            确认执行
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
