
import React from 'react';
import { Wrench } from 'lucide-react';
import { ServerRecommendationCard, ServerRecommendation } from './ServerRecommendationCard';

interface ServerRecommendationsProps {
  messageId: string;
  onConfigureServer: (messageId: string, server: ServerRecommendation) => void;
}

export const ServerRecommendations: React.FC<ServerRecommendationsProps> = ({
  messageId,
  onConfigureServer
}) => {
  // Mock server recommendations based on context
  const recommendations: ServerRecommendation[] = [
    {
      id: 'filesystem-mcp',
      name: 'Filesystem MCP Server',
      type: 'STDIO',
      description: 'Node.js server implementing Model Context Protocol for filesystem operations.',
      icon: 'folder',
      badges: ['STDIO'],
      isOfficial: true
    }
  ];

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
