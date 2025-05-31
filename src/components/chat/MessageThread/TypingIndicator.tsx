
import React from 'react';
import { Bot } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex gap-3">
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarImage src="/lovable-uploads/28a44396-b42e-441d-99e7-1e2a713be56a.png" alt="MCP Now Logo" />
        <AvatarFallback className="bg-green-100 text-green-600">
          <Bot className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-sm">AI Assistant</span>
          <span className="text-xs text-muted-foreground">typing...</span>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-900/20 rounded-lg p-3 w-16">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>
  );
};
