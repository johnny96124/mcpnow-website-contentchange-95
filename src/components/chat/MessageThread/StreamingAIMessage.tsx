
import React, { useState, useEffect } from 'react';
import { Bot, Loader2, MoreVertical, Trash2, Play, X, ChevronDown, ChevronRight, Wrench, CheckCircle, XCircle, Clock, Server, AlertTriangle } from 'lucide-react';
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
import { Message, PendingToolCall } from '../types/chat';
import { formatDistanceToNow } from 'date-fns';

interface StreamingAIMessageProps {
  message: Message;
  isStreaming?: boolean;
  onDelete?: () => void;
  onToolAction?: (messageId: string, toolId: string, action: 'run' | 'cancel') => void;
}

export const StreamingAIMessage: React.FC<StreamingAIMessageProps> = ({ 
  message, 
  isStreaming = false,
  onDelete,
  onToolAction
}) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [showActions, setShowActions] = useState(false);
  const [expandedTools, setExpandedTools] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isStreaming) {
      streamText();
    } else {
      setDisplayedContent(message.content);
    }
  }, [message, isStreaming]);

  const streamText = () => {
    let index = 0;
    const streamTimer = setInterval(() => {
      if (index < message.content.length) {
        setDisplayedContent(message.content.slice(0, index + 1));
        index++;
      } else {
        clearInterval(streamTimer);
      }
    }, 30);
  };

  const toggleExpanded = (toolId: string) => {
    const newExpanded = new Set(expandedTools);
    if (newExpanded.has(toolId)) {
      newExpanded.delete(toolId);
    } else {
      newExpanded.add(toolId);
    }
    setExpandedTools(newExpanded);
  };

  const handleToolAction = (toolId: string, action: 'run' | 'cancel') => {
    if (onToolAction) {
      onToolAction(message.id, toolId, action);
    }
  };

  const pendingCalls = message.pendingToolCalls || [];
  const hasToolCalls = pendingCalls.length > 0;

  const getToolStatusIcon = (tool: PendingToolCall) => {
    switch (tool.status) {
      case 'executing':
        return <Loader2 className="h-4 w-4 text-yellow-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  const getToolStatusBadge = (tool: PendingToolCall) => {
    switch (tool.status) {
      case 'executing':
        return (
          <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-700 border-yellow-200">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            执行中
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            完成
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="outline" className="text-xs bg-red-100 text-red-700 border-red-200">
            <AlertTriangle className="h-3 w-3 mr-1" />
            失败
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="outline" className="text-xs bg-gray-100 text-gray-700 border-gray-200">
            <XCircle className="h-3 w-3 mr-1" />
            已取消
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700 border-blue-200">
            <Clock className="h-3 w-3 mr-1" />
            待确认
          </Badge>
        );
    }
  };

  return (
    <div 
      className="flex gap-3 animate-fade-in group"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarFallback className="bg-green-100 text-green-600">
          <Bot className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 space-y-3 max-w-none">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">AI助手</span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(message.timestamp, { addSuffix: true })}
            </span>
            {isStreaming && (
              <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
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
        
        {/* 工具调用区域 - 只在有工具调用时显示 */}
        {hasToolCalls && (
          <div className="rounded-lg p-4 border bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Wrench className="h-4 w-4 text-purple-500" />
                    <span className="font-medium text-sm">MCP工具调用</span>
                    <Badge variant="outline" className="text-xs">
                      {pendingCalls.length} 个工具
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    这将帮助您了解相关信息，以便更好地回答您的问题。
                  </p>
                </div>
              </div>

              {/* 工具列表 */}
              <div className="space-y-2">
                {pendingCalls.map((tool) => (
                  <Card key={tool.id} className="border-purple-200 dark:border-purple-800">
                    <Collapsible 
                      open={expandedTools.has(tool.id)} 
                      onOpenChange={() => toggleExpanded(tool.id)}
                    >
                      <CollapsibleTrigger asChild>
                        <CardHeader className="cursor-pointer p-3 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                {getToolStatusIcon(tool)}
                                <span className="font-medium text-sm">{tool.toolName}</span>
                              </div>
                              
                              <Badge variant="outline" className="text-xs flex items-center gap-1">
                                <Server className="h-3 w-3" />
                                {tool.serverName}
                              </Badge>

                              {getToolStatusBadge(tool)}
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {/* 工具操作按钮 */}
                              {tool.status === 'pending' && (
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleToolAction(tool.id, 'cancel');
                                    }}
                                    className="text-gray-600 hover:text-gray-800 h-7 px-2"
                                  >
                                    <X className="h-3 w-3 mr-1" />
                                    取消
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleToolAction(tool.id, 'run');
                                    }}
                                    className="bg-blue-600 hover:bg-blue-700 text-white h-7 px-2"
                                  >
                                    <Play className="h-3 w-3 mr-1" />
                                    执行
                                  </Button>
                                </div>
                              )}

                              {tool.status === 'failed' && (
                                <Button
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToolAction(tool.id, 'run');
                                  }}
                                  className="bg-blue-600 hover:bg-blue-700 text-white h-7 px-2"
                                >
                                  <Play className="h-3 w-3 mr-1" />
                                  重试
                                </Button>
                              )}

                              <Button variant="ghost" size="sm" className="h-auto p-1">
                                {expandedTools.has(tool.id) ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
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

                          {tool.status === 'failed' && tool.errorMessage && (
                            <div>
                              <h4 className="text-xs font-medium text-red-600 mb-2">错误信息</h4>
                              <div className="bg-red-50 dark:bg-red-950/50 rounded border border-red-200 p-2">
                                <div className="text-xs text-red-700 dark:text-red-300">
                                  {tool.errorMessage}
                                </div>
                              </div>
                            </div>
                          )}

                          {tool.status === 'completed' && tool.response && (
                            <div>
                              <h4 className="text-xs font-medium text-muted-foreground mb-2">响应结果</h4>
                              <div className="bg-white dark:bg-gray-800 rounded border p-2">
                                <pre className="text-xs overflow-x-auto">
                                  {JSON.stringify(tool.response, null, 2)}
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
            </div>
          </div>
        )}
        
        {/* AI 回复内容 */}
        {displayedContent && (
          <div className="bg-gray-50 dark:bg-gray-900/20 rounded-lg p-4 prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap m-0">
              {displayedContent}
              {isStreaming && displayedContent.length < message.content.length && (
                <span className="inline-block w-2 h-4 bg-gray-400 animate-pulse ml-1" />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
