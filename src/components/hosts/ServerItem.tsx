
import React, { useState } from "react";
import { ServerInstance, ConnectionStatus, serverDefinitions } from "@/data/mockData";
import { StatusIndicator } from "@/components/status/StatusIndicator";
import { EndpointLabel } from "@/components/status/EndpointLabel";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Info, AlertTriangle, ExternalLink, Trash2, Server, Wrench } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ServerErrorDialog } from "./ServerErrorDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ServerDetailsDialog } from "./ServerDetailsDialog";
import { ServerToolsList } from "@/components/discovery/ServerToolsList";

interface ServerItemProps {
  server: ServerInstance;
  hostConnectionStatus: ConnectionStatus;
  onStatusChange: (serverId: string, enabled: boolean) => void;
  load: number;
  onRemoveFromProfile: (serverId: string) => void;
}

export const ServerItem: React.FC<ServerItemProps> = ({
  server,
  hostConnectionStatus,
  onStatusChange,
  load,
  onRemoveFromProfile
}) => {
  const [showErrorDetails, setShowErrorDetails] = useState(false);
  const [showServerDetails, setShowServerDetails] = useState(false);
  const [showServerTools, setShowServerTools] = useState(false);

  const errorMessage = server.status === 'error' 
    ? "Failed to connect to server: Connection refused" 
    : null;

  const definition = serverDefinitions.find(def => def.id === server.type);
  
  return (
    <tr className="border-b">
      <td className="p-4">
        <div className="flex items-center gap-3">
          {definition?.icon ? (
            <div className="w-6 h-6 flex items-center justify-center">
              <img src={definition.icon} alt={definition.name} className="max-w-full max-h-full" />
            </div>
          ) : (
            <Server className="w-4 h-4 text-muted-foreground" />
          )}
          <div>
            <p className="font-medium">{server.name}</p>
            <p className="text-xs text-muted-foreground">
              {server.endpoint}
            </p>
          </div>
        </div>
      </td>
      <td className="p-4">
        {definition?.name || "Unknown"}
      </td>
      <td className="p-4">
        <div className="flex items-center gap-2">
          <StatusIndicator 
            status={server.status === 'error' ? 'error' : server.status === 'running' ? 'active' : 'inactive'} 
            size="sm" 
          />
          <span className="text-sm">
            {server.status === 'running' 
              ? 'Running' 
              : server.status === 'error' 
                ? 'Error' 
                : server.status === 'connecting' 
                  ? 'Connecting...' 
                  : 'Stopped'}
          </span>
          
          {server.status === 'error' && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-5 w-5 rounded-full" 
              onClick={() => setShowErrorDetails(true)}
            >
              <AlertTriangle className="h-3 w-3 text-destructive" />
            </Button>
          )}
        </div>
      </td>
      <td className="p-4 text-center">
        <Switch
          checked={server.status === 'running' || server.status === 'connecting' || server.status === 'error'}
          disabled={hostConnectionStatus !== 'connected'}
          onCheckedChange={(checked) => onStatusChange(server.id, checked)}
        />
      </td>
      <td className="p-4 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Server Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setShowServerDetails(true)}>
              <Info className="mr-2 h-4 w-4" />
              <span>View Details</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowServerTools(true)}>
              <Wrench className="mr-2 h-4 w-4" />
              <span>Server Tools</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => {
                window.open(server.endpoint, '_blank');
              }}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              <span>Open in Browser</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-destructive"
              onClick={() => onRemoveFromProfile(server.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Remove Server</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
      
      <ServerErrorDialog 
        open={showErrorDetails}
        onOpenChange={setShowErrorDetails}
        errorMessage={errorMessage || "An unknown error occurred"}
        server={server}
      />
      
      <ServerDetailsDialog 
        open={showServerDetails}
        onOpenChange={setShowServerDetails}
        server={server}
      />

      <Dialog open={showServerTools} onOpenChange={setShowServerTools}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Server Tools - {server.name}</DialogTitle>
            <DialogDescription>
              Available tools and utilities for this server
            </DialogDescription>
          </DialogHeader>
          <ServerToolsList serverId={server.id} className="mt-4" />
        </DialogContent>
      </Dialog>
    </tr>
  );
};
