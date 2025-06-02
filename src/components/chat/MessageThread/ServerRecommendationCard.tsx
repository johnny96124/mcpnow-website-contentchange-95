
import React from 'react';
import { Plus, Lock, Mountain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ServerRecommendation {
  id: string;
  name: string;
  description: string;
  type: 'SSE' | 'STDIO';
  icon: React.ReactNode;
  isOfficial?: boolean;
  supportedTypes?: string[];
}

interface ServerRecommendationCardProps {
  server: ServerRecommendation;
  onSetupServer: (serverId: string) => void;
}

export const ServerRecommendationCard: React.FC<ServerRecommendationCardProps> = ({
  server,
  onSetupServer
}) => {
  const handleSetupClick = () => {
    onSetupServer(server.id);
  };

  return (
    <Card className="border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer group">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          {/* Left side - Icon and info */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Server Icon */}
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
              {server.icon}
            </div>
            
            {/* Server Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-sm text-gray-900 truncate">
                  {server.name}
                </h4>
                {server.isOfficial && (
                  <Lock className="h-3 w-3 text-yellow-500 flex-shrink-0" />
                )}
                <Mountain className="h-3 w-3 text-blue-500 flex-shrink-0" />
              </div>
              
              {/* Type badges */}
              <div className="flex gap-1 mb-2">
                {server.supportedTypes?.includes('SSE') && (
                  <Badge variant="secondary" className="text-xs px-2 py-0 bg-green-100 text-green-700">
                    SSE
                  </Badge>
                )}
                {server.supportedTypes?.includes('STDIO') && (
                  <Badge variant="secondary" className="text-xs px-2 py-0 bg-purple-100 text-purple-700">
                    STDIO
                  </Badge>
                )}
              </div>
              
              <p className="text-xs text-gray-600 line-clamp-2">
                {server.description}
              </p>
            </div>
          </div>
          
          {/* Right side - Setup button */}
          <div className="flex-shrink-0">
            <Button
              size="sm"
              variant="outline"
              onClick={handleSetupClick}
              className="h-8 px-3 text-xs opacity-70 group-hover:opacity-100 transition-opacity"
            >
              <Plus className="h-3 w-3 mr-1" />
              配置
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
