
import React, { useState, useEffect } from 'react';
import { Bot, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Message, ToolInvocation } from '../types/chat';
import { ToolInvocationFlow } from './ToolInvocationFlow';
import { formatDistanceToNow } from 'date-fns';

interface StreamingAIMessageProps {
  message: Message;
  isStreaming?: boolean;
}

export const StreamingAIMessage: React.FC<StreamingAIMessageProps> = ({ 
  message, 
  isStreaming = false 
}) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [currentToolIndex, setCurrentToolIndex] = useState(0);
  const [showingTools, setShowingTools] = useState(false);

  useEffect(() => {
    if (isStreaming) {
      // 首先显示工具调用
      if (message.toolInvocations && message.toolInvocations.length > 0) {
        setShowingTools(true);
        
        // 逐个显示工具调用过程
        const toolTimer = setInterval(() => {
          setCurrentToolIndex(prev => {
            if (prev < message.toolInvocations!.length - 1) {
              return prev + 1;
            }
            clearInterval(toolTimer);
            
            // 工具调用完成后，开始流式显示文本内容
            setTimeout(() => {
              streamText();
            }, 500);
            
            return prev;
          });
        }, 800);

        return () => clearInterval(toolTimer);
      } else {
        // 没有工具调用，直接流式显示文本
        streamText();
      }
    } else {
      // 非流式模式，直接显示所有内容
      setDisplayedContent(message.content);
      setShowingTools(true);
      setCurrentToolIndex(message.toolInvocations?.length || 0);
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
    }, 30); // 调整速度
  };

  const visibleTools = message.toolInvocations?.slice(0, currentToolIndex + 1) || [];

  return (
    <div className="flex gap-3 animate-fade-in">
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarFallback className="bg-green-100 text-green-600">
          <Bot className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 space-y-3 max-w-none">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">AI助手</span>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(message.timestamp, { addSuffix: true })}
          </span>
          {isStreaming && (
            <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
          )}
        </div>
        
        {/* 工具调用流程 */}
        {showingTools && visibleTools.length > 0 && (
          <ToolInvocationFlow invocations={visibleTools} />
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
