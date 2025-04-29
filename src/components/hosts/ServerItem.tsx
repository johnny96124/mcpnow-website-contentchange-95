
import React, { useState } from "react";
import { ServerInstance, ConnectionStatus, serverDefinitions } from "@/data/mockData";
import { StatusIndicator } from "@/components/status/StatusIndicator";
import { EndpointLabel } from "@/components/status/EndpointLabel";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PenLine, Info, Trash2, Server, Wrench, AlertTriangle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ServerErrorDialog } from "./ServerErrorDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ServerDetailsDialog } from "./ServerDetailsDialog";
import { ServerToolsList } from "@/components/discovery/ServerToolsList";
import { AddInstanceDialog } from "@/components/servers/AddInstanceDialog";
import { useToast } from "@/hooks/use-toast";

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
  const [toolsDialogOpen, setToolsDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const hasError = server.status === 'error';
  const isDisabled = hostConnectionStatus !== "connected";
  const definition = serverDefinitions.find(def => def.id === server.definitionId);

  const handleRemove = () => {
    if (window.confirm(`Are you sure you want to remove ${server.name} from this profile?`)) {
      onRemoveFromProfile(server.id);
    }
  };

  const handleEditComplete = () => {
    toast({
      title: "Instance updated",
      description: "The instance settings have been updated successfully."
    });
    setEditDialogOpen(false);
  };

  const handleRetryConnection = async (): Promise<boolean> => {
    // This would normally call an API to retry the connection
    return new Promise((resolve) => {
      setTimeout(() => {
        const success = Math.random() > 0.3;
        if (success) {
          // Update the server status to running
          onStatusChange(server.id, true);
        }
        resolve(success);
      }, 2000);
    });
  };

  return <tr className={hasError ? "bg-red-50/30" : ""}>
      <td className="p-4 align-middle">
        <div className="flex items-center gap-2">
          <div className="bg-muted/20 p-1.5 rounded">
            <Server className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex items-center gap-1.5">
            <div className="font-medium">{server.name}</div>
            {hasError && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 text-red-600 hover:text-red-700 hover:bg-red-50 p-0" 
                title="Server Error" 
                onClick={() => setErrorDialogOpen(true)}
              >
                <AlertTriangle className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
      </td>
      <td className="p-4 align-middle">
        <EndpointLabel type={definition?.type || "STDIO"} />
      </td>
      <td className="p-4 align-middle">
        <StatusIndicator status={server.status === "running" ? "active" : server.status === "error" ? "error" : server.status === "connecting" ? "warning" : "inactive"} label={server.status} />
      </td>
      <td className="p-4 align-middle text-center">
        <Switch checked={server.status === 'running'} onCheckedChange={enabled => onStatusChange(server.id, enabled)} disabled={isDisabled} />
      </td>

      <td className="p-4 align-middle text-right">
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50" title="Server Info" onClick={() => setDetailsDialogOpen(true)}>
            <Info className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="icon" className="h-8 w-8 text-purple-600 hover:text-purple-700 hover:bg-purple-50" title="Server Tools" onClick={() => setToolsDialogOpen(true)}>
            <Wrench className="h-4 w-4" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>More Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
                <PenLine className="h-4 w-4 mr-2" />
                Edit Instance
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600" onClick={handleRemove}>
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
        onRetryConnection={handleRetryConnection}
      />
      
      <Dialog open={toolsDialogOpen} onOpenChange={setToolsDialogOpen}>
        <DialogContent className="max-w-4xl h-[600px] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Wrench className="h-5 w-5 text-purple-500" />
              Server Tools - {server.name}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              Debug, execute tools, and view message history for this server instance
            </p>
          </DialogHeader>
          <div className="flex-1 overflow-hidden py-4">
            <ServerToolsList tools={definition?.tools} debugMode={true} serverName={server.name} instanceId={server.id} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setToolsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <ServerDetailsDialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen} server={server} />

      <AddInstanceDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        serverDefinition={definition}
        editMode={true}
        instanceId={server.id}
        initialValues={{
          name: server.name,
          args: server.arguments?.join(' ') || '',
          url: '',
          env: server.environment || {},
          headers: {},
        }}
        onCreateInstance={handleEditComplete}
      />
    </tr>;
};
