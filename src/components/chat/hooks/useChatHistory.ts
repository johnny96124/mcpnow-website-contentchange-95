import { useState, useEffect, useCallback } from 'react';
import { ChatSession, Message, ToolInvocation } from '../types/chat';

const STORAGE_KEY = 'mcp-chat-history';

export const useChatHistory = () => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load chat history from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const sessions = JSON.parse(stored);
        setChatSessions(sessions);
      } catch (error) {
        console.error('Failed to load chat history:', error);
      }
    }
  }, []);

  // Save chat history to localStorage
  const saveChatHistory = useCallback((sessions: ChatSession[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch (error) {
      console.error('Failed to save chat history:', error);
    }
  }, []);

  const generateTitle = (firstMessage: string): string => {
    const maxLength = 50;
    if (firstMessage.length <= maxLength) {
      return firstMessage;
    }
    return firstMessage.substring(0, maxLength) + '...';
  };

  const createNewChat = useCallback((selectedServers: string[], selectedProfile?: string): ChatSession => {
    const newSession: ChatSession = {
      id: `chat-${Date.now()}`,
      title: 'New Chat',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      selectedServers,
      selectedProfile,
      messages: []
    };

    setChatSessions(prev => {
      const updated = [newSession, ...prev];
      saveChatHistory(updated);
      return updated;
    });

    return newSession;
  }, [saveChatHistory]);

  const selectChat = useCallback((sessionId: string) => {
    const session = chatSessions.find(s => s.id === sessionId);
    setCurrentSession(session || null);
  }, [chatSessions]);

  const updateSession = useCallback((sessionId: string, updates: Partial<ChatSession>) => {
    setChatSessions(prev => {
      const updated = prev.map(session => 
        session.id === sessionId 
          ? { ...session, ...updates, updatedAt: Date.now() }
          : session
      );
      saveChatHistory(updated);
      return updated;
    });

    // 如果更新的是当前会话，也要更新 currentSession
    setCurrentSession(prev => {
      if (prev && prev.id === sessionId) {
        return { ...prev, ...updates, updatedAt: Date.now() };
      }
      return prev;
    });
  }, [saveChatHistory]);

  const renameSession = useCallback((sessionId: string, newTitle: string) => {
    updateSession(sessionId, { title: newTitle });
  }, [updateSession]);

  const addMessage = useCallback((sessionId: string, message: Message) => {
    console.log('Adding message to session:', sessionId, message);
    
    setChatSessions(prev => {
      const session = prev.find(s => s.id === sessionId);
      if (!session) {
        console.error('Session not found:', sessionId);
        return prev;
      }

      const updatedMessages = [...session.messages, message];
      const updates: Partial<ChatSession> = {
        messages: updatedMessages
      };

      // Update title if this is the first user message
      if (message.role === 'user' && session.messages.length === 0) {
        updates.title = generateTitle(message.content);
      }

      const updatedSession = { ...session, ...updates, updatedAt: Date.now() };
      const updated = prev.map(s => s.id === sessionId ? updatedSession : s);
      
      saveChatHistory(updated);
      return updated;
    });

    // 同时更新 currentSession
    setCurrentSession(prev => {
      if (prev && prev.id === sessionId) {
        const updatedMessages = [...prev.messages, message];
        const updates: Partial<ChatSession> = {
          messages: updatedMessages
        };

        // Update title if this is the first user message
        if (message.role === 'user' && prev.messages.length === 0) {
          updates.title = generateTitle(message.content);
        }

        return { ...prev, ...updates, updatedAt: Date.now() };
      }
      return prev;
    });
  }, [saveChatHistory, generateTitle]);

  const updateMessage = useCallback((sessionId: string, messageId: string, updates: Partial<Message>) => {
    console.log('Updating message:', messageId, updates);
    
    setChatSessions(prev => {
      const session = prev.find(s => s.id === sessionId);
      if (!session) {
        console.error('Session not found:', sessionId);
        return prev;
      }

      const updatedMessages = session.messages.map(msg => 
        msg.id === messageId ? { ...msg, ...updates } : msg
      );

      const updatedSession = { 
        ...session, 
        messages: updatedMessages, 
        updatedAt: Date.now() 
      };
      
      const updated = prev.map(s => s.id === sessionId ? updatedSession : s);
      saveChatHistory(updated);
      return updated;
    });

    // 同时更新 currentSession
    setCurrentSession(prev => {
      if (prev && prev.id === sessionId) {
        const updatedMessages = prev.messages.map(msg => 
          msg.id === messageId ? { ...msg, ...updates } : msg
        );
        return { ...prev, messages: updatedMessages, updatedAt: Date.now() };
      }
      return prev;
    });
  }, [saveChatHistory]);

  const simulateAIResponse = useCallback(async (userMessage: string, selectedServers: string[]): Promise<Message> => {
    // Simulate AI processing with tool invocations
    await new Promise(resolve => setTimeout(resolve, 1000));

    const toolInvocations: ToolInvocation[] = [];
    
    // Simulate some tool calls based on message content
    if (userMessage.toLowerCase().includes('file') || userMessage.toLowerCase().includes('read')) {
      toolInvocations.push({
        id: `tool-${Date.now()}-1`,
        toolName: 'read_file',
        serverId: selectedServers[0],
        serverName: `Server ${selectedServers[0]}`,
        request: { path: '/example/file.txt' },
        response: { content: 'File content example...' },
        status: 'success',
        duration: 250,
        timestamp: Date.now()
      });
    }

    if (userMessage.toLowerCase().includes('search') || userMessage.toLowerCase().includes('find')) {
      toolInvocations.push({
        id: `tool-${Date.now()}-2`,
        toolName: 'search',
        serverId: selectedServers[0],
        serverName: `Server ${selectedServers[0]}`,
        request: { query: 'search terms' },
        response: { results: ['Result 1', 'Result 2'] },
        status: 'success',
        duration: 500,
        timestamp: Date.now()
      });
    }

    return {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: `I understand you're asking about "${userMessage}". Based on the available MCP tools, I've processed your request and here's what I found:\n\n${toolInvocations.length > 0 ? 'I used several tools to help answer your question. ' : ''}This is a simulated AI response that would incorporate the results from any MCP tool invocations.`,
      timestamp: Date.now(),
      toolInvocations: toolInvocations.length > 0 ? toolInvocations : undefined
    };
  }, []);

  const sendMessage = useCallback(async (sessionId: string, content: string, selectedServers: string[]) => {
    if (!currentSession) return;

    setIsLoading(true);

    // Add user message
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content,
      timestamp: Date.now()
    };

    addMessage(sessionId, userMessage);

    try {
      // Simulate AI response
      const aiMessage = await simulateAIResponse(content, selectedServers);
      addMessage(sessionId, aiMessage);
    } catch (error) {
      console.error('Failed to get AI response:', error);
      const errorMessage: Message = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: Date.now()
      };
      addMessage(sessionId, errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [currentSession, addMessage, simulateAIResponse]);

  const deleteSession = useCallback((sessionId: string) => {
    setChatSessions(prev => {
      const updated = prev.filter(session => session.id !== sessionId);
      saveChatHistory(updated);
      return updated;
    });

    // If deleting current session, clear it
    setCurrentSession(prev => {
      if (prev && prev.id === sessionId) {
        return null;
      }
      return prev;
    });
  }, [saveChatHistory]);

  const deleteMessage = useCallback((sessionId: string, messageId: string) => {
    setChatSessions(prev => {
      const session = prev.find(s => s.id === sessionId);
      if (!session) {
        console.error('Session not found:', sessionId);
        return prev;
      }

      const updatedMessages = session.messages.filter(msg => msg.id !== messageId);
      const updatedSession = { 
        ...session, 
        messages: updatedMessages, 
        updatedAt: Date.now() 
      };
      
      const updated = prev.map(s => s.id === sessionId ? updatedSession : s);
      saveChatHistory(updated);
      return updated;
    });

    // Also update currentSession
    setCurrentSession(prev => {
      if (prev && prev.id === sessionId) {
        const updatedMessages = prev.messages.filter(msg => msg.id !== messageId);
        return { ...prev, messages: updatedMessages, updatedAt: Date.now() };
      }
      return prev;
    });
  }, [saveChatHistory]);

  return {
    chatSessions,
    currentSession,
    isLoading,
    createNewChat,
    selectChat,
    updateSession,
    renameSession,
    addMessage,
    updateMessage,
    deleteSession,
    deleteMessage
  };
};
