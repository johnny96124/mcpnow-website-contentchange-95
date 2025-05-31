
import React, { useState, useEffect } from 'react';
import { Bot, Loader2, MoreVertical, Trash2, Play, X, ChevronDown, ChevronRight, Wrench, CheckCircle, XCircle, Clock, Server } from 'lucide-react';
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

interface StreamingAIMessageProps {
  message: Message;
  isStreaming?: boolean;
  onDelete?: () => void;
  onToolAction?: (messageId: string, action: 'run' | 'cancel') => void;
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

  const handleToolAction = (action: 'run' | 'cancel') => {
    if (onToolAction) {
      onToolAction(message.id, action);
    }
  };

  const pendingCalls = message.pendingToolCalls || [];
  const canExecute = message.toolCallStatus === 'pending';
  const isRejected = message.toolCallStatus === 'rejected';
  const isCompleted = message.toolCallStatus === 'completed';
  const isExecuting = message.toolCallStatus === 'executing';
  const isCancelled = message.toolCallStatus === 'cancelled';

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
        {pendingCalls.length > 0 && (
          <div className="bg-purple-50 dark:bg-purple-950/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Wrench className="h-4 w-4 text-purple-500" />
                    <span className="font-medium text-sm">MCP工具调用</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    这将帮助您了解相关信息，以便更好地回答您的问题。
                  </p>
                </div>
                
                {canExecute && (
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToolAction('cancel')}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleToolAction('run')}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Run tool
                    </Button>
                  </div>
                )}
              </div>

              {/* 简化的工具详情 - 只显示一个汇总的工具调用 */}
              <div className="space-y-2">
                <Card className="border-purple-200 dark:border-purple-800">
                  <Collapsible 
                    open={expandedTools.has(`${message.id}-summary`)} 
                    onOpenChange={() => toggleExpanded(`${message.id}-summary`)}
                  >
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer p-3 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <Wrench className="h-4 w-4 text-purple-500" />
                              <span className="font-medium text-sm">
                                {pendingCalls[0]?.toolName || 'analyze_request'}
                              </span>
                            </div>
                            
                            <Badge variant="outline" className="text-xs flex items-center gap-1">
                              <Server className="h-3 w-3" />
                              服务器 {pendingCalls[0]?.serverId || 'postgres-dev'}
                            </Badge>

                            {/* 状态标签 */}
                            {isExecuting && (
                              <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-700">
                                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                执行中
                              </Badge>
                            )}
                            
                            {isCompleted && (
                              <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-700">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                完成
                              </Badge>
                            )}
                            
                            {isCancelled && (
                              <Badge variant="outline" className="text-xs bg-red-100 text-red-700 border-red-200">
                                <X className="h-3 w-3 mr-1" />
                                已取消
                              </Badge>
                            )}
                          </div>
                          
                          <Button variant="ghost" size="sm" className="h-auto p-1">
                            {expandedTools.has(`${message.id}-summary`) ? (
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
                              {JSON.stringify(pendingCalls[0]?.request || { message: "分析用户请求" }, null, 2)}
                            </pre>
                          </div>
                        </div>

                        {isCompleted && (
                          <div>
                            <h4 className="text-xs font-medium text-muted-foreground mb-2">响应结果</h4>
                            <div className="bg-white dark:bg-gray-800 rounded border p-2">
                              <pre className="text-xs overflow-x-auto">
                                {JSON.stringify({
                                  status: "success",
                                  data: {
                                    analysis: "请求分析完成",
                                    action: "ready_to_respond",
                                    confidence: 0.95
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
