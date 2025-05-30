
import React, { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserMessage } from './UserMessage';
import { AIMessage } from './AIMessage';
import { TypingIndicator } from './TypingIndicator';
import { Message } from '../types/chat';

interface MessageThreadProps {
  messages: Message[];
  isLoading: boolean;
}

export const MessageThread: React.FC<MessageThreadProps> = ({
  messages,
  isLoading,
}) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <ScrollArea ref={scrollAreaRef} className="h-full">
      <div className="p-4 space-y-6">
        {messages.map((message) => (
          message.role === 'user' ? (
            <UserMessage key={message.id} message={message} />
          ) : (
            <AIMessage key={message.id} message={message} />
          )
        ))}
        
        {isLoading && <TypingIndicator />}
        
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
};
