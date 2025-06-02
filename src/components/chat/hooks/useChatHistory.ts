
import { useState, useEffect, useCallback } from 'react';
import { ChatSession, Message } from '../types/chat';

const STORAGE_KEY = 'mcp-chat-history';
const MAX_SESSIONS = 10; // 限制最大会话数量
const MAX_MESSAGES_PER_SESSION = 50; // 限制每个会话的最大消息数

const saveToStorage = (data: ChatSession[]) => {
  try {
    // 清理旧数据以节省空间
    const cleanedData = data
      .slice(-MAX_SESSIONS) // 只保留最新的会话
      .map(session => ({
        ...session,
        messages: session.messages.slice(-MAX_MESSAGES_PER_SESSION) // 每个会话只保留最新的消息
      }));
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanedData));
    console.log('Chat history saved successfully');
  } catch (error) {
    console.error('Failed to save chat history:', error);
    
    // 如果存储失败，尝试清理更多数据
    try {
      const minimalData = data
        .slice(-5) // 只保留最新的5个会话
        .map(session => ({
          ...session,
          messages: session.messages.slice(-20) // 每个会话只保留最新的20条消息
        }));
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(minimalData));
      console.log('Chat history saved with reduced data');
    } catch (secondError) {
      console.error('Failed to save reduced chat history:', secondError);
      // 如果还是失败，清空存储
      localStorage.removeItem(STORAGE_KEY);
    }
  }
};

const loadFromStorage = (): ChatSession[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load chat history:', error);
    return [];
  }
};

export const useChatHistory = () => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(() => loadFromStorage());
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const currentSession = chatSessions.find(session => session.id === currentSessionId) || null;

  // 保存到 localStorage
  useEffect(() => {
    saveToStorage(chatSessions);
  }, [chatSessions]);

  const createNewChat = useCallback((selectedServers: string[], profileId?: string): ChatSession => {
    const now = Date.now();
    const newSession: ChatSession = {
      id: `session-${now}`,
      title: '新对话',
      createdAt: now,
      updatedAt: now,
      selectedServers,
      selectedProfile: profileId,
      messages: []
    };

    setChatSessions(prev => {
      const updated = [newSession, ...prev];
      console.log('创建新会话:', newSession);
      return updated;
    });
    
    setCurrentSessionId(newSession.id);
    return newSession;
  }, []);

  const selectChat = useCallback((sessionId: string) => {
    console.log('选择会话:', sessionId);
    setCurrentSessionId(sessionId);
  }, []);

  const addMessage = useCallback((sessionId: string, message: Message) => {
    console.log('添加消息到会话:', sessionId, message);
    setChatSessions(prev => prev.map(session => {
      if (session.id === sessionId) {
        const updatedSession = {
          ...session,
          messages: [...session.messages, message],
          updatedAt: Date.now(),
          title: session.messages.length === 0 && message.role === 'user' 
            ? message.content.substring(0, 30) + (message.content.length > 30 ? '...' : '')
            : session.title
        };
        console.log('会话更新:', updatedSession);
        return updatedSession;
      }
      return session;
    }));
  }, []);

  const updateMessage = useCallback((sessionId: string, messageId: string, updates: Partial<Message>) => {
    console.log('更新消息:', sessionId, messageId, updates);
    setChatSessions(prev => prev.map(session => {
      if (session.id === sessionId) {
        return {
          ...session,
          messages: session.messages.map(msg => 
            msg.id === messageId ? { ...msg, ...updates } : msg
          ),
          updatedAt: Date.now()
        };
      }
      return session;
    }));
  }, []);

  const deleteMessage = useCallback((sessionId: string, messageId: string) => {
    setChatSessions(prev => prev.map(session => {
      if (session.id === sessionId) {
        return {
          ...session,
          messages: session.messages.filter(msg => msg.id !== messageId),
          updatedAt: Date.now()
        };
      }
      return session;
    }));
  }, []);

  const deleteSession = useCallback((sessionId: string) => {
    setChatSessions(prev => prev.filter(session => session.id !== sessionId));
    if (currentSessionId === sessionId) {
      setCurrentSessionId(null);
    }
  }, [currentSessionId]);

  const renameSession = useCallback((sessionId: string, newTitle: string) => {
    setChatSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, title: newTitle, updatedAt: Date.now() }
        : session
    ));
  }, []);

  return {
    chatSessions,
    currentSession,
    createNewChat,
    selectChat,
    addMessage,
    updateMessage,
    deleteMessage,
    deleteSession,
    renameSession
  };
};
