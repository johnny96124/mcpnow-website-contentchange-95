import React, { useState, useEffect } from 'react';
import { MessageSquare, Bot, Zap, Settings } from 'lucide-react';
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
import { ServerStatusMonitor } from './ServerMonitoring/ServerStatusMonitor';
import { ToolManagementPanel } from './ServerMonitoring/ToolManagementPanel';
import { ServerDebugDialog } from './ServerMonitoring/ServerDebugDialog';
import { useToolManagement } from './hooks/useToolManagement';
import { useServerMonitoring } from './hooks/useServerMonitoring';

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
  
  // New monitoring and tool management hooks
  const {
    tools,
    toggleTool,
    toggleAllToolsForServer,
    toggleToolsByCategory,
    resetToDefault,
    getEnabledTools
  } = useToolManagement();
  
  const {
    serverInfo,
    serverMessages,
    isHealthChecking,
    performHealthCheck,
    initializeServer,
    addServerMessage
  } = useServerMonitoring();
  
  const [selectedServers, setSelectedServers] = useState<string[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<string | undefined>();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [debugServerId, setDebugServerId] = useState<string | null>(null);
  const [showAdvancedPanel, setShowAdvancedPanel] = useState(false);

  const connectedServers = getConnectedServers();
  
  // Initialize server monitoring for connected servers
  useEffect(() => {
    connectedServers.forEach(server => {
      if (!serverInfo[server.id]) {
        initializeServer(server.id, {
          name: server.name,
          type: server.type,
          status: server.status,
          configuration: { serverId: server.id, type: server.type }
        });
      }
    });
  }, [connectedServers, serverInfo, initializeServer]);

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
    selectChat('');
    setCurrentMessages([]);
  };

  const handleSendMessage = async (content: string, attachedFiles?: AttachedFile[]) => {
    if (selectedServers.length === 0 || isSending) return;
    
    // Filter tools based on enabled state
    const enabledTools = getEnabledTools().filter(tool => 
      selectedServers.includes(tool.serverId)
    );
    
    if (enabledTools.length === 0) {
      console.warn('No enabled tools available for selected servers');
    }
    
    console.log('Sending message:', content, 'with attachments:', attachedFiles);
    console.log('Enabled tools:', enabledTools);
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
        currentToolIndex: 0 // 从第一个工具开始
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
    // 生成3个按顺序执行的工具调用
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
        visible: true // 第一个工具立即可见
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
        visible: false // 第二个工具先隐藏
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
        visible: false // 第三个工具先隐藏
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
      // 取消所有后续工具
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
      // 执行指定的工具
      const toolIndex = message.pendingToolCalls.findIndex(tool => tool.id === toolId);
      if (toolIndex === -1) return;

      // 更新当前工具状态为执行中
      const updatedToolCalls = message.pendingToolCalls.map(tool => 
        tool.id === toolId ? { ...tool, status: 'executing' as const } : tool
      );

      updateMessageInline({ 
        pendingToolCalls: updatedToolCalls,
        toolCallStatus: 'executing'
      });
      
      // 模拟工具执行
      setTimeout(() => {
        const shouldFail = Math.random() < 0.2; // 20% 失败率
        
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
          // 成功执行，更新当前工具状态，并显示下一个工具
          const completedToolCalls = updatedToolCalls.map((tool, index) => {
            if (tool.id === toolId) {
              return { ...tool, status: 'completed' as const };
            }
            // 显示下一个工具
            if (index === toolIndex + 1) {
              return { ...tool, visible: true };
            }
            return tool;
          });

          // 检查是否所有工具都完成了
          const allCompleted = completedToolCalls.every(tool => 
            tool.status === 'completed' || tool.status === 'cancelled'
          );

          updateMessageInline({ 
            pendingToolCalls: completedToolCalls,
            toolCallStatus: allCompleted ? 'completed' : 'pending',
            currentToolIndex: allCompleted ? undefined : toolIndex + 1,
            content: allCompleted ? 
              message.content + '\n\n工具调用执行完成！基于获取到的信息，我现在可以为您提供详细的回答：\n\n通过搜索相关文档，我找到了与您问题相关的信息。经过内容分析，我理解了您的具体需求。最后，我为您生成了一个综合性的总结。\n\n如果您需要更多详细信息或有其他问题，请随时告诉我。' :
              message.content
          });
        }
      }, 2000);
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

  const handleOpenDebug = (serverId: string) => {
    setDebugServerId(serverId);
  };

  const handleCloseDebug = () => {
    setDebugServerId(null);
  };

  const handleServerHealthCheck = async (serverId: string) => {
    const result = await performHealthCheck(serverId);
    addServerMessage(serverId, {
      type: result ? 'response' : 'error',
      content: result ? 'Manual health check successful' : 'Manual health check failed',
      data: { manual: true, success: result }
    });
    return result;
  };

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

          {/* Server Status Monitor */}
          <div className="p-4 border-b">
            <ServerStatusMonitor
              servers={connectedServers}
              onHealthCheck={handleServerHealthCheck}
              onOpenDebug={handleOpenDebug}
              isHealthChecking={isHealthChecking}
            />
          </div>

          {/* Advanced Tools Panel Toggle */}
          <div className="p-4 border-b">
            <Button
              variant="ghost"
              onClick={() => setShowAdvancedPanel(!showAdvancedPanel)}
              className="w-full justify-start"
            >
              <Settings className="h-4 w-4 mr-2" />
              {showAdvancedPanel ? '隐藏高级工具' : '显示高级工具'}
            </Button>
          </div>

          {/* Tool Management Panel */}
          {showAdvancedPanel && (
            <div className="px-4 pb-4 border-b">
              <ToolManagementPanel
                servers={connectedServers}
                tools={tools}
                onToggleTool={toggleTool}
                onToggleAllToolsForServer={toggleAllToolsForServer}
                onToggleToolsByCategory={toggleToolsByCategory}
                onResetToDefault={resetToDefault}
                collapsed={false}
              />
            </div>
          )}

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

      {/* Server Debug Dialog */}
      <ServerDebugDialog
        open={!!debugServerId}
        onOpenChange={handleCloseDebug}
        serverInfo={debugServerId ? serverInfo[debugServerId] : null}
        messages={debugServerId ? serverMessages[debugServerId] || [] : []}
        onHealthCheck={() => debugServerId ? handleServerHealthCheck(debugServerId) : Promise.resolve(false)}
      />
    </div>
  );
};
