
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { Host } from "@/data/mockData";
import { StatusIndicator } from "@/components/status/StatusIndicator";

export interface HostCardProps {
  host: Host;
  selected: boolean;
  onSelect: () => void;
  onConfigView: () => void;
}

export function HostCard({ host, selected, onSelect, onConfigView }: HostCardProps) {
  return (
    <Card 
      className={`cursor-pointer transition-all hover:border-primary ${selected ? 'border-primary bg-primary/5' : ''}`} 
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{host.icon || '💻'}</span>
            <div>
              <h3 className="font-medium leading-none mb-1">{host.name}</h3>
              <div className="flex items-center gap-1">
                <StatusIndicator 
                  status={
                    host.connectionStatus === "connected" 
                      ? "active" 
                      : host.configStatus === "misconfigured" 
                        ? "error" 
                        : "inactive"
                  } 
                  size="sm" 
                  iconOnly
                />
                <span className="text-xs text-muted-foreground">
                  {host.connectionStatus === "connected" 
                    ? "Connected" 
                    : host.configStatus === "misconfigured" 
                      ? "Misconfigured" 
                      : "Not connected"
                  }
                </span>
              </div>
            </div>
          </div>

          {host.configPath && (
            <Button 
              variant="ghost" 
              size="sm"
              className="h-8 w-8 p-0" 
              onClick={(e) => {
                e.stopPropagation();
                onConfigView();
              }}
              title="View configuration file"
            >
              <FileText className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
