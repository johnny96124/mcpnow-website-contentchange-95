
import { useState, useCallback } from 'react';
import { Message, ToolInvocation, PendingToolCall } from '../types/chat';

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

    // 如果需要工具调用，先添加工具调用消息
    if (toolsToUse.length > 0) {
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

      const toolCallMessage: Message = {
        id: `msg-${Date.now()}-tool`,
        role: 'tool_call',
        content: `好的，我将使用 MCP 工具来获取您提供的 Figma 链接中指定节点（node-id=${pendingCalls[0]?.request?.nodeId}）的数据。`,
        timestamp: Date.now(),
        pendingToolCalls: pendingCalls,
        toolCallStatus: 'pending'
      };

      addMessage(sessionId, toolCallMessage);
      
      // 监听工具调用状态变化，当状态变为 completed 时，添加 AI 回复
      // 这里我们模拟一个简单的延迟来等待用户操作
      // 在实际实现中，你需要监听 updateMessage 的调用
    } else {
      // 没有工具调用，直接生成普通AI回复
      const messageId = `msg-${Date.now()}`;
      setStreamingMessageId(messageId);

      const aiMessage: Message = {
        id: messageId,
        role: 'assistant',
        content: `我理解您的请求"${userMessage}"。这是一个模拟的AI回复，展示了如何处理不需要工具调用的对话。`,
        timestamp: Date.now()
      };

      // 模拟流式响应延迟
      setTimeout(() => {
        addMessage(sessionId, aiMessage);
        setStreamingMessageId(null);
      }, 1000);
    }
  }, [simulateToolInvocation]);

  return {
    streamingMessageId,
    generateAIResponseWithInlineTools
  };
};
