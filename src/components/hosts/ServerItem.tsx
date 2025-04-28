import React, { useState } from "react";
import { ServerInstance, ConnectionStatus } from "@/data/mockData";
import { StatusIndicator } from "@/components/status/StatusIndicator";
import { EndpointLabel } from "@/components/status/EndpointLabel";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Info, AlertTriangle, ExternalLink, Trash2, Server } from "lucide-react";
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
import { serverDefinitions } from "@/data/mockData";

interface ServerItemProps {
  server: ServerInstance;
  hostConnectionStatus: ConnectionStatus;
  load: number;
  onStatusChange: (serverId: string, enabled: boolean) => void;
  onRemoveFromProfile: (serverId: string) => void;
}

export const ServerItem: React.FC<ServerItemProps> = ({
  server,
  hostConnectionStatus,
  load,
  onStatusChange,
  onRemoveFromProfile
}) => {
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  
  const hasError = server.status === 'error';
  const isDisabled = hostConnectionStatus !== "connected";
  const definition = serverDefinitions.find(def => def.id === server.definitionId);
  
  const getServerType = () => {
    if (!definition) return "HTTP_SSE";
    return definition.type;
  };
  
  const handleRemove = () => {
    if (window.confirm(`Are you sure you want to remove ${server.name} from this profile?`)) {
      onRemoveFromProfile(server.id);
    }
  };
  
  const viewServerDetails = () => {
    toast({
      title: "View server details",
      description: "Navigating to server details page"
    });
  };
  
  const viewServerDefinition = () => {
    toast({
      title: "View server definition",
      description: "Navigating to server definition page"
    });
  };

  return (
    <tr className={hasError ? "bg-red-50/30" : ""}>
      <td className="p-4 align-middle">
        <div className="flex items-center gap-2">
          <div className="bg-muted/20 p-1.5 rounded">
            <Server className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <div className="font-medium">{server.name}</div>
            {hasError && (
              <div className="flex items-center gap-1.5 text-xs text-red-500 mt-1">
                <span>Error: Failed to connect to server</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 text-red-600 hover:text-red-700 hover:bg-red-50"
                  title="View Error"
                  onClick={() => setErrorDialogOpen(true)}
                >
                  <AlertTriangle className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </td>
      <td className="p-4 align-middle">
        <EndpointLabel type={getServerType()} />
      </td>
      <td className="p-4 align-middle">
        <StatusIndicator 
          status={
            server.status === "running" 
              ? "active" 
              : server.status === "error" 
                ? "error" 
                : server.status === "connecting" 
                  ? "warning" 
                  : "inactive"
          } 
          label={server.status} 
        />
      </td>
      <td className="p-4 align-middle text-center">
        <Switch
          checked={server.status === 'running'}
          onCheckedChange={(enabled) => onStatusChange(server.id, enabled)}
          disabled={isDisabled}
        />
      </td>
      <td className="p-4 align-middle text-right">
        <div className="flex justify-end gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            title="Server Info"
            onClick={viewServerDetails}
          >
            <Info className="h-4 w-4" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Server Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={viewServerDetails}>
                <Info className="h-4 w-4 mr-2" />
                View Server Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={viewServerDefinition}>
                <ExternalLink className="h-4 w-4 mr-2" />
                View Definition
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-600" 
                onClick={handleRemove}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remove from Profile
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </td>
      
      <ServerErrorDialog 
        open={errorDialogOpen}
        onOpenChange={setErrorDialogOpen}
        serverName={server.name}
        errorMessage="Failed to connect to server. The endpoint is not responding or is not properly configured."
      />
    </tr>
  );
};
