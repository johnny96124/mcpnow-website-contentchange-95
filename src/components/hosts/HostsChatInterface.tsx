import React, { useState, useEffect } from 'react';
import { ArrowLeft, MessageSquare, Bot, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MessageThread } from '@/components/chat/MessageThread/MessageThread';
import { MessageInput } from '@/components/chat/InputArea/MessageInput';
import { ConversationExport } from '@/components/chat/ConversationExport';
import { useChatHistory } from '@/components/chat/hooks/useChatHistory';
import { useMCPServers } from '@/components/chat/hooks/useMCPServers';
import { useStreamingChat } from '@/components/chat/hooks/useStreamingChat';
import { useToast } from '@/hooks/use-toast';
import { Message, MessageAttachment } from '@/components/chat/types/chat';

interface AttachedFile {
  id: string;
  file: File;
  preview?: string;
}

interface HostsChatInterfaceProps {
  onClose: () => void;
}

export const HostsChatInterface: React.FC<HostsChatInterfaceProps> = ({ onClose }) => {
  const { getConnectedServers } = useMCPServers();
  const { 
    chatSessions, 
    currentSession, 
    createNewChat, 
    selectChat, 
    addMessage,
    updateMessage,
    deleteMessage,
    renameSession,
  } = useChatHistory();
  const { 
    streamingMessageId, 
    generateAIResponseWithInlineTools,
    handleToolsCompletion
  } = useStreamingChat();
  const { toast } = useToast();
  
  const [isSending, setIsSending] = useState(false);
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);

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

  const handleSendMessage = async (content: string, attachedFiles?: AttachedFile[]) => {
    if (selectedServers.length === 0 || isSending) return;
    
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
      // 使用新的分阶段流式生成
      await generateAIResponseWithInlineTools(
        content,
        selectedServers,
        sessionId,
        addMessage,
        updateMessage
      );
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
    } finally {
      setIsSending(false);
    }
  };

  const handleToolAction = (messageId: string, action: 'run' | 'cancel', toolId?: string) => {
    const message = currentMessages.find(msg => msg.id === messageId);
    if (!message || !message.pendingToolCalls) return;

    const updateMessageInline = (updates: Partial<Message>) => {
      setCurrentMessages(prev => 
        prev.map(msg => msg.id === messageId ? { ...msg, ...updates } : msg)
      );
      if (currentSession) {
        updateMessage(currentSession.id, messageId, updates);
      }
    };

    if (action === 'cancel') {
      const updatedToolCalls = message.pendingToolCalls.map(tool => ({
        ...tool,
        status: tool.status === 'pending' ? 'cancelled' as const : tool.status
      }));

      updateMessageInline({ 
        pendingToolCalls: updatedToolCalls,
        toolCallStatus: 'cancelled'
      });
    } else if (action === 'run' && toolId) {
      const toolIndex = message.pendingToolCalls.findIndex(tool => tool.id === toolId);
      if (toolIndex === -1) return;

      const updatedToolCalls = message.pendingToolCalls.map(tool => 
        tool.id === toolId ? { ...tool, status: 'executing' as const } : tool
      );

      updateMessageInline({ 
        pendingToolCalls: updatedToolCalls,
        toolCallStatus: 'executing'
      });
      
      setTimeout(() => {
        const shouldFail = Math.random() < 0.2;
        
        if (shouldFail) {
          const failedToolCalls = updatedToolCalls.map(tool => 
            tool.id === toolId ? { ...tool, status: 'failed' as const } : tool
          );

          updateMessageInline({ 
            pendingToolCalls: failedToolCalls,
            toolCallStatus: 'failed',
            errorMessage: '工具调用执行失败：连接超时'
          });
        } else {
          const completedToolCalls = updatedToolCalls.map((tool, index) => {
            if (tool.id === toolId) {
              return { ...tool, status: 'completed' as const };
            }
            if (index === toolIndex + 1) {
              return { ...tool, visible: true };
            }
            return tool;
          });

          const allCompleted = completedToolCalls.every(tool => 
            tool.status === 'completed' || tool.status === 'cancelled'
          );

          updateMessageInline({ 
            pendingToolCalls: completedToolCalls,
            toolCallStatus: allCompleted ? 'completed' : 'pending',
            currentToolIndex: allCompleted ? undefined : toolIndex + 1
          });

          // 如果所有工具都完成了，开始第二阶段流式输出
          if (allCompleted && currentSession) {
            handleToolsCompletion(currentSession.id, messageId, updateMessage);
          }
        }
      }, 2000);
    }
  };

  const handleEditMessage = (messageId: string, newContent: string) => {
    if (!currentSession) return;
    
    const updatedMessage: Partial<Message> = { content: newContent };
    setCurrentMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, ...updatedMessage } : msg
      )
    );
    updateMessage(currentSession.id, messageId, updatedMessage);
    
    toast({
      title: "消息已更新",
      description: "消息内容已成功修改",
    });
  };

  const handleDeleteMessage = (messageId: string) => {
    if (!currentSession) return;
    deleteMessage(currentSession.id, messageId);
  };

  const canSendMessage = selectedServers.length > 0 && !isSending;

  if (connectedServers.length === 0) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <div className="flex justify-center mb-4">
            <MessageSquare className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">暂无MCP服务器连接</h3>
          <p className="text-muted-foreground mb-4">
            请先连接至少一个MCP服务器才能开始与AI对话。
          </p>
          <Button variant="outline" onClick={onClose}>
            返回
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <div className="border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="font-semibold">
              {currentSession?.title || 'MCP Now AI 对话'}
            </h2>
            <p className="text-sm text-muted-foreground">
              使用 {selectedServers.length} 个连接的服务器
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ConversationExport
            messages={currentMessages}
            sessionTitle={currentSession?.title}
          />
          
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Message Thread */}
      <div className="flex-1 overflow-hidden">
        {currentMessages.length > 0 ? (
          <MessageThread
            messages={currentMessages}
            isLoading={false}
            streamingMessageId={streamingMessageId}
            onUpdateMessage={handleToolAction}
            onDeleteMessage={handleDeleteMessage}
            onEditMessage={handleEditMessage}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">开始与AI对话</h3>
              <p className="text-muted-foreground">
                MCP Now AI助手已准备就绪
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t p-4">
        <MessageInput
          onSendMessage={handleSendMessage}
          disabled={!canSendMessage}
          placeholder="输入您的消息..."
          selectedServers={selectedServers}
          servers={connectedServers}
        />
      </div>
    </div>
  );
};
