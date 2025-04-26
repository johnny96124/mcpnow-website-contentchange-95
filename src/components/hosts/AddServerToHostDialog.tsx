
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Search, List, FolderOpen, X, Server, Plus } from "lucide-react";
import { ServerDefinition } from "@/data/mockData";

interface AddServerToHostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddServers: (servers: ServerDefinition[]) => void;
  availableServers: ServerDefinition[];
  collections?: { id: string; name: string; servers: ServerDefinition[] }[];
}

export function AddServerToHostDialog({
  open,
  onOpenChange,
  onAddServers,
  availableServers,
  collections = []
}: AddServerToHostDialogProps) {
  const [activeTab, setActiveTab] = useState<"servers" | "collections">("servers");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedServers, setSelectedServers] = useState<ServerDefinition[]>([]);
  
  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedServers([]);
      setSearchQuery("");
    }
  }, [open]);

  // Filter servers based on search query
  const filteredServers = availableServers.filter(server => 
    server.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleServerSelection = (server: ServerDefinition) => {
    setSelectedServers(prev => {
      const isAlreadySelected = prev.some(s => s.id === server.id);
      
      if (isAlreadySelected) {
        return prev.filter(s => s.id !== server.id);
      } else {
        return [...prev, server];
      }
    });
  };

  const removeSelectedServer = (serverId: string) => {
    setSelectedServers(prev => prev.filter(s => s.id !== serverId));
  };

  const addAllServersFromCollection = (collectionId: string) => {
    const collection = collections.find(c => c.id === collectionId);
    if (collection) {
      const newServers = collection.servers.filter(
        server => !selectedServers.some(s => s.id === server.id)
      );
      
      setSelectedServers(prev => [...prev, ...newServers]);
    }
  };

  const handleSave = () => {
    onAddServers(selectedServers);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configure Host Services</DialogTitle>
          <DialogDescription>
            Choose services to run on this host
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "servers" | "collections")}>
          <TabsList className="grid grid-cols-2 w-full mb-4">
            <TabsTrigger value="servers" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              <span>Service List</span>
            </TabsTrigger>
            <TabsTrigger value="collections" className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              <span>Add from Collections</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="servers" className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <ScrollArea className="h-[300px] border rounded-md p-4">
              {filteredServers.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <Server className="h-12 w-12 text-muted-foreground mb-2" />
                  <h3 className="font-semibold">No services found</h3>
                  <p className="text-muted-foreground text-sm">
                    {searchQuery ? "Try a different search term" : "No services available to add"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredServers.map((server) => {
                    const isSelected = selectedServers.some(s => s.id === server.id);
                    return (
                      <div 
                        key={server.id} 
                        className="flex items-start gap-3 p-3 rounded-md hover:bg-muted/50 cursor-pointer"
                        onClick={() => toggleServerSelection(server)}
                      >
                        <Checkbox 
                          id={`server-${server.id}`}
                          checked={isSelected}
                          onCheckedChange={() => toggleServerSelection(server)}
                        />
                        <div className="flex-1">
                          <label 
                            htmlFor={`server-${server.id}`} 
                            className="text-base font-medium cursor-pointer flex items-center"
                          >
                            {server.name}
                          </label>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {server.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="collections" className="space-y-4">
            <ScrollArea className="h-[350px]">
              {collections.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center p-4 border rounded-md">
                  <FolderOpen className="h-12 w-12 text-muted-foreground mb-2" />
                  <h3 className="font-semibold">No collections found</h3>
                  <p className="text-muted-foreground text-sm">
                    You don't have any service collections yet
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {collections.map((collection) => (
                    <div key={collection.id} className="border rounded-md overflow-hidden">
                      <div className="bg-muted/50 p-3 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <FolderOpen className="h-5 w-5 text-muted-foreground" />
                          <span className="font-medium">{collection.name}</span>
                        </div>
                        <Badge variant="outline">{collection.servers.length} services</Badge>
                      </div>
                      
                      <div className="p-3 space-y-2">
                        <div className="flex flex-wrap gap-2">
                          {collection.servers.slice(0, 3).map(server => (
                            <Badge key={server.id} variant="secondary" className="text-xs">
                              {server.name}
                            </Badge>
                          ))}
                          {collection.servers.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{collection.servers.length - 3} more
                            </Badge>
                          )}
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full mt-2"
                          onClick={() => addAllServersFromCollection(collection.id)}
                        >
                          Add all services from this collection
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <div className="border-t pt-4 mt-2">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-semibold">Selected Services</h4>
            <span className="text-sm text-muted-foreground">{selectedServers.length}</span>
          </div>
          
          {selectedServers.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-4 border rounded-md">
              No services selected yet
            </div>
          ) : (
            <ScrollArea className="h-[100px] border rounded-md p-2">
              <div className="flex flex-wrap gap-2">
                {selectedServers.map(server => (
                  <Badge key={server.id} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                    {server.name}
                    <Button
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 rounded-full hover:bg-muted-foreground/20" 
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSelectedServer(server.id);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          <Button 
            variant="ghost" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={selectedServers.length === 0}
          >
            Add Services
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
