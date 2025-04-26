
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, X, List, Folder, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { serverDefinitions } from "@/data/mockData";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

interface AddServerToHostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddServers: (serverIds: string[]) => void;
}

export function AddServerToHostDialog({
  open,
  onOpenChange,
  onAddServers
}: AddServerToHostDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedServers, setSelectedServers] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("servers");

  const filteredServers = serverDefinitions.filter(server => 
    server.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleServerToggle = (serverId: string) => {
    setSelectedServers(prev => {
      if (prev.includes(serverId)) {
        return prev.filter(id => id !== serverId);
      }
      return [...prev, serverId];
    });
  };

  const handleRemoveServer = (serverId: string) => {
    setSelectedServers(prev => prev.filter(id => id !== serverId));
  };

  const handleSave = () => {
    onAddServers(selectedServers);
    setSelectedServers([]);
    setSearchQuery("");
    onOpenChange(false);
  };

  const getSelectedServerNames = () => {
    return selectedServers.map(id => {
      const server = serverDefinitions.find(s => s.id === id);
      return server?.name || "";
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Configure Host Services</DialogTitle>
          <DialogDescription>
            Select services to run on this host
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="servers" className="flex-1">
              <List className="h-4 w-4 mr-2" />
              Server List
            </TabsTrigger>
            <TabsTrigger value="collections" className="flex-1">
              <Folder className="h-4 w-4 mr-2" />
              From Collections
            </TabsTrigger>
          </TabsList>

          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search servers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <TabsContent value="servers" className="mt-4">
            {filteredServers.length === 0 ? (
              <Card className="p-8 flex flex-col items-center justify-center text-center">
                <p className="text-muted-foreground">No servers found</p>
                <p className="text-sm text-muted-foreground mt-1">Try adjusting your search terms</p>
              </Card>
            ) : (
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-2">
                  {filteredServers.map((server) => (
                    <div
                      key={server.id}
                      className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent"
                    >
                      <Checkbox
                        checked={selectedServers.includes(server.id)}
                        onCheckedChange={() => handleServerToggle(server.id)}
                        id={`server-${server.id}`}
                      />
                      <label
                        htmlFor={`server-${server.id}`}
                        className="flex-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {server.icon && <span className="mr-2">{server.icon}</span>}
                        {server.name}
                      </label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>

          <TabsContent value="collections" className="mt-4">
            <Card className="p-8 flex flex-col items-center justify-center text-center">
              <Folder className="h-12 w-12 text-muted-foreground opacity-50 mb-4" />
              <p className="text-muted-foreground">No collections available</p>
              <Button variant="outline" className="mt-4">
                Create Collection
              </Button>
            </Card>
          </TabsContent>
        </Tabs>

        {selectedServers.length > 0 && (
          <>
            <Separator className="my-4" />
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Selected Servers</h4>
              <div className="flex flex-wrap gap-2">
                {getSelectedServerNames().map((name, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {name}
                    <button
                      onClick={() => handleRemoveServer(selectedServers[index])}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}

        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button 
            onClick={handleSave} 
            disabled={selectedServers.length === 0}
          >
            {selectedServers.length === 0 
              ? "No Servers Selected" 
              : `Add ${selectedServers.length} Server${selectedServers.length > 1 ? 's' : ''}`
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
