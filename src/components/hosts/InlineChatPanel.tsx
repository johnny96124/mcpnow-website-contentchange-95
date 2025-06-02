
import React, { useState, useEffect } from 'react';
import { Send, Bot, History, Plus, ChevronRight } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageThread } from '@/components/chat/MessageThread/MessageThread';
import { MessageInput } from '@/components/chat/InputArea/MessageInput';
import { useChatHistory } from '@/components/chat/hooks/useChatHistory';
import { useMCPServers } from '@/components/chat/hooks/useMCPServers';
import { useStreamingChat } from '@/components/chat/hooks/useStreamingChat';
import { useToast } from '@/hooks/use-toast';
import { Message, MessageAttachment, PendingToolCall } from '@/components/chat/types/chat';
import { ChatHistoryPopover } from './ChatHistoryPopover';

interface AttachedFile {
  id: string;
  file: File;
  preview?: string;
}

interface InlineChatPanelProps {
  className?: string;
  onToggleChat?: () => void;
}

export const InlineChatPanel: React.FC<InlineChatPanelProps> = ({ className, onToggleChat }) => {
  const { getConnectedServers } = useMCPServers();
  const { 
    chatSessions, 
    currentSession, 
    createNewChat, 
    selectChat, 
    addMessage,
    updateMessage,
    deleteSession,
    deleteMessage,
    renameSession,
  } = useChatHistory();
  const { streamingMessageId } = useStreamingChat();
  const { toast } = useToast();
  
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  const connectedServers = getConnectedServers();
  const selectedServers = connectedServers.map(s => s.id);

  // Update current messages when session changes
  useEffect(() => {
    if (currentSession) {
      setCurrentMessages(currentSession.messages);
    } else {
      setCurrentMessages([]);
    }
  }, [currentSession]);

  const handleNewChat = () => {
    if (selectedServers.length > 0) {
      const newSession = createNewChat(selectedServers);
      selectChat(newSession.id);
      setCurrentMessages([]);
    }
  };

  const handleSelectHistorySession = (sessionId: string) => {
    selectChat(sessionId);
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
          
          updateMessage(sessionId, messageId, { content: partialContent });
          
          currentIndex++;
        } else {
          clearInterval(streamInterval);
          resolve();
        }
      }, 30);
    });
  };

  const generateSequentialToolCalls = (userMessage: string, selectedServers: string[]): PendingToolCall[] => {
    const useMultipleServers = Math.random() < 0.5;
    const availableServers = selectedServers.length > 1 ? selectedServers : connectedServers.map(s => s.id);
    
    if (useMultipleServers && availableServers.length > 1) {
      const tools = [
        {
          id: `tool-${Date.now()}-1`,
          toolName: 'search_documents',
          serverId: availableServers[0],
          serverName: `服务器 ${availableServers[0]}`,
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
          toolName: 'get_weather_data',
          serverId: availableServers[1] || availableServers[0],
          serverName: `服务器 ${availableServers[1] || availableServers[0]}`,
          request: { 
            location: 'Shanghai',
            format: 'detailed'
          },
          status: 'pending' as const,
          order: 1,
          visible: false
        },
        {
          id: `tool-${Date.now()}-3`,
          toolName: 'analyze_content',
          serverId: availableServers[Math.min(2, availableServers.length - 1)] || availableServers[0],
          serverName: `服务器 ${availableServers[Math.min(2, availableServers.length - 1)] || availableServers[0]}`,
          request: { 
            content: userMessage,
            analysis_type: 'comprehensive'
          },
          status: 'pending' as const,
          order: 2,
          visible: false
        }
      ];

      return tools;
    } else {
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
        }
      ];

      return tools;
    }
  };

  const handleSendMessage = async (content: string, attachedFiles?: AttachedFile[]) => {
    if (!content.trim() || selectedServers.length === 0 || isSending) return;
    
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
      // 创建AI助手消息，开始流式生成
      const aiMessageId = `msg-${Date.now()}-ai`;
      
      // 根据用户消息内容决定是否需要工具调用
      const needsTools = content.toLowerCase().includes('figma') || 
                        content.toLowerCase().includes('文件') || 
                        content.toLowerCase().includes('搜索') ||
                        content.toLowerCase().includes('查找') ||
                        content.length > 20; // 复杂问题可能需要工具

      let fullContent: string;
      
      if (needsTools) {
        fullContent = `我理解您的请求"${content}"。基于您的问题，我需要调用一些工具来获取相关信息，以便为您提供更准确和详细的回答。让我先分析一下您的需求...`;
      } else {
        fullContent = `我理解您的请求"${content}"。这是一个简单的回复：您输入的内容是"${content}"。如果您需要更复杂的功能或工具调用，请描述更详细的需求。`;
      }

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
      
      // 如果需要工具调用，添加工具调用序列
      if (needsTools) {
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
              message.content + '\n\n工具调用执行完成！基于获取到的信息，我现在可以为您提供详细的回答：\n\n通过搜索相关文档和分析内容，我找到了与您问题相关的信息。如果您需要更多详细信息或有其他问题，请随时告诉我。' :
              message.content
          });
        }
      }, 2000);
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    if (!currentSession) return;
    deleteMessage(currentSession.id, messageId);
  };

  const canSendMessage = selectedServers.length > 0 && !isSending;

  return (
    <div className={`h-full flex flex-col relative ${className}`}>
      {/* Single header with all controls */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleChat}
            className="p-1 h-auto hover:bg-muted"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <h3 className="font-semibold">AI对话</h3>
          {currentSession && (
            <Badge variant="secondary" className="text-xs">
              {currentMessages.length} 条消息
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setHistoryOpen(true)}
          >
            <History className="h-4 w-4" />
          </Button>
          
          <Button
            variant="default"
            size="sm"
            onClick={handleNewChat}
            className="h-8 w-8 p-0"
            disabled={selectedServers.length === 0}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Chat Area - positioned relative for popover positioning */}
      <div className="flex-1 min-h-0 relative">
        {currentMessages.length > 0 ? (
          <MessageThread
            messages={currentMessages}
            isLoading={isSending}
            streamingMessageId={streamingMessageId}
            onUpdateMessage={handleToolAction}
            onDeleteMessage={handleDeleteMessage}
            onEditMessage={() => {}}
          />
        ) : (
          <div className="flex items-center justify-center h-full p-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-sm text-muted-foreground">
                发送消息开始与AI助手交流，支持MCP工具调用
              </p>
            </div>
          </div>
        )}

        {/* History Popover positioned absolutely within chat area */}
        <ChatHistoryPopover
          open={historyOpen}
          onOpenChange={setHistoryOpen}
          sessions={chatSessions}
          onSelectSession={handleSelectHistorySession}
        />
      </div>

      {/* Input Area */}
      <div className="border-t p-3">
        <MessageInput
          onSendMessage={handleSendMessage}
          disabled={!canSendMessage}
          placeholder={
            selectedServers.length === 0 
              ? "请先连接MCP服务器..."
              : "输入您的消息..."
          }
          selectedServers={[]}
          servers={[]}
        />
      </div>
    </div>
  );
};
