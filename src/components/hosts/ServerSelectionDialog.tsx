
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Server, Info } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { EndpointLabel } from "@/components/status/EndpointLabel";
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
      setSelectedServers([]);
      setShowAddedOnly(false);
    }
  }, [open]);

  const availableServers = serverDefinitions.map(def => ({
    id: `server-${def.id}`,
    name: def.name,
    definitionId: def.id,
    status: "stopped" as Status, // Explicitly casting to Status type
    connectionDetails: def.url || "",
    enabled: false,
    description: def.description,
    type: def.type
  }));

  const filteredServers = availableServers.filter(server => {
    const matchesSearch = server.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (showAddedOnly) {
      return matchesSearch && selectedServers.some(s => s.id === server.id);
    }
    return matchesSearch;
  });

  const handleServerClick = (server: ServerInstance) => {
    setSelectedServers(prev => {
      const isSelected = prev.some(s => s.id === server.id);
      if (isSelected) {
        return prev.filter(s => s.id !== server.id);
      }
      return [...prev, server];
    });
  };

  const handleAddServers = () => {
    onAddServers(selectedServers);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Select Server</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search servers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8"
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

          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
            {filteredServers.map((server) => {
              const isSelected = selectedServers.some(s => s.id === server.id);
              
              return (
                <div
                  key={server.id}
                  onClick={() => handleServerClick(server)}
                  className={`flex items-start space-x-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                    isSelected ? "border-primary bg-primary/5" : "hover:border-primary/30 hover:bg-muted/20"
                  }`}
                >
                  <div className="h-12 w-12 flex items-center justify-center bg-muted rounded-lg text-2xl font-mono">
                    {server.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{server.name}</h3>
                      {isSelected && (
                        <Badge variant="secondary">Added</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {server.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <EndpointLabel type={server.type} />
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredServers.length === 0 && (
              <div className="text-center py-8 border border-dashed rounded-lg">
                <Server className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  {searchQuery
                    ? `No servers matching "${searchQuery}"`
                    : "No servers available"}
                </p>
                {searchQuery && (
                  <Button
                    variant="link"
                    className="mt-2"
                    onClick={() => setSearchQuery("")}
                  >
                    Clear search
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleAddServers}
            disabled={selectedServers.length === 0}
          >
            Next
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
