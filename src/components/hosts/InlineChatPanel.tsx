
import React, { useState, useEffect } from 'react';
import { Send, Bot } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageThread } from '@/components/chat/MessageThread/MessageThread';
import { MessageInput } from '@/components/chat/InputArea/MessageInput';
import { ChatHistory } from '@/components/chat/ChatHistory/ChatHistory';
import { useChatHistory } from '@/components/chat/hooks/useChatHistory';
import { useMCPServers } from '@/components/chat/hooks/useMCPServers';
import { useToast } from '@/hooks/use-toast';
import { Message, MessageAttachment } from '@/components/chat/types/chat';

interface AttachedFile {
  id: string;
  file: File;
  preview?: string;
}

interface InlineChatPanelProps {
  className?: string;
}

export const InlineChatPanel: React.FC<InlineChatPanelProps> = ({ className }) => {
  const { getConnectedServers } = useMCPServers();
  const { 
    chatSessions, 
    currentSession, 
    createNewChat, 
    selectChat, 
    addMessage,
    deleteSession,
    deleteMessage,
    renameSession,
  } = useChatHistory();
  const { toast } = useToast();
  
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [showHistory, setShowHistory] = useState(true);

  const connectedServers = getConnectedServers();
  const selectedServers = connectedServers.map(s => s.id);

  // Update current messages when session changes
  useEffect(() => {
    if (currentSession) {
      setCurrentMessages(currentSession.messages);
    } else {
      setCurrentMessages([]);
      if (selectedServers.length > 0) {
        const newSession = createNewChat(selectedServers);
        selectChat(newSession.id);
      }
    }
  }, [currentSession, selectedServers]);

  const handleNewChat = () => {
    selectChat('');
    setCurrentMessages([]);
  };

  const handleSendMessage = async (content: string, attachedFiles?: AttachedFile[]) => {
    if (!content.trim() || isSending) return;
    
    setIsSending(true);

    // Process attachments
    const attachments: MessageAttachment[] = [];
    if (attachedFiles && attachedFiles.length > 0) {
      for (const attachedFile of attachedFiles) {
        const attachment: MessageAttachment = {
          id: attachedFile.id,
          name: attachedFile.file.name,
          size: attachedFile.file.size,
          type: attachedFile.file.type,
          preview: attachedFile.preview,
        };
        attachments.push(attachment);
      }
    }

    let sessionId = currentSession?.id;
    if (!sessionId) {
      const newSession = createNewChat(selectedServers);
      sessionId = newSession.id;
      selectChat(sessionId);
    }

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content,
      timestamp: Date.now(),
      attachments: attachments.length > 0 ? attachments : undefined
    };

    setCurrentMessages(prev => [...prev, userMessage]);
    addMessage(sessionId, userMessage);

    try {
      // Simulate AI response
      setTimeout(async () => {
        const aiMessageId = `msg-${Date.now()}-ai`;
        const aiResponse = `我理解您的问题："${content}"。我正在为您分析和处理这个请求。`;

        const aiMessage: Message = {
          id: aiMessageId,
          role: 'assistant',
          content: aiResponse,
          timestamp: Date.now()
        };

        setCurrentMessages(prev => [...prev, aiMessage]);
        addMessage(sessionId, aiMessage);
        setIsSending(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to get AI response:', error);
      const errorMessage: Message = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: '抱歉，处理您的请求时遇到了错误，请稍后重试。',
        timestamp: Date.now()
      };
      setCurrentMessages(prev => [...prev, errorMessage]);
      addMessage(sessionId, errorMessage);
      setIsSending(false);
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    if (!currentSession) return;
    deleteMessage(currentSession.id, messageId);
  };

  return (
    <div className={`h-full flex flex-col ${className}`}>
      {/* Chat Area */}
      <div className="flex-1 min-h-0">
        {currentMessages.length > 0 ? (
          <MessageThread
            messages={currentMessages}
            isLoading={isSending}
            onDeleteMessage={handleDeleteMessage}
            onEditMessage={() => {}}
          />
        ) : (
          <div className="flex items-center justify-center h-full p-4">
            <div className="text-center">
              <Bot className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <h3 className="font-semibold mb-1">开始AI对话</h3>
              <p className="text-sm text-muted-foreground">
                发送消息开始与AI助手交流
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t p-3">
        <MessageInput
          onSendMessage={handleSendMessage}
          disabled={isSending}
          placeholder="输入您的消息..."
          selectedServers={selectedServers}
          servers={connectedServers}
        />
      </div>
    </div>
  );
};
