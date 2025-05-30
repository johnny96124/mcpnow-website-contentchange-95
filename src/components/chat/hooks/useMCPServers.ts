
import { useState, useEffect } from 'react';
import { serverInstances, profiles } from '@/data/mockData';
import { MCPServer, MCPProfile } from '../types/chat';

export const useMCPServers = () => {
  const [servers, setServers] = useState<MCPServer[]>([]);
  const [mcpProfiles, setMcpProfiles] = useState<MCPProfile[]>([]);

  useEffect(() => {
    // Convert existing server instances to MCP server format
    const mcpServers: MCPServer[] = serverInstances.map(instance => ({
      id: instance.id,
      name: instance.name,
      type: instance.definitionId.includes('stdio') ? 'STDIO' : 'SSE',
      status: instance.enabled ? 'connected' : 'disconnected',
      enabled: instance.enabled
    }));

    // Convert existing profiles to MCP profile format
    const convertedProfiles: MCPProfile[] = profiles.map(profile => ({
      id: profile.id,
      name: profile.name,
      serverIds: profile.instances
    }));

    setServers(mcpServers);
    setMcpProfiles(convertedProfiles);
  }, []);

  const getConnectedServers = () => {
    return servers.filter(server => server.status === 'connected');
  };

  const getServerById = (id: string) => {
    return servers.find(server => server.id === id);
  };

  const getProfileById = (id: string) => {
    return mcpProfiles.find(profile => profile.id === id);
  };

  return {
    servers,
    profiles: mcpProfiles,
    getConnectedServers,
    getServerById,
    getProfileById
  };
};
