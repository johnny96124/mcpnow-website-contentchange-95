import React, { useState, useEffect } from 'react';
import { ArrowLeft, MessageSquare, Bot, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MessageThread } from '@/components/chat/MessageThread/MessageThread';
import { MessageInput } from '@/components/chat/InputArea/MessageInput';
import { ConversationExport } from '@/components/chat/ConversationExport';
import { AddInstanceDialog } from '@/components/servers/AddInstanceDialog';
import { useChatHistory } from '@/components/chat/hooks/useChatHistory';
import { useMCPServers } from '@/components/chat/hooks/useMCPServers';
import { useStreamingChat } from '@/components/chat/hooks/useStreamingChat';
import { useToast } from '@/hooks/use-toast';
import { Message, MessageAttachment, PendingToolCall } from '@/components/chat/types/chat';
import { ServerRecommendation } from '@/components/chat/MessageThread/ServerRecommendationCard';

interface AttachedFile {
  id: string;
  file: File;
  preview?: string;
}

interface DashboardChatInterfaceProps {
  onClose: () => void;
}

export const DashboardChatInterface: React.FC<DashboardChatInterfaceProps> = ({ onClose }) => {
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
  } = useStreamingChat();
  const { toast } = useToast();
  
  const [isSending, setIsSending] = useState(false);
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [configDialog, setConfigDialog] = useState<{
    open: boolean;
    server: ServerRecommendation | null;
    messageId: string | null;
  }>({
    open: false,
    server: null,
    messageId: null
  });

  const connectedServers = getConnectedServers();
  
  // 自动使用所有连接的服务器
  const selectedServers = connectedServers.map(s => s.id);

  // Update current messages when session changes
  useEffect(() => {
    if (currentSession) {
      setCurrentMessages(currentSession.messages);
    } else {
      setCurrentMessages([]);
      // 自动创建新对话
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

    // 如果当前没有会话，创建一个新会话
    let sessionId = currentSession?.id;
    if (!sessionId) {
      const newSession = createNewChat(selectedServers);
      sessionId = newSession.id;
      selectChat(sessionId);
    }

    // 添加用户消息
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
      // 创建AI助手消息，开始流式生成
      const aiMessageId = `msg-${Date.now()}-ai`;
      const fullContent = `我理解您的请求"${content}"。基于您的问题，我需要调用一些工具来获取相关信息，以便为您提供更准确和详细的回答。让我先分析一下您的需求...`;

      const aiMessage: Message = {
        id: aiMessageId,
        role: 'assistant',
        content: '',
        timestamp: Date.now()
      };

      setCurrentMessages(prev => [...prev, aiMessage]);
      addMessage(sessionId, aiMessage);

      // 先完成流式文字生成
      await simulateStreamingText(sessionId, aiMessageId, fullContent);
      
      // 文字生成完成后，生成工具调用序列
      const toolCalls = generateSequentialToolCalls(content, selectedServers);
      const messageWithTools: Partial<Message> = {
        pendingToolCalls: toolCalls,
        toolCallStatus: 'pending',
        currentToolIndex: 0
      };

      setCurrentMessages(prev => 
        prev.map(msg => 
          msg.id === aiMessageId ? { ...msg, ...messageWithTools } : msg
        )
      );
      
      if (currentSession) {
        updateMessage(sessionId, aiMessageId, messageWithTools);
      }

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

  const simulateStreamingText = async (sessionId: string, messageId: string, fullContent: string) => {
    let currentIndex = 0;
    const words = fullContent.split('');
    
    return new Promise<void>((resolve) => {
      const streamInterval = setInterval(() => {
        if (currentIndex < words.length) {
          const partialContent = words.slice(0, currentIndex + 1).join('');
          
          setCurrentMessages(prev => 
            prev.map(msg => 
              msg.id === messageId ? { ...msg, content: partialContent } : msg
            )
          );
          
          if (currentSession) {
            updateMessage(sessionId, messageId, { content: partialContent });
          }
          
          currentIndex++;
        } else {
          clearInterval(streamInterval);
          resolve();
        }
      }, 25);
    });
  };

  const generateSequentialToolCalls = (userMessage: string, selectedServers: string[]): PendingToolCall[] => {
    const tools = [
      {
        id: `tool-${Date.now()}-1`,
        toolName: 'search_documents',
        serverId: selectedServers[0],
        serverName: `服务器 ${selectedServers[0]}`,
        request: { 
          query: userMessage.substring(0, 50),
          filters: { type: 'relevant' }
        },
        status: 'pending' as const,
        order: 0,
        visible: true
      },
      {
        id: `tool-${Date.now()}-2`,
        toolName: 'analyze_content',
        serverId: selectedServers[0],
        serverName: `服务器 ${selectedServers[0]}`,
        request: { 
          content: userMessage,
          analysis_type: 'comprehensive'
        },
        status: 'pending' as const,
        order: 1,
        visible: false
      },
      {
        id: `tool-${Date.now()}-3`,
        toolName: 'generate_summary',
        serverId: selectedServers[0],
        serverName: `服务器 ${selectedServers[0]}`,
        request: { 
          source: 'user_query',
          context: userMessage
        },
        status: 'pending' as const,
        order: 2,
        visible: false
      }
    ];

    return tools;
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
        toolCallStatus: 'cancelled',
        content: message.content + '\n\n工具调用已被取消。如果您还有其他问题，请随时告诉我。'
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
            currentToolIndex: allCompleted ? undefined : toolIndex + 1,
            content: allCompleted ? 
              message.content + '\n\n工具调用执行完成！基于获取到的信息，我现在可以为您提供详细的回答。' :
              message.content
          });
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

  const handleConfigureServer = (messageId: string, server: ServerRecommendation) => {
    setConfigDialog({
      open: true,
      server,
      messageId
    });
  };

  const handleServerConfigComplete = (formData: any) => {
    // Mock success message
    toast({
      title: "服务器配置成功",
      description: `${configDialog.server?.name} 已成功添加到您的配置文件中`,
    });

    // 模拟添加成功反馈到对话中
    if (currentSession && configDialog.messageId) {
      const successMessage: Message = {
        id: `msg-${Date.now()}-config-success`,
        role: 'assistant',
        content: `太好了！我已经帮您成功配置了 ${configDialog.server?.name}。现在您可以使用这个服务器的功能来增强我们的对话体验。这个服务器已经添加到您的配置文件中，您可以在主页面看到它。`,
        timestamp: Date.now()
      };

      setCurrentMessages(prev => [...prev, successMessage]);
      addMessage(currentSession.id, successMessage);
    }

    setConfigDialog({ open: false, server: null, messageId: null });
  };

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
            onConfigureServer={handleConfigureServer}
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

      {/* Server Configuration Dialog */}
      <AddInstanceDialog
        open={configDialog.open}
        onOpenChange={(open) => setConfigDialog(prev => ({ ...prev, open }))}
        serverDefinition={configDialog.server ? {
          id: configDialog.server.id,
          name: configDialog.server.name,
          type: configDialog.server.type,
          description: configDialog.server.description,
          isOfficial: configDialog.server.isOfficial || false,
          category: 'Development',
          url: '',
          args: '',
          env: {},
          headers: {}
        } : null}
        onCreateInstance={handleServerConfigComplete}
        editMode={false}
      />
    </div>
  );
};
