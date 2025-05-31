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
import { ChatSession, Message, MessageAttachment } from './types/chat';

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
  const [pendingToolQueue, setPendingToolQueue] = useState<any[]>([]);

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
    setPendingToolQueue([]); // 清空待执行工具队列
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
      
      // 文字生成完成后，开始逐个添加工具调用消息
      const toolsToCall = generateToolsForMessage(content, selectedServers);
      setPendingToolQueue(toolsToCall);
      
      // 添加第一个工具调用消息
      if (toolsToCall.length > 0) {
        await addNextToolCall(sessionId, toolsToCall[0], 0);
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

  const addNextToolCall = async (sessionId: string, toolCall: any, index: number) => {
    // 添加工具调用消息
    const toolMessageId = `msg-${Date.now()}-tool-${index}`;
    const toolMessage: Message = {
      id: toolMessageId,
      role: 'tool_call',
      content: `我需要调用 ${toolCall.toolName} 工具来${getToolDescription(toolCall.toolName)}。`,
      timestamp: Date.now(),
      pendingToolCalls: [toolCall],
      toolCallStatus: 'pending'
    };

    setCurrentMessages(prev => [...prev, toolMessage]);
    addMessage(sessionId, toolMessage);
  };

  const getToolDescription = (toolName: string): string => {
    const descriptions = {
      'search_documents': '搜索相关文档',
      'analyze_content': '分析内容',
      'generate_summary': '生成摘要',
      'get_figma_data': '获取Figma设计数据'
    };
    return descriptions[toolName] || '执行相关操作';
  };

  const generateToolsForMessage = (userMessage: string, selectedServers: string[]) => {
    const tools = [];
    
    // 根据用户消息内容决定需要调用哪些工具
    if (userMessage.toLowerCase().includes('figma') || userMessage.toLowerCase().includes('设计')) {
      tools.push({
        toolName: 'get_figma_data',
        serverId: selectedServers[0],
        serverName: `服务器 ${selectedServers[0]}`,
        request: { 
          nodeId: '630-5984',
          fileKey: 'NuM4uOURmTCLfqltMzDJH'
        }
      });
    }

    if (userMessage.toLowerCase().includes('搜索') || userMessage.toLowerCase().includes('查找')) {
      tools.push({
        toolName: 'search_documents',
        serverId: selectedServers[0],
        serverName: `服务器 ${selectedServers[0]}`,
        request: { 
          query: userMessage.substring(0, 50),
          filters: { type: 'relevant' }
        }
      });
    }

    if (userMessage.toLowerCase().includes('分析') || userMessage.toLowerCase().includes('理解')) {
      tools.push({
        toolName: 'analyze_content',
        serverId: selectedServers[0],
        serverName: `服务器 ${selectedServers[0]}`,
        request: { 
          content: userMessage,
          analysis_type: 'comprehensive'
        }
      });
    }

    // 如果没有特定的工具需求，默认使用搜索和分析
    if (tools.length === 0) {
      tools.push(
        {
          toolName: 'search_documents',
          serverId: selectedServers[0],
          serverName: `服务器 ${selectedServers[0]}`,
          request: { 
            query: userMessage.substring(0, 50),
            filters: { type: 'relevant' }
          }
        },
        {
          toolName: 'analyze_content',
          serverId: selectedServers[0],
          serverName: `服务器 ${selectedServers[0]}`,
          request: { 
            content: userMessage,
            analysis_type: 'comprehensive'
          }
        }
      );
    }

    return tools;
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
      }, 25); // 从50ms减少到25ms，双倍速度
    });
  };

  const handleToolAction = async (messageId: string, action: 'run' | 'cancel') => {
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
      
      // 取消后不再添加后续工具调用，清空队列
      setPendingToolQueue([]);
    } else if (action === 'run') {
      updateMessageInline({ 
        toolCallStatus: 'executing',
        content: '正在执行工具调用，请稍候...'
      });
      
      // 模拟工具执行
      setTimeout(async () => {
        updateMessageInline({ 
          toolCallStatus: 'completed',
          content: '工具调用执行完成！获取到了相关信息。'
        });

        // 检查是否还有待执行的工具
        const currentToolIndex = pendingToolQueue.findIndex(tool => 
          currentMessages.some(msg => 
            msg.pendingToolCalls?.some(call => call.toolName === tool.toolName)
          )
        );
        
        const nextToolIndex = currentToolIndex + 1;
        if (nextToolIndex < pendingToolQueue.length && currentSession) {
          // 等待一小段时间后添加下一个工具调用
          setTimeout(() => {
            addNextToolCall(currentSession.id, pendingToolQueue[nextToolIndex], nextToolIndex);
          }, 1000);
        } else if (nextToolIndex >= pendingToolQueue.length && currentSession) {
          // 所有工具都执行完毕，添加最终的AI回复
          setTimeout(() => {
            const finalMessageId = `msg-${Date.now()}-final`;
            const finalMessage: Message = {
              id: finalMessageId,
              role: 'assistant',
              content: '基于所有工具调用的结果，我现在可以为您提供完整的回答：\n\n通过多个工具的协作，我已经收集了所需的信息。如果您需要更多详细信息或有其他问题，请随时告诉我。',
              timestamp: Date.now()
            };
            
            setCurrentMessages(prev => [...prev, finalMessage]);
            addMessage(currentSession.id, finalMessage);
            setPendingToolQueue([]); // 清空队列
          }, 1000);
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

const generatePendingToolCalls = (userMessage: string, selectedServers: string[]) => {
  // 生成3个工具调用示例
  return [
    {
      toolName: 'search_documents',
      serverId: selectedServers[0],
      serverName: `服务器 ${selectedServers[0]}`,
      request: { 
        query: userMessage.substring(0, 50),
        filters: { type: 'relevant' }
      }
    },
    {
      toolName: 'analyze_content',
      serverId: selectedServers[0],
      serverName: `服务器 ${selectedServers[0]}`,
      request: { 
        content: userMessage,
        analysis_type: 'comprehensive'
      }
    },
    {
      toolName: 'generate_summary',
      serverId: selectedServers[0],
      serverName: `服务器 ${selectedServers[0]}`,
      request: { 
        source: 'user_query',
        context: userMessage
      }
    }
  ];
};
