
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Settings } from 'lucide-react';
import { MCPTool, MCPServer } from '../types/chat';

interface ToolManagementPanelProps {
  servers: MCPServer[];
  tools: MCPTool[];
  onToggleTool: (toolId: string) => void;
  onToggleAllToolsForServer: (serverId: string, enabled: boolean) => void;
  onToggleToolsByCategory: (category: string, enabled: boolean) => void;
  onResetToDefault: () => void;
  collapsed?: boolean;
}

export const ToolManagementPanel: React.FC<ToolManagementPanelProps> = ({
  servers,
  tools,
  onToggleTool,
  onToggleAllToolsForServer,
  onToggleToolsByCategory,
  onResetToDefault,
  collapsed = false
}) => {
  const [isOpen, setIsOpen] = useState(!collapsed);

  const getToolsByServer = (serverId: string) => {
    return tools.filter(tool => tool.serverId === serverId);
  };

  const getEnabledToolsCount = (serverId: string) => {
    const serverTools = getToolsByServer(serverId);
    return serverTools.filter(tool => tool.enabled).length;
  };

  const getAllCategories = () => {
    const categories = new Set(tools.map(tool => tool.category).filter(Boolean));
    return Array.from(categories) as string[];
  };

  const getToolsByCategory = (category: string) => {
    return tools.filter(tool => tool.category === category);
  };

  const getCategoryEnabledCount = (category: string) => {
    const categoryTools = getToolsByCategory(category);
    return categoryTools.filter(tool => tool.enabled).length;
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="w-full">
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="font-medium">工具管理</span>
              <Badge variant="secondary">
                {tools.filter(t => t.enabled).length}/{tools.length} 启用
              </Badge>
            </div>
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="p-4 pt-0 space-y-4">
            {/* Batch Operations */}
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={onResetToDefault}
              >
                重置为默认
              </Button>
            </div>

            <Separator />

            {/* Tools by Server */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">按服务器管理</h4>
              <ScrollArea className="max-h-64">
                <div className="space-y-3">
                  {servers.map((server) => {
                    const serverTools = getToolsByServer(server.id);
                    const enabledCount = getEnabledToolsCount(server.id);
                    
                    return (
                      <div key={server.id} className="border rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              server.status === 'connected' ? 'bg-green-500' : 'bg-gray-400'
                            }`} />
                            <span className="font-medium text-sm">{server.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {enabledCount}/{serverTools.length}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onToggleAllToolsForServer(server.id, true)}
                              disabled={enabledCount === serverTools.length}
                            >
                              全部启用
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onToggleAllToolsForServer(server.id, false)}
                              disabled={enabledCount === 0}
                            >
                              全部禁用
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2 ml-4">
                          {serverTools.map((tool) => (
                            <div key={tool.id} className="flex items-center justify-between py-1">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-mono">{tool.name}</span>
                                  {tool.category && (
                                    <Badge variant="secondary" className="text-xs">
                                      {tool.category}
                                    </Badge>
                                  )}
                                </div>
                                {tool.description && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {tool.description}
                                  </p>
                                )}
                              </div>
                              <Switch
                                checked={tool.enabled}
                                onCheckedChange={() => onToggleTool(tool.id)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>

            <Separator />

            {/* Tools by Category */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">按类别管理</h4>
              <div className="space-y-2">
                {getAllCategories().map((category) => {
                  const categoryTools = getToolsByCategory(category);
                  const enabledCount = getCategoryEnabledCount(category);
                  
                  return (
                    <div key={category} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{category}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {enabledCount}/{categoryTools.length} 启用
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onToggleToolsByCategory(category, true)}
                          disabled={enabledCount === categoryTools.length}
                        >
                          启用
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onToggleToolsByCategory(category, false)}
                          disabled={enabledCount === 0}
                        >
                          禁用
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};
