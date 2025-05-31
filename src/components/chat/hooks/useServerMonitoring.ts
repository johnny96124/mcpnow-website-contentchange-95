
import { useState, useEffect, useCallback } from 'react';
import { ServerConnectionInfo, ServerMessage } from '../types/chat';

export const useServerMonitoring = () => {
  const [serverInfo, setServerInfo] = useState<Record<string, ServerConnectionInfo>>({});
  const [serverMessages, setServerMessages] = useState<Record<string, ServerMessage[]>>({});
  const [isHealthChecking, setIsHealthChecking] = useState(false);

  // Simulate health check
  const performHealthCheck = useCallback(async (serverId: string) => {
    const startTime = Date.now();
    setServerInfo(prev => ({
      ...prev,
      [serverId]: {
        ...prev[serverId],
        status: 'starting'
      }
    }));

    // Simulate health check delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const responseTime = Date.now() - startTime;
    const isHealthy = Math.random() > 0.2; // 80% success rate

    setServerInfo(prev => ({
      ...prev,
      [serverId]: {
        ...prev[serverId],
        status: isHealthy ? 'connected' : 'disconnected',
        responseTime,
        lastHealthCheck: Date.now(),
        errorMessage: isHealthy ? undefined : '连接超时 - 服务器无响应'
      }
    }));

    // Add health check message to history
    const message: ServerMessage = {
      id: `msg-${Date.now()}`,
      timestamp: Date.now(),
      type: isHealthy ? 'response' : 'error',
      content: isHealthy ? 'Health check successful' : 'Health check failed - timeout',
      data: { responseTime, success: isHealthy }
    };

    setServerMessages(prev => ({
      ...prev,
      [serverId]: [...(prev[serverId] || []), message].slice(-50) // Keep last 50 messages
    }));

    return isHealthy;
  }, []);

  const performAllHealthChecks = useCallback(async () => {
    setIsHealthChecking(true);
    const serverIds = Object.keys(serverInfo);
    
    await Promise.all(serverIds.map(id => performHealthCheck(id)));
    setIsHealthChecking(false);
  }, [serverInfo, performHealthCheck]);

  // Auto health check every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHealthChecking && Object.keys(serverInfo).length > 0) {
        performAllHealthChecks();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isHealthChecking, serverInfo, performAllHealthChecks]);

  const initializeServer = useCallback((serverId: string, serverData: Partial<ServerConnectionInfo>) => {
    setServerInfo(prev => ({
      ...prev,
      [serverId]: {
        id: serverId,
        name: serverData.name || `Server ${serverId}`,
        type: serverData.type || 'STDIO',
        status: serverData.status || 'disconnected',
        configuration: serverData.configuration || {},
        ...serverData
      }
    }));

    if (!serverMessages[serverId]) {
      setServerMessages(prev => ({
        ...prev,
        [serverId]: []
      }));
    }
  }, [serverMessages]);

  const addServerMessage = useCallback((serverId: string, message: Omit<ServerMessage, 'id' | 'timestamp'>) => {
    const fullMessage: ServerMessage = {
      ...message,
      id: `msg-${Date.now()}-${Math.random()}`,
      timestamp: Date.now()
    };

    setServerMessages(prev => ({
      ...prev,
      [serverId]: [...(prev[serverId] || []), fullMessage].slice(-50)
    }));
  }, []);

  return {
    serverInfo,
    serverMessages,
    isHealthChecking,
    performHealthCheck,
    performAllHealthChecks,
    initializeServer,
    addServerMessage
  };
};
