
import { useState, useCallback } from 'react';
import { Message, PendingToolCall } from '../types/chat';

export const useStreamingPhases = () => {
  const [activeStreamingMessageId, setActiveStreamingMessageId] = useState<string | null>(null);
  
  const createPhasedMessage = useCallback((
    messageId: string,
    preToolContent: string,
    postToolContent: string,
    toolCalls: PendingToolCall[]
  ): Message => {
    return {
      id: messageId,
      role: 'assistant',
      content: '', // 将被 contentPhases 替代
      timestamp: Date.now(),
      contentPhases: [preToolContent, postToolContent],
      currentPhase: 0,
      toolCallsPhase: 0, // 工具调用在第0阶段之后显示
      streamingPhase: 'pre-tools',
      isStreamingPhase: true,
      pendingToolCalls: toolCalls,
      toolCallStatus: 'pending'
    };
  }, []);

  const startPreToolsStreaming = useCallback((
    sessionId: string,
    messageId: string,
    addMessage: (sessionId: string, message: Message) => void,
    updateMessage: (sessionId: string, messageId: string, updates: Partial<Message>) => void,
    preToolContent: string,
    postToolContent: string,
    toolCalls: PendingToolCall[],
    onPhaseComplete?: () => void
  ) => {
    setActiveStreamingMessageId(messageId);
    
    const message = createPhasedMessage(messageId, preToolContent, postToolContent, toolCalls);
    addMessage(sessionId, message);

    // 模拟第一阶段流式输出
    let charIndex = 0;
    const streamInterval = setInterval(() => {
      if (charIndex < preToolContent.length) {
        charIndex++;
      } else {
        clearInterval(streamInterval);
        // 第一阶段完成，转到工具调用阶段
        updateMessage(sessionId, messageId, {
          streamingPhase: 'tools',
          isStreamingPhase: false
        });
        setActiveStreamingMessageId(null);
        onPhaseComplete?.();
      }
    }, 30);
  }, [createPhasedMessage]);

  const startPostToolsStreaming = useCallback((
    sessionId: string,
    messageId: string,
    updateMessage: (sessionId: string, messageId: string, updates: Partial<Message>) => void,
    onComplete?: () => void
  ) => {
    setActiveStreamingMessageId(messageId);
    
    // 开始第二阶段流式输出
    updateMessage(sessionId, messageId, {
      currentPhase: 1,
      streamingPhase: 'post-tools',
      isStreamingPhase: true
    });

    // 模拟第二阶段流式输出完成
    setTimeout(() => {
      updateMessage(sessionId, messageId, {
        streamingPhase: 'completed',
        isStreamingPhase: false
      });
      setActiveStreamingMessageId(null);
      onComplete?.();
    }, 2000);
  }, []);

  const handleToolsCompletion = useCallback((
    sessionId: string,
    messageId: string,
    updateMessage: (sessionId: string, messageId: string, updates: Partial<Message>) => void
  ) => {
    // 所有工具调用完成后，开始第二阶段内容流式输出
    startPostToolsStreaming(sessionId, messageId, updateMessage);
  }, [startPostToolsStreaming]);

  return {
    activeStreamingMessageId,
    createPhasedMessage,
    startPreToolsStreaming,
    startPostToolsStreaming,
    handleToolsCompletion
  };
};
