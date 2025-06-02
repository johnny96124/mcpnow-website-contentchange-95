
import React, { useState, useEffect } from 'react';
import { Send, Bot, History, Plus } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageThread } from '@/components/chat/MessageThread/MessageThread';
import { MessageInput } from '@/components/chat/InputArea/MessageInput';
import { ChatHistory } from '@/components/chat/ChatHistory/ChatHistory';
import { useChatHistory } from '@/components/chat/hooks/useChatHistory';
import { useMCPServers } from '@/components/chat/hooks/useMCPServers';
import { useToast } from '@/hooks/use-toast';
import { Message, MessageAttachment, PendingToolCall } from '@/components/chat/types/chat';
import { Separator } from '@/components/ui/separator';

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
    updateMessage,
    deleteSession,
    deleteMessage,
    renameSession,
  } = useChatHistory();
  const { toast } = useToast();
  
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [selectedModel, setSelectedModel] = useState('GPT-4o');
  const [isSending, setIsSending] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

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

  const generateSequentialToolCalls = (userMessage: string, selectedServers: string[]): PendingToolCall[] => {
    const tools = [
      {
        id: `tool-${Date.now()}-1`,
        toolName: 'search_documents',
        serverId: selectedServers[0],
        serverName: `fastgpt-instance-1`,
        request: { 
          query: userMessage.substring(0, 50),
          filters: { type: 'relevant' }
        },
        status: 'pending' as const,
        order: 0,
        visible: true
      }
    ];

    return tools;
  };

  const simulateStreamingText = async (sessionId: string, messageId: string, fullContent: string) => {
    let currentIndex = 0;
    const chars = fullContent.split('');
    
    return new Promise<void>((resolve) => {
      const streamInterval = setInterval(() => {
        if (currentIndex < chars.length) {
          const partialContent = chars.slice(0, currentIndex + 1).join('');
          
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
      }, 20);
    });
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

      await simulateStreamingText(sessionId, aiMessageId, fullContent);
      
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
        const shouldFail = Math.random() < 0.1;
        
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
          const completedToolCalls = updatedToolCalls.map(tool => 
            tool.id === toolId ? { ...tool, status: 'completed' as const } : tool
          );

          updateMessageInline({ 
            pendingToolCalls: completedToolCalls,
            toolCallStatus: 'completed',
            content: message.content + '\n\n🔧 MCP工具调用\n\n这将帮助您获解相关信息，以便更好地回答您的问题。\n\n工具调用执行完成！基于获取到的信息，我现在可以为您提供详细的回答。'
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
    <div className={`h-full flex ${className}`}>
      {/* Chat History Sidebar */}
      {showHistory && (
        <div className="w-80 border-r bg-card flex flex-col">
          <div className="p-3 border-b">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">新建对话</h3>
              <Button variant="outline" size="sm" onClick={handleNewChat}>
                <Plus className="h-4 w-4 mr-1" />
                新建
              </Button>
            </div>
            <Badge variant="secondary" className="text-xs">
              已选择 1 个服务器
            </Badge>
          </div>
          
          <div className="flex-1 overflow-hidden">
            <ChatHistory
              sessions={chatSessions}
              currentSessionId={currentSession?.id}
              onSelectChat={selectChat}
              onDeleteSession={deleteSession}
              onDeleteMessage={deleteMessage}
              onRenameSession={renameSession}
            />
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-3 border-b">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {!showHistory && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowHistory(true)}
                >
                  <History className="h-4 w-4 mr-1" />
                  历史
                </Button>
              )}
              <span className="font-medium">
                {currentSession?.title || '新建对话'}
              </span>
            </div>
            {showHistory && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowHistory(false)}
              >
                ←
              </Button>
            )}
          </div>
          
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GPT-4o">❤️ GPT-4o</SelectItem>
              <SelectItem value="Claude 4 Sonnet">⭐ Claude 4 Sonnet</SelectItem>
              <SelectItem value="GPT-4">GPT-4</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Connected Servers Info */}
        <div className="p-3 border-b bg-muted/30">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Connected to:</span>
            <Badge variant="secondary">
              {connectedServers.length > 0 ? 'FastGPT Instance 1' : 'No servers'}
            </Badge>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 min-h-0">
          {currentMessages.length > 0 ? (
            <MessageThread
              messages={currentMessages}
              isLoading={isSending}
              onUpdateMessage={handleToolAction}
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
            disabled={!canSendMessage}
            placeholder={
              selectedServers.length === 0 
                ? "请先连接MCP服务器..."
                : "输入您的消息..."
            }
            selectedServers={selectedServers}
            servers={connectedServers}
          />
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span>Press Cmd+Enter to send</span>
            <span>0/4000</span>
          </div>
        </div>
      </div>
    </div>
  );
};
