
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
            <span className="font-medium text-sm">MCP工具调用</span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(message.timestamp, { addSuffix: true })}
            </span>
            {getStatusIcon()}
            {isRejected && (
              <Badge variant="destructive" className="text-xs">
                已取消
              </Badge>
            )}
            {isCompleted && (
              <Badge variant="default" className="text-xs bg-green-100 text-green-700">
                调用完成
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
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  {message.content}
                </p>
                <p className="text-sm text-muted-foreground">
                  这将帮助你了解该节点的详细信息，以便您进行前端界面的开发。
                </p>
              </div>
              
              {canExecute && (
                <div className="flex gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onToolAction(message.id, 'cancel')}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onToolAction(message.id, 'run')}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Run tool
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
                      <CardHeader className="cursor-pointer p-3 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <Wrench className="h-4 w-4 text-purple-500" />
                              <span className="font-medium text-sm">{toolCall.toolName}</span>
                            </div>
                            
                            <Badge variant="outline" className="text-xs flex items-center gap-1">
                              <Server className="h-3 w-3" />
                              {toolCall.serverName}
                            </Badge>

                            {isCompleted && (
                              <Badge variant="default" className="text-xs bg-green-100 text-green-700">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                完成
                              </Badge>
                            )}
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
                <XCircle className="h-4 w-4" />
                <span className="text-sm font-medium">已取消 MCP 工具</span>
                <span className="text-sm">get_figma_data</span>
              </div>
            )}

            {isCompleted && (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">工具调用已完成</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
