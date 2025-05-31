
import React, { useState } from 'react';
import { Play, X, ChevronDown, ChevronRight, Wrench, CheckCircle, XCircle, Clock, Server, MoreVertical, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ToolQueueConfirmDialog } from './ToolQueueConfirmDialog';
import { Message } from '../types/chat';
import { formatDistanceToNow } from 'date-fns';

interface ToolCallMessageProps {
  message: Message;
  onToolAction: (messageId: string, action: 'run' | 'cancel') => void;
  onDelete?: () => void;
}

export const ToolCallMessage: React.FC<ToolCallMessageProps> = ({ 
  message, 
  onToolAction,
  onDelete 
}) => {
  const [expandedTools, setExpandedTools] = useState<Set<string>>(new Set());
  const [showActions, setShowActions] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const toggleExpanded = (toolId: string) => {
    const newExpanded = new Set(expandedTools);
    if (newExpanded.has(toolId)) {
      newExpanded.delete(toolId);
    } else {
      newExpanded.add(toolId);
    }
    setExpandedTools(newExpanded);
  };

  const toolQueue = message.toolQueue || [];
  const currentIndex = message.currentToolIndex || 0;
  const currentTool = toolQueue[currentIndex];
  
  const canExecute = message.toolCallStatus === 'pending_first' || message.toolCallStatus === 'pending_next';
  const isExecuting = message.toolCallStatus === 'executing';
  const isAllCompleted = message.toolCallStatus === 'all_completed';
  const isCancelled = message.toolCallStatus === 'cancelled';

  const getStatusIcon = () => {
    switch (message.toolCallStatus) {
      case 'all_completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'executing':
        return <Clock className="h-4 w-4 text-yellow-500 animate-spin" />;
      default:
        return null;
    }
  };

  const getToolStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'executing':
        return <Clock className="h-4 w-4 text-yellow-500 animate-spin" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const handleRunTool = () => {
    if (canExecute && currentTool) {
      setShowConfirmDialog(true);
    }
  };

  const handleConfirmRun = () => {
    onToolAction(message.id, 'run');
  };

  const handleCancelTool = () => {
    onToolAction(message.id, 'cancel');
  };

  return (
    <>
      <div 
        className="flex gap-3 animate-fade-in group"
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarFallback className="bg-purple-100 text-purple-600">
            <Wrench className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-3 max-w-none">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">MCP工具调用队列</span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(message.timestamp, { addSuffix: true })}
              </span>
              {getStatusIcon()}
              {toolQueue.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  {currentIndex + 1} / {toolQueue.length}
                </Badge>
              )}
              {isCancelled && (
                <Badge variant="destructive" className="text-xs">
                  已取消
                </Badge>
              )}
              {isAllCompleted && (
                <Badge variant="default" className="text-xs bg-green-100 text-green-700">
                  全部完成
                </Badge>
              )}
            </div>
            
            {onDelete && (
              <div className={`transition-opacity ${showActions ? 'opacity-100' : 'opacity-0'}`}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <MoreVertical className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={onDelete}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      删除消息
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-950/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    {message.content}
                  </p>
                  
                  {/* 当前工具提示 */}
                  {canExecute && currentTool && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-purple-300 mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Wrench className="h-4 w-4 text-purple-500" />
                        <span className="font-medium text-sm text-purple-700 dark:text-purple-300">
                          下一个工具: {currentTool.toolName}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        {currentTool.description}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        <Server className="h-3 w-3 mr-1" />
                        {currentTool.serverName}
                      </Badge>
                    </div>
                  )}
                </div>
                
                {canExecute && (
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancelTool}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <X className="h-4 w-4 mr-1" />
                      取消
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleRunTool}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <Play className="h-4 w-4 mr-1" />
                      执行工具
                    </Button>
                  </div>
                )}
              </div>

              {/* 工具队列详情 */}
              {toolQueue.length > 0 && (
                <div className="space-y-2">
                  <Collapsible>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-full justify-between">
                        <span className="text-sm">查看所有工具 ({toolQueue.length})</span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-2 mt-2">
                      {toolQueue.map((tool, index) => (
                        <Card 
                          key={index} 
                          className={`border transition-all ${
                            index === currentIndex 
                              ? 'border-purple-400 bg-purple-100 dark:bg-purple-900/30' 
                              : 'border-purple-200 dark:border-purple-800'
                          }`}
                        >
                          <Collapsible 
                            open={expandedTools.has(`${message.id}-${index}`)} 
                            onOpenChange={() => toggleExpanded(`${message.id}-${index}`)}
                          >
                            <CollapsibleTrigger asChild>
                              <CardHeader className="cursor-pointer p-3 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-colors">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2">
                                      {getToolStatusIcon(tool.status)}
                                      <span className="font-medium text-sm">
                                        {index + 1}. {tool.toolName}
                                      </span>
                                      {index === currentIndex && (
                                        <Badge variant="default" className="text-xs bg-purple-100 text-purple-700">
                                          当前
                                        </Badge>
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
                                  <h4 className="text-xs font-medium text-muted-foreground mb-2">工具描述</h4>
                                  <p className="text-xs text-gray-600 dark:text-gray-400">{tool.description}</p>
                                </div>
                                
                                <div>
                                  <h4 className="text-xs font-medium text-muted-foreground mb-2">请求参数</h4>
                                  <div className="bg-white dark:bg-gray-800 rounded border p-2">
                                    <pre className="text-xs overflow-x-auto">
                                      {JSON.stringify(tool.request, null, 2)}
                                    </pre>
                                  </div>
                                </div>

                                {tool.status === 'completed' && (
                                  <div>
                                    <h4 className="text-xs font-medium text-muted-foreground mb-2">执行结果</h4>
                                    <div className="bg-green-50 dark:bg-green-950/20 rounded border border-green-200 p-2">
                                      <div className="flex items-center gap-2 mb-1">
                                        <CheckCircle className="h-3 w-3 text-green-500" />
                                        <span className="text-xs font-medium text-green-700 dark:text-green-300">
                                          执行成功
                                        </span>
                                      </div>
                                      <pre className="text-xs text-green-600 dark:text-green-400">
                                        工具 {tool.toolName} 已成功执行并返回结果
                                      </pre>
                                    </div>
                                  </div>
                                )}
                              </CardContent>
                            </CollapsibleContent>
                          </Collapsible>
                        </Card>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 工具确认对话框 */}
      {currentTool && (
        <ToolQueueConfirmDialog
          open={showConfirmDialog}
          onOpenChange={setShowConfirmDialog}
          onConfirm={handleConfirmRun}
          onCancel={handleCancelTool}
          currentTool={currentTool}
          toolQueue={toolQueue}
          currentIndex={currentIndex}
          userMessage="用户的原始消息" // 这里可以从上下文获取
        />
      )}
    </>
  );
};
