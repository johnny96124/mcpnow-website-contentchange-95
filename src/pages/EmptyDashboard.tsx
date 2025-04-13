import { Link } from "react-router-dom";
import { 
  Calendar,
  Check,
  CheckCircle,
  ChevronLeft,
  Clock,
  Database,
  Download,
  Eye,
  ExternalLink,
  FolderOpen,
  Globe,
  Info,
  Link2, 
  Loader2,
  Server, 
  Star,
  Tag,
  UsersRound,
  UserRound,
  Wrench,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useState } from "react";
import { EndpointLabel } from "@/components/status/EndpointLabel";
import { OfficialBadge } from "@/components/discovery/OfficialBadge";
import { EmptyState } from "@/components/discovery/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ServerToolsList } from "@/components/discovery/ServerToolsList";
import type { ServerDefinition, EndpointType } from "@/data/mockData";

const EmptyDashboard = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedServer, setSelectedServer] = useState<ServerDefinition | null>(null);
  const [isInstalling, setIsInstalling] = useState<Record<string, boolean>>({});
  const [installedServers, setInstalledServers] = useState<Record<string, boolean>>({});
  const [activeDetailTab, setActiveDetailTab] = useState("overview");
  const [installedButtonHover, setInstalledButtonHover] = useState<Record<string, boolean>>({});
  
  const hosts = [];
  const profiles = [];
  const serverInstances = [];
  const serverDefinitions = [];
  
  const activeProfiles = 0;
  const runningInstances = 0;
  const connectedHosts = 0;
  
  const trendingServers = [
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
    setActiveDetailTab("overview");
  };

  const handleInstall = (serverId: string) => {
    const server = trendingServers.find(item => item.id === serverId);
    if (!server) return;
    
    setIsInstalling(prev => ({ ...prev, [serverId]: true }));
    
    setTimeout(() => {
      setIsInstalling(prev => ({ ...prev, [serverId]: false }));
      setInstalledServers(prev => ({ ...prev, [serverId]: true }));
    }, 1500);
  };

  const formatDownloadCount = (count: number) => {
    return `${(count / 1000).toFixed(1)}K`;
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
    if (!dateStr) return "Recently";
    
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
  
  const handleNavigateToServers = () => {
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Empty Dashboard</h1>
          <p className="text-muted-foreground">
            Empty state view for MCP profiles, servers, and host connections.
          </p>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="overflow-hidden flex flex-col">
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
          <CardContent className="space-y-4 flex-1 flex items-center justify-center">
            <div className="text-center p-4">
              <div className="rounded-full bg-muted/50 p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <UsersRound className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-1">No Hosts Connected</h3>
              <p className="text-sm text-muted-foreground">
                Add hosts to manage your infrastructure
              </p>
            </div>
          </CardContent>
          <CardFooter className="pt-2 mt-auto border-t">
            <Button asChild className="w-full">
              <Link to="/hosts">
                Add Host
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="overflow-hidden flex flex-col">
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
          <CardContent className="space-y-4 flex-1 flex items-center justify-center">
            <div className="text-center p-4">
              <div className="rounded-full bg-muted/50 p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Database className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-1">No Profiles Created</h3>
              <p className="text-sm text-muted-foreground">
                Create profiles to manage your API connections
              </p>
            </div>
          </CardContent>
          <CardFooter className="pt-2 mt-auto border-t">
            <Button asChild className="w-full">
              <Link to="/profiles">
                Create Profile
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="overflow-hidden flex flex-col">
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
          <CardContent className="space-y-4 flex-1 flex items-center justify-center">
            <div className="text-center p-4">
              <div className="rounded-full bg-muted/50 p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Server className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-1">No Server Instances</h3>
              <p className="text-sm text-muted-foreground">
                Add server instances to expand functionality
              </p>
            </div>
          </CardContent>
          <CardFooter className="pt-2 mt-auto border-t">
            <Button asChild className="w-full">
              <Link to="/servers">
                Add Server Instance
              </Link>
            </Button>
          </CardFooter>
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
                  <Card className="flex flex-col h-[280px] overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="pb-2 space-y-0">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <CardTitle className="text-xl">{server.name}</CardTitle>
                          <div className="flex items-center gap-1">
                            <EndpointLabel type={server.type} />
                            {server.isOfficial && <OfficialBadge />}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="flex-1 pt-4">
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                        {server.description}
                      </p>
                    </CardContent>
                    
                    <CardFooter className="flex justify-between items-center p-3 mt-auto border-t">
                      <Badge variant="outline" className="flex items-center gap-1 py-1 px-2 bg-amber-50 text-amber-600 border-amber-200">
                        <Download className="h-3 w-3" />
                        {formatDownloadCount(server.downloads)}
                      </Badge>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleViewDetails(server)}
                      >
                        <Info className="h-4 w-4 mr-1" />
                        Details
                      </Button>
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
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-white dark:bg-gray-900">
          {selectedServer && (
            <div className="h-full flex flex-col">
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
                value={activeDetailTab} 
                onValueChange={setActiveDetailTab}
                className="w-full flex-1 flex flex-col"
              >
                <div className="border-b border-gray-200 dark:border-gray-800">
                  <TabsList className="bg-transparent px-6 pt-2 h-auto">
                    <TabsTrigger 
                      value="overview" 
                      className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none px-3 pb-2"
                    >
                      <Info className="h-4 w-4 mr-2" />
                      Overview
                    </TabsTrigger>
                    <TabsTrigger 
                      value="tools"
                      className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none px-3 pb-2"
                    >
                      <Wrench className="h-4 w-4 mr-2" />
                      Tools
                      {selectedServer.tools && selectedServer.tools.length > 0 && (
                        <Badge className="ml-1.5 text-[10px] bg-blue-600/20 text-blue-700 dark:bg-blue-600/30 dark:text-blue-300 border-none">
                          {selectedServer.tools.length}
                        </Badge>
                      )}
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="flex-1 overflow-hidden">
                  <TabsContent value="overview" className="mt-0 pt-0 h-[500px] overflow-auto">
                    <div className="p-6 space-y-6">
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
                          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-md p-5 space-y-4">
                            <div>
                              <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Version</h3>
                              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                {selectedServer.version || (Math.random() > 0.5 ? '1.5.0' : '0.9.5')}
                              </p>
                            </div>
                            
                            <div>
                              <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Last Updated</h3>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                <span className="text-sm text-gray-800 dark:text-gray-200">
                                  {selectedServer.updated ? new Date(selectedServer.updated).toLocaleDateString() : 'April 3, 2025'}
                                </span>
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Repository</h3>
                              <a 
                                href="#" 
                                className="text-sm text-blue-600 flex items-center hover:underline"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Globe className="h-4 w-4 mr-2" />
                                <span className="truncate">
                                  {selectedServer.repository || `github.com/${selectedServer.name.toLowerCase().replace(/\s+/g, '-')}`}
                                </span>
                                <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
                              </a>
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-md p-5">
                            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3">Usage Statistics</h3>
                            
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
                  
                  <TabsContent value="tools" className="mt-0 pt-0 h-[500px] overflow-auto">
                    <div className="p-6">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                          Available Tools
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          These tools are available for this server definition. Tools can be used after creating an instance.
                        </p>
                      </div>
                      
                      <ServerToolsList tools={selectedServer.tools} />
                    </div>
                  </TabsContent>
                </div>
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
    </div>
  );
};

export default EmptyDashboard;
