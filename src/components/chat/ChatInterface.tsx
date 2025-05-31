
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
import { ChatSession, Message } from './types/chat';

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
    // Save current messages to session if any exist
    if (currentMessages.length > 0 && !currentSession) {
      const newSession = createNewChat(selectedServers, selectedProfile);
      // Add all current messages to the new session
      currentMessages.forEach(message => {
        addMessage(newSession.id, message);
      });
      selectChat(newSession.id);
    } else {
      // Clear current messages and create empty state
      setCurrentMessages([]);
      selectChat(''); // Clear current session
    }
  };

  const handleSendMessage = async (content: string) => {
    if (selectedServers.length === 0 || isSending) return;
    
    console.log('Sending message:', content);
    setIsSending(true);

    // 立即添加用户消息到当前显示
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content,
      timestamp: Date.now()
    };

    console.log('Adding user message to current display:', userMessage);
    setCurrentMessages(prev => [...prev, userMessage]);

    // 如果有当前会话，也添加到会话中
    if (currentSession) {
      addMessage(currentSession.id, userMessage);
    }

    try {
      // 生成AI回复（内联工具调用）
      console.log('Generating AI response with inline tools...');
      await generateAIResponseWithInlineToolsInline(content, selectedServers);
    } catch (error) {
      console.error('Failed to get AI response:', error);
      const errorMessage: Message = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: '抱歉，处理您的请求时遇到了错误，请稍后重试。',
        timestamp: Date.now()
      };
      setCurrentMessages(prev => [...prev, errorMessage]);
      if (currentSession) {
        addMessage(currentSession.id, errorMessage);
      }
    } finally {
      setIsSending(false);
    }
  };

  const generateAIResponseWithInlineToolsInline = async (
    userMessage: string,
    selectedServers: string[]
  ) => {
    // 分析用户消息，决定使用哪些工具
    const toolsToUse: Array<{ name: string; request: any }> = [];

    if (userMessage.toLowerCase().includes('figma') || userMessage.toLowerCase().includes('设计')) {
      toolsToUse.push({
        name: 'get_figma_data',
        request: {
          nodeId: '630-5984',
          fileKey: 'NuM4uOURmTCLfqltMzDJH'
        }
      });
    }

    if (userMessage.toLowerCase().includes('文件') || userMessage.toLowerCase().includes('读取')) {
      toolsToUse.push({
        name: 'read_file',
        request: { path: '/example/config.json' }
      });
    }

    if (userMessage.toLowerCase().includes('搜索') || userMessage.toLowerCase().includes('查找')) {
      toolsToUse.push({
        name: 'search',
        request: { query: userMessage.substring(0, 50) }
      });
    }

    // 总是添加工具调用，即使没有特定工具
    if (toolsToUse.length === 0) {
      toolsToUse.push({
        name: 'analyze_request',
        request: { message: userMessage }
      });
    }

    const pendingCalls = toolsToUse.map(tool => ({
      toolName: tool.name,
      serverId: selectedServers[0],
      serverName: `服务器 ${selectedServers[0]}`,
      request: tool.request
    }));

    const toolCallMessage: Message = {
      id: `msg-${Date.now()}-tool`,
      role: 'tool_call',
      content: `好的，我将使用 MCP 工具来处理您的请求。`,
      timestamp: Date.now(),
      pendingToolCalls: pendingCalls,
      toolCallStatus: 'pending'
    };

    setCurrentMessages(prev => [...prev, toolCallMessage]);
    if (currentSession) {
      addMessage(currentSession.id, toolCallMessage);
    }
  };

  const handleToolAction = (messageId: string, action: 'run' | 'cancel') => {
    const updateMessageInline = (updates: Partial<Message>) => {
      setCurrentMessages(prev => 
        prev.map(msg => msg.id === messageId ? { ...msg, ...updates } : msg)
      );
      if (currentSession) {
        updateMessage(currentSession.id, messageId, updates);
      }
    };

    if (action === 'cancel') {
      updateMessageInline({ 
        toolCallStatus: 'rejected'
      });
    } else if (action === 'run') {
      updateMessageInline({ 
        toolCallStatus: 'executing'
      });
      // 模拟工具执行
      setTimeout(() => {
        updateMessageInline({ 
          toolCallStatus: 'completed'
        });
        
        // 添加AI回复
        const aiMessage: Message = {
          id: `msg-${Date.now()}-ai`,
          role: 'assistant',
          content: '工具执行完成！基于工具调用的结果，我已经为您处理了请求。',
          timestamp: Date.now()
        };
        setCurrentMessages(prev => [...prev, aiMessage]);
        if (currentSession) {
          addMessage(currentSession.id, aiMessage);
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
              isLoading={isSending}
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
