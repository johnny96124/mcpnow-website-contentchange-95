
import React, { useState, useEffect } from 'react';
import { Copy, MoreVertical, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ToolCallMessage } from './ToolCallMessage';
import { SequentialToolExecutionComponent } from './SequentialToolExecution';
import { Message } from '../types/chat';
import { formatDistanceToNow } from 'date-fns';

interface StreamingAIMessageProps {
  message: Message;
  isStreaming?: boolean;
  onDelete?: () => void;
  onToolAction?: (messageId: string, action: 'run' | 'cancel') => void;
  onConfirmTool?: (messageId: string, toolIndex: number) => void;
  onCancelExecution?: (messageId: string) => void;
}

export const StreamingAIMessage: React.FC<StreamingAIMessageProps> = ({ 
  message, 
  isStreaming = false,
  onDelete,
  onToolAction,
  onConfirmTool,
  onCancelExecution
}) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [showActions, setShowActions] = useState(false);

  useEffect(() => {
    if (isStreaming && message.content) {
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex < message.content.length) {
          setDisplayedContent(message.content.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, 30);

      return () => clearInterval(interval);
    } else {
      setDisplayedContent(message.content);
    }
  }, [message.content, isStreaming]);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(message.content);
  };

  // 如果有顺序工具执行，显示专门的组件
  if (message.sequentialExecution) {
    return (
      <SequentialToolExecutionComponent
        message={message}
        onConfirmTool={onConfirmTool || (() => {})}
        onCancelExecution={onCancelExecution || (() => {})}
      />
    );
  }

  // 如果有待处理的工具调用，显示工具调用组件
  if (message.pendingToolCalls && message.pendingToolCalls.length > 0) {
    return (
      <ToolCallMessage
        message={message}
        onToolAction={onToolAction || (() => {})}
        onDelete={onDelete}
      />
    );
  }

  return (
    <div 
      className="flex gap-3 animate-fade-in group"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarFallback className="bg-blue-100 text-blue-600">AI</AvatarFallback>
      </Avatar>
      
      <div className="flex-1 space-y-2 max-w-none">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">AI助手</span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(message.timestamp, { addSuffix: true })}
            </span>
          </div>
          
          <div className={`flex items-center gap-1 transition-opacity ${showActions ? 'opacity-100' : 'opacity-0'}`}>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={copyToClipboard}
            >
              <Copy className="h-3 w-3" />
            </Button>
            
            {onDelete && (
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
            )}
          </div>
        </div>
        
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <div className="whitespace-pre-wrap break-words">
            {displayedContent}
            {isStreaming && <span className="animate-pulse">|</span>}
          </div>
        </div>
      </div>
    </div>
  );
};
