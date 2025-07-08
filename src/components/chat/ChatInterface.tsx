import React, { useState, useEffect } from 'react';
import { MessageSquare, Bot, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ServerSelector } from './ServerSelector/ServerSelector';
import { ChatHistory } from './ChatHistory/ChatHistory';
import { MessageThread } from './MessageThread/MessageThread';
import { MessageInput } from './InputArea/MessageInput';
import { ConversationExport } from './ConversationExport';
import { useChatHistory } from './hooks/useChatHistory';
import { useMCPServers } from './hooks/useMCPServers';
import { useStreamingChat } from './hooks/useStreamingChat';
import { useToast } from '@/hooks/use-toast';
import { ChatSession, Message, MessageAttachment, PendingToolCall } from './types/chat';

interface AttachedFile {
  id: string;
  file: File;
  preview?: string;
}

interface ChatInterfaceProps {
  mode?: string;
  initialContext?: any;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  mode, 
  initialContext 
}) => {
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
  const { toast } = useToast();
  
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

  // Handle AI installation mode initialization
  useEffect(() => {
    if (mode === 'installation' && initialContext && connectedServers.length > 0) {
      // Initialize AI installation session
      const handleInitializeInstallation = async () => {
        const sessionId = createNewChat(selectedServers.length > 0 ? selectedServers : [connectedServers[0].id], selectedProfile);
        selectChat(sessionId.id);
        
        // Add only the initial welcome message
        const welcomeMsg: Message = {
          id: `msg-${Date.now()}-welcome`,
          role: 'assistant',
          content: `你好！我将协助你安装 **${initialContext.serverDefinition?.name}** 服务器。

**服务器信息：**
- 名称：${initialContext.serverDefinition?.name}
- 类型：${initialContext.serverDefinition?.type}
- 描述：${initialContext.serverDefinition?.description}

请确认是否要开始安装此服务器？回复"确认"或"开始"来继续安装过程。`,
          timestamp: Date.now()
        };
        
        addMessage(sessionId.id, welcomeMsg);
        setCurrentMessages([welcomeMsg]);

        toast({
          title: "AI安装助手已启动",
          description: `准备安装 ${initialContext.serverDefinition?.name}`,
        });
      };
      
      // Delay to ensure everything is initialized
      setTimeout(handleInitializeInstallation, 100);
    }
  }, [mode, initialContext, connectedServers, createNewChat, selectChat, addMessage, selectedServers, selectedProfile, toast]);

  const handleNewChat = () => {
    selectChat('');
    setCurrentMessages([]);
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
      // Check if this is installation mode and handle accordingly
      if (mode === 'installation' && initialContext) {
        await handleInstallationMessage(content, sessionId);
      } else {
        // Regular chat mode
        await handleRegularChatMessage(content, sessionId);
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

  const handleInstallationMessage = async (content: string, sessionId: string) => {
    const aiMessageId = `msg-${Date.now()}-ai`;
    const userInput = content.toLowerCase();
    
    // Installation flow responses based on user input
    let responseContent = '';
    let installationToolCalls: PendingToolCall[] = [];
    
    if (userInput.includes('开始') || userInput.includes('continue') || userInput.includes('确认')) {
      responseContent = `好的！开始安装 **${initialContext.serverDefinition?.name}**。

**第1步：选择连接模式**

根据您要安装的服务器类型，我推荐使用 **${initialContext.serverDefinition?.type}** 连接模式。

- ✅ **${initialContext.serverDefinition?.type}**: 最适合当前服务器的连接方式
- 📊 稳定性高，性能良好
- 🔧 配置简单

请确认是否使用 **${initialContext.serverDefinition?.type}** 模式？回复"确认连接模式"继续下一步。`;

    } else if (userInput.includes('确认连接模式') || userInput.includes('连接模式')) {
      responseContent = `太好了！连接模式已确认为 **${initialContext.serverDefinition?.type}**。

**第2步：检查依赖项**

现在我将检查您系统中的必要依赖项...`;

      installationToolCalls = [
        {
          id: `install-tool-${Date.now()}-1`,
          toolName: 'check_dependencies',
          serverId: 'system',
          serverName: '系统检查',
          request: { 
            serverType: initialContext.serverDefinition?.type,
            serverName: initialContext.serverDefinition?.name
          },
          status: 'pending' as const,
          order: 0,
          visible: true
        }
      ];

    } else if (userInput.includes('依赖') || userInput.includes('继续检查')) {
      responseContent = `依赖项检查完成！✅

**检查结果：**
- ✅ Node.js v18.0+ (已安装)
- ✅ npm v8.0+ (已安装)  
- ✅ ${initialContext.serverDefinition?.name} 包 (准备安装)

**第3步：配置API密钥**

请提供以下必要的API密钥：`;

      installationToolCalls = [
        {
          id: `install-tool-${Date.now()}-2`,
          toolName: 'configure_api_keys',
          serverId: 'config',
          serverName: '配置管理',
          request: { 
            serverName: initialContext.serverDefinition?.name,
            requiredKeys: ['API_KEY', 'SECRET_KEY']
          },
          status: 'pending' as const,
          order: 0,
          visible: true
        }
      ];

    } else if (userInput.includes('api') || userInput.includes('密钥') || userInput.includes('配置完成')) {
      responseContent = `API密钥配置完成！🔑

**第4步：创建服务器实例**

正在为您创建 ${initialContext.serverDefinition?.name} 实例...`;

      installationToolCalls = [
        {
          id: `install-tool-${Date.now()}-3`,
          toolName: 'create_server_instance',
          serverId: 'mcp-manager',
          serverName: 'MCP管理器',
          request: { 
            serverDefinition: initialContext.serverDefinition,
            connectionMode: initialContext.serverDefinition?.type,
            profile: 'default'
          },
          status: 'pending' as const,
          order: 0,
          visible: true
        }
      ];

    } else if (userInput.includes('验证') || userInput.includes('测试') || userInput.includes('完成实例')) {
      responseContent = `服务器实例创建成功！🎉

**第5步：验证连接**

正在验证服务器连接...`;

      installationToolCalls = [
        {
          id: `install-tool-${Date.now()}-4`,
          toolName: 'verify_server_connection',
          serverId: 'mcp-manager',
          serverName: 'MCP管理器',
          request: { 
            serverId: `${initialContext.serverDefinition?.name}-instance`,
            testConnection: true
          },
          status: 'pending' as const,
          order: 0,
          visible: true
        }
      ];

    } else if (userInput.includes('成功') || userInput.includes('完成')) {
      responseContent = `🎊 **安装完成！**

**${initialContext.serverDefinition?.name}** 已成功安装并添加到您的当前Profile中！

**安装摘要：**
- ✅ 连接模式：${initialContext.serverDefinition?.type}
- ✅ 依赖项检查：通过
- ✅ API密钥：已配置
- ✅ 服务器实例：已创建
- ✅ 连接验证：成功

您现在可以开始使用这个服务器了！返回主界面查看您的新服务器。`;

    } else {
      // Default response for unrecognized input
      responseContent = `我正在引导您完成 **${initialContext.serverDefinition?.name}** 的安装过程。

当前安装步骤包括：
1. 确认安装意图
2. 选择连接模式  
3. 检查依赖项
4. 配置API密钥
5. 创建实例
6. 验证连接

请回复相关关键词来继续安装，例如："开始"、"确认连接模式"、"继续检查"等。`;
    }

    const aiMessage: Message = {
      id: aiMessageId,
      role: 'assistant',
      content: '',
      timestamp: Date.now()
    };

    setCurrentMessages(prev => [...prev, aiMessage]);
    addMessage(sessionId, aiMessage);

    // Stream the response
    await simulateStreamingText(sessionId, aiMessageId, responseContent);
    
    // Add tool calls if any
    if (installationToolCalls.length > 0) {
      const messageWithTools: Partial<Message> = {
        pendingToolCalls: installationToolCalls,
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
  };

  const handleRegularChatMessage = async (content: string, sessionId: string) => {
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
  };

  // 专门用于基于编辑后的用户消息重新生成AI回复的函数
  const generateAIResponseForEditedMessage = async (content: string, sessionId: string) => {
    setIsSending(true);
    
    try {
      // 创建AI助手消息，开始流式生成
      const aiMessageId = `msg-${Date.now()}-ai`;
      const fullContent = `基于您修改后的请求"${content}"，我重新为您分析并提供回答。让我调用相关工具来获取最新的信息...`;

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
      
      updateMessage(sessionId, aiMessageId, messageWithTools);

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

  // 新增：处理消息编辑
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

  // 新增：处理消息编辑并重新生成
  const handleEditAndRegenerate = async (messageId: string, newContent: string) => {
    if (!currentSession) return;
    
    console.log('开始编辑并重新生成:', messageId, newContent);
    
    // 找到这条用户消息的索引
    const messageIndex = currentMessages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1) return;
    
    // 首先更新用户消息内容
    const updatedMessage: Partial<Message> = { content: newContent };
    setCurrentMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, ...updatedMessage } : msg
      )
    );
    updateMessage(currentSession.id, messageId, updatedMessage);
    
    // 删除这条用户消息之后的所有消息（包括AI回复）
    const messagesToDelete = currentMessages.slice(messageIndex + 1);
    console.log('要删除的消息:', messagesToDelete);
    
    // 先从当前状态中删除后续消息
    const messagesToKeep = currentMessages.slice(0, messageIndex + 1).map(msg => 
      msg.id === messageId ? { ...msg, content: newContent } : msg
    );
    setCurrentMessages(messagesToKeep);
    
    // 从数据库中删除后续消息
    messagesToDelete.forEach(msg => {
      deleteMessage(currentSession.id, msg.id);
    });
    
    toast({
      title: "正在重新生成",
      description: "基于修改后的消息重新生成AI回复",
    });
    
    // 等待一小段时间确保删除操作完成，然后重新生成AI回复
    setTimeout(() => {
      generateAIResponseForEditedMessage(newContent, currentSession.id);
    }, 100);
  };

  // 修复：处理消息重新生成
  const handleRegenerateMessage = (messageId: string) => {
    if (!currentSession) return;
    
    // 找到这条AI消息的索引
    const messageIndex = currentMessages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1) return;
    
    // 找到这条AI消息之前的最后一条用户消息
    const messagesBeforeAI = currentMessages.slice(0, messageIndex);
    const lastUserMessage = messagesBeforeAI.reverse().find(msg => msg.role === 'user');
    
    if (!lastUserMessage) return;
    
    // 删除从AI消息开始的所有后续消息
    const newMessages = currentMessages.slice(0, messageIndex);
    setCurrentMessages(newMessages);
    
    // 从数据库中也删除这些消息
    const messagesToDelete = currentMessages.slice(messageIndex);
    messagesToDelete.forEach(msg => {
      deleteMessage(currentSession.id, msg.id);
    });
    
    // 重新发送最后一条用户消息
    handleSendMessage(lastUserMessage.content);
    
    toast({
      title: "正在重新生成",
      description: "AI正在重新生成回答",
    });
  };

  // 新增：处理消息评分
  const handleRateMessage = (messageId: string, rating: 'positive' | 'negative' | null) => {
    if (!currentSession) return;
    
    const updatedMessage: Partial<Message> = { rating };
    setCurrentMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, ...updatedMessage } : msg
      )
    );
    updateMessage(currentSession.id, messageId, updatedMessage);
    
    console.log(`Message ${messageId} rated as:`, rating);
  };

  // 修正：处理删除消息 - 修改函数签名以匹配期望的参数
  const handleDeleteMessage = (messageId: string) => {
    if (!currentSession) return;
    deleteMessage(currentSession.id, messageId);
  };

  const simulateStreamingText = async (sessionId: string, messageId: string, fullContent: string) => {
    const words = fullContent.split(' ');
    let currentIndex = 0;
    
    return new Promise<void>((resolve) => {
      const streamInterval = setInterval(() => {
        if (currentIndex < words.length) {
          // Stream 2-3 words at a time for faster output
          const wordsToAdd = Math.min(3, words.length - currentIndex);
          const partialContent = words.slice(0, currentIndex + wordsToAdd).join(' ');
          
          setCurrentMessages(prev => 
            prev.map(msg => 
              msg.id === messageId ? { ...msg, content: partialContent } : msg
            )
          );
          
          if (currentSession) {
            updateMessage(sessionId, messageId, { content: partialContent });
          }
          
          currentIndex += wordsToAdd;
        } else {
          clearInterval(streamInterval);
          resolve();
        }
      }, 80); // Faster interval: 80ms for 2-3 words
    });
  };

  const generateSequentialToolCalls = (userMessage: string, selectedServers: string[]): PendingToolCall[] => {
    // 50% 几率使用多服务器调用
    const useMultipleServers = Math.random() < 0.5;
    const availableServers = selectedServers.length > 1 ? selectedServers : connectedServers.map(s => s.id);
    
    if (useMultipleServers && availableServers.length > 1) {
      // 多服务器场景：从不同服务器调用工具
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
        },
        {
          id: `tool-${Date.now()}-4`,
          toolName: 'generate_summary',
          serverId: availableServers[0],
          serverName: `服务器 ${availableServers[0]}`,
          request: { 
            source: 'multi_tool_analysis',
            context: userMessage
          },
          status: 'pending' as const,
          order: 3,
          visible: false
        }
      ];

      return tools;
    } else {
      // 单服务器场景（原有逻辑）
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
            {/* 新增：导出功能 */}
            <ConversationExport
              messages={currentMessages}
              sessionTitle={currentSession?.title}
            />
            
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-blue-500" />
              <span className="text-sm text-muted-foreground">AI助手</span>
            </div>
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
              onEditAndRegenerate={handleEditAndRegenerate}
              onRegenerateMessage={handleRegenerateMessage}
              onRateMessage={handleRateMessage}
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
