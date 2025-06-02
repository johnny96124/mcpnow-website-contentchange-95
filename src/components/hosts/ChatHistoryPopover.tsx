
import React, { useState } from 'react';
import { X, MessageSquare, Clock, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChatSession } from '@/components/chat/types/chat';
import { formatDistanceToNow } from 'date-fns';

interface ChatHistoryPopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessions: ChatSession[];
  onSelectSession: (sessionId: string) => void;
  children: React.ReactNode;
}

export const ChatHistoryPopover: React.FC<ChatHistoryPopoverProps> = ({
  open,
  onOpenChange,
  sessions,
  onSelectSession,
  children
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSessions = sessions.filter(session =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectSession = (sessionId: string) => {
    onSelectSession(sessionId);
    onOpenChange(false);
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent 
        side="top" 
        align="end"
        className="w-96 p-0 shadow-lg border animate-slide-in-from-bottom"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            <span className="font-semibold">对话历史</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索对话..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Sessions List */}
        <ScrollArea className="h-80">
          {filteredSessions.length === 0 ? (
            <div className="text-center py-8 px-4">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-sm">
                {searchQuery ? '未找到匹配的对话' : '暂无对话历史'}
              </p>
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {filteredSessions.map((session) => (
                <div
                  key={session.id}
                  className="p-3 rounded-lg cursor-pointer hover:bg-accent transition-colors border border-transparent hover:border-border"
                  onClick={() => handleSelectSession(session.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-sm line-clamp-1 flex-1">
                      {session.title}
                    </h3>
                    <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                      {formatDistanceToNow(session.updatedAt, { addSuffix: true })}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <Clock className="h-3 w-3" />
                    <span>{session.messages.length} 条消息</span>
                  </div>
                  
                  {session.messages.length > 0 && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {session.messages[session.messages.length - 1]?.content.substring(0, 80)}...
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
