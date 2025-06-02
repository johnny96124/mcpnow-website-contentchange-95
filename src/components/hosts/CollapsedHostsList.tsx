
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
      <div className="p-1 space-y-1">
        {hosts.map(host => (
          <Tooltip key={host.id}>
            <TooltipTrigger asChild>
              <Card 
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:bg-muted/50 relative border-2",
                  selectedHostId === host.id ? "border-primary bg-primary/10" : "border-transparent"
                )}
                onClick={() => onHostSelect(host.id)}
              >
                <CardContent className="p-2 flex flex-col items-center justify-center">
                  <div className="relative">
                    <div className="bg-muted/30 p-1.5 rounded-lg flex items-center justify-center w-8 h-8">
                      <span className="text-sm">{host.icon || '🖥️'}</span>
                    </div>
                    {/* Connection Status Indicator - 更小的指示器 */}
                    <div className="absolute -bottom-0.5 -right-0.5">
                      <div className={cn(
                        "w-2.5 h-2.5 rounded-full border border-background",
                        host.connectionStatus === "connected" 
                          ? "bg-green-500" 
                          : "bg-gray-400"
                      )} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={10}>
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
