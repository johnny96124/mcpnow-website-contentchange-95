
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserMessage } from './UserMessage';
import { AIMessage } from './AIMessage';
import { ToolCallMessage } from './ToolCallMessage';
import { ServerDiscoveryMessage } from './ServerDiscoveryMessage';
import { TypingIndicator } from './TypingIndicator';
import { Message } from '../types/chat';

interface MessageThreadProps {
  messages: Message[];
  isLoading: boolean;
  streamingMessageId?: string | null;
  onUpdateMessage: (messageId: string, action: 'run' | 'cancel', toolId?: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onEditMessage: (messageId: string, newContent: string) => void;
  onEditAndRegenerate?: (messageId: string, newContent: string) => void;
  onRegenerateMessage?: (messageId: string) => void;
  onRateMessage?: (messageId: string, rating: 'positive' | 'negative' | null) => void;
  onConfigureServer?: (serverId: string) => void;
}

export const MessageThread: React.FC<MessageThreadProps> = ({
  messages,
  isLoading,
  streamingMessageId,
  onUpdateMessage,
  onDeleteMessage,
  onEditMessage,
  onEditAndRegenerate,
  onRegenerateMessage,
  onRateMessage,
  onConfigureServer
}) => {
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isLoading]);

  return (
    <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((message) => {
          if (message.role === 'user') {
            return (
              <UserMessage
                key={message.id}
                message={message}
                onDelete={() => onDeleteMessage(message.id)}
                onEdit={onEditMessage ? (newContent: string) => onEditMessage(message.id, newContent) : undefined}
                onEditAndRegenerate={onEditAndRegenerate ? (newContent: string) => onEditAndRegenerate(message.id, newContent) : undefined}
              />
            );
          }

          if (message.role === 'tool_call') {
            return (
              <div key={message.id} className="space-y-4">
                <ToolCallMessage
                  message={message}
                  onToolAction={(action: 'run' | 'cancel') => onUpdateMessage(message.id, action)}
                  onDelete={() => onDeleteMessage(message.id)}
                />
                {message.serverDiscoveryCards && message.serverDiscoveryCards.length > 0 && onConfigureServer && (
                  <ServerDiscoveryMessage
                    cards={message.serverDiscoveryCards}
                    onConfigureServer={onConfigureServer}
                  />
                )}
              </div>
            );
          }

          return (
            <div key={message.id} className="space-y-4">
              <AIMessage
                message={message}
                isStreaming={streamingMessageId === message.id}
                onDelete={() => onDeleteMessage(message.id)}
                onEdit={onEditMessage ? (newContent: string) => onEditMessage(message.id, newContent) : undefined}
                onRegenerate={onRegenerateMessage ? () => onRegenerateMessage(message.id) : undefined}
                onRate={onRateMessage ? (rating: 'positive' | 'negative' | null) => onRateMessage(message.id, rating) : undefined}
              />
              {message.serverDiscoveryCards && message.serverDiscoveryCards.length > 0 && onConfigureServer && (
                <ServerDiscoveryMessage
                  cards={message.serverDiscoveryCards}
                  onConfigureServer={onConfigureServer}
                />
              )}
            </div>
          );
        })}
        
        {isLoading && (
          <TypingIndicator />
        )}
      </div>
    </ScrollArea>
  );
};
