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
  description?: string;
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

  // 根据图片中的工具名称更新工具数据
  const getServerTools = (serverId: string): Tool[] => {
    const mockTools: Record<string, Tool[]> = {
      'PostgresTool-DevDB': [{
        id: 'query_database',
        name: 'query_database',
        enabled: true,
        description: '数据库查询',
        category: 'database'
      }, {
        id: 'create_table',
        name: 'create_table',
        enabled: true,
        description: '创建数据表',
        category: 'database'
      }, {
        id: 'insert_data',
        name: 'insert_data',
        enabled: true,
        description: '插入数据',
        category: 'database'
      }],
      'GitHub Copilot': [{
        id: 'code_completion',
        name: 'code_completion',
        enabled: true,
        description: '代码补全',
        category: 'ai'
      }, {
        id: 'code_review',
        name: 'code_review',
        enabled: true,
        description: '代码审查',
        category: 'ai'
      }, {
        id: 'generate_tests',
        name: 'generate_tests',
        enabled: true,
        description: '生成测试',
        category: 'ai'
      }],
      'Local File Assistant': [{
        id: 'read_file',
        name: 'read_file',
        enabled: true,
        description: '读取文件',
        category: 'file_operations'
      }, {
        id: 'write_file',
        name: 'write_file',
        enabled: true,
        description: '写入文件',
        category: 'file_operations'
      }, {
        id: 'list_directory',
        name: 'list_directory',
        enabled: true,
        description: '列出目录',
        category: 'file_operations'
      }],
      'filesystem': [{
        id: 'read_file',
        name: 'read_file',
        enabled: true,
        description: '读取文件内容',
        category: 'file_operations'
      }, {
        id: 'write_file',
        name: 'write_file',
        enabled: true,
        description: '写入文件内容',
        category: 'file_operations'
      }, {
        id: 'list_directory',
        name: 'list_directory',
        enabled: true,
        description: '列出目录内容',
        category: 'file_operations'
      }],
      'mcp-now': [{
        id: 'get_figma_data',
        name: 'get_figma_data',
        enabled: true,
        description: '获取Figma设计数据',
        category: 'design'
      }, {
        id: 'download_figma_images',
        name: 'download_figma_images',
        enabled: true,
        description: '下载Figma图片',
        category: 'design'
      }, {
        id: 'browser_close',
        name: 'browser_close',
        enabled: true,
        description: '关闭浏览器',
        category: 'browser'
      }, {
        id: 'browser_resize',
        name: 'browser_resize',
        enabled: true,
        description: '调整浏览器大小',
        category: 'browser'
      }, {
        id: 'browser_console_messages',
        name: 'browser_console_messages',
        enabled: true,
        description: '浏览器控制台消息',
        category: 'browser'
      }, {
        id: 'browser_handle_dialog',
        name: 'browser_handle_dialog',
        enabled: true,
        description: '处理浏览器对话框',
        category: 'browser'
      }, {
        id: 'browser_file_upload',
        name: 'browser_file_upload',
        enabled: true,
        description: '浏览器文件上传',
        category: 'browser'
      }, {
        id: 'browser_install',
        name: 'browser_install',
        enabled: true,
        description: '浏览器安装',
        category: 'browser'
      }, {
        id: 'browser_press_key',
        name: 'browser_press_key',
        enabled: true,
        description: '浏览器按键',
        category: 'browser'
      }, {
        id: 'browser_navigate',
        name: 'browser_navigate',
        enabled: true,
        description: '浏览器导航',
        category: 'browser'
      }, {
        id: 'browser_navigate_back',
        name: 'browser_navigate_back',
        enabled: true,
        description: '浏览器后退',
        category: 'browser'
      }, {
        id: 'browser_navigate_forward',
        name: 'browser_navigate_forward',
        enabled: true,
        description: '浏览器前进',
        category: 'browser'
      }, {
        id: 'browser_network_requests',
        name: 'browser_network_requests',
        enabled: true,
        description: '浏览器网络请求',
        category: 'browser'
      }, {
        id: 'browser_pdf_save',
        name: 'browser_pdf_save',
        enabled: true,
        description: '保存PDF',
        category: 'browser'
      }, {
        id: 'browser_take_screenshot',
        name: 'browser_take_screenshot',
        enabled: true,
        description: '截图',
        category: 'browser'
      }, {
        id: 'browser_snapshot',
        name: 'browser_snapshot',
        enabled: true,
        description: '快照',
        category: 'browser'
      }, {
        id: 'browser_click',
        name: 'browser_click',
        enabled: true,
        description: '浏览器点击',
        category: 'browser'
      }, {
        id: 'browser_drag',
        name: 'browser_drag',
        enabled: true,
        description: '浏览器拖拽',
        category: 'browser'
      }, {
        id: 'browser_hover',
        name: 'browser_hover',
        enabled: true,
        description: '浏览器悬停',
        category: 'browser'
      }, {
        id: 'browser_type',
        name: 'browser_type',
        enabled: true,
        description: '浏览器输入',
        category: 'browser'
      }, {
        id: 'browser_select_option',
        name: 'browser_select_option',
        enabled: true,
        description: '选择选项',
        category: 'browser'
      }, {
        id: 'browser_tab_list',
        name: 'browser_tab_list',
        enabled: true,
        description: '标签页列表',
        category: 'browser'
      }, {
        id: 'browser_tab_new',
        name: 'browser_tab_new',
        enabled: true,
        description: '新建标签页',
        category: 'browser'
      }, {
        id: 'browser_tab_select',
        name: 'browser_tab_select',
        enabled: true,
        description: '选择标签页',
        category: 'browser'
      }, {
        id: 'browser_tab_close',
        name: 'browser_tab_close',
        enabled: true,
        description: '关闭标签页',
        category: 'browser'
      }, {
        id: 'browser_generate_playwright_test',
        name: 'browser_generate_playwright_test',
        enabled: true,
        description: '生成Playwright测试',
        category: 'testing'
      }, {
        id: 'browser_wait_for',
        name: 'browser_wait_for',
        enabled: true,
        description: '等待元素',
        category: 'browser'
      }, {
        id: 'sequentialthinking',
        name: 'sequentialthinking',
        enabled: true,
        description: '顺序思考',
        category: 'ai'
      }, {
        id: 'echo',
        name: 'echo',
        enabled: true,
        description: '回显',
        category: 'utility'
      }, {
        id: 'add',
        name: 'add',
        enabled: true,
        description: '加法运算',
        category: 'math'
      }, {
        id: 'printEnv',
        name: 'printEnv',
        enabled: true,
        description: '打印环境变量',
        category: 'system'
      }, {
        id: 'longRunningOperation',
        name: 'longRunningOperation',
        enabled: true,
        description: '长时间运行操作',
        category: 'async'
      }, {
        id: 'sampleLLM',
        name: 'sampleLLM',
        enabled: true,
        description: '示例LLM',
        category: 'ai'
      }, {
        id: 'getTinyImage',
        name: 'getTinyImage',
        enabled: true,
        description: '获取小图片',
        category: 'media'
      }, {
        id: 'annotatedMessage',
        name: 'annotatedMessage',
        enabled: true,
        description: '带注释消息',
        category: 'utility'
      }, {
        id: 'getResourceReference',
        name: 'getResourceReference',
        enabled: true,
        description: '获取资源引用',
        category: 'resource'
      }]
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
    console.log(`Tool ${toolId} from server ${serverId} ${!getToolState(serverId, toolId) ? 'enabled' : 'disabled'}`);
  };
  const toggleAllServerTools = (serverId: string, enabled: boolean) => {
    const tools = getServerTools(serverId);
    const updates: Record<string, boolean> = {};
    tools.forEach(tool => {
      updates[`${serverId}-${tool.id}`] = enabled;
    });
    setToolStates(prev => ({
      ...prev,
      ...updates
    }));
    console.log(`All tools for server ${serverId} ${enabled ? 'enabled' : 'disabled'}`);
  };
  const getToolState = (serverId: string, toolId: string): boolean => {
    const key = `${serverId}-${toolId}`;
    if (toolStates.hasOwnProperty(key)) {
      return toolStates[key];
    }
    // Use default state from tool definition
    const tools = getServerTools(serverId);
    const tool = tools.find(t => t.id === toolId);
    return tool?.enabled ?? true;
  };
  const getEnabledToolCount = (serverId: string): number => {
    const tools = getServerTools(serverId);
    return tools.filter(tool => getToolState(serverId, tool.id)).length;
  };
  const getCategoryColor = (category?: string): string => {
    const colors: Record<string, string> = {
      'file_operations': 'bg-blue-100 text-blue-700',
      'utility': 'bg-green-100 text-green-700',
      'math': 'bg-purple-100 text-purple-700',
      'system': 'bg-orange-100 text-orange-700',
      'async': 'bg-yellow-100 text-yellow-700',
      'ai': 'bg-pink-100 text-pink-700',
      'media': 'bg-indigo-100 text-indigo-700',
      'resource': 'bg-gray-100 text-gray-700',
      'design': 'bg-red-100 text-red-700',
      'browser': 'bg-cyan-100 text-cyan-700'
    };
    return colors[category || ''] || 'bg-gray-100 text-gray-700';
  };

  // Create mock servers to match the image
  const mockServers = [{
    id: 'PostgresTool-DevDB',
    name: 'PostgresTool-DevDB',
    type: 'STDIO' as const,
    status: 'connected' as const,
    enabled: true
  }, {
    id: 'GitHub Copilot',
    name: 'GitHub Copilot',
    type: 'STDIO' as const,
    status: 'connected' as const,
    enabled: true
  }, {
    id: 'Local File Assistant',
    name: 'Local File Assistant',
    type: 'STDIO' as const,
    status: 'connected' as const,
    enabled: true
  }, {
    id: 'mcp-now',
    name: 'mcp-now',
    type: 'STDIO' as const,
    status: 'connected' as const,
    enabled: true
  }];
  const selectedServerList = mockServers;
  return <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={disabled} title="工具控制">
          <Settings className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium">工具控制</h4>
            <Badge variant="secondary" className="text-xs">
              {selectedServerList.length} 个服务器
            </Badge>
          </div>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {selectedServerList.map(server => {
            const tools = getServerTools(server.id);
            const enabledCount = getEnabledToolCount(server.id);
            const isExpanded = expandedServers.has(server.id);
            return <div key={server.id} className="border rounded-lg p-2">
                  <div className="flex items-center justify-between cursor-pointer hover:bg-muted/50 rounded p-1" onClick={() => toggleServer(server.id)}>
                    <div className="flex items-center gap-2">
                      {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      <span className="font-medium text-sm">{server.name}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {enabledCount}/{tools.length}
                    </Badge>
                  </div>
                  
                  {isExpanded && <div className="mt-2 space-y-2">
                      <Separator />
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">工具管理</span>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={e => {
                      e.stopPropagation();
                      toggleAllServerTools(server.id, true);
                    }}>
                            全开
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={e => {
                      e.stopPropagation();
                      toggleAllServerTools(server.id, false);
                    }}>
                            全关
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        {tools.map(tool => {
                    const isEnabled = getToolState(server.id, tool.id);
                    return <div key={tool.id} className="flex items-center justify-between py-1 hover:bg-muted/30 rounded px-1">
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium truncate" title={tool.name}>
                                  {tool.name}
                                </div>
                                {tool.description && <div className="text-xs text-muted-foreground truncate" title={tool.description}>
                                    {tool.description}
                                  </div>}
                              </div>
                              <Switch checked={isEnabled} onCheckedChange={() => toggleTool(server.id, tool.id)} className="scale-75 flex-shrink-0 ml-2" />
                            </div>;
                  })}
                      </div>
                    </div>}
                </div>;
          })}
          </div>
        </div>
      </PopoverContent>
    </Popover>;
};