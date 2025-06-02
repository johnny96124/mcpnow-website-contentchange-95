
import React from 'react';
import { FolderOpen, Search } from 'lucide-react';
import { ServerRecommendationCard } from './ServerRecommendationCard';

interface ServerRecommendation {
  id: string;
  name: string;
  description: string;
  type: 'SSE' | 'STDIO';
  icon: React.ReactNode;
  isOfficial?: boolean;
  supportedTypes?: string[];
}

interface ServerRecommendationsProps {
  onSetupServer: (serverId: string) => void;
}

const mockServerRecommendations: ServerRecommendation[] = [
  {
    id: 'filesystem-mcp',
    name: 'Filesystem MCP Server',
    description: 'Node.js server implementing Model Context Protocol for filesystem operations.',
    type: 'STDIO',
    icon: <FolderOpen className="h-5 w-5 text-yellow-600" />,
    isOfficial: true,
    supportedTypes: ['SSE', 'STDIO']
  },
  {
    id: 'brave-search-mcp',
    name: 'Brave Search MCP Server',
    description: 'MCP server integrating Brave Search API for web and local search capabilities.',
    type: 'STDIO',
    icon: <Search className="h-5 w-5 text-orange-600" />,
    isOfficial: true,
    supportedTypes: ['STDIO']
  }
];

export const ServerRecommendations: React.FC<ServerRecommendationsProps> = ({
  onSetupServer
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 bg-blue-100 rounded flex items-center justify-center">
          <div className="h-2 w-2 bg-blue-500 rounded"></div>
        </div>
        <span className="text-sm font-medium text-gray-700">推荐服务器</span>
      </div>
      
      <div className="space-y-2">
        {mockServerRecommendations.map((server) => (
          <ServerRecommendationCard
            key={server.id}
            server={server}
            onSetupServer={onSetupServer}
          />
        ))}
      </div>
      
      <p className="text-xs text-gray-500 mt-3">
        这些服务器可以扩展AI助手的功能，点击配置按钮即可添加到您的配置文件中。
      </p>
    </div>
  );
};
