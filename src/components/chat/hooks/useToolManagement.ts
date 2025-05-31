
import { useState, useEffect, useCallback } from 'react';
import { MCPTool } from '../types/chat';

// Mock tool data - in real implementation, this would come from the servers
const mockTools: MCPTool[] = [
  { id: 'tool-1', name: 'get_figma_data', description: 'Retrieve Figma design data', serverId: 'server-1', enabled: true, category: 'design' },
  { id: 'tool-2', name: 'read_file', description: 'Read file contents', serverId: 'server-1', enabled: true, category: 'file' },
  { id: 'tool-3', name: 'search_documents', description: 'Search through documents', serverId: 'server-1', enabled: false, category: 'search' },
  { id: 'tool-4', name: 'analyze_content', description: 'Analyze content structure', serverId: 'server-2', enabled: true, category: 'analysis' },
  { id: 'tool-5', name: 'generate_summary', description: 'Generate content summary', serverId: 'server-2', enabled: true, category: 'generation' },
];

export const useToolManagement = () => {
  const [tools, setTools] = useState<MCPTool[]>(mockTools);

  const toggleTool = useCallback((toolId: string) => {
    setTools(prev => prev.map(tool => 
      tool.id === toolId ? { ...tool, enabled: !tool.enabled } : tool
    ));
  }, []);

  const toggleAllToolsForServer = useCallback((serverId: string, enabled: boolean) => {
    setTools(prev => prev.map(tool => 
      tool.serverId === serverId ? { ...tool, enabled } : tool
    ));
  }, []);

  const toggleToolsByCategory = useCallback((category: string, enabled: boolean) => {
    setTools(prev => prev.map(tool => 
      tool.category === category ? { ...tool, enabled } : tool
    ));
  }, []);

  const resetToDefault = useCallback(() => {
    setTools(mockTools);
  }, []);

  const getToolsByServer = useCallback((serverId: string) => {
    return tools.filter(tool => tool.serverId === serverId);
  }, [tools]);

  const getEnabledTools = useCallback(() => {
    return tools.filter(tool => tool.enabled);
  }, [tools]);

  return {
    tools,
    toggleTool,
    toggleAllToolsForServer,
    toggleToolsByCategory,
    resetToDefault,
    getToolsByServer,
    getEnabledTools
  };
};
