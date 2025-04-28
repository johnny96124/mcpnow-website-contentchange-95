
import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ServerLogo } from "@/components/servers/ServerLogo";
import { EndpointLabel } from "@/components/status/EndpointLabel";
import { serverDefinitions, type ServerInstance, type EndpointType, type Status } from "@/data/mockData";

interface ServerSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddServers: (servers: ServerInstance[]) => void;
}

// Mock data with descriptions
const availableServers: Array<{
  id: string;
  name: string;
  definitionId: string;
  status: Status;
  connectionDetails: string;
  enabled: boolean;
  description: string;
  type: EndpointType;
}> = [
  {
    id: "server-1",
    name: "PostgreSQL Database",
    definitionId: "def-http-sse",
    status: "stopped",
    connectionDetails: "https://api.postgresql.org",
    enabled: false,
    description: "PostgreSQL database server with extended JSON-RPC API",
    type: "HTTP_SSE"
  },
  {
    id: "server-2",
    name: "Docker Assistant",
    definitionId: "def-stdio",
    status: "stopped",
    connectionDetails: "npx docker-assistant",
    enabled: false,
    description: "Helps manage Docker containers and images with intuitive interface",
    type: "STDIO"
  },
  {
    id: "server-3",
    name: "Redis Cache",
    definitionId: "def-http-sse",
    status: "stopped",
    connectionDetails: "https://redis.cache.local",
    enabled: false,
    description: "In-memory data structure store used as cache, database, and message broker",
    type: "HTTP_SSE"
  }
];

const existingInstances: ServerInstance[] = [
  {
    id: "instance-1",
    name: "Local PostgreSQL",
    definitionId: "def-http-sse",
    status: "stopped",
    connectionDetails: "https://localhost:5432",
    enabled: false
  },
  {
    id: "instance-2",
    name: "Development Redis",
    definitionId: "def-stdio",
    status: "stopped",
    connectionDetails: "redis://localhost:6379",
    enabled: false
  }
];

export const ServerSelectionDialog: React.FC<ServerSelectionDialogProps> = ({
  open,
  onOpenChange,
  onAddServers,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAdded, setShowAdded] = useState(false);
  const [selectedServer, setSelectedServer] = useState<string | null>(null);
  const [showExisting, setShowExisting] = useState(false);

  const handleServerSelect = (serverId: string) => {
    setSelectedServer(serverId);
    if (showExisting) {
      const server = existingInstances.find(s => s.id === serverId);
      if (server) {
        onAddServers([server]);
        onOpenChange(false);
      }
    } else {
      // Here you would proceed to configuration step
      // For now, we'll just add the server directly
      const server = availableServers.find(s => s.id === serverId);
      if (server) {
        const newInstance: ServerInstance = {
          id: `new-${Date.now()}`,
          name: server.name,
          definitionId: server.definitionId,
          status: "stopped",
          connectionDetails: server.connectionDetails,
          enabled: false
        };
        onAddServers([newInstance]);
        onOpenChange(false);
      }
    }
  };

  const filteredServers = showExisting
    ? existingInstances.filter(server =>
        server.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : availableServers.filter(server =>
        server.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Select Server</DialogTitle>
          <DialogDescription>
            Choose a server to add to your profile
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search servers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="show-existing"
                checked={showExisting}
                onCheckedChange={setShowExisting}
              />
              <Label htmlFor="show-existing">Show Added Only</Label>
            </div>
          </div>

          <div className="space-y-4">
            {filteredServers.map((server) => (
              <div
                key={server.id}
                className="flex items-start space-x-4 p-4 border rounded-lg hover:border-primary hover:bg-accent/5 cursor-pointer transition-colors"
                onClick={() => handleServerSelect(server.id)}
              >
                <ServerLogo name={server.name} className="flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium truncate">{server.name}</h4>
                    {'type' in server && (
                      <EndpointLabel type={server.type} />
                    )}
                    {showExisting && (
                      <Badge variant="secondary">Added</Badge>
                    )}
                  </div>
                  {'description' in server && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {server.description}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {server.connectionDetails}
                  </p>
                </div>
              </div>
            ))}

            {filteredServers.length === 0 && (
              <div className="text-center py-8 border border-dashed rounded-md">
                <p className="text-muted-foreground">No servers found</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onOpenChange(false)}>
            {showExisting ? "Add Selected" : "Next"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
