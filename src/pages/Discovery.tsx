
import { useState } from "react";
import { 
  Download, 
  Info, 
  Loader2, 
  PackagePlus, 
  Search, 
  SortAsc, 
  Star 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { EndpointLabel } from "@/components/status/EndpointLabel";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { discoveryItems, ServerDefinition } from "@/data/mockData";

const Discovery = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "type" | "author">("name");
  const [selectedServer, setSelectedServer] = useState<ServerDefinition | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isInstalling, setIsInstalling] = useState<Record<string, boolean>>({});
  const [installedServers, setInstalledServers] = useState<Record<string, boolean>>({});
  
  const filteredServers = discoveryItems
    .filter(server => 
      server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      server.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      server.author?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "type") return a.type.localeCompare(b.type);
      if (sortBy === "author" && a.author && b.author) return a.author.localeCompare(b.author);
      return 0;
    });

  const handleViewDetails = (server: ServerDefinition) => {
    setSelectedServer(server);
    setIsDialogOpen(true);
  };

  const handleInstall = (serverId: string) => {
    setIsInstalling(prev => ({ ...prev, [serverId]: true }));
    
    // Simulate installation process
    setTimeout(() => {
      setIsInstalling(prev => ({ ...prev, [serverId]: false }));
      setInstalledServers(prev => ({ ...prev, [serverId]: true }));
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Discovery</h1>
          <p className="text-muted-foreground">
            Browse and install MCP server definitions
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search servers..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <SortAsc className="h-4 w-4 mr-2" />
              Sort By
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Sort options</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setSortBy("name")}>
              Name {sortBy === "name" && "✓"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("type")}>
              Type {sortBy === "type" && "✓"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("author")}>
              Author {sortBy === "author" && "✓"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredServers.map(server => (
          <Card key={server.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{server.icon}</span>
                <div>
                  <CardTitle>{server.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <EndpointLabel type={server.type} />
                    <span>v{server.version}</span>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {server.description}
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Author</p>
                  <p className="text-sm text-muted-foreground">{server.author}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <Star className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t bg-muted/50 p-2">
              <Button variant="ghost" size="sm" onClick={() => handleViewDetails(server)}>
                <Info className="h-4 w-4 mr-1" />
                Details
              </Button>
              {installedServers[server.id] ? (
                <Button variant="outline" size="sm" disabled className="text-green-600">
                  <Download className="h-4 w-4 mr-1" />
                  Installed
                </Button>
              ) : isInstalling[server.id] ? (
                <Button variant="outline" size="sm" disabled>
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  Installing...
                </Button>
              ) : (
                <Button size="sm" onClick={() => handleInstall(server.id)}>
                  <PackagePlus className="h-4 w-4 mr-1" />
                  Add Server
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {/* Server details dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          {selectedServer && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{selectedServer.icon}</span>
                  <DialogTitle>{selectedServer.name}</DialogTitle>
                </div>
                <DialogDescription className="flex items-center gap-2">
                  <EndpointLabel type={selectedServer.type} />
                  <span>Version {selectedServer.version}</span>
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Description</h4>
                  <p className="text-sm">{selectedServer.description}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Author</h4>
                  <p className="text-sm">{selectedServer.author}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Capabilities</h4>
                  <ul className="list-disc list-inside text-sm">
                    <li>Supports custom environment variables</li>
                    <li>Configurable connection parameters</li>
                    <li>Auto-restart on failure</li>
                    <li>Detailed logging and diagnostics</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Repository</h4>
                  <a 
                    href="#" 
                    className="text-sm text-primary underline underline-offset-2"
                  >
                    https://github.com/mcp/{selectedServer.id}
                  </a>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                {installedServers[selectedServer.id] ? (
                  <Button variant="outline" disabled className="text-green-600">
                    <Download className="h-4 w-4 mr-1" />
                    Installed
                  </Button>
                ) : isInstalling[selectedServer.id] ? (
                  <Button variant="outline" disabled>
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    Installing...
                  </Button>
                ) : (
                  <Button onClick={() => handleInstall(selectedServer.id)}>
                    <PackagePlus className="h-4 w-4 mr-1" />
                    Add Server
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Discovery;
