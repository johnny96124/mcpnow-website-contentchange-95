
import React from 'react';
import { User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Message } from '../types/chat';
import { formatDistanceToNow } from 'date-fns';

interface UserMessageProps {
  message: Message;
}

export const UserMessage: React.FC<UserMessageProps> = ({ message }) => {
  return (
    <div className="flex gap-3">
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarFallback className="bg-blue-100 text-blue-600">
          <User className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">You</span>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(message.timestamp, { addSuffix: true })}
          </span>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3 prose prose-sm max-w-none">
          <p className="whitespace-pre-wrap m-0">{message.content}</p>
        </div>
      </div>
    </div>
  );
};
