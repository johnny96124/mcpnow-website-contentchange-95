
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Server, Wrench, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ToolQueueItem } from '../types/chat';

interface ToolQueueConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
  currentTool: ToolQueueItem;
  toolQueue: ToolQueueItem[];
  currentIndex: number;
  userMessage: string;
}

export const ToolQueueConfirmDialog: React.FC<ToolQueueConfirmDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
  currentTool,
  toolQueue,
  currentIndex,
  userMessage
}) => {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onCancel();
    onOpenChange(false);
  };

  const getToolStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'executing':
        return <Clock className="h-4 w-4 text-yellow-500 animate-spin" />;
      case 'cancelled':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-purple-500" />
            MCP工具调用确认 - 步骤 {currentIndex + 1} / {toolQueue.length}
          </DialogTitle>
          <DialogDescription>
            正在处理您的请求，需要执行以下工具。当前需要您确认第 {currentIndex + 1} 个工具的调用。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* 用户消息 */}
          <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">您的请求</span>
            </div>
            <p className="text-sm text-blue-800 dark:text-blue-200">"{userMessage}"</p>
          </div>

          {/* 工具队列进度 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Wrench className="h-4 w-4 text-purple-500" />
              <span className="font-medium text-sm">工具执行进度</span>
              <Badge variant="outline">{currentIndex + 1} / {toolQueue.length}</Badge>
            </div>

            <div className="grid gap-2">
              {toolQueue.map((tool, index) => (
                <Card 
                  key={index} 
                  className={`border transition-all ${
                    index === currentIndex 
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/30 shadow-md' 
                      : index < currentIndex 
                        ? 'border-green-200 bg-green-50 dark:bg-green-950/20' 
                        : 'border-gray-200 bg-gray-50 dark:bg-gray-950/20'
                  }`}
                >
                  <CardHeader className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {getToolStatusIcon(tool.status)}
                          <span className={`font-medium text-sm ${
                            index === currentIndex ? 'text-purple-700 dark:text-purple-300' : ''
                          }`}>
                            {index + 1}. {tool.toolName}
                          </span>
                          {index === currentIndex && (
                            <Badge variant="default" className="text-xs bg-purple-100 text-purple-700">
                              当前工具
                            </Badge>
                          )}
                        </div>
                        <Badge variant="outline" className="text-xs flex items-center gap-1">
                          <Server className="h-3 w-3" />
                          {tool.serverName}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* 工具描述 */}
                    <p className="text-xs text-muted-foreground mt-1">
                      {tool.description}
                    </p>
                  </CardHeader>
                  
                  {/* 当前工具的详细信息 */}
                  {index === currentIndex && (
                    <CardContent className="p-3 pt-0">
                      <div className="bg-white dark:bg-gray-800 rounded-lg border p-3">
                        <div className="text-xs text-muted-foreground mb-1">请求参数:</div>
                        <pre className="text-xs overflow-x-auto text-gray-600 dark:text-gray-400">
                          {JSON.stringify(tool.request, null, 2)}
                        </pre>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>

          {/* 当前工具重点提示 */}
          <div className="bg-purple-50 dark:bg-purple-950/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
            <div className="flex items-start gap-3">
              <Wrench className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-1">
                  即将执行：{currentTool.toolName}
                </div>
                <p className="text-sm text-purple-600 dark:text-purple-400 mb-2">
                  {currentTool.description}
                </p>
                <p className="text-xs text-purple-500 dark:text-purple-400">
                  执行此工具将会 {currentTool.toolName === 'get_figma_data' ? '访问 Figma 设计文件' : 
                  currentTool.toolName === 'read_file' ? '读取指定的文件内容' : 
                  currentTool.toolName === 'search' ? '执行搜索操作' : '分析您的请求'}。
                </p>
              </div>
            </div>
          </div>

          {/* 安全提示 */}
          <div className="bg-amber-50 dark:bg-amber-950/20 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-amber-700 dark:text-amber-300 mb-1">
                  安全确认
                </div>
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  请仔细确认当前工具的调用参数是否符合您的预期。每个工具都需要您的明确授权才会执行。
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleCancel}>
            取消当前工具
          </Button>
          <Button onClick={handleConfirm} className="bg-purple-600 hover:bg-purple-700">
            确认执行当前工具
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
