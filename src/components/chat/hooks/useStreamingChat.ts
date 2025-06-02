
import { useState, useCallback } from 'react';
import { Message, ToolInvocation, PendingToolCall } from '../types/chat';
import { useStreamingPhases } from './useStreamingPhases';

export const useStreamingChat = () => {
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const {
    activeStreamingMessageId,
    startPreToolsStreaming,
    handleToolsCompletion
  } = useStreamingPhases();

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

    const delay = Math.random() * 1000 + 500;
    await new Promise(resolve => setTimeout(resolve, delay));

    const success = Math.random() > 0.1;

    if (success) {
      invocation.status = 'success';
      invocation.duration = Math.round(delay);
      
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

  const generateAIResponseWithInlineTools = useCallback(async (
    userMessage: string,
    selectedServers: string[],
    sessionId: string,
    addMessage: (sessionId: string, message: Message) => void,
    updateMessage: (sessionId: string, messageId: string, updates: Partial<Message>) => void
  ): Promise<void> => {
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

    const messageId = `msg-${Date.now()}-ai`;
    setStreamingMessageId(messageId);

    if (toolsToUse.length > 0) {
      // 准备分阶段内容
      const preToolContent = `我理解您的请求"${userMessage}"。基于您的问题，我需要调用一些工具来获取相关信息，以便为您提供更准确和详细的回答。让我先分析一下您的需求...`;
      const postToolContent = '工具调用执行完成！基于获取到的信息，我现在可以为您提供详细的回答。根据工具调用的结果，我可以看到该节点是一个设计组件，包含了宽度375px、高度812px的白色背景框架。这些信息可以帮助您进行前端界面开发。';

      // 准备工具调用
      const pendingCalls: PendingToolCall[] = toolsToUse.map((tool, index) => ({
        id: `tool-${Date.now()}-${index}`,
        toolName: tool.name,
        serverId: selectedServers[0],
        serverName: `服务器 ${selectedServers[0]}`,
        request: tool.request,
        status: 'pending' as const,
        order: index,
        visible: index === 0 // 只有第一个工具可见
      }));

      // 开始分阶段流式输出
      startPreToolsStreaming(
        sessionId,
        messageId,
        addMessage,
        updateMessage,
        preToolContent,
        postToolContent,
        pendingCalls,
        () => {
          // 第一阶段完成后的回调 - 这里可以处理工具调用的初始化
          console.log('Pre-tools streaming completed, tools are now visible');
        }
      );
    } else {
      // 没有工具调用，直接生成普通AI回复
      const aiMessage: Message = {
        id: messageId,
        role: 'assistant',
        content: `我理解您的请求"${userMessage}"。这是一个模拟的AI回复，展示了如何处理不需要工具调用的对话。`,
        timestamp: Date.now()
      };

      setTimeout(() => {
        addMessage(sessionId, aiMessage);
        setStreamingMessageId(null);
      }, 1000);
    }
  }, [startPreToolsStreaming]);

  return {
    streamingMessageId: activeStreamingMessageId || streamingMessageId,
    generateAIResponseWithInlineTools,
    handleToolsCompletion
  };
};
