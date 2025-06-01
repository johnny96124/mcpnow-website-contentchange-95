
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusIndicator } from '@/components/status/StatusIndicator';
import { MessageSquare, Settings, Server } from 'lucide-react';

interface MCPNowHostCardProps {
  onStartChat: () => void;
  onManageServers: () => void;
  serverCount: number;
  activeServers: number;
}

export const MCPNowHostCard: React.FC<MCPNowHostCardProps> = ({
  onStartChat,
  onManageServers,
  serverCount,
  activeServers
}) => {
  return (
    <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
              <span className="text-2xl">🤖</span>
            </div>
            <div>
              <CardTitle className="text-xl">MCP Now Host</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <StatusIndicator status="active" label="Ready" />
                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                  Built-in
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Server className="h-4 w-4 text-blue-600" />
            <span className="text-muted-foreground">Servers:</span>
            <span className="font-medium">{serverCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            <span className="text-muted-foreground">Active:</span>
            <span className="font-medium">{activeServers}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <Button 
            onClick={onStartChat} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Start AI Chat
          </Button>
          <Button 
            onClick={onManageServers} 
            variant="outline" 
            className="w-full border-blue-200 hover:bg-blue-50"
          >
            <Settings className="h-4 w-4 mr-2" />
            Manage Servers
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground bg-white/50 rounded p-2">
          Chat directly with your MCP servers without leaving the dashboard
        </div>
      </CardContent>
    </Card>
  );
};
