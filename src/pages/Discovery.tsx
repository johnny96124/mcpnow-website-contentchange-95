import { useEffect, useRef, useState } from "react";
import { 
  CheckCircle,
  Download, 
  ExternalLink,
  Info, 
  Loader2, 
  Search,
  X
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
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const ITEMS_PER_PAGE = 6;

const extendedItems = [
  ...discoveryItems,
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
  
  const { toast } = useToast();
  
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
    const server = extendedItems.find(item => item.id === serverId);
    if (!server) return;
    
    setIsInstalling(prev => ({ ...prev, [serverId]: true }));
    
    setTimeout(() => {
      setIsInstalling(prev => ({ ...prev, [serverId]: false }));
      setInstalledServers(prev => ({ ...prev, [serverId]: true }));
      
      toast({
        title: "Server installed",
        description: `${server.name} has been successfully installed.`,
      });
    }, 1500);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
  };

  const formatDownloadCount = (count: number) => {
    return `${(count / 1000).toFixed(1)}K`;
  };

  const InfoSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-4">
      <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1 px-4 pt-4">{title}</h3>
        <div className="p-4 pt-0 text-gray-900 dark:text-gray-100">
          {children}
        </div>
      </div>
    </div>
  );

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
                <Card key={server.id} className="flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="pb-2 space-y-0">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="text-xl">{server.name}</CardTitle>
                        <div className="flex items-center gap-1">
                          <EndpointLabel type={server.type} />
                          {server.isOfficial && <OfficialBadge />}
                        </div>
                      </div>
                      <Badge variant="outline" className="flex items-center gap-1 py-1 px-2 bg-amber-50 text-amber-600 border-amber-200">
                        <Download className="h-3 w-3" />
                        {formatDownloadCount(1320)}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-1 pt-4">
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {server.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {['DevOps', 'Containers', 'Infrastructure'].map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs py-1 bg-gray-50 text-gray-700 border-gray-200">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Author</p>
                        <p className="text-sm font-medium">{server.author || `${server.name.split(' ')[0]} Community`}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Version</p>
                        <p className="text-sm font-medium">{server.version || (Math.random() > 0.5 ? '2.1.0' : '0.9.5')}</p>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between border-t bg-gray-50 dark:bg-gray-800/50 p-3 mt-4">
                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(server)}>
                      <Info className="h-4 w-4 mr-1" />
                      Details
                    </Button>
                    
                    {installedServers[server.id] ? (
                      <Button variant="outline" size="sm" className="text-green-600 bg-green-50 border-green-200 hover:bg-green-100">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Installed
                      </Button>
                    ) : isInstalling[server.id] ? (
                      <Button variant="outline" size="sm" disabled className="bg-blue-50 text-blue-600 border-blue-200">
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        Installing...
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        onClick={() => handleInstall(server.id)}
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Install Server
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
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden bg-white dark:bg-gray-900">
          {selectedServer && (
            <div className="h-full">
              <div className="flex justify-between items-center p-5 pb-2">
                <div className="space-y-1">
                  <DialogTitle className="text-2xl font-bold leading-tight">
                    {selectedServer.name}
                  </DialogTitle>
                  <div className="flex items-center gap-2">
                    <EndpointLabel type={selectedServer.type} />
                    {selectedServer.isOfficial && <OfficialBadge />}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="flex items-center gap-1 py-1 px-2 bg-amber-50 text-amber-600 border-amber-200">
                    <Download className="h-3 w-3" />
                    {formatDownloadCount(1320)}
                  </Badge>
                  <DialogClose className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800">
                    <X className="h-5 w-5" />
                  </DialogClose>
                </div>
              </div>
              
              <div className="px-5 space-y-4 pb-6">
                <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Description</h3>
                  <p>{selectedServer.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Author</h3>
                    <p className="font-medium">
                      {selectedServer.author || `${selectedServer.name.split(' ')[0]} Community`}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Version</h3>
                    <p className="font-medium">
                      {selectedServer.version || (Math.random() > 0.5 ? '1.5.0' : '0.9.5')}
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Category</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedServer.categories?.map(category => (
                      <Badge key={category} variant="outline" className="py-1 px-2 bg-gray-50 text-gray-700 border-gray-200">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Features</h3>
                  <ul className="list-disc list-inside space-y-1 ml-1">
                    {selectedServer.features?.map((feature, index) => (
                      <li key={index} className="text-sm">{feature}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Repository</h3>
                  <a 
                    href="#" 
                    className="text-blue-500 flex items-center hover:underline text-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {selectedServer.repository || 'github.com/Docker Community/docker assistant'}
                    <ExternalLink className="h-3.5 w-3.5 ml-1" />
                  </a>
                </div>
              </div>
              
              <div className="flex justify-end p-4 border-t gap-2 bg-gray-50 dark:bg-gray-800/50">
                {installedServers[selectedServer.id] ? (
                  <div className="flex gap-2">
                    <Button variant="outline" className="text-green-600 bg-green-50 border-green-200 hover:bg-green-100">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Installed
                    </Button>
                    <Button variant="outline">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Check
                    </Button>
                  </div>
                ) : isInstalling[selectedServer.id] ? (
                  <Button disabled className="bg-blue-50 text-blue-600 border-blue-200">
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    Installing...
                  </Button>
                ) : (
                  <Button onClick={() => handleInstall(selectedServer.id)} className="bg-blue-500 hover:bg-blue-600">
                    <Download className="h-4 w-4 mr-1" />
                    Install Server
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Discovery;
