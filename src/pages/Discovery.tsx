
import { useEffect, useRef, useState } from "react";
import { 
  CheckCircle,
  Download, 
  ExternalLink,
  Info, 
  Loader2, 
  PackagePlus, 
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { EndpointLabel } from "@/components/status/EndpointLabel";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { discoveryItems, ServerDefinition } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { CategoryList } from "@/components/discovery/CategoryList";
import { OfficialBadge } from "@/components/discovery/OfficialBadge";
import { CategoryFilter } from "@/components/discovery/CategoryFilter";
import { EmptyState } from "@/components/discovery/EmptyState";
import { LoadingIndicator } from "@/components/discovery/LoadingIndicator";
import { ScrollArea } from "@/components/ui/scroll-area";

const ITEMS_PER_PAGE = 6;

// Duplicate and modify the discovery items to create more content
const extendedItems = [
  ...discoveryItems,
  // Additional items with slight modifications
  ...discoveryItems.map((item, index) => ({
    ...item,
    id: `extended-${item.id}-${index}`,
    name: `${item.name} Extended`,
  })),
  ...discoveryItems.map((item, index) => ({
    ...item,
    id: `custom-${item.id}-${index}`,
    name: `${item.name} Custom`,
    isOfficial: false,
  }))
];

const Discovery = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedServer, setSelectedServer] = useState<ServerDefinition | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isInstalling, setIsInstalling] = useState<Record<string, boolean>>({});
  const [installedServers, setInstalledServers] = useState<Record<string, boolean>>({});
  const [visibleItems, setVisibleItems] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);
  
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const filteredServers = extendedItems
    .filter(server => 
      (searchQuery === "" || 
        server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        server.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        server.author?.toLowerCase().includes(searchQuery.toLowerCase())
      ) && 
      (selectedCategory === null || 
        server.categories?.includes(selectedCategory)
      )
    );

  const visibleServers = filteredServers.slice(0, visibleItems);
  const hasMore = visibleServers.length < filteredServers.length;

  useEffect(() => {
    // Reset visible items when filters change
    setVisibleItems(ITEMS_PER_PAGE);
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !isLoading) {
          loadMoreItems();
        }
      },
      { rootMargin: "100px" }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [visibleItems, filteredServers.length, isLoading]);

  const loadMoreItems = () => {
    if (!hasMore) return;
    
    setIsLoading(true);
    
    // Simulate network delay for loading more items
    setTimeout(() => {
      setVisibleItems(prev => prev + ITEMS_PER_PAGE);
      setIsLoading(false);
    }, 800);
  };

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

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
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
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search servers..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <CategoryFilter 
          selectedCategory={selectedCategory} 
          onCategoryChange={setSelectedCategory}
        />
      </div>
      
      <ScrollArea className="h-[calc(100vh-220px)] pr-4">
        {filteredServers.length > 0 ? (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {visibleServers.map(server => (
                <Card key={server.id} className="flex flex-col overflow-hidden hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex flex-col">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">{server.name}</CardTitle>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <EndpointLabel type={server.type} />
                        {server.isOfficial && <OfficialBadge />}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {server.description}
                    </p>
                    
                    <div className="mb-4">
                      <CategoryList categories={server.categories || []} maxVisible={3} />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Author</p>
                        <p className="text-sm font-medium">{server.author}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Version</p>
                        <p className="text-sm font-medium">{server.version}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t bg-muted/50 p-3">
                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(server)}>
                      <Info className="h-4 w-4 mr-1" />
                      Details
                    </Button>
                    {installedServers[server.id] ? (
                      <Button variant="outline" size="sm" disabled className="text-green-600">
                        <CheckCircle className="h-4 w-4 mr-1" />
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
            
            {hasMore && (
              <div ref={loadMoreRef} className="py-2">
                {isLoading && <LoadingIndicator />}
              </div>
            )}
          </>
        ) : (
          <EmptyState 
            searchQuery={searchQuery} 
            onReset={handleClearFilters} 
          />
        )}
      </ScrollArea>
      
      {/* Server details dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          {selectedServer && (
            <>
              <DialogHeader className="flex flex-col items-start space-y-2">
                <div>
                  <DialogTitle className="text-2xl">{selectedServer.name}</DialogTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <EndpointLabel type={selectedServer.type} />
                    {selectedServer.isOfficial && <OfficialBadge />}
                  </div>
                </div>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="rounded-lg bg-muted/50 p-4">
                  <h3 className="text-base font-medium mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedServer.description}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Author</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedServer.author}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Version</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedServer.version}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Category</h3>
                  <div className="flex flex-wrap">
                    {selectedServer.categories?.map(category => (
                      <Badge key={category} variant="outline" className="mr-2 mb-2">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Features</h3>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {selectedServer.features?.map((feature, index) => (
                      <li key={index} className="text-muted-foreground">{feature}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Repository</h3>
                  <a 
                    href="#" 
                    className="text-sm text-primary flex items-center hover:underline"
                  >
                    {selectedServer.repository}
                    <ExternalLink className="h-3.5 w-3.5 ml-1" />
                  </a>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <div className="flex gap-3">
                  <DialogClose asChild>
                    <Button variant="outline">Close</Button>
                  </DialogClose>
                  
                  {installedServers[selectedServer.id] ? (
                    <Button variant="outline" disabled className="text-green-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Installed
                    </Button>
                  ) : isInstalling[selectedServer.id] ? (
                    <Button disabled>
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
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Discovery;
