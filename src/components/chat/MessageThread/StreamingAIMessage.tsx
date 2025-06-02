
import React, { useState, useEffect } from 'react';
import { Bot, Loader2, MoreVertical, Trash2, Play, X, ChevronDown, ChevronRight, Wrench, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { MessageActions } from './MessageActions';
import { MessageRating } from './MessageRating';
import { formatDistanceToNow } from 'date-fns';

interface StreamingAIMessageProps {
  message: Message;
  isStreaming?: boolean;
  onDelete?: () => void;
  onRegenerate?: () => void;
  onToolAction?: (messageId: string, action: 'run' | 'cancel', toolId?: string) => void;
  onRating?: (messageId: string, rating: 'positive' | 'negative' | null) => void;
}

export const StreamingAIMessage: React.FC<StreamingAIMessageProps> = ({ 
  message, 
  isStreaming = false,
  onDelete,
  onRegenerate,
  onToolAction,
  onRating
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

  const handleToolAction = (action: 'run' | 'cancel', toolId?: string) => {
    if (onToolAction) {
      onToolAction(message.id, action, toolId);
    }
  };

  const pendingCalls = message.pendingToolCalls || [];
  const visibleTools = pendingCalls.filter(tool => tool.visible);
  const hasToolCalls = pendingCalls.length > 0;
  const isFailed = message.toolCallStatus === 'failed';

  return (
    <div 
      className="flex gap-2 sm:gap-3 animate-fade-in group"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <Avatar className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0 mt-1">
        <AvatarImage src="/lovable-uploads/4128f88c-639d-47a2-baf6-4288709b348a.png" alt="MCP Now Logo" />
        <AvatarFallback className="bg-blue-100 text-blue-600">
          <Bot className="h-3 w-3 sm:h-4 sm:w-4" />
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 space-y-2 sm:space-y-3 max-w-none min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="font-medium text-xs sm:text-sm">AI助手</span>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              {formatDistanceToNow(message.timestamp, { addSuffix: true })}
            </span>
            {isStreaming && (
              <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
            )}
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* 新增的消息操作按钮 */}
            <MessageActions
              content={message.content}
              messageId={message.id}
              onRegenerate={onRegenerate}
              isUserMessage={false}
            />
            
            {/* 新增的评分组件 */}
            <MessageRating
              messageId={message.id}
              onRating={onRating}
            />
            
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
        </div>
        
        {/* AI 回复内容 */}
        {displayedContent && (
          <div className="bg-gray-50 dark:bg-gray-900/20 rounded-lg p-3 sm:p-4 prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap m-0 text-sm">
              {displayedContent}
              {isStreaming && displayedContent.length < message.content.length && (
                <span className="inline-block w-2 h-4 bg-gray-400 animate-pulse ml-1" />
              )}
            </div>
          </div>
        )}

        {/* 顺序显示的工具调用区域 */}
        {hasToolCalls && (
          <div className={`rounded-lg p-3 sm:p-4 border ${
            isFailed 
              ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'
              : 'bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800'
          }`}>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {isFailed ? (
                      <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 flex-shrink-0" />
                    ) : (
                      <Wrench className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500 flex-shrink-0" />
                    )}
                    <span className="font-medium text-xs sm:text-sm">
                      {isFailed ? 'MCP工具调用失败' : 'MCP工具调用'}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {isFailed 
                      ? '工具执行过程中遇到了问题，请查看详细错误信息。'
                      : '这将帮助您了解相关信息，以便更好地回答您的问题。'
                    }
                  </p>
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3">
                {visibleTools
                  .sort((a, b) => a.order - b.order)
                  .map((tool) => (
                  <Card key={tool.id} className={`border-purple-200 dark:border-purple-800 ${
                    tool.status === 'failed' ? 'border-red-200 dark:border-red-800' : ''
                  }`}>
                    <Collapsible 
                      open={expandedTools.has(tool.id)} 
                      onOpenChange={() => toggleExpanded(tool.id)}
                    >
                      <CollapsibleTrigger asChild>
                        <CardHeader className="cursor-pointer p-2 sm:p-3 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-colors">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <Wrench className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500 flex-shrink-0" />
                              <span className="font-medium text-xs sm:text-sm truncate">{tool.toolName}</span>

                              {tool.status === 'executing' && (
                                <Badge variant="outline" className="text-xs px-1 py-0 bg-yellow-100 text-yellow-700 flex-shrink-0">
                                  <Loader2 className="h-2 w-2 sm:h-3 sm:w-3 mr-1 animate-spin" />
                                  执行中
                                </Badge>
                              )}
                              
                              {tool.status === 'completed' && (
                                <Badge variant="outline" className="text-xs px-1 py-0 bg-green-100 text-green-700 border-green-200 flex-shrink-0">
                                  <CheckCircle className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                                  完成
                                </Badge>
                              )}
                              
                              {tool.status === 'cancelled' && (
                                <Badge variant="outline" className="text-xs px-1 py-0 bg-red-100 text-red-700 border-red-200 flex-shrink-0">
                                  <X className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                                  已取消
                                </Badge>
                              )}

                              {tool.status === 'failed' && (
                                <Badge variant="outline" className="text-xs px-1 py-0 bg-red-100 text-red-700 border-red-200 flex-shrink-0">
                                  <AlertTriangle className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                                  失败
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                              {tool.status === 'pending' && (
                                <div className="flex gap-1 sm:gap-2">
                                  <Button
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleToolAction('cancel', tool.id);
                                    }}
                                    variant="outline"
                                    className="text-gray-600 hover:text-gray-800 h-6 w-6 p-0"
                                  >
                                    <X className="h-2 w-2 sm:h-3 sm:w-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleToolAction('run', tool.id);
                                    }}
                                    className="bg-blue-600 hover:bg-blue-700 text-white h-6 w-6 p-0"
                                  >
                                    <Play className="h-2 w-2 sm:h-3 sm:w-3" />
                                  </Button>
                                </div>
                              )}

                              {tool.status === 'failed' && (
                                <Button
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToolAction('run', tool.id);
                                  }}
                                  className="bg-blue-600 hover:bg-blue-700 text-white h-6 w-6 p-0"
                                >
                                  <Play className="h-2 w-2 sm:h-3 sm:w-3" />
                                </Button>
                              )}

                              <Button variant="ghost" size="sm" className="h-auto p-1">
                                {expandedTools.has(tool.id) ? (
                                  <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
                                ) : (
                                  <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent>
                        <CardContent className="p-2 sm:p-3 pt-0 space-y-3">
                          <div>
                            <h4 className="text-xs font-medium text-muted-foreground mb-2">请求参数</h4>
                            <div className="bg-white dark:bg-gray-800 rounded border p-2">
                              <pre className="text-xs overflow-x-auto">
                                {JSON.stringify(tool.request, null, 2)}
                              </pre>
                            </div>
                          </div>

                          {tool.status === 'failed' && message.errorMessage && (
                            <div>
                              <h4 className="text-xs font-medium text-red-600 mb-2">错误信息</h4>
                              <div className="bg-red-50 dark:bg-red-950/50 rounded border border-red-200 p-2">
                                <div className="text-xs text-red-700 dark:text-red-300">
                                  {message.errorMessage}
                                </div>
                              </div>
                            </div>
                          )}

                          {tool.status === 'completed' && (
                            <div>
                              <h4 className="text-xs font-medium text-muted-foreground mb-2">响应结果</h4>
                              <div className="bg-white dark:bg-gray-800 rounded border p-2">
                                <pre className="text-xs overflow-x-auto">
                                  {JSON.stringify({
                                    status: "success",
                                    data: {
                                      analysis: `${tool.toolName} 执行完成`,
                                      result: "操作成功",
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
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
