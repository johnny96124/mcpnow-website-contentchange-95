import React, { useState, useEffect } from 'react';
import { MessageSquare, Bot, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ServerSelector } from './ServerSelector/ServerSelector';
import { ChatHistory } from './ChatHistory/ChatHistory';
import { MessageThread } from './MessageThread/MessageThread';
import { MessageInput } from './InputArea/MessageInput';
import { useChatHistory } from './hooks/useChatHistory';
import { useMCPServers } from './hooks/useMCPServers';
import { useStreamingChat } from './hooks/useStreamingChat';
import { ChatSession, Message, MessageAttachment, PendingToolCall } from './types/chat';

interface AttachedFile {
  id: string;
  file: File;
  preview?: string;
}

export const ChatInterface = () => {
  const { servers, profiles, getConnectedServers } = useMCPServers();
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
    isLoading 
  } = useChatHistory();
  const { 
    streamingMessageId, 
    generateAIResponseWithInlineTools
  } = useStreamingChat();
  
  const [selectedServers, setSelectedServers] = useState<string[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<string | undefined>();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);

  const connectedServers = getConnectedServers();
  
  // Auto-select first connected server if none selected
  useEffect(() => {
    if (connectedServers.length > 0 && selectedServers.length === 0) {
      setSelectedServers([connectedServers[0].id]);
    }
  }, [connectedServers, selectedServers]);

  // Update current messages when session changes
  useEffect(() => {
    if (currentSession) {
      setCurrentMessages(currentSession.messages);
    } else {
      setCurrentMessages([]);
    }
  }, [currentSession]);

  const handleNewChat = () => {
    // 清空当前会话和消息，开始新的对话
    selectChat(''); // 清除当前会话选择
    setCurrentMessages([]); // 清空当前消息
  };

  const handleSendMessage = async (content: string, attachedFiles?: AttachedFile[]) => {
    if (selectedServers.length === 0 || isSending) return;
    
    console.log('Sending message:', content, 'with attachments:', attachedFiles);
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
      const newSession = createNewChat(selectedServers, selectedProfile);
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

      // 生成多个工具调用
      const pendingToolCalls = generateMultipleToolCalls(content, selectedServers);

      const aiMessage: Message = {
        id: aiMessageId,
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
        pendingToolCalls,
        toolCallStatus: 'pending'
      };

      setCurrentMessages(prev => [...prev, aiMessage]);
      addMessage(sessionId, aiMessage);

      // 流式生成文字内容
      await simulateStreamingText(sessionId, aiMessageId, fullContent);

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

  const generateMultipleToolCalls = (userMessage: string, selectedServers: string[]): PendingToolCall[] => {
    // 只生成第一个工具调用，其他的会在前一个完成后动态添加
    return [
      {
        id: `tool-${Date.now()}-1`,
        toolName: 'search_documents',
        serverId: selectedServers[0],
        serverName: `服务器 ${selectedServers[0]}`,
        request: { 
          query: userMessage.substring(0, 50),
          filters: { type: 'relevant' }
        },
        status: 'pending'
      }
    ];
  };

  const addNextToolCall = (sessionId: string, messageId: string, completedToolIndex: number) => {
    const nextTools = [
      {
        id: `tool-${Date.now()}-${completedToolIndex + 2}`,
        toolName: 'analyze_content',
        serverId: selectedServers[0],
        serverName: `服务器 ${selectedServers[0]}`,
        request: { 
          content: '分析内容',
          analysis_type: 'comprehensive'
        },
        status: 'pending'
      },
      {
        id: `tool-${Date.now()}-${completedToolIndex + 3}`,
        toolName: 'generate_summary',
        serverId: selectedServers[0],
        serverName: `服务器 ${selectedServers[0]}`,
        request: { 
          source: 'user_query',
          context: '生成摘要'
        },
        status: 'pending'
      }
    ];

    // 只添加下一个工具，如果还有的话
    if (completedToolIndex < 2) { // 总共3个工具，索引0,1,2
      const nextTool = nextTools[completedToolIndex];
      
      setCurrentMessages(prev => 
        prev.map(msg => {
          if (msg.id === messageId && msg.pendingToolCalls) {
            return {
              ...msg,
              pendingToolCalls: [...msg.pendingToolCalls, nextTool]
            };
          }
          return msg;
        })
      );

      if (currentSession) {
        const message = currentSession.messages.find(m => m.id === messageId);
        if (message && message.pendingToolCalls) {
          const updatedToolCalls = [...message.pendingToolCalls, nextTool];
          updateMessage(sessionId, messageId, { pendingToolCalls: updatedToolCalls });
        }
      }
    }
  };

  const handleToolAction = (messageId: string, toolId: string, action: 'run' | 'cancel') => {
    const updateToolInMessage = (toolUpdates: Partial<PendingToolCall>) => {
      setCurrentMessages(prev => 
        prev.map(msg => {
          if (msg.id === messageId && msg.pendingToolCalls) {
            return {
              ...msg,
              pendingToolCalls: msg.pendingToolCalls.map(tool =>
                tool.id === toolId ? { ...tool, ...toolUpdates } : tool
              )
            };
          }
          return msg;
        })
      );

      if (currentSession) {
        const message = currentSession.messages.find(m => m.id === messageId);
        if (message && message.pendingToolCalls) {
          const updatedToolCalls = message.pendingToolCalls.map(tool =>
            tool.id === toolId ? { ...tool, ...toolUpdates } : tool
          );
          updateMessage(currentSession.id, messageId, { pendingToolCalls: updatedToolCalls });
        }
      }
    };

    if (action === 'cancel') {
      updateToolInMessage({ status: 'cancelled' });
    } else if (action === 'run') {
      updateToolInMessage({ status: 'executing' });
      
      // 模拟工具执行
      setTimeout(() => {
        const shouldFail = Math.random() < 0.3; // 30% 失败率
        
        if (shouldFail) {
          updateToolInMessage({ 
            status: 'failed',
            errorMessage: '连接超时: 无法连接到MCP服务器'
          });
        } else {
          updateToolInMessage({ 
            status: 'completed',
            response: {
              status: "success",
              data: {
                analysis: "工具执行完成",
                action: "data_retrieved",
                confidence: 0.95
              },
              timestamp: new Date().toISOString()
            }
          });

          // 工具完成后，添加下一个工具（如果有的话）
          if (currentSession) {
            const message = currentSession.messages.find(m => m.id === messageId);
            if (message && message.pendingToolCalls) {
              const completedToolIndex = message.pendingToolCalls.findIndex(tool => tool.id === toolId);
              setTimeout(() => {
                addNextToolCall(currentSession.id, messageId, completedToolIndex);
              }, 1000); // 延迟1秒后添加下一个工具
            }
          }
        }
      }, 3000);
    }
  };

  const canSendMessage = selectedServers.length > 0 && !isSending;

  if (connectedServers.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="p-8 text-center max-w-md">
          <div className="flex justify-center mb-4">
            <MessageSquare className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">暂无MCP服务器连接</h3>
          <p className="text-muted-foreground mb-4">
            请先连接至少一个MCP服务器才能开始与AI对话。
          </p>
          <Button variant="outline" onClick={() => window.location.href = '/servers'}>
            <Zap className="h-4 w-4 mr-2" />
            管理服务器
          </Button>
        </Card>
      </div>
    );
  }

  console.log('Current messages:', currentMessages);

  return (
    <div className="flex h-full bg-background">
      {/* Left Sidebar */}
      <div className={`border-r bg-card transition-all duration-300 ${
        sidebarCollapsed ? 'w-0 overflow-hidden' : 'w-80'
      }`}>
        <div className="flex flex-col h-full">
          {/* Server Selection */}
          <div className="p-4 border-b">
            <ServerSelector
              servers={connectedServers}
              profiles={profiles}
              selectedServers={selectedServers}
              selectedProfile={selectedProfile}
              onServersChange={setSelectedServers}
              onProfileChange={setSelectedProfile}
            />
          </div>

          {/* New Chat Button */}
          <div className="p-4 border-b">
            <Button onClick={handleNewChat} className="w-full">
              <MessageSquare className="h-4 w-4 mr-2" />
              新建对话
            </Button>
          </div>

          {/* Chat History */}
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
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
            <div>
              <h2 className="font-semibold">
                {currentSession?.title || '新建对话'}
              </h2>
              <p className="text-sm text-muted-foreground">
                已选择 {selectedServers.length} 个服务器
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-500" />
            <span className="text-sm text-muted-foreground">AI助手</span>
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
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">欢迎使用AI对话</h3>
                <p className="text-muted-foreground">
                  开始新的对话来与AI助手交流
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
            placeholder={
              selectedServers.length === 0 
                ? "请先选择MCP服务器..."
                : "输入您的消息..."
            }
            selectedServers={selectedServers}
            servers={connectedServers}
          />
        </div>
      </div>
    </div>
  );
};
