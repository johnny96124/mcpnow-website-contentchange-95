
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { ServerDefinition, profiles } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface AddServerToHostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddServers: (servers: ServerDefinition[]) => void;
}

export function AddServerToHostDialog({
  open,
  onOpenChange,
  onAddServers,
}: AddServerToHostDialogProps) {
  const [selectedTab, setSelectedTab] = useState("serverList");
  const [selectedServers, setSelectedServers] = useState<ServerDefinition[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string>("");

  const handleServerToggle = (server: ServerDefinition) => {
    setSelectedServers(prev => {
      const isSelected = prev.find(s => s.id === server.id);
      if (isSelected) {
        return prev.filter(s => s.id !== server.id);
      }
      return [...prev, server];
    });
  };

  const handleCollectionChange = (collectionId: string) => {
    setSelectedCollection(collectionId);
    // Here you would typically fetch servers from the collection
    // and update selectedServers accordingly
  };

  const handleRemoveServer = (serverId: string) => {
    setSelectedServers(prev => prev.filter(s => s.id !== serverId));
  };

  const handleAddServers = () => {
    onAddServers(selectedServers);
    setSelectedServers([]);
    setSelectedCollection("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Servers</DialogTitle>
        </DialogHeader>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="serverList">Server List</TabsTrigger>
            <TabsTrigger value="collections">From Collections</TabsTrigger>
          </TabsList>

          <TabsContent value="serverList" className="border rounded-md p-4 mt-4">
            <ScrollArea className="h-[300px]">
              {serverDefinitions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No servers available
                </div>
              ) : (
                <div className="space-y-2">
                  {serverDefinitions.map(server => (
                    <div
                      key={server.id}
                      className="flex items-center space-x-3 p-2 hover:bg-muted rounded-md"
                    >
                      <Checkbox
                        checked={selectedServers.some(s => s.id === server.id)}
                        onCheckedChange={() => handleServerToggle(server)}
                      />
                      <div className="flex-1">
                        <div className="font-medium">{server.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {server.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="collections" className="border rounded-md p-4 mt-4">
            <ScrollArea className="h-[300px]">
              {profiles.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No collections available
                </div>
              ) : (
                <div className="space-y-2">
                  {profiles.map(profile => (
                    <div
                      key={profile.id}
                      className="flex items-center space-x-3 p-2 hover:bg-muted rounded-md"
                    >
                      <Checkbox
                        checked={selectedCollection === profile.id}
                        onCheckedChange={() => handleCollectionChange(profile.id)}
                      />
                      <div>
                        <div className="font-medium">{profile.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {profile.description || "No description"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>

        {selectedServers.length > 0 && (
          <div className="mt-4 border rounded-md p-4">
            <div className="text-sm font-medium mb-2">Selected Servers ({selectedServers.length})</div>
            <div className="flex flex-wrap gap-2">
              {selectedServers.map(server => (
                <Badge
                  key={server.id}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {server.name}
                  <button
                    onClick={() => handleRemoveServer(server.id)}
                    className="ml-1 hover:bg-muted rounded"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleAddServers}
            disabled={selectedServers.length === 0}
          >
            Add {selectedServers.length > 0 ? `(${selectedServers.length})` : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
