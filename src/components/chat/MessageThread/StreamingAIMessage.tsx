
import React, { useState, useEffect } from 'react';
import { Bot, MoreVertical, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Message } from '../types/chat';
import { ToolCallMessage } from './ToolCallMessage';
import { MessageActions } from './MessageActions';
import { MessageRating } from './MessageRating';
import { ServerRecommendations } from './ServerRecommendations';
import { formatDistanceToNow } from 'date-fns';

interface StreamingAIMessageProps {
  message: Message;
  isStreaming?: boolean;
  onDelete?: () => void;
  onRegenerate?: () => void;
  onToolAction?: (messageId: string, action: 'run' | 'cancel', toolId?: string) => void;
  onRating?: (messageId: string, rating: 'positive' | 'negative' | null) => void;
  onSetupServer?: (serverId: string) => void;
}

export const StreamingAIMessage: React.FC<StreamingAIMessageProps> = ({ 
  message, 
  isStreaming = false,
  onDelete,
  onRegenerate,
  onToolAction,
  onRating,
  onSetupServer
}) => {
  const [showActions, setShowActions] = useState(false);
  const [displayContent, setDisplayContent] = useState('');
  const [showServerRecommendations, setShowServerRecommendations] = useState(false);

  // Simulate streaming effect
  useEffect(() => {
    if (isStreaming && message.content) {
      let currentIndex = 0;
      const fullContent = message.content;
      
      const interval = setInterval(() => {
        if (currentIndex <= fullContent.length) {
          setDisplayContent(fullContent.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(interval);
          // Show server recommendations after streaming is complete
          setShowServerRecommendations(true);
        }
      }, 20);

      return () => clearInterval(interval);
    } else {
      setDisplayContent(message.content);
      // Show server recommendations for completed messages
      setShowServerRecommendations(true);
    }
  }, [message.content, isStreaming]);

  const handleSetupServer = (serverId: string) => {
    if (onSetupServer) {
      onSetupServer(serverId);
    }
  };

  // Show tool call message if it exists
  if (message.role === 'tool_call') {
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
      className="flex gap-3 group animate-fade-in"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage src="/lovable-uploads/4128f88c-639d-47a2-baf6-4288709b348a.png" alt="MCP Now Logo" />
        <AvatarFallback className="bg-blue-100 text-blue-600">
          <Bot className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 space-y-3 max-w-none min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="font-medium text-sm">AI Assistant</span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(message.timestamp, { addSuffix: true })}
            </span>
            {isStreaming && (
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse animation-delay-150"></div>
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse animation-delay-300"></div>
              </div>
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
        
        {/* AI Response Content */}
        {displayContent && (
          <div className="bg-gray-50 dark:bg-gray-900/20 rounded-lg p-3 prose prose-sm max-w-none">
            <p className="whitespace-pre-wrap m-0 text-sm">
              {displayContent}
              {isStreaming && <span className="animate-pulse">|</span>}
            </p>
          </div>
        )}

        {/* Server Recommendations - Only show after content is complete */}
        {showServerRecommendations && !isStreaming && displayContent && (
          <div className="mt-4">
            <ServerRecommendations onSetupServer={handleSetupServer} />
          </div>
        )}

        {/* Error Message */}
        {message.errorMessage && (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-sm text-red-700 dark:text-red-300">{message.errorMessage}</p>
          </div>
        )}

        {/* Message Actions */}
        {!isStreaming && (
          <div className="flex items-center justify-between gap-2">
            <MessageActions
              content={message.content}
              messageId={message.id}
              onRegenerate={onRegenerate}
            />
            
            {onRating && (
              <MessageRating
                messageId={message.id}
                currentRating={message.rating}
                onRating={onRating}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
