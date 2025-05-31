
import React, { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserMessage } from './UserMessage';
import { StreamingAIMessage } from './StreamingAIMessage';
import { ToolCallMessage } from './ToolCallMessage';
import { TypingIndicator } from './TypingIndicator';
import { Message } from '../types/chat';

interface MessageThreadProps {
  messages: Message[];
  isLoading: boolean;
  streamingMessageId?: string | null;
  onUpdateMessage?: (messageId: string, updates: Partial<Message>) => void;
}

export const MessageThread: React.FC<MessageThreadProps> = ({
  messages,
  isLoading,
  streamingMessageId,
  onUpdateMessage,
}) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleToolAction = (messageId: string, action: 'run' | 'cancel') => {
    if (!onUpdateMessage) return;
    
    if (action === 'cancel') {
      onUpdateMessage(messageId, { 
        toolCallStatus: 'rejected'
      });
    } else if (action === 'run') {
      onUpdateMessage(messageId, { 
        toolCallStatus: 'executing'
      });
      // Here you would trigger the actual tool execution
      // For now, we'll simulate it
      setTimeout(() => {
        onUpdateMessage(messageId, { 
          toolCallStatus: 'completed'
        });
      }, 2000);
    }
  };

  return (
    <ScrollArea ref={scrollAreaRef} className="h-full">
      <div className="p-4 space-y-6">
        {messages.map((message) => {
          if (message.role === 'user') {
            return <UserMessage key={message.id} message={message} />;
          } else if (message.role === 'tool_call') {
            return (
              <ToolCallMessage 
                key={message.id} 
                message={message}
                onToolAction={handleToolAction}
              />
            );
          } else {
            return (
              <StreamingAIMessage 
                key={message.id} 
                message={message} 
                isStreaming={message.id === streamingMessageId}
              />
            );
          }
        })}
        
        {isLoading && <TypingIndicator />}
        
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
};
