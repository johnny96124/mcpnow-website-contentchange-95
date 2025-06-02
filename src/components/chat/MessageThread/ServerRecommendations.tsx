
import React from 'react';
import { Wrench } from 'lucide-react';
import { ServerRecommendationCard, ServerRecommendation } from './ServerRecommendationCard';

interface ServerRecommendationsProps {
  messageId: string;
  onConfigureServer: (messageId: string, server: ServerRecommendation) => void;
  context?: string; // 新增：用于根据上下文推荐不同服务器
}

export const ServerRecommendations: React.FC<ServerRecommendationsProps> = ({
  messageId,
  onConfigureServer,
  context = ''
}) => {
  // 根据上下文智能推荐服务器
  const getRecommendations = (): ServerRecommendation[] => {
    const contextLower = context.toLowerCase();
    
    // 文件操作相关
    if (contextLower.includes('文件') || contextLower.includes('目录') || contextLower.includes('读取') || contextLower.includes('写入')) {
      return [
        {
          id: 'filesystem-mcp',
          name: 'Filesystem MCP Server',
          type: 'STDIO',
          description: 'Node.js server implementing Model Context Protocol for filesystem operations.',
          icon: 'folder',
          badges: ['STDIO', 'File Operations'],
          isOfficial: true
        }
      ];
    }
    
    // 数据库相关
    if (contextLower.includes('数据库') || contextLower.includes('sql') || contextLower.includes('查询')) {
      return [
        {
          id: 'database-mcp',
          name: 'Database MCP Server',
          type: 'STDIO',
          description: 'Connect and query databases with SQL support for multiple database engines.',
          icon: 'database',
          badges: ['STDIO', 'Database'],
          isOfficial: true
        }
      ];
    }
    
    // 网络请求相关
    if (contextLower.includes('api') || contextLower.includes('请求') || contextLower.includes('http')) {
      return [
        {
          id: 'fetch-mcp',
          name: 'Fetch MCP Server',
          type: 'STDIO',
          description: 'Make HTTP requests and fetch data from external APIs and websites.',
          icon: 'globe',
          badges: ['STDIO', 'HTTP'],
          isOfficial: true
        }
      ];
    }
    
    // Git相关
    if (contextLower.includes('git') || contextLower.includes('代码') || contextLower.includes('仓库')) {
      return [
        {
          id: 'git-mcp',
          name: 'Git MCP Server',
          type: 'STDIO',
          description: 'Git operations and repository management through MCP protocol.',
          icon: 'git-branch',
          badges: ['STDIO', 'Git'],
          isOfficial: true
        }
      ];
    }
    
    // 默认推荐
    return [
      {
        id: 'filesystem-mcp',
        name: 'Filesystem MCP Server',
        type: 'STDIO',
        description: 'Node.js server implementing Model Context Protocol for filesystem operations.',
        icon: 'folder',
        badges: ['STDIO'],
        isOfficial: true
      },
      {
        id: 'fetch-mcp',
        name: 'Fetch MCP Server',
        type: 'STDIO',
        description: 'Make HTTP requests and fetch data from external APIs and websites.',
        icon: 'globe',
        badges: ['STDIO', 'HTTP'],
        isOfficial: true
      }
    ];
  };

  const recommendations = getRecommendations();

  return (
    <div className="rounded-lg p-3 sm:p-4 border bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800">
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-start gap-2">
          <Wrench className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-sm text-blue-900 dark:text-blue-100">
              推荐相关服务器
            </h4>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
              基于当前对话内容，我们推荐以下MCP服务器来增强AI能力
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          {recommendations.map((server) => (
            <ServerRecommendationCard
              key={server.id}
              server={server}
              onConfigure={(server) => onConfigureServer(messageId, server)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
