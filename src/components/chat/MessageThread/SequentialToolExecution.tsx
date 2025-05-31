
import React, { useState } from 'react';
import { Play, X, ChevronDown, ChevronRight, Wrench, CheckCircle, XCircle, Clock, Server, AlertTriangle } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Message, SequentialToolExecution, PendingToolCall, ToolInvocation } from '../types/chat';
import { formatDistanceToNow } from 'date-fns';

interface SequentialToolExecutionProps {
  message: Message;
  onConfirmTool: (messageId: string, toolIndex: number) => void;
  onCancelExecution: (messageId: string) => void;
}

export const SequentialToolExecutionComponent: React.FC<SequentialToolExecutionProps> = ({ 
  message, 
  onConfirmTool,
  onCancelExecution
}) => {
  const [expandedTools, setExpandedTools] = useState<Set<string>>(new Set());
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const sequentialExecution = message.sequentialExecution;
  if (!sequentialExecution) return null;

  const { tools, currentIndex, completedTools, status } = sequentialExecution;
  const currentTool = tools[currentIndex];
  const isWaitingConfirmation = status === 'waiting_confirmation';
  const isExecuting = status === 'executing';
  const isCompleted = status === 'completed';
  const isCancelled = status === 'cancelled';

  const toggleExpanded = (toolId: string) => {
    const newExpanded = new Set(expandedTools);
    if (newExpanded.has(toolId)) {
      newExpanded.delete(toolId);
    } else {
      newExpanded.add(toolId);
    }
    setExpandedTools(newExpanded);
  };

  const handleConfirmTool = () => {
    setShowConfirmDialog(false);
    onConfirmTool(message.id, currentIndex);
  };

  const handleCancelExecution = () => {
    setShowConfirmDialog(false);
    onCancelExecution(message.id);
  };

  const getToolStatus = (toolIndex: number) => {
    if (toolIndex < currentIndex) return 'completed';
    if (toolIndex === currentIndex && isExecuting) return 'executing';
    if (toolIndex === currentIndex && isWaitingConfirmation) return 'pending';
    return 'waiting';
  };

  const getStatusIcon = (toolStatus: string) => {
    switch (toolStatus) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'executing':
        return <Clock className="h-4 w-4 text-yellow-500 animate-spin" />;
      case 'pending':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <>
      <div className="flex gap-3 animate-fade-in">
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarFallback className="bg-purple-100 text-purple-600">
            <Wrench className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-3 max-w-none">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">MCP工具调用</span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(message.timestamp, { addSuffix: true })}
            </span>
            <Badge variant="outline" className="text-xs">
              {currentIndex + 1}/{tools.length} 工具
            </Badge>
            {isCompleted && (
              <Badge variant="default" className="text-xs bg-green-100 text-green-700">
                全部完成
              </Badge>
            )}
            {isCancelled && (
              <Badge variant="destructive" className="text-xs">
                已取消
              </Badge>
            )}
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-950/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  {message.content}
                </p>
                <p className="text-sm text-muted-foreground">
                  需要按顺序执行 {tools.length} 个工具调用。
                </p>
              </div>

              {/* 工具执行进度 */}
              <div className="space-y-3">
                {tools.map((tool, index) => {
                  const toolStatus = getToolStatus(index);
                  const isCurrentTool = index === currentIndex;
                  const completedTool = completedTools.find(ct => ct.toolName === tool.toolName);

                  return (
                    <Card 
                      key={index} 
                      className={`border transition-all ${
                        isCurrentTool && isWaitingConfirmation
                          ? 'border-orange-300 bg-orange-50 dark:border-orange-600 dark:bg-orange-950/20'
                          : toolStatus === 'completed'
                          ? 'border-green-300 bg-green-50 dark:border-green-600 dark:bg-green-950/20'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <Collapsible 
                        open={expandedTools.has(`${message.id}-${index}`)} 
                        onOpenChange={() => toggleExpanded(`${message.id}-${index}`)}
                      >
                        <CollapsibleTrigger asChild>
                          <CardHeader className="cursor-pointer p-3 hover:bg-opacity-50 transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                {getStatusIcon(toolStatus)}
                                
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-sm">{tool.toolName}</span>
                                  {toolStatus === 'waiting' && (
                                    <span className="text-xs text-gray-500">等待中</span>
                                  )}
                                  {toolStatus === 'pending' && (
                                    <span className="text-xs text-orange-600 font-medium">待确认</span>
                                  )}
                                  {toolStatus === 'executing' && (
                                    <span className="text-xs text-yellow-600 font-medium">执行中</span>
                                  )}
                                  {toolStatus === 'completed' && (
                                    <span className="text-xs text-green-600 font-medium">已完成</span>
                                  )}
                                </div>
                                
                                <Badge variant="outline" className="text-xs flex items-center gap-1">
                                  <Server className="h-3 w-3" />
                                  {tool.serverName}
                                </Badge>
                              </div>
                              
                              <Button variant="ghost" size="sm" className="h-auto p-1">
                                {expandedTools.has(`${message.id}-${index}`) ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </CardHeader>
                        </CollapsibleTrigger>
                        
                        <CollapsibleContent>
                          <CardContent className="p-3 pt-0 space-y-3">
                            <div>
                              <h4 className="text-xs font-medium text-muted-foreground mb-2">请求参数</h4>
                              <div className="bg-white dark:bg-gray-800 rounded border p-2">
                                <pre className="text-xs overflow-x-auto">
                                  {JSON.stringify(tool.request, null, 2)}
                                </pre>
                              </div>
                            </div>

                            {completedTool && (
                              <div>
                                <h4 className="text-xs font-medium text-muted-foreground mb-2">执行结果</h4>
                                <div className="bg-white dark:bg-gray-800 rounded border p-2">
                                  <pre className="text-xs overflow-x-auto">
                                    {JSON.stringify(completedTool.response, null, 2)}
                                  </pre>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </CollapsibleContent>
                      </Collapsible>
                    </Card>
                  );
                })}
              </div>

              {/* 当前工具确认按钮 */}
              {isWaitingConfirmation && currentTool && (
                <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-700">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    <span className="text-sm font-medium">
                      是否执行工具: <code className="bg-orange-100 dark:bg-orange-900 px-1 rounded">{currentTool.toolName}</code>
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancelExecution}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <X className="h-4 w-4 mr-1" />
                      取消全部
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setShowConfirmDialog(true)}
                      className="bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      <Play className="h-4 w-4 mr-1" />
                      确认执行
                    </Button>
                  </div>
                </div>
              )}

              {isCompleted && (
                <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-700">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">
                    所有工具调用已完成
                  </span>
                </div>
              )}

              {isCancelled && (
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-700">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium text-red-700 dark:text-red-300">
                    工具调用已取消
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 工具确认对话框 */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              确认执行工具
            </DialogTitle>
            <DialogDescription>
              您确定要执行工具 <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">{currentTool?.toolName}</code> 吗？
            </DialogDescription>
          </DialogHeader>

          {currentTool && (
            <div className="space-y-3">
              <div className="bg-orange-50 dark:bg-orange-950/20 rounded-lg p-3 border border-orange-200 dark:border-orange-800">
                <div className="text-xs text-muted-foreground mb-1">工具参数:</div>
                <pre className="text-xs overflow-x-auto text-gray-600 dark:text-gray-400">
                  {JSON.stringify(currentTool.request, null, 2)}
                </pre>
              </div>
              
              <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">请确认参数正确后继续执行</span>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleCancelExecution}>
              取消全部
            </Button>
            <Button onClick={handleConfirmTool} className="bg-orange-600 hover:bg-orange-700">
              确认执行
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
