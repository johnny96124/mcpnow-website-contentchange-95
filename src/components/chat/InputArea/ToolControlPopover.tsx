
import React, { useState } from 'react';
import { Settings, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MCPServer } from '../types/chat';

interface Tool {
  id: string;
  name: string;
  enabled: boolean;
  category?: string;
}

interface ToolControlPopoverProps {
  servers: MCPServer[];
  selectedServers: string[];
  disabled?: boolean;
}

export const ToolControlPopover: React.FC<ToolControlPopoverProps> = ({
  servers,
  selectedServers,
  disabled = false
}) => {
  const [expandedServers, setExpandedServers] = useState<Set<string>>(new Set());
  const [toolStates, setToolStates] = useState<Record<string, boolean>>({});

  // Mock tool data - in real implementation, this would come from the MCP servers
  const getServerTools = (serverId: string): Tool[] => {
    const mockTools: Record<string, Tool[]> = {
      'filesystem': [
        { id: 'read_file', name: 'read_file', enabled: true },
        { id: 'write_file', name: 'write_file', enabled: true },
        { id: 'list_directory', name: 'list_directory', enabled: true }
      ],
      'mcp-now': [
        { id: 'echo', name: 'echo', enabled: true },
        { id: 'add', name: 'add', enabled: true },
        { id: 'printEnv', name: 'printEnv', enabled: true },
        { id: 'longRunningOperation', name: 'longRunningOperation', enabled: true },
        { id: 'sampleLLM', name: 'sampleLLM', enabled: true },
        { id: 'getTinyImage', name: 'getTinyImage', enabled: true },
        { id: 'annotatedMessage', name: 'annotatedMessage', enabled: true },
        { id: 'getResourceReference', name: 'getResourceReference', enabled: true },
        { id: 'get_figma_data', name: 'get_figma_data', enabled: true },
        { id: 'download_figma_images', name: 'download_figma_images', enabled: true }
      ]
    };
    return mockTools[serverId] || [];
  };

  const toggleServer = (serverId: string) => {
    setExpandedServers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(serverId)) {
        newSet.delete(serverId);
      } else {
        newSet.add(serverId);
      }
      return newSet;
    });
  };

  const toggleTool = (serverId: string, toolId: string) => {
    const key = `${serverId}-${toolId}`;
    setToolStates(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const toggleAllServerTools = (serverId: string, enabled: boolean) => {
    const tools = getServerTools(serverId);
    const updates: Record<string, boolean> = {};
    tools.forEach(tool => {
      updates[`${serverId}-${tool.id}`] = enabled;
    });
    setToolStates(prev => ({ ...prev, ...updates }));
  };

  const getToolState = (serverId: string, toolId: string): boolean => {
    const key = `${serverId}-${toolId}`;
    return toolStates[key] ?? true; // Default to enabled
  };

  const getEnabledToolCount = (serverId: string): number => {
    const tools = getServerTools(serverId);
    return tools.filter(tool => getToolState(serverId, tool.id)).length;
  };

  const selectedServerList = servers.filter(server => selectedServers.includes(server.id));

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          disabled={disabled || selectedServers.length === 0}
          title="工具控制"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium">工具控制</h4>
            <Badge variant="secondary" className="text-xs">
              {selectedServers.length} 个服务器
            </Badge>
          </div>
          
          {selectedServerList.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground text-sm">
              请先选择MCP服务器
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {selectedServerList.map(server => {
                const tools = getServerTools(server.id);
                const enabledCount = getEnabledToolCount(server.id);
                const isExpanded = expandedServers.has(server.id);
                
                return (
                  <div key={server.id} className="border rounded-lg p-2">
                    <div 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleServer(server.id)}
                    >
                      <div className="flex items-center gap-2">
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                        <span className="font-medium text-sm">{server.name}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {enabledCount}/{tools.length}
                      </Badge>
                    </div>
                    
                    {isExpanded && (
                      <div className="mt-2 space-y-2">
                        <Separator />
                        
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">批量操作</span>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleAllServerTools(server.id, true);
                              }}
                            >
                              全开
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleAllServerTools(server.id, false);
                              }}
                            >
                              全关
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          {tools.map(tool => (
                            <div key={tool.id} className="flex items-center justify-between py-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-mono bg-muted px-1 rounded">
                                  {tool.name.charAt(0).toUpperCase()}
                                </span>
                                <span className="text-sm">{tool.name}</span>
                              </div>
                              <Switch
                                checked={getToolState(server.id, tool.id)}
                                onCheckedChange={() => toggleTool(server.id, tool.id)}
                                className="scale-75"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
