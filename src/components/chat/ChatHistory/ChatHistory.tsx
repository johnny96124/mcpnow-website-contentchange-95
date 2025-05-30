
import React from 'react';
import { MessageSquare, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatSession } from '../types/chat';
import { formatDistanceToNow } from 'date-fns';

interface ChatHistoryProps {
  sessions: ChatSession[];
  currentSessionId?: string;
  onSelectChat: (sessionId: string) => void;
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({
  sessions,
  currentSessionId,
  onSelectChat,
}) => {
  if (sessions.length === 0) {
    return (
      <div className="p-4 text-center">
        <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">No chat history yet</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-2 space-y-1">
        {sessions.map((session) => (
          <Button
            key={session.id}
            variant={session.id === currentSessionId ? "secondary" : "ghost"}
            className="w-full justify-start h-auto p-3 text-left"
            onClick={() => onSelectChat(session.id)}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <MessageSquare className="h-4 w-4 flex-shrink-0" />
                <span className="font-medium truncate text-sm">
                  {session.title}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>
                  {formatDistanceToNow(session.updatedAt, { addSuffix: true })}
                </span>
                <span>•</span>
                <span>{session.messages.length} messages</span>
              </div>
            </div>
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
};
