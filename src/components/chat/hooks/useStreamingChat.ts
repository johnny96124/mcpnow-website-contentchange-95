
import { useState, useCallback } from 'react';
import { Message, ToolInvocation, PendingToolCall, ServerDiscoveryCard } from '../types/chat';
import { findRelevantServers, shouldShowServerDiscovery } from '../ServerDiscovery/serverMatcher';

export const useStreamingChat = () => {
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);

  const simulateToolInvocation = useCallback(async (
    toolName: string, 
    serverId: string, 
    serverName: string,
    request: any
  ): Promise<ToolInvocation> => {
    const invocation: ToolInvocation = {
      id: `tool-${Date.now()}-${Math.random()}`,
      toolName,
      serverId,
      serverName,
      request,
      response: null,
      status: 'pending',
      timestamp: Date.now()
    };

    // 模拟工具调用延迟
    const delay = Math.random() * 1000 + 500; // 500-1500ms
    await new Promise(resolve => setTimeout(resolve, delay));

    // 模拟成功或失败
    const success = Math.random() > 0.1; // 90% 成功率

    if (success) {
      invocation.status = 'success';
      invocation.duration = Math.round(delay);
      
      // 根据工具类型生成模拟响应
      switch (toolName) {
        case 'get_figma_data':
          invocation.response = {
            metadata: {
              name: "Swap原型",
              type: "design",
              lastModified: "2024-01-15T10:30:00Z"
            },
            nodes: [
              { id: "frame1", type: "FRAME", name: "主页面" },
              { id: "button1", type: "INSTANCE", name: "提交按钮" }
            ]
          };
          break;
        case 'search_documents':
          invocation.response = {
            results: [
              { title: "相关文档1", score: 0.95 },
              { title: "相关文档2", score: 0.87 }
            ],
            total: 2
          };
          break;
        case 'read_file':
          invocation.response = {
            content: "文件内容示例...",
            size: 1024,
            encoding: "utf-8"
          };
          break;
        case 'search':
          invocation.response = {
            results: [
              { title: "搜索结果1", url: "https://example.com/1" },
              { title: "搜索结果2", url: "https://example.com/2" }
            ],
            total: 2
          };
          break;
        default:
          invocation.response = { success: true, data: "操作完成" };
      }
    } else {
      invocation.status = 'error';
      invocation.error = '工具调用失败：服务器连接超时';
    }

    return invocation;
  }, []);

  const generateServerDiscoveryCards = useCallback((userMessage: string): ServerDiscoveryCard[] => {
    console.log('检查服务器发现条件:', { userMessage, shouldShow: shouldShowServerDiscovery(userMessage) });
    
    if (!shouldShowServerDiscovery(userMessage)) {
      return [];
    }

    const matches = findRelevantServers(userMessage);
    console.log('找到的服务器匹配:', matches);
    
    return matches.map(match => ({
      id: `discovery-${Date.now()}-${match.server.id}`,
      serverId: match.server.id,
      serverName: match.server.name,
      serverType: match.server.type,
      description: match.server.description,
      matchedKeywords: match.matchedKeywords
    }));
  }, []);

  const generateAIResponseWithInlineTools = useCallback(async (
    userMessage: string,
    selectedServers: string[],
    sessionId: string,
    addMessage: (sessionId: string, message: Message) => void,
    updateMessage: (sessionId: string, messageId: string, updates: Partial<Message>) => void
  ): Promise<void> => {
    console.log('开始生成AI回复，用户消息:', userMessage);
    
    // 检查是否需要显示服务器发现卡片
    const discoveryCards = generateServerDiscoveryCards(userMessage);
    console.log('生成的服务器发现卡片:', discoveryCards);
    
    // 分析用户消息，决定使用哪些工具
    const toolsToUse: Array<{ name: string; request: any }> = [];

    // 更宽松的工具触发条件
    if (userMessage.toLowerCase().includes('figma') || 
        userMessage.toLowerCase().includes('设计') ||
        userMessage.toLowerCase().includes('原型')) {
      toolsToUse.push({
        name: 'get_figma_data',
        request: {
          nodeId: '630-5984',
          fileKey: 'NuM4uOURmTCLfqltMzDJH'
        }
      });
    }

    if (userMessage.toLowerCase().includes('文件') || 
        userMessage.toLowerCase().includes('读取') ||
        userMessage.toLowerCase().includes('查看')) {
      toolsToUse.push({
        name: 'read_file',
        request: { path: '/example/config.json' }
      });
    }

    if (userMessage.toLowerCase().includes('搜索') || 
        userMessage.toLowerCase().includes('查找') ||
        userMessage.toLowerCase().includes('文档')) {
      toolsToUse.push({
        name: 'search_documents',
        request: { query: userMessage.substring(0, 50) }
      });
    }

    // 为了测试，对任何消息都添加一个默认工具调用
    if (toolsToUse.length === 0) {
      toolsToUse.push({
        name: 'search_documents',
        request: { 
          query: userMessage.substring(0, 50),
          filters: { type: 'relevant' }
        }
      });
    }

    console.log('将要使用的工具:', toolsToUse);

    // 如果需要工具调用，先添加工具调用消息
    if (toolsToUse.length > 0) {
      const pendingCalls: PendingToolCall[] = toolsToUse.map((tool, index) => ({
        id: `tool-${Date.now()}-${index}`,
        toolName: tool.name,
        serverId: selectedServers[0] || 'default-server',
        serverName: `服务器 ${selectedServers[0] || 'Default'}`,
        request: tool.request,
        status: 'pending' as const,
        order: index,
        visible: index === 0 // 只有第一个工具可见
      }));

      const toolCallMessage: Message = {
        id: `msg-${Date.now()}-tool`,
        role: 'tool_call',
        content: `好的，我将使用 MCP 工具来处理您的请求"${userMessage}"。`,
        timestamp: Date.now(),
        pendingToolCalls: pendingCalls,
        toolCallStatus: 'pending',
        serverDiscoveryCards: discoveryCards.length > 0 ? discoveryCards : undefined
      };

      console.log('添加工具调用消息:', toolCallMessage);
      addMessage(sessionId, toolCallMessage);
      
      // 延迟添加AI响应
      setTimeout(() => {
        const aiMessageId = `msg-${Date.now()}-ai`;
        const aiMessage: Message = {
          id: aiMessageId,
          role: 'assistant',
          content: `根据您的请求"${userMessage}"，我已经调用了相关的MCP工具。工具执行完成后，我将为您提供详细的分析结果。`,
          timestamp: Date.now()
        };
        
        console.log('添加AI回复消息:', aiMessage);
        addMessage(sessionId, aiMessage);
      }, 1500);
      
    } else if (discoveryCards.length > 0) {
      // 如果没有工具调用但有服务器发现，添加带发现卡片的AI回复
      const messageId = `msg-${Date.now()}`;
      setStreamingMessageId(messageId);

      const aiMessage: Message = {
        id: messageId,
        role: 'assistant',
        content: `我理解您的请求"${userMessage}"。基于您的问题，我为您推荐了一些相关的 MCP 服务器，这些服务器可以帮助您完成相关任务。`,
        timestamp: Date.now(),
        serverDiscoveryCards: discoveryCards
      };

      console.log('添加带服务器发现的AI消息:', aiMessage);
      // 模拟流式响应延迟
      setTimeout(() => {
        addMessage(sessionId, aiMessage);
        setStreamingMessageId(null);
      }, 1000);
    } else {
      // 没有工具调用也没有服务器发现，直接生成普通AI回复
      const messageId = `msg-${Date.now()}`;
      setStreamingMessageId(messageId);

      const aiMessage: Message = {
        id: messageId,
        role: 'assistant',
        content: `我理解您的请求"${userMessage}"。这是一个模拟的AI回复，展示了如何处理不需要工具调用的对话。`,
        timestamp: Date.now()
      };

      console.log('添加普通AI回复:', aiMessage);
      // 模拟流式响应延迟
      setTimeout(() => {
        addMessage(sessionId, aiMessage);
        setStreamingMessageId(null);
      }, 1000);
    }
  }, [simulateToolInvocation, generateServerDiscoveryCards]);

  return {
    streamingMessageId,
    generateAIResponseWithInlineTools
  };
};
