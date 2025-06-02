
import React, { useState } from 'react';
import { Play, X, ChevronDown, ChevronRight, Wrench, CheckCircle, XCircle, Clock, MoreVertical, Trash2 } from 'lucide-react';
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
import { Message } from '../types/chat';
import { formatDistanceToNow } from 'date-fns';

interface ToolCallMessageProps {
  message: Message;
  onToolAction: (action: 'run' | 'cancel') => void;
  onDelete?: () => void;
}

export const ToolCallMessage: React.FC<ToolCallMessageProps> = ({ 
  message, 
  onToolAction,
  onDelete 
}) => {
  const [expandedTools, setExpandedTools] = useState<Set<string>>(new Set());
  const [showActions, setShowActions] = useState(false);

  const toggleExpanded = (toolId: string) => {
    const newExpanded = new Set(expandedTools);
    if (newExpanded.has(toolId)) {
      newExpanded.delete(toolId);
    } else {
      newExpanded.add(toolId);
    }
    setExpandedTools(newExpanded);
  };

  const pendingCalls = message.pendingToolCalls || [];
  const canExecute = message.toolCallStatus === 'pending';
  const isRejected = message.toolCallStatus === 'rejected';
  const isCompleted = message.toolCallStatus === 'completed';

  const getStatusIcon = () => {
    switch (message.toolCallStatus) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'executing':
        return <Clock className="h-4 w-4 text-yellow-500 animate-spin" />;
      default:
        return null;
    }
  };

  return (
    <div 
      className="flex gap-2 sm:gap-3 animate-fade-in group"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <Avatar className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0 mt-1">
        <AvatarFallback className="bg-purple-100 text-purple-600">
          <Wrench className="h-3 w-3 sm:h-4 sm:w-4" />
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 space-y-2 sm:space-y-3 max-w-none min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="font-medium text-xs sm:text-sm truncate">MCP工具调用</span>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              {formatDistanceToNow(message.timestamp, { addSuffix: true })}
            </span>
            {getStatusIcon()}
            {isRejected && (
              <Badge variant="destructive" className="text-xs px-1 py-0">
                已取消
              </Badge>
            )}
            {isCompleted && (
              <Badge variant="default" className="text-xs px-1 py-0 bg-green-100 text-green-700">
                完成
              </Badge>
            )}
          </div>
          
          {onDelete && (
            <div className={`transition-opacity ${showActions ? 'opacity-100' : 'opacity-0'}`}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-5 w-5 sm:h-6 sm:w-6">
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
        
        <div className="bg-purple-50 dark:bg-purple-950/20 rounded-lg p-3 sm:p-4 border border-purple-200 dark:border-purple-800">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  {message.content}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  这将帮助你了解该节点的详细信息，以便您进行前端界面的开发。
                </p>
              </div>
              
              {canExecute && (
                <div className="flex gap-2 sm:ml-4 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onToolAction('cancel')}
                    className="text-gray-600 hover:text-gray-800 text-xs px-2 py-1 h-7"
                  >
                    <X className="h-3 w-3 mr-1" />
                    取消
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onToolAction('run')}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 h-7"
                  >
                    <Play className="h-3 w-3 mr-1" />
                    执行
                  </Button>
                </div>
              )}
            </div>

            {/* Tool Details */}
            <div className="space-y-2">
              {pendingCalls.map((toolCall, index) => (
                <Card key={index} className="border-purple-200 dark:border-purple-800">
                  <Collapsible 
                    open={expandedTools.has(`${message.id}-${index}`)} 
                    onOpenChange={() => toggleExpanded(`${message.id}-${index}`)}
                  >
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer p-2 sm:p-3 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-colors">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <Wrench className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500 flex-shrink-0" />
                            <span className="font-medium text-xs sm:text-sm truncate">{toolCall.toolName}</span>

                            {isCompleted && (
                              <Badge variant="default" className="text-xs px-1 py-0 bg-green-100 text-green-700 flex-shrink-0">
                                <CheckCircle className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                                完成
                              </Badge>
                            )}
                          </div>
                          
                          <Button variant="ghost" size="sm" className="h-auto p-1 flex-shrink-0">
                            {expandedTools.has(`${message.id}-${index}`) ? (
                              <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
                            ) : (
                              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                            )}
                          </Button>
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent>
                      <CardContent className="p-2 sm:p-3 pt-0 space-y-3">
                        <div>
                          <h4 className="text-xs font-medium text-muted-foreground mb-2">请求参数</h4>
                          <div className="bg-white dark:bg-gray-800 rounded border p-2">
                            <pre className="text-xs overflow-x-auto">
                              {JSON.stringify(toolCall.request, null, 2)}
                            </pre>
                          </div>
                        </div>

                        {/* 显示工具调用完成后的响应结果 */}
                        {isCompleted && (
                          <div>
                            <h4 className="text-xs font-medium text-muted-foreground mb-2">响应结果</h4>
                            <div className="bg-white dark:bg-gray-800 rounded border p-2">
                              <pre className="text-xs overflow-x-auto">
                                {JSON.stringify({
                                  status: "success",
                                  data: {
                                    figma_data: {
                                      node_id: toolCall.request.nodeId || "630-5984",
                                      name: "设计组件",
                                      type: "FRAME",
                                      properties: {
                                        width: 375,
                                        height: 812,
                                        backgroundColor: "#FFFFFF"
                                      }
                                    },
                                    message: "成功获取 Figma 节点数据"
                                  },
                                  timestamp: new Date().toISOString()
                                }, null, 2)}
                              </pre>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              ))}
            </div>

            {isRejected && (
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <XCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium">已取消 MCP 工具</span>
                <span className="text-xs sm:text-sm truncate">get_figma_data</span>
              </div>
            )}

            {isCompleted && (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium">工具调用已完成</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
