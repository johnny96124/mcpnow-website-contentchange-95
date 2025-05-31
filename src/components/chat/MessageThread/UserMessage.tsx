
import React, { useState } from 'react';
import { User, MoreVertical, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Message } from '../types/chat';
import { MessageActions } from './MessageActions';
import { formatDistanceToNow } from 'date-fns';

interface UserMessageProps {
  message: Message;
  onDelete?: () => void;
  onEdit?: (newContent: string) => void;
}

export const UserMessage: React.FC<UserMessageProps> = ({ message, onDelete, onEdit }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <div 
      className="flex gap-3 group"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarFallback className="bg-blue-100 text-blue-600">
          <User className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">You</span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(message.timestamp, { addSuffix: true })}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {/* 新增的消息操作按钮 */}
            <MessageActions
              content={message.content}
              messageId={message.id}
              onEdit={onEdit}
              isUserMessage={true}
            />
            
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
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3 prose prose-sm max-w-none">
          <p className="whitespace-pre-wrap m-0">{message.content}</p>
        </div>
      </div>
    </div>
  );
};
