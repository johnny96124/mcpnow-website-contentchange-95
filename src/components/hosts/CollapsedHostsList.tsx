
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Host } from '@/data/mockData';
import { StatusIndicator } from '@/components/status/StatusIndicator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface CollapsedHostsListProps {
  hosts: Host[];
  selectedHostId: string | null;
  onHostSelect: (hostId: string) => void;
}

export const CollapsedHostsList: React.FC<CollapsedHostsListProps> = ({
  hosts,
  selectedHostId,
  onHostSelect
}) => {
  return (
    <TooltipProvider>
      <div className="p-2 space-y-2">
        {hosts.map(host => (
          <Tooltip key={host.id}>
            <TooltipTrigger asChild>
              <Card 
                className={cn(
                  "cursor-pointer transition-colors hover:bg-muted/50 relative",
                  selectedHostId === host.id && "border-primary bg-primary/5"
                )}
                onClick={() => onHostSelect(host.id)}
              >
                <CardContent className="p-3 flex flex-col items-center justify-center">
                  <div className="bg-muted/30 p-2 rounded-full mb-2 relative">
                    <span className="text-lg">{host.icon || '🖥️'}</span>
                    {/* Connection Status Indicator */}
                    <div className="absolute -bottom-1 -right-1">
                      <StatusIndicator 
                        status={host.connectionStatus === "connected" ? "active" : "inactive"} 
                        iconOnly 
                        size="sm"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent side="right">
              <div className="text-sm">
                <p className="font-medium">{host.name}</p>
                <p className="text-muted-foreground">
                  {host.connectionStatus === "connected" ? "Connected" : "Disconnected"}
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
};
