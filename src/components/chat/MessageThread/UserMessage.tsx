
import React, { useState } from 'react';
import { User, MoreVertical, Trash2, Edit, Check, X } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
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
  onEditAndRegenerate?: (newContent: string) => void;
}

export const UserMessage: React.FC<UserMessageProps> = ({ 
  message, 
  onDelete, 
  onEdit, 
  onEditAndRegenerate 
}) => {
  const [showActions, setShowActions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);

  const handleStartEdit = () => {
    setEditContent(message.content);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (editContent.trim() !== message.content && editContent.trim()) {
      // 如果内容有变化，触发编辑并重新生成
      if (onEditAndRegenerate) {
        onEditAndRegenerate(editContent.trim());
      } else if (onEdit) {
        onEdit(editContent.trim());
      }
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(message.content);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex gap-3 group">
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarFallback className="bg-blue-100 text-blue-600">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">You</span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(message.timestamp, { addSuffix: true })}
            </span>
          </div>
          
          {/* 编辑模式的输入框 */}
          <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3 border-2 border-blue-200 dark:border-blue-800">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="min-h-[80px] resize-none border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              autoFocus
            />
          </div>
          
          {/* 确认和取消按钮 */}
          <div className="flex items-center justify-end gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleCancelEdit}
              className="h-8"
            >
              <X className="h-3 w-3 mr-1" />
              Cancel
            </Button>
            <Button 
              size="sm" 
              onClick={handleSaveEdit}
              className="h-8"
            >
              <Check className="h-3 w-3 mr-1" />
              Save
            </Button>
          </div>
          
          {/* 提示信息 */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-blue-50/50 dark:bg-blue-950/10 rounded p-2 border border-blue-200/50 dark:border-blue-800/50">
            <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-[10px] font-bold">i</span>
            </div>
            Editing this message will create a new conversation branch. You can switch between branches using the arrow navigation buttons.
          </div>
        </div>
      </div>
    );
  }

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
            {/* 复制和编辑按钮 */}
            <MessageActions
              content={message.content}
              messageId={message.id}
              onEdit={handleStartEdit}
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
