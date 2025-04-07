
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
import { AddInstanceDialog } from "@/components/servers/AddInstanceDialog";
import { useServerContext } from "@/context/ServerContext";
import { useOnboarding } from "@/context/OnboardingContext";
import { toast } from "sonner";

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
  
  const { openAddInstanceDialog } = useServerContext();
  const { isOnboarding, currentStep, setSelectedServerId, nextStep } = useOnboarding();
  
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
    
    // 模拟安装过程
    setTimeout(() => {
      setIsInstalling(prev => ({ ...prev, [serverId]: false }));
      setInstalledServers(prev => ({ ...prev, [serverId]: true }));
      
      // 如果处于引导模式且当前是第一步，更新状态并继续
      if (isOnboarding && currentStep === "discover") {
        setSelectedServerId(serverId);
        toast.success("服务器已安装成功，请继续创建实例");
      }
      
      // 打开添加实例对话框
      openAddInstanceDialog(server);
    }, 1500);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
  };

  const DialogSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-6">
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <h3 className="text-base font-medium p-4 border-b border-gray-100 dark:border-gray-700">{title}</h3>
        <div className="p-4 text-gray-600 dark:text-gray-300 text-sm">
          {children}
        </div>
      </div>
    </div>
  );

  // 引导流程的高亮提示
  const renderOnboardingHighlight = (server: ServerDefinition) => {
    if (!isOnboarding || currentStep !== "discover") return null;
    
    return (
      <div className="absolute inset-0 border-2 border-primary rounded-lg pointer-events-none animate-pulse" />
    );
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
                <Card key={server.id} className="flex flex-col overflow-hidden hover:shadow-md transition-shadow duration-200 relative">
                  {renderOnboardingHighlight(server)}
                  <CardHeader className="pb-3">
                    <div className="flex flex-col">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl truncate" title={server.name}>{server.name}</CardTitle>
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
                        <p className="text-sm font-medium truncate" title={server.author}>{server.author}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Version</p>
                        <p className="text-sm font-medium truncate" title={server.version}>{server.version}</p>
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
                      <Button 
                        size="sm" 
                        onClick={() => handleInstall(server.id)}
                        className={isOnboarding && currentStep === "discover" ? "animate-pulse" : ""}
                      >
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
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          {selectedServer && (
            <>
              <DialogHeader className="flex flex-col items-start space-y-2 pb-2">
                <div className="w-full">
                  <DialogTitle className="text-2xl font-bold truncate" title={selectedServer.name}>{selectedServer.name}</DialogTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <EndpointLabel type={selectedServer.type} />
                    {selectedServer.isOfficial && <OfficialBadge />}
                  </div>
                </div>
              </DialogHeader>
              
              <div className="space-y-6 mt-4">
                <DialogSection title="Description">
                  {selectedServer.description}
                </DialogSection>
                
                <div className="grid grid-cols-2 gap-6">
                  <DialogSection title="Author">
                    <div className="truncate" title={selectedServer.author}>{selectedServer.author}</div>
                  </DialogSection>
                  
                  <DialogSection title="Version">
                    <div className="truncate" title={selectedServer.version}>{selectedServer.version}</div>
                  </DialogSection>
                </div>
                
                <DialogSection title="Category">
                  <div className="flex flex-wrap gap-2">
                    {selectedServer.categories?.map(category => (
                      <Badge key={category} variant="outline" className="rounded-full">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </DialogSection>
                
                <DialogSection title="Features">
                  <ul className="list-disc list-inside space-y-2">
                    {selectedServer.features?.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </DialogSection>
                
                <DialogSection title="Repository">
                  <a 
                    href="#" 
                    className="text-primary flex items-center hover:underline"
                  >
                    <span className="truncate">{selectedServer.repository}</span>
                    <ExternalLink className="h-3.5 w-3.5 ml-1 flex-shrink-0" />
                  </a>
                </DialogSection>
              </div>
              
              <div className="flex justify-end mt-6 border-t pt-4">
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
                    <Button 
                      onClick={() => handleInstall(selectedServer.id)}
                      className={isOnboarding && currentStep === "discover" ? "animate-pulse" : ""}
                    >
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
