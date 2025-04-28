
import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { EndpointLabel } from "@/components/status/EndpointLabel";
import { ServerLogo } from "@/components/servers/ServerLogo";
import { serverDefinitions, ServerInstance, Status } from "@/data/mockData";

interface ServerSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddServers: (servers: ServerInstance[]) => void;
}

export const ServerSelectionDialog: React.FC<ServerSelectionDialogProps> = ({
  open,
  onOpenChange,
  onAddServers,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddedOnly, setShowAddedOnly] = useState(false);
  const [selectedServers, setSelectedServers] = useState<ServerInstance[]>([]);
  
  useEffect(() => {
    if (!open) {
      setSearchQuery("");
      setShowAddedOnly(false);
      setSelectedServers([]);
    }
  }, [open]);

  const availableServers = [
    {
      id: "postgres-db",
      name: "PostgreSQL Database",
      definitionId: "def-http-sse",
      status: "stopped" as Status,
      connectionDetails: "https://localhost:5432",
      enabled: false,
      description: "PostgreSQL database server with extended JSON-RPC API",
      type: "HTTP_SSE" as const,
      logoInitials: "PD"
    },
    {
      id: "docker-assistant",
      name: "Docker Assistant",
      definitionId: "def-http-sse",
      status: "stopped" as Status,
      connectionDetails: "http://localhost:8080",
      enabled: false,
      description: "Helps manage Docker containers and images with intuitive interface",
      type: "HTTP_SSE" as const,
      logoInitials: "DA"
    },
    {
      id: "redis-cache",
      name: "Redis Cache",
      definitionId: "def-stdio",
      status: "stopped" as Status,
      connectionDetails: "redis-cli",
      enabled: false,
      description: "In-memory data structure store used as cache, database, and message broker",
      type: "STDIO" as const,
      logoInitials: "RC"
    }
  ];

  const filteredServers = availableServers.filter(server => {
    const matchesSearch = server.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (showAddedOnly) {
      return matchesSearch && selectedServers.some(s => s.id === server.id);
    }
    return matchesSearch;
  });

  const handleServerToggle = (server: typeof availableServers[0]) => {
    setSelectedServers(prev => {
      const isSelected = prev.some(s => s.id === server.id);
      if (isSelected) {
        return prev.filter(s => s.id !== server.id);
      }
      return [...prev, {
        id: server.id,
        name: server.name,
        definitionId: server.definitionId,
        status: server.status,
        connectionDetails: server.connectionDetails,
        enabled: false
      }];
    });
  };

  const isServerSelected = (serverId: string) => {
    return selectedServers.some(s => s.id === serverId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <h2 className="text-2xl font-semibold mb-6">Select Server</h2>
        
        <div className="flex items-center justify-between mb-6">
          <div className="relative flex-1 mr-4">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search servers..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="show-added"
              checked={showAddedOnly}
              onCheckedChange={setShowAddedOnly}
            />
            <Label htmlFor="show-added">Show Added Only</Label>
          </div>
        </div>
        
        <div className="space-y-3">
          {filteredServers.map(server => (
            <div
              key={server.id}
              className="p-4 border rounded-lg hover:border-primary/50 cursor-pointer transition-all"
              onClick={() => handleServerToggle(server)}
            >
              <div className="flex items-start gap-3">
                <ServerLogo name={server.logoInitials} />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium">{server.name}</h3>
                    {isServerSelected(server.id) && (
                      <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                        Added
                      </Badge>
                    )}
                  </div>
                  
                  <EndpointLabel type={server.type} className="mb-2" />
                  
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {server.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {filteredServers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No servers found matching your search
            </div>
          )}
        </div>
        
        <div className="flex justify-between mt-6 pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              onAddServers(selectedServers);
              onOpenChange(false);
            }}
            className="bg-[#96a4ff] hover:bg-[#7f8eff]"
            disabled={selectedServers.length === 0}
          >
            Next
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
