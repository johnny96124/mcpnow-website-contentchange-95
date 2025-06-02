
import React, { useEffect, useRef, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserMessage } from './UserMessage';
import { StreamingAIMessage } from './StreamingAIMessage';
import { TypingIndicator } from './TypingIndicator';
import { DeleteConfirmDialog } from '../ChatHistory/DeleteConfirmDialog';
import { Message } from '../types/chat';

interface MessageThreadProps {
  messages: Message[];
  isLoading: boolean;
  streamingMessageId?: string | null;
  onUpdateMessage?: (messageId: string, action: 'run' | 'cancel', toolId?: string) => void;
  onDeleteMessage?: (messageId: string) => void;
  onEditMessage?: (messageId: string, newContent: string) => void;
  onEditAndRegenerate?: (messageId: string, newContent: string) => void;
  onRegenerateMessage?: (messageId: string) => void;
  onRateMessage?: (messageId: string, rating: 'positive' | 'negative' | null) => void;
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
}) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    messageId: string;
    content: string;
  }>({
    open: false,
    messageId: '',
    content: ''
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleDeleteMessage = (messageId: string, content: string) => {
    setDeleteDialog({
      open: true,
      messageId,
      content: content.substring(0, 50) + (content.length > 50 ? '...' : '')
    });
  };

  const confirmDeleteMessage = () => {
    if (onDeleteMessage) {
      onDeleteMessage(deleteDialog.messageId);
    }
    setDeleteDialog({ open: false, messageId: '', content: '' });
  };

  return (
    <>
      <ScrollArea ref={scrollAreaRef} className="h-full">
        <div className="p-4 space-y-6">
          {messages.map((message) => {
            if (message.role === 'user') {
              return (
                <UserMessage 
                  key={message.id} 
                  message={message}
                  onDelete={onDeleteMessage ? () => handleDeleteMessage(message.id, message.content) : undefined}
                  onEdit={onEditMessage ? (newContent) => onEditMessage(message.id, newContent) : undefined}
                  onEditAndRegenerate={onEditAndRegenerate ? (newContent) => onEditAndRegenerate(message.id, newContent) : undefined}
                />
              );
            } else {
              return (
                <StreamingAIMessage 
                  key={message.id} 
                  message={message} 
                  isStreaming={message.id === streamingMessageId}
                  onDelete={onDeleteMessage ? () => handleDeleteMessage(message.id, message.content) : undefined}
                  onRegenerate={onRegenerateMessage ? () => onRegenerateMessage(message.id) : undefined}
                  onToolAction={onUpdateMessage}
                  onRating={onRateMessage}
                />
              );
            }
          })}
          
          {isLoading && <TypingIndicator />}
          
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      <DeleteConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
        title="删除消息"
        description={`确定要删除这条消息吗？"${deleteDialog.content}"`}
        onConfirm={confirmDeleteMessage}
      />
    </>
  );
};
