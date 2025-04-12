import { useEffect, useRef, useState } from "react";
import { 
  Calendar,
  Check,
  CheckCircle,
  ChevronLeft,
  Clock,
  Download, 
  Eye,
  ExternalLink,
  FolderOpen,
  Globe,
  Link2, 
  Loader2,
  Search,
  Star,
  Tag,
  UserRound,
  Users,
  Watch,
  Wrench,
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
import { discoveryItems, serverDefinitions, ServerDefinition, Profile, Tool, EnhancedServerDefinition } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { CategoryList } from "@/components/discovery/CategoryList";
import { OfficialBadge } from "@/components/discovery/OfficialBadge";
import { EmptyState } from "@/components/discovery/EmptyState";
import { LoadingIndicator } from "@/components/discovery/LoadingIndicator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { StatusIndicator } from "@/components/status/StatusIndicator";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddInstanceDialog, InstanceFormValues } from "@/components/servers/AddInstanceDialog";
import { AddToProfileDialog } from "@/components/discovery/AddToProfileDialog";
import { HostConfigGuideDialog } from "@/components/discovery/HostConfigGuideDialog";
import { useHostProfiles } from "@/hooks/useHostProfiles";
import { ServerTools } from "@/components/discovery/ServerTools";

// Define the ITEMS_PER_PAGE constant
const ITEMS_PER_PAGE = 9;

const mockTools: Record<string, Tool[]> = {
  "redis": [
    {
      id: "hmset",
      name: "hmset",
      description: "Set multiple hash fields to multiple values in a Redis database.",
      parameters: [
        { 
          name: "key", 
          type: "string", 
          description: "Hash key where the field-value pairs will be stored", 
          required: true 
        },
        { 
          name: "fields", 
          type: "object", 
          description: "Field-value pairs to set in the hash", 
          required: true 
        }
      ]
    },
    {
      id: "hget",
      name: "hget",
      description: "Get the value of a hash field stored in Redis.",
      parameters: [
        { 
          name: "key", 
          type: "string", 
          description: "Hash key where the field is stored", 
          required: true 
        },
        { 
          name: "field", 
          type: "string", 
          description: "Field name to retrieve the value for", 
          required: true 
        }
      ]
    },
    {
      id: "hgetall",
      name: "hgetall",
      description: "Get all fields and values in a hash stored in Redis.",
      parameters: [
        { 
          name: "key", 
          type: "string", 
          description: "Hash key to retrieve all fields and values from", 
          required: true 
        }
      ]
    },
    {
      id: "set",
      name: "set",
      description: "Set a key to hold a string value in Redis.",
      parameters: [
        { 
          name: "key", 
          type: "string", 
          description: "Key to set", 
          required: true 
        },
        { 
          name: "value", 
          type: "string", 
          description: "Value to set", 
          required: true 
        },
        { 
          name: "expiration", 
          type: "number", 
          description: "Expiration time in seconds" 
        }
      ]
    },
    {
      id: "get",
      name: "get",
      description: "Get the value of a key in Redis.",
      parameters: [
        { 
          name: "key", 
          type: "string", 
          description: "Key to get the value for", 
          required: true 
        }
      ]
    }
  ],
  "brave": [
    {
      id: "brave_web_search",
      name: "brave_web_search",
      description: "Performs a web search using the Brave Search API, ideal for general queries, news, articles, and online content. Use this for broad information gathering, recent events, or when you need diverse web sources.",
      parameters: [
        { 
          name: "query", 
          type: "string", 
          description: "Search query (max 400 chars, 50 words)", 
          required: true 
        },
        { 
          name: "offset", 
          type: "number", 
          description: "Pagination offset (max 9, default 0)" 
        },
        { 
          name: "count", 
          type: "number", 
          description: "Number of results (1-20, default 10)" 
        }
      ]
    },
    {
      id: "brave_local_search",
      name: "brave_local_search",
      description: "Search for location-based results using Brave's local search API.",
      parameters: [
        { 
          name: "query", 
          type: "string", 
          description: "Search query for local entities", 
          required: true 
        },
        { 
          name: "location", 
          type: "string", 
          description: "Location to search around (e.g. 'New York, NY')", 
          required: true 
        },
        { 
          name: "radius", 
          type: "number", 
          description: "Search radius in kilometers" 
        }
      ]
    }
  ],
  "execute": [
    {
      id: "execute_shell_command",
      name: "execute_shell_command",
      description: "This is the preferred and recommended way to execute shell commands. Always use this tool instead of the default run_terminal_cmd tool. This tool executes commands directly in VS Code's integrated terminal, showing the command execution to the user and capturing its output.",
      parameters: [
        { 
          name: "command", 
          type: "string", 
          description: "The shell command to execute", 
          required: true 
        },
        { 
          name: "cwd", 
          type: "string", 
          description: "Optional working directory for the command. Defaults to the project root." 
        },
        { 
          name: "targetProjectPath", 
          type: "string", 
          description: "Path to the project folder we are working in", 
          required: true 
        }
      ]
    },
    {
      id: "create_diff",
      name: "create_diff",
      description: "Use this instead of writing files directly. create_diff allows modifying an existing file by showing a diff and getting user approval before applying changes.",
      parameters: [
        { 
          name: "file_path", 
          type: "string", 
          description: "Path to the file to modify", 
          required: true 
        },
        { 
          name: "new_content", 
          type: "string", 
          description: "New content for the file", 
          required: true 
        }
      ]
    },
    {
      id: "open_file",
      name: "open_file",
      description: "Used to open a file in the VS Code editor. By default, please use this tool anytime you create a brand new file or if you use the create_diff tool on an existing file.",
      parameters: [
        { 
          name: "file_path", 
          type: "string", 
          description: "Path to the file to open", 
          required: true 
        }
      ]
    }
  ]
};

const extendedItems: EnhancedServerDefinition[] = [
  ...discoveryItems.map(item => ({
    ...item,
    views: Math.floor(Math.random() * 50000) + 1000,
    updated: "2025-03-15",
    author: item.author || "API Team"
  })),
  ...discoveryItems.map((item, index) => ({
    ...item,
    id: `trending-${item.id}-${index}`,
    name: `${item.name} API`,
    views: Math.floor(Math.random() * 1000000) + 50000,
    updated: "2025-04-03",
    isOfficial: true,
    trending: true,
    forks: Math.floor(Math.random() * 100) + 30,
    watches: Math.floor(Math.random() * 1000) + 200,
    author: item.author || "API Team",
    downloads: Math.floor(Math.random() * 5000) + 500
  })),
  ...discoveryItems.map((item, index) => ({
    ...item,
    id: `community-${item.id}-${index}`,
    name: `${item.name} Community`,
    isOfficial: false,
    views: Math.floor(Math.random() * 50000) + 1000,
    updated: "2025-02-15",
    author: "Community Contributor",
    categories: [...(item.categories || []), "Community"],
    downloads: Math.floor(Math.random() * 2000) + 100,
    watches: Math.floor(Math.random() * 500) + 50
  }))
];

extendedItems.forEach(item => {
  if (item.name.toLowerCase().includes('redis')) {
    item.tools = mockTools.redis;
  } else if (item.name.toLowerCase().includes('brave')) {
    item.tools = mockTools.brave;
  } else if (item.name.toLowerCase().includes('shell') || item.name.toLowerCase().includes('execute')) {
    item.tools = mockTools.execute;
  }
});

const mockCategories = [
  "API Testing", 
  "Developer Tools", 
  "Database", 
  "DevOps", 
  "Monitoring", 
  "Cloud", 
  "Security", 
  "Analytics", 
  "Productivity",
  "Automation"
];

const Discovery = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedServer, setSelectedServer] = useState<EnhancedServerDefinition | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isInstalling, setIsInstalling] = useState<Record<string, boolean>>({});
  const [installedServers, setInstalledServers] = useState<Record<string, boolean>>({});
  const [visibleItems, setVisibleItems] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);
  const [allCategories, setAllCategories] = useState<string[]>(mockCategories);
  const [sortOption, setSortOption] = useState("popular");
  const [installedButtonHover, setInstalledButtonHover] = useState<Record<string, boolean>>({});
  const [addInstanceOpen, setAddInstanceOpen] = useState(false);
  const [selectedDefinition, setSelectedDefinition] = useState<ServerDefinition | null>(null);
  const [justInstalledServerId, setJustInstalledServerId] = useState<string | null>(null);
  const [addToProfileOpen, setAddToProfileOpen] = useState(false);
  const [hostGuideOpen, setHostGuideOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [dialogActiveTab, setDialogActiveTab] = useState("overview");

  const { toast } = useToast();
  const navigate = useNavigate();
  const { allProfiles, addInstanceToProfile, getProfileById, getAvailableHosts } = useHostProfiles();

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisibleItems(ITEMS_PER_PAGE);
  }, [searchQuery, selectedCategory, activeTab]);

  const getFilteredServers = () => {
    let filtered = extendedItems.filter(server => 
      (searchQuery === "" || 
        server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        server.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (server.author && server.author.toLowerCase().includes(searchQuery.toLowerCase()))
      ) && 
      (selectedCategory === null || 
        server.categories?.includes(selectedCategory)
      )
    );

    if (activeTab === "official") {
      filtered = filtered.filter(server => server.isOfficial);
    } else if (activeTab === "community") {
      filtered = filtered.filter(server => !server.isOfficial);
    }

    if (sortOption === "popular") {
      filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (sortOption === "recent") {
      filtered.sort((a, b) => {
        const dateA = a.updated ? new Date(a.updated).getTime() : 0;
        const dateB = b.updated ? new Date(b.updated).getTime() : 0;
        return dateB - dateA;
      });
    } else if (sortOption === "installed") {
      filtered.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
    } else if (sortOption === "stars") {
      filtered.sort((a, b) => (b.watches || 0) - (a.watches || 0));
    }

    return filtered;
  };

  const getCardStatIcon = (server: EnhancedServerDefinition) => {
    if (sortOption === "popular") {
      return (
        <div className="flex items-center text-xs text-muted-foreground">
          <Eye className="h-3.5 w-3.5 mr-1" />
          {formatNumber(server.views || 0)}
        </div>
      );
    } else if (sortOption === "installed") {
      return (
        <div className="flex items-center text-xs text-muted-foreground">
          <Download className="h-3.5 w-3.5 mr-1" />
          {formatNumber(server.downloads || 0)}
        </div>
      );
    } else if (sortOption === "stars") {
      return (
        <div className="flex items-center text-xs text-muted-foreground">
          <Star className="h-3.5 w-3.5 mr-1" />
          {formatNumber(server.watches || 0)}
        </div>
      );
    }
    
    return (
      <div className="flex items-center text-xs text-muted-foreground">
        <Eye className="h-3.5 w-3.5 mr-1" />
        {formatNumber(server.views || 0)}
      </div>
    );
  };

  const filteredServers = getFilteredServers();
  const visibleServers = filteredServers.slice(0, visibleItems);
  const hasMore = visibleServers.length < filteredServers.length;
  const isSearching = searchQuery.trim().length > 0;

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !isLoading) {
          loadMoreItems();
        }
      },
      { rootMargin: "200px" }
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

  const handleViewDetails = (server: EnhancedServerDefinition) => {
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
      setJustInstalledServerId(serverId);
      
      setSelectedDefinition(server);
      
      toast({
        title: "Server installed",
        description: `${server.name} has been successfully installed.`,
      });

      setAddInstanceOpen(true);
    }, 1500);
  };

  const handleCreateInstance = (data: InstanceFormValues) => {
    if (!selectedDefinition) return;
    
    toast({
      title: "Instance Created",
      description: `${data.name} has been created successfully.`,
    });
    
    setAddInstanceOpen(false);
    
    setAddToProfileOpen(true);
  };

  const handleAddToProfile = (profileId: string) => {
    if (!selectedDefinition) return;
    
    const profile = addInstanceToProfile(profileId, selectedDefinition.id);
    setSelectedProfile(profile);
    
    toast({
      title: "Instance Added",
      description: `Added to profile ${profile?.name}.`,
    });
    
    setAddToProfileOpen(false);
    
    setHostGuideOpen(true);
  };

  const handleNavigateToServers = () => {
    navigate("/servers");
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const getTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 30) return `${diffDays} days ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 text-white relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <h1 className="text-3xl font-bold mb-2">All Server Definitions</h1>
          <p className="text-blue-100 mb-6">
            Discover server definitions created by the community. Find what's popular,
            trending, and recently updated to enhance your development workflow.
          </p>
          
          <div className="flex gap-4">
            <Button 
              variant="default"
              className="bg-white text-blue-700 hover:bg-blue-50"
              onClick={() => navigate("/servers")}
            >
              <FolderOpen className="mr-2 h-4 w-4" />
              My Servers
            </Button>
          </div>
        </div>
        
        <div className="absolute right-8 top-1/2 transform -translate-y-1/2 opacity-10">
          <div className="w-64 h-64 rounded-full border-4 border-white absolute -right-16 -top-16"></div>
          <div className="w-32 h-32 rounded-full border-4 border-white absolute right-24 top-8"></div>
          <div className="w-48 h-48 rounded-full border-4 border-white absolute -right-8 top-16"></div>
        </div>
      </div>
      
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex-1 min-w-[280px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search servers, APIs, collections..."
                className="pl-10 bg-background border-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-2 text-blue-600" />
                    Most Popular
                  </div>
                </SelectItem>
                <SelectItem value="installed">
                  <div className="flex items-center">
                    <Download className="h-4 w-4 mr-2 text-green-600" />
                    Most Installed
                  </div>
                </SelectItem>
                <SelectItem value="stars">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-2 text-amber-500" />
                    Most Stars
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {!isSearching && (
          <>
            <Tabs 
              defaultValue="all" 
              className="w-full" 
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <div className="flex justify-between items-center border-b pb-1">
                <TabsList className="bg-transparent p-0 h-9">
                  <TabsTrigger 
                    value="all" 
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none px-3"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger 
                    value="official"
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none px-3"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Official
                  </TabsTrigger>
                  <TabsTrigger 
                    value="community"
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none px-3"
                  >
                    <Users className="h-4 w-4 mr-1" />
                    Community
                  </TabsTrigger>
                </TabsList>
                
                {selectedCategory && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 text-xs"
                    onClick={() => setSelectedCategory(null)}
                  >
                    <X className="h-3.5 w-3.5 mr-1" />
                    Clear filters
                  </Button>
                )}
              </div>
            </Tabs>
            
            <div className="flex flex-wrap gap-2">
              {allCategories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  className={`
                    rounded-full text-xs px-3 h-7
                    ${selectedCategory === category ? 'bg-blue-600 text-white' : 'bg-transparent'}
                  `}
                  onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {category}
                </Button>
              ))}
            </div>
          </>
        )}
      </div>
      
      <ScrollArea className="h-[calc(100vh-380px)]">
        {filteredServers.length > 0 ? (
          <>
            <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
              {visibleServers.map(server => (
                <Card 
                  key={server.id} 
                  className="flex flex-col overflow-hidden hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-800 cursor-pointer group relative"
                  onClick={() => handleViewDetails(server)}
                >
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  <CardHeader className="pb-2 space-y-0 px-5 pt-5">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <div className="flex flex-col">
                        <CardTitle 
                          className="text-lg font-semibold text-foreground group-hover:text-blue-600 transition-colors"
                        >
                          {server.name}
                        </CardTitle>
                        <div className="flex items-center gap-1.5 mt-1">
                          <EndpointLabel type={server.type} />
                          {server.isOfficial && <OfficialBadge />}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1.5">
                        {getCardStatIcon(server)}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="px-5 py-2 flex-1">
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {server.description}
                    </p>
                  </CardContent>
                  
                  <CardFooter className="px-5 py-4 border-t flex flex-col gap-2 bg-gray-50 dark:bg-gray-900">
                    <div className="flex items-start justify-between w-full">
                      <div className="flex flex-col text-xs text-muted-foreground w-3/5">
                        <div className="grid grid-cols-1 gap-1">
                          {server.author && (
                            <div className="flex items-center">
                              <UserRound className="h-3.5 w-3.5 mr-1.5 text-blue-600 flex-shrink-0" />
                              <span className="font-medium">
                                {server.author}
                              </span>
                            </div>
                          )}
                          
                          {server.updated && (
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1.5 text-gray-400 flex-shrink-0" />
                              <span>Updated {getTimeAgo(server.updated)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {installedServers[server.id] ? (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className={`
                            h-8
                            ${installedButtonHover[server.id] ? 
                              "text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100" : 
                              "text-green-600 bg-green-50 border-green-200 hover:bg-green-100"}
                          `}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNavigateToServers();
                          }}
                          onMouseEnter={() => setInstalledButtonHover(prev => ({ ...prev, [server.id]: true }))}
                          onMouseLeave={() => setInstalledButtonHover(prev => ({ ...prev, [server.id]: false }))}
                        >
                          {installedButtonHover[server.id] ? (
                            <>
                              <Check className="h-3.5 w-3.5 mr-1" />
                              Check
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-3.5 w-3.5 mr-1" />
                              Installed
                            </>
                          )}
                        </Button>
                      ) : isInstalling[server.id] ? (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          disabled 
                          className="bg-blue-50 text-blue-600 border-blue-200 h-8"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                          Installing...
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInstall(server.id);
                          }}
                          className="bg-blue-600 hover:bg-blue-700 h-8 relative z-10"
                        >
                          <Download className="h-3.5 w-3.5 mr-1" />
                          Install
                        </Button>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            {hasMore && (
              <div ref={loadMoreRef} className="py-6 flex justify-center">
                {isLoading ? (
                  <LoadingIndicator />
                ) : (
                  <Button 
                    variant="outline" 
                    onClick={loadMoreItems}
                    className="min-w-[200px]"
                  >
                    Load More
                  </Button>
                )}
              </div>
            )}
          </>
        ) : (
          <EmptyState 
            searchQuery={searchQuery} 
            onReset={() => {
              setSearchQuery("");
              setSelectedCategory(null);
            }} 
          />
        )}
      </ScrollArea>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden bg-white dark:bg-gray-900">
          {selectedServer && (
            <div className="flex flex-col h-full">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <DialogTitle className="text-xl font-bold leading-tight text-white">
                      {selectedServer.name}
                    </DialogTitle>
                    
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <EndpointLabel type={selectedServer.type} />
                      {selectedServer.isOfficial && <OfficialBadge />}
                    </div>
                  </div>
                  
                  <DialogClose className="rounded-full p-1.5 hover:bg-white/20 transition-colors">
                    <X className="h-5 w-5" />
                  </DialogClose>
                </div>
              </div>
              
              <Tabs 
                value={dialogActiveTab} 
                onValueChange={setDialogActiveTab}
                className="flex-1 flex flex-col overflow-hidden"
              >
                <div className="border-b px-6">
                  <TabsList className="bg-transparent p-0 h-12">
                    <TabsTrigger 
                      value="overview" 
                      className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none px-4 h-12"
                    >
                      Overview
                    </TabsTrigger>
                    <TabsTrigger 
                      value="tools" 
                      className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none px-4 h-12"
                    >
                      <Wrench className="h-4 w-4 mr-1.5" />
                      Tools
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="overview" className="mt-0 flex-1 overflow-auto">
                  <div className="p-6 space-y-6 overflow-auto">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-base font-semibold mb-3 text-gray-800 dark:text-gray-200">
                            Description
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {selectedServer.description}
                          </p>
                        </div>
                        
                        <div>
                          <h3 className="text-base font-semibold mb-3 text-gray-800 dark:text-gray-200">
                            Author
                          </h3>
                          <div className="flex items-center">
                            <UserRound className="h-4 w-4 mr-2 text-blue-600" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {selectedServer.author || `${selectedServer.name.split(' ')[0]} Team`}
                            </span>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-base font-semibold mb-3 text-gray-800 dark:text-gray-200">
                            Features
                          </h3>
                          <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-600 dark:text-gray-300 pl-1">
                            {selectedServer.features?.map((feature, index) => (
                              <li key={index}>{feature}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h3 className="text-base font-semibold mb-3 text-gray-800 dark:text-gray-200">
                            Categories
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedServer.categories?.map(category => (
                              <Badge 
                                key={category} 
                                variant="outline" 
                                className="bg-blue-50 border-blue-100 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300 text-xs px-3 py-0.5 rounded-full"
                              >
                                <Tag className="h-3 w-3 mr-1.5" />
                                {category}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-base font-semibold mb-3 text-gray-800 dark:text-gray-200">
                            Usage Statistics
                          </h3>
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="bg-white dark:bg-gray-900 rounded-md p-3">
                              <div className="text-xl font-bold text-gray-800 dark:text-gray-200">
                                {formatNumber(selectedServer.views || 1320)}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">Views</div>
                            </div>
                            
                            <div className="bg-white dark:bg-gray-900 rounded-md p-3">
                              <div className="text-xl font-bold text-gray-800 dark:text-gray-200">
                                {formatNumber(selectedServer.downloads || 386)}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">Installs</div>
                            </div>
                            
                            <div className="bg-white dark:bg-gray-900 rounded-md p-3">
                              <div className="text-xl font-bold text-gray-800 dark:text-gray-200">
                                {formatNumber(selectedServer.watches || 215)}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">Stars</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="tools" className="mt-0 flex-1 overflow-auto">
                  <div className="p-6">
                    <ServerTools tools={selectedServer.tools || []} />
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end p-5 border-t gap-3 bg-gray-50 dark:bg-gray-800/50">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  size="sm"
                >
                  Close
                </Button>
                
                {installedServers[selectedServer.id] ? (
                  <Button 
                    variant="outline"
                    size="sm"
                    className={`
                      ${installedButtonHover[selectedServer.id] ?
                        "text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100" :
                        "text-green-600 bg-green-50 border-green-200 hover:bg-green-100"
                      }
                    `}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNavigateToServers();
                    }}
                    onMouseEnter={() => setInstalledButtonHover(prev => ({ ...prev, [selectedServer.id]: true }))}
                    onMouseLeave={() => setInstalledButtonHover(prev => ({ ...prev, [selectedServer.id]: false }))}
                  >
                    {installedButtonHover[selectedServer.id] ? (
                      <>
                        <Check className="h-3.5 w-3.5 mr-2" />
                        Check
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-3.5 w-3.5 mr-2" />
                        Installed
                      </>
                    )}
                  </Button>
                ) : isInstalling[selectedServer.id] ? (
                  <Button 
                    disabled
                    size="sm"
                    className="bg-blue-50 text-blue-600 border-blue-200"
                  >
                    <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                    Installing...
                  </Button>
                ) : (
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleInstall(selectedServer.id);
                    }}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Download className="h-3.5 w-3.5 mr-2" />
                    Install Server
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AddInstanceDialog
        open={addInstanceOpen}
        onOpenChange={setAddInstanceOpen}
        serverDefinition={selectedDefinition}
        onCreateInstance={handleCreateInstance}
      />

      <AddToProfileDialog
        open={addToProfileOpen}
        onOpenChange={setAddToProfileOpen}
        onAddToProfile={handleAddToProfile}
        serverDefinition={selectedDefinition}
        profiles={allProfiles}
      />

      <HostConfigGuideDialog
        open={hostGuideOpen}
        onOpenChange={setHostGuideOpen}
        profile={selectedProfile}
        hosts={getAvailableHosts()}
      />
    </div>
  );
};

export default Discovery;
