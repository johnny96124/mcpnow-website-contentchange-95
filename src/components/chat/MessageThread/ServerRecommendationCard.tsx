
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Folder, Lock, Bot } from 'lucide-react';

export interface ServerRecommendation {
  id: string;
  name: string;
  type: 'SSE' | 'STDIO';
  description: string;
  icon?: string;
  badges?: string[];
  isOfficial?: boolean;
}

interface ServerRecommendationCardProps {
  server: ServerRecommendation;
  onConfigure: (server: ServerRecommendation) => void;
}

export const ServerRecommendationCard: React.FC<ServerRecommendationCardProps> = ({
  server,
  onConfigure
}) => {
  const getIcon = () => {
    switch (server.icon) {
      case 'folder':
        return <Folder className="h-5 w-5 text-amber-500" />;
      default:
        return (
          <div className="h-8 w-8 bg-amber-100 rounded-lg flex items-center justify-center">
            <Folder className="h-4 w-4 text-amber-600" />
          </div>
        );
    }
  };

  return (
    <Card className="border border-purple-200 dark:border-purple-800 hover:border-purple-300 dark:hover:border-purple-700 transition-colors cursor-pointer group">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            {getIcon()}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-sm truncate">{server.name}</h4>
                {server.isOfficial && (
                  <Lock className="h-3 w-3 text-amber-500 flex-shrink-0" />
                )}
                {server.isOfficial && (
                  <Bot className="h-3 w-3 text-blue-500 flex-shrink-0" />
                )}
              </div>
              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                {server.description}
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs px-2 py-0 bg-green-50 text-green-700 border-green-200">
                  {server.type}
                </Badge>
                {server.badges?.map((badge, index) => (
                  <Badge key={index} variant="outline" className="text-xs px-2 py-0">
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => onConfigure(server)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 h-auto ml-2 flex-shrink-0"
          >
            配置
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
