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
import { ChatSession, Message, MessageAttachment, SequentialToolExecution } from './types/chat';

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
        // In a real app, you would upload the file to a server here
        // For now, we'll just create a mock attachment object
        const attachment: MessageAttachment = {
          id: attachedFile.id,
          name: attachedFile.file.name,
          size: attachedFile.file.size,
          type: attachedFile.file.type,
          preview: attachedFile.preview,
          // url would be set after uploading to server
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
      // 生成待执行的工具列表
      const toolsToExecute = generatePendingToolCalls(content, selectedServers);
      
      // 创建顺序工具执行的AI消息
      const sequentialExecution: SequentialToolExecution = {
        tools: toolsToExecute,
        currentIndex: 0,
        completedTools: [],
        status: 'waiting_confirmation'
      };

      const aiMessage: Message = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        content: `准备执行 ${toolsToExecute.length} 个工具调用。需要您逐个确认每个工具的执行。`,
        timestamp: Date.now(),
        sequentialExecution
      };

      setCurrentMessages(prev => [...prev, aiMessage]);
      addMessage(sessionId, aiMessage);

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

  const generatePendingToolCalls = (userMessage: string, selectedServers: string[]) => {
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

    return toolsToUse.map(tool => ({
      toolName: tool.name,
      serverId: selectedServers[0],
      serverName: `服务器 ${selectedServers[0]}`,
      request: tool.request
    }));
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
        toolCallStatus: 'cancelled',
        content: '工具调用已被取消。'
      });
    } else if (action === 'run') {
      updateMessageInline({ 
        toolCallStatus: 'executing',
        content: '正在执行工具调用...'
      });
      
      // 模拟工具执行
      setTimeout(() => {
        updateMessageInline({ 
          toolCallStatus: 'completed',
          content: '工具执行完成！基于工具调用的结果，我已经为您处理了请求。以下是获取到的信息：\n\n根据 Figma 数据分析，该节点是一个设计组件，尺寸为 375x812，背景色为白色。这为前端开发提供了准确的设计规范。'
        });
      }, 2000);
    }
  };

  const handleConfirmTool = (messageId: string, toolIndex: number) => {
    const updateMessageInline = (updates: Partial<Message>) => {
      setCurrentMessages(prev => 
        prev.map(msg => msg.id === messageId ? { ...msg, ...updates } : msg)
      );
      if (currentSession) {
        updateMessage(currentSession.id, messageId, updates);
      }
    };

    // 获取当前消息
    const currentMessage = currentMessages.find(msg => msg.id === messageId);
    if (!currentMessage?.sequentialExecution) return;

    const { tools, currentIndex, completedTools } = currentMessage.sequentialExecution;
    const currentTool = tools[currentIndex];

    // 模拟工具执行
    const mockToolResult = {
      id: `tool-${Date.now()}`,
      toolName: currentTool.toolName,
      serverId: currentTool.serverId,
      serverName: currentTool.serverName,
      request: currentTool.request,
      response: { success: true, data: `${currentTool.toolName} 执行结果` },
      status: 'success' as const,
      timestamp: Date.now(),
      duration: 1500
    };

    const newCompletedTools = [...completedTools, mockToolResult];
    const nextIndex = currentIndex + 1;
    const isLastTool = nextIndex >= tools.length;

    const updatedSequentialExecution: SequentialToolExecution = {
      tools,
      currentIndex: nextIndex,
      completedTools: newCompletedTools,
      status: isLastTool ? 'completed' : 'waiting_confirmation'
    };

    updateMessageInline({
      sequentialExecution: updatedSequentialExecution,
      content: isLastTool 
        ? '所有工具调用已完成！基于执行结果，我已经为您处理了请求。'
        : `工具 ${currentTool.toolName} 执行完成。准备执行下一个工具。`
    });
  };

  const handleCancelExecution = (messageId: string) => {
    const updateMessageInline = (updates: Partial<Message>) => {
      setCurrentMessages(prev => 
        prev.map(msg => msg.id === messageId ? { ...msg, ...updates } : msg)
      );
      if (currentSession) {
        updateMessage(currentSession.id, messageId, updates);
      }
    };

    const currentMessage = currentMessages.find(msg => msg.id === messageId);
    if (!currentMessage?.sequentialExecution) return;

    const updatedSequentialExecution: SequentialToolExecution = {
      ...currentMessage.sequentialExecution,
      status: 'cancelled'
    };

    updateMessageInline({
      sequentialExecution: updatedSequentialExecution,
      content: '工具调用序列已被取消。'
    });
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
              isLoading={isSending}
              streamingMessageId={streamingMessageId}
              onUpdateMessage={handleToolAction}
              onConfirmTool={handleConfirmTool}
              onCancelExecution={handleCancelExecution}
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
