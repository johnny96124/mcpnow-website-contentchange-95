
import React from 'react';
import { ServerDiscoveryCard as ServerCard } from '../ServerDiscovery/ServerDiscoveryCard';
import { ServerDiscoveryCard } from '../types/chat';
import { serverDefinitions } from '@/data/mockData';

interface ServerDiscoveryMessageProps {
  cards: ServerDiscoveryCard[];
  onConfigureServer: (serverId: string) => void;
}

export const ServerDiscoveryMessage: React.FC<ServerDiscoveryMessageProps> = ({
  cards,
  onConfigureServer
}) => {
  return (
    <div className="space-y-3 mt-4">
      <div className="text-sm font-medium text-muted-foreground">
        💡 我发现了一些可能对您有用的 MCP 服务器：
      </div>
      <div className="space-y-2">
        {cards.map(card => {
          const serverDef = serverDefinitions.find(s => s.id === card.serverId);
          if (!serverDef) return null;
          
          return (
            <ServerCard
              key={card.id}
              server={serverDef}
              onConfigureServer={() => onConfigureServer(card.serverId)}
            />
          );
        })}
      </div>
    </div>
  );
};
