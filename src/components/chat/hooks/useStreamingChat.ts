
import { useState, useCallback } from 'react';
import { Message, ToolInvocation } from '../types/chat';

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

  const simulateAIResponseWithTools = useCallback(async (
    userMessage: string,
    selectedServers: string[]
  ): Promise<Message> => {
    const messageId = `msg-${Date.now()}`;
    setStreamingMessageId(messageId);

    // 分析用户消息，决定使用哪些工具
    const toolsToUse: Array<{ name: string; request: any }> = [];

    if (userMessage.toLowerCase().includes('figma') || userMessage.toLowerCase().includes('设计')) {
      toolsToUse.push({
        name: 'get_figma_data',
        request: {
          nodeId: '177-3082',
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

    // 如果没有匹配的工具，添加一个默认工具
    if (toolsToUse.length === 0) {
      toolsToUse.push({
        name: 'analyze_content',
        request: { content: userMessage }
      });
    }

    // 执行工具调用
    const toolInvocations: ToolInvocation[] = [];
    for (const tool of toolsToUse) {
      const invocation = await simulateToolInvocation(
        tool.name,
        selectedServers[0],
        `服务器 ${selectedServers[0]}`,
        tool.request
      );
      toolInvocations.push(invocation);
    }

    // 基于工具结果生成AI回复
    let aiResponse = `我已经处理了您的请求"${userMessage}"。\n\n`;
    
    if (toolInvocations.some(t => t.status === 'success')) {
      aiResponse += '通过调用MCP工具，我获取了以下信息：\n\n';
      
      toolInvocations.forEach(invocation => {
        if (invocation.status === 'success') {
          switch (invocation.toolName) {
            case 'get_figma_data':
              aiResponse += `🎨 **Figma设计分析**：\n获取到设计文件"${invocation.response?.metadata?.name}"，包含${invocation.response?.nodes?.length || 0}个设计节点。\n\n`;
              break;
            case 'read_file':
              aiResponse += `📁 **文件读取**：\n成功读取文件内容，大小为${invocation.response?.size || 0}字节。\n\n`;
              break;
            case 'search':
              aiResponse += `🔍 **搜索结果**：\n找到${invocation.response?.total || 0}个相关结果。\n\n`;
              break;
            default:
              aiResponse += `⚙️ **${invocation.toolName}**：\n操作已成功完成。\n\n`;
          }
        }
      });
    }

    aiResponse += '如果您需要更多信息或有其他问题，请随时告诉我。';

    const message: Message = {
      id: messageId,
      role: 'assistant',
      content: aiResponse,
      timestamp: Date.now(),
      toolInvocations
    };

    setStreamingMessageId(null);
    return message;
  }, [simulateToolInvocation]);

  return {
    streamingMessageId,
    simulateAIResponseWithTools
  };
};
