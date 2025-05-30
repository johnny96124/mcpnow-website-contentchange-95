
import React from 'react';
import { Bot } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Message } from '../types/chat';
import { ToolInvocation } from './ToolInvocation';
import { formatDistanceToNow } from 'date-fns';

interface AIMessageProps {
  message: Message;
}

export const AIMessage: React.FC<AIMessageProps> = ({ message }) => {
  return (
    <div className="flex gap-3">
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarFallback className="bg-green-100 text-green-600">
          <Bot className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">AI Assistant</span>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(message.timestamp, { addSuffix: true })}
          </span>
        </div>
        
        {/* Tool Invocations */}
        {message.toolInvocations && message.toolInvocations.length > 0 && (
          <div className="space-y-2">
            {message.toolInvocations.map((invocation) => (
              <ToolInvocation key={invocation.id} invocation={invocation} />
            ))}
          </div>
        )}
        
        {/* AI Response */}
        <div className="bg-gray-50 dark:bg-gray-900/20 rounded-lg p-3 prose prose-sm max-w-none">
          <p className="whitespace-pre-wrap m-0">{message.content}</p>
        </div>
      </div>
    </div>
  );
};
