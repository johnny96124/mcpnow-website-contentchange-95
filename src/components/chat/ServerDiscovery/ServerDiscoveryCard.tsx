
import React from 'react';
import { Server, Plus, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ServerDefinition } from '@/data/mockData';
import { ServerLogo } from '@/components/servers/ServerLogo';

interface ServerDiscoveryCardProps {
  server: ServerDefinition;
  onConfigureServer: (server: ServerDefinition) => void;
}

export const ServerDiscoveryCard: React.FC<ServerDiscoveryCardProps> = ({
  server,
  onConfigureServer
}) => {
  return (
    <Card className="border-2 border-blue-200 bg-blue-50/50 hover:border-blue-300 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <ServerLogo name={server.name} className="flex-shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm">{server.name}</h3>
                <Badge variant="secondary" className="text-xs">
                  {server.type}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {server.description}
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => onConfigureServer(server)}
            className="gap-2 min-w-fit"
          >
            <Plus className="h-3 w-3" />
            配置
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
};
