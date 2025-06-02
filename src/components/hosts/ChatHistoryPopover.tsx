
import React, { useState } from 'react';
import { X, MessageSquare, Clock, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { ChatSession } from '@/components/chat/types/chat';
import { formatDistanceToNow } from 'date-fns';

interface ChatHistoryPopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessions: ChatSession[];
  onSelectSession: (sessionId: string) => void;
}

export const ChatHistoryPopover: React.FC<ChatHistoryPopoverProps> = ({
  open,
  onOpenChange,
  sessions,
  onSelectSession,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSessions = sessions.filter(session =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectSession = (sessionId: string) => {
    onSelectSession(sessionId);
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop - only covers the chat area */}
      <div 
        className="absolute inset-0 bg-black/20 z-40"
        onClick={() => onOpenChange(false)}
      />
      
      {/* Sliding Panel from bottom of chat area - responsive */}
      <div className="absolute bottom-0 left-0 right-0 z-50 animate-slide-up-from-bottom">
        <Card className="mx-1 sm:mx-2 mb-1 sm:mb-2 max-h-[70vh] sm:max-h-[60vh] rounded-t-xl shadow-xl border-0 bg-white">
          <div className="flex flex-col h-full max-h-[70vh] sm:max-h-[60vh]">
            {/* Header */}
            <div className="flex items-center justify-between p-3 sm:p-4 border-b">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
                <h3 className="font-semibold text-sm sm:text-base">对话历史</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="h-6 w-6 sm:h-8 sm:w-8"
              >
                <X className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
            
            {/* Search */}
            <div className="p-3 sm:p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索对话..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 sm:pl-10 h-8 sm:h-10 text-sm"
                />
              </div>
            </div>

            {/* Content */}
            <ScrollArea className="flex-1">
              {filteredSessions.length === 0 ? (
                <div className="text-center py-6 sm:py-8">
                  <MessageSquare className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    {searchQuery ? '未找到匹配的对话' : '暂无对话历史'}
                  </p>
                </div>
              ) : (
                <div className="space-y-1 sm:space-y-2 p-3 sm:p-4">
                  {filteredSessions.map((session) => (
                    <div
                      key={session.id}
                      className="p-2 sm:p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => handleSelectSession(session.id)}
                    >
                      <div className="flex items-start justify-between mb-1 sm:mb-2 gap-2">
                        <h4 className="font-medium text-xs sm:text-sm line-clamp-1 min-w-0 flex-1">
                          {session.title}
                        </h4>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {formatDistanceToNow(session.updatedAt, { addSuffix: true })}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1 sm:mb-2">
                        <Clock className="h-2 w-2 sm:h-3 sm:w-3" />
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
          </div>
        </Card>
      </div>
    </>
  );
};
