import { Link } from "react-router-dom";
import { 
  Database,
  ExternalLink,
  Info,
  Loader2,
  PackagePlus,
  Server, 
  Star,
  UsersRound,
  CheckCircle,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { profiles, hosts, serverInstances, serverDefinitions } from "@/data/mockData";
import { useState } from "react";
import { EndpointLabel } from "@/components/status/EndpointLabel";
import { OfficialBadge } from "@/components/discovery/OfficialBadge";
import { CategoryList } from "@/components/discovery/CategoryList";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { ServerDefinition, EndpointType } from "@/data/mockData";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useServerContext } from "@/context/ServerContext";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Dashboard = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedServer, setSelectedServer] = useState<ServerDefinition | null>(null);
  const [isInstalling, setIsInstalling] = useState<Record<string, boolean>>({});
  const [installedServers, setInstalledServers] = useState<Record<string, boolean>>({});
  
  const { openAddInstanceDialog } = useServerContext();
  
  const activeProfiles = profiles.filter(p => p.enabled).length;
  const runningInstances = serverInstances.filter(s => s.status === 'running').length;
  const connectedHosts = hosts.filter(h => h.connectionStatus === 'connected').length;
  
  const trendingServers: ServerDefinition[] = [
    { 
      id: "trend1", 
      name: "FastGPT Server", 
      icon: "🚀", 
      type: "HTTP_SSE" as EndpointType, 
      stars: 4.9, 
      downloads: 2342, 
      description: "High-performance GPT model server with streaming responses",
      author: "AI Systems Inc",
      version: "1.3.0",
      categories: ["AI", "LLM", "NLP"],
      isOfficial: true,
      features: [
        "High throughput streaming responses",
        "Automatic model quantization",
        "Multi-model support",
        "Custom prompt templates"
      ],
      repository: "https://github.com/ai-systems/fastgpt-server"
    },
    { 
      id: "trend2", 
      name: "CodeAssistant", 
      icon: "💻", 
      type: "STDIO" as EndpointType, 
      stars: 4.8, 
      downloads: 1856, 
      description: "Code completion and analysis server with multiple language support",
      author: "DevTools Ltd",
      version: "2.1.1",
      categories: ["Development", "AI", "Code"],
      isOfficial: true,
      features: [
        "Multi-language support",
        "Context-aware completions",
        "Semantic code search",
        "Integration with popular IDEs"
      ],
      repository: "https://github.com/devtools/code-assistant"
    },
    { 
      id: "trend3", 
      name: "PromptWizard", 
      icon: "✨", 
      type: "HTTP_SSE" as EndpointType, 
      stars: 4.7, 
      downloads: 1543, 
      description: "Advanced prompt engineering and testing server",
      author: "PromptLabs",
      version: "1.0.4",
      categories: ["AI", "Prompting", "Testing"],
      isOfficial: false,
      features: [
        "Prompt versioning",
        "A/B testing framework",
        "Performance analytics",
        "Template library"
      ],
      repository: "https://github.com/promptlabs/prompt-wizard"
    },
    { 
      id: "trend4", 
      name: "SemanticSearch", 
      icon: "🔍", 
      type: "HTTP_SSE" as EndpointType, 
      stars: 4.6, 
      downloads: 1278, 
      description: "Vector database integration for semantic search capabilities",
      author: "SearchTech",
      version: "0.9.2",
      categories: ["Search", "Embeddings", "Vector DB"],
      isOfficial: false,
      features: [
        "Multiple vector DB integrations",
        "Hybrid search capabilities",
        "Custom embeddings support",
        "Query optimization"
      ],
      repository: "https://github.com/searchtech/semantic-search"
    },
    { 
      id: "trend5", 
      name: "DocumentLoader", 
      icon: "📄", 
      type: "HTTP_SSE" as EndpointType, 
      stars: 4.5, 
      downloads: 1150, 
      description: "Document parsing and processing for various file formats",
      author: "DocTools",
      version: "1.2.0",
      categories: ["Document", "Processing", "Parsing"],
      isOfficial: true,
      features: [
        "Multi-format support (PDF, DOCX, TXT)",
        "Extraction of structured data",
        "Document chunking",
        "Metadata extraction"
      ],
      repository: "https://github.com/doctools/document-loader"
    },
    { 
      id: "trend6", 
      name: "VectorStore", 
      icon: "🔮", 
      type: "HTTP_SSE" as EndpointType, 
      stars: 4.4, 
      downloads: 1050, 
      description: "High-performance vector database for AI applications",
      author: "VectorTech",
      version: "0.8.1",
      categories: ["Database", "Vectors", "Storage"],
      isOfficial: false,
      features: [
        "Fast similarity search",
        "Efficient vector storage",
        "Hybrid queries",
        "Multi-tenancy support"
      ],
      repository: "https://github.com/vectortech/vector-store"
    },
    { 
      id: "trend7", 
      name: "ImageProcessor", 
      icon: "🖼️", 
      type: "STDIO" as EndpointType, 
      stars: 4.3, 
      downloads: 980, 
      description: "Image analysis and transformation server",
      author: "PixelWorks",
      version: "2.0.1",
      categories: ["Image", "Processing", "AI"],
      isOfficial: true,
      features: [
        "Object detection",
        "Image classification",
        "Image transformations",
        "Batch processing"
      ],
      repository: "https://github.com/pixelworks/image-processor"
    },
    { 
      id: "trend8", 
      name: "AudioTranscriber", 
      icon: "🎵", 
      type: "STDIO" as EndpointType, 
      stars: 4.2, 
      downloads: 920, 
      description: "Speech-to-text and audio analysis server",
      author: "AudioLabs",
      version: "1.5.2",
      categories: ["Audio", "Transcription", "Speech"],
      isOfficial: false,
      features: [
        "Multi-language transcription",
        "Speaker diarization",
        "Noise reduction",
        "Audio summarization"
      ],
      repository: "https://github.com/audiolabs/audio-transcriber"
    },
    { 
      id: "trend9", 
      name: "DataAnalyzer", 
      icon: "📊", 
      type: "HTTP_SSE" as EndpointType, 
      stars: 4.1, 
      downloads: 870, 
      description: "Data analysis and visualization server",
      author: "DataWorks",
      version: "3.0.0",
      categories: ["Data", "Analysis", "Visualization"],
      isOfficial: true,
      features: [
        "Statistical analysis",
        "Data visualization",
        "Automated insights",
        "Report generation"
      ],
      repository: "https://github.com/dataworks/data-analyzer"
    },
    { 
      id: "trend10", 
      name: "ChatBot", 
      icon: "💬", 
      type: "HTTP_SSE" as EndpointType, 
      stars: 4.0, 
      downloads: 820, 
      description: "Conversational AI platform with multiple personalities",
      author: "ChatTech",
      version: "2.2.1",
      categories: ["Chat", "Conversational", "AI"],
      isOfficial: false,
      features: [
        "Multiple personality templates",
        "Context management",
        "Knowledge base integration",
        "Multi-turn conversations"
      ],
      repository: "https://github.com/chattech/chatbot"
    }
  ];

  const handleViewDetails = (server: ServerDefinition) => {
    setSelectedServer(server);
    setIsDialogOpen(true);
  };

  const handleInstall = (serverId: string) => {
    const server = trendingServers.find(item => item.id === serverId);
    if (!server) return;
    
    setIsInstalling(prev => ({ ...prev, [serverId]: true }));
    
    setTimeout(() => {
      setIsInstalling(prev => ({ ...prev, [serverId]: false }));
      setInstalledServers(prev => ({ ...prev, [serverId]: true }));
      
      openAddInstanceDialog(server);
    }, 1500);
  };

  const formatDownloadCount = (downloads?: number) => {
    if (!downloads) return '0';
    return downloads.toLocaleString();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your MCP profiles, servers, and host connections.
          </p>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-lg font-medium">
                Connected Hosts
              </CardTitle>
              <CardDescription>
                {connectedHosts} of {hosts.length} hosts connected
              </CardDescription>
            </div>
            <UsersRound className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {hosts.slice(0, 3).map(host => (
                <div 
                  key={host.id} 
                  className="flex items-center justify-between p-2 bg-muted/50 rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{host.icon}</span>
                    <span className="font-medium">{host.name}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    host.connectionStatus === 'connected' ? 
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 
                    host.connectionStatus === 'disconnected' ? 
                    'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' :
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                  }`}>
                    {host.connectionStatus === 'connected' ? 'Connected' : 
                     host.connectionStatus === 'disconnected' ? 'Disconnected' : 
                     'Unknown'}
                  </span>
                </div>
              ))}
              {hosts.length > 3 && (
                <p className="text-xs text-muted-foreground text-center">
                  +{hosts.length - 3} more hosts
                </p>
              )}
            </div>
            <div className="flex">
              <Button asChild className="flex-1">
                <Link to="/hosts">
                  View All
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-lg font-medium">
                Active Profiles
              </CardTitle>
              <CardDescription>
                {activeProfiles} of {profiles.length} profiles enabled
              </CardDescription>
            </div>
            <Database className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {profiles.slice(0, 3).map(profile => (
                <div 
                  key={profile.id} 
                  className="flex items-center justify-between p-2 bg-muted/50 rounded-md"
                >
                  <span className="font-medium">{profile.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    profile.enabled ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 
                    'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                  }`}>
                    {profile.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              ))}
              {profiles.length > 3 && (
                <p className="text-xs text-muted-foreground text-center">
                  +{profiles.length - 3} more profiles
                </p>
              )}
            </div>
            <div className="flex">
              <Button asChild className="flex-1">
                <Link to="/profiles">
                  View All
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-lg font-medium">
                Server Instances
              </CardTitle>
              <CardDescription>
                {runningInstances} of {serverInstances.length} instances running
              </CardDescription>
            </div>
            <Server className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {serverDefinitions.slice(0, 3).map(definition => (
                <div 
                  key={definition.id} 
                  className="flex items-center justify-between p-2 bg-muted/50 rounded-md"
                >
                  <span className="font-medium">{definition.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    definition.type === 'HTTP_SSE' ? 
                    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : 
                    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                  }`}>
                    {definition.type === 'HTTP_SSE' ? 'HTTP' : 'STDIO'}
                  </span>
                </div>
              ))}
              {serverDefinitions.length > 3 && (
                <p className="text-xs text-muted-foreground text-center">
                  +{serverDefinitions.length - 3} more servers
                </p>
              )}
            </div>
            <div className="flex">
              <Button asChild className="flex-1">
                <Link to="/servers">
                  View All
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Trending MCP Servers</h2>
          <Button variant="outline" size="sm" asChild>
            <Link to="/discovery">
              View All
              <ExternalLink className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <div className="w-full">
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {trendingServers.map(server => (
                <CarouselItem key={server.id} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                  <Card className="overflow-hidden h-full">
                    <div className="relative">
                      <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-2">
                          <div className="text-xl">{server.icon}</div>
                          <div className="font-medium text-md">{server.name}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <EndpointLabel type={server.type} />
                          {server.isOfficial && <OfficialBadge />}
                        </div>
                      </div>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {server.description}
                        </p>
                        <div className="mt-2">
                          <CategoryList categories={server.categories || []} maxVisible={2} />
                        </div>
                      </CardContent>
                    </div>
                    <CardFooter className="flex justify-between items-center border-t p-4 bg-muted/30">
                      <div className="flex items-center gap-4">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center text-muted-foreground">
                                <Star className="h-3.5 w-3.5 mr-1" />
                                <span className="text-xs">{server.stars}</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">Rating</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center text-muted-foreground">
                                <Download className="h-3.5 w-3.5 mr-1" />
                                <span className="text-xs">{formatDownloadCount(server.downloads)}</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">Downloads</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleViewDetails(server)}>
                          Details
                        </Button>
                        {installedServers[server.id] ? (
                          <Button variant="outline" size="sm" className="text-green-600" disabled>
                            <CheckCircle className="h-3.5 w-3.5 mr-1" />
                            Installed
                          </Button>
                        ) : isInstalling[server.id] ? (
                          <Button variant="outline" size="sm" disabled>
                            <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                            Installing...
                          </Button>
                        ) : (
                          <Button size="sm" onClick={() => handleInstall(server.id)}>
                            <PackagePlus className="h-3.5 w-3.5 mr-1" />
                            Add
                          </Button>
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex items-center justify-center mt-4">
              <CarouselPrevious className="relative -left-0 mx-2" />
              <CarouselNext className="relative -right-0 mx-2" />
            </div>
          </Carousel>
        </div>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          {selectedServer && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="text-2xl">{selectedServer.icon}</div>
                    <DialogTitle className="text-xl font-semibold">{selectedServer.name}</DialogTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <EndpointLabel type={selectedServer.type} />
                    {selectedServer.isOfficial && <OfficialBadge />}
                  </div>
                </div>
                <DialogDescription className="mt-2">
                  {selectedServer.description}
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4">
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {selectedServer.categories?.map((category) => (
                    <Badge key={category} variant="outline">
                      {category}
                    </Badge>
                  ))}
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Author</div>
                    <div>{selectedServer.author}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Version</div>
                    <div>{selectedServer.version}</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Features</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {selectedServer.features?.map((feature, index) => (
                      <li key={index} className="text-sm text-muted-foreground">{feature}</li>
                    ))}
                  </ul>
                </div>
                
                {selectedServer.repository && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-1">Repository</h4>
                    <a 
                      href={selectedServer.repository} 
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="text-sm text-primary flex items-center hover:underline"
                    >
                      {selectedServer.repository}
                      <ExternalLink className="h-3.5 w-3.5 ml-1" />
                    </a>
                  </div>
                )}
                
                <div className="flex items-center gap-4 mt-4 pt-4 border-t">
                  <div className="flex items-center text-muted-foreground">
                    <Star className="h-4 w-4 mr-1" />
                    <span>{selectedServer.stars}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Download className="h-4 w-4 mr-1" />
                    <span>{formatDownloadCount(selectedServer.downloads)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between mt-6 pt-4 border-t">
                <DialogClose asChild>
                  <Button variant="outline">Close</Button>
                </DialogClose>
                
                <div>
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

export default Dashboard;
