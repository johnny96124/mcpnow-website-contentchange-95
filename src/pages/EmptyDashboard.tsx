import { Link } from "react-router-dom";
import { 
  Database,
  ExternalLink,
  Info,
  Loader2,
  Server, 
  UsersRound,
  Download,
  X,
  Calendar,
  Eye,
  Globe,
  Star,
  CheckCircle,
  User,
  Tag,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import type { ServerDefinition, EndpointType, Tool, ToolParameter } from "@/data/mockData";

const EmptyDashboard = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedServer, setSelectedServer] = useState<ServerDefinition | null>(null);
  const [isInstalling, setIsInstalling] = useState<Record<string, boolean>>({});
  const [installedServers, setInstalledServers] = useState<Record<string, boolean>>({});
  
  // Empty arrays for hosts, profiles, and server instances
  const hosts = [];
  const profiles = [];
  const serverInstances = [];
  const serverDefinitions = [];
  
  // Stats with zero values
  const activeProfiles = 0;
  const runningInstances = 0;
  const connectedHosts = 0;
  
  const trendingServers: ServerDefinition[] = [
    { 
      id: "trend1", 
      name: "FastGPT Server", 
      icon: "🚀", 
      type: "HTTP_SSE" as EndpointType, 
      stars: 918, 
      downloads: 2342, 
      views: 879600,
      watches: 345,
      updated: "2025/4/3",
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
      repository: "https://github.com/ai-systems/fastgpt-server",
      tools: [
        {
          id: "complete",
          name: "complete",
          description: "Generate text completions from a prompt",
          parameters: [
            {
              name: "prompt",
              type: "string" as "string",
              description: "The prompt to generate completions for",
              required: true
            },
            {
              name: "max_tokens",
              type: "number" as "number",
              description: "The maximum number of tokens to generate",
              required: false,
              default: 100
            }
          ]
        },
        {
          id: "summarize",
          name: "summarize",
          description: "Summarize a long text",
          parameters: [
            {
              name: "text",
              type: "string" as "string",
              description: "The text to summarize",
              required: true
            }
          ]
        },
        {
          id: "translate",
          name: "translate",
          description: "Translate text between languages",
          parameters: [
            {
              name: "text",
              type: "string" as "string",
              description: "The text to translate",
              required: true
            },
            {
              name: "target_language",
              type: "string" as "string",
              description: "The target language",
              required: true
            }
          ]
        }
      ]
    },
    { 
      id: "trend2", 
      name: "CodeAssistant", 
      icon: "💻", 
      type: "STDIO" as EndpointType, 
      stars: 856, 
      downloads: 1856, 
      views: 652400,
      watches: 289,
      updated: "2025/3/17",
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
      stars: 745, 
      downloads: 1543,
      views: 543200,
      watches: 214,
      updated: "2025/3/28", 
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
      stars: 678, 
      downloads: 1278,
      views: 478500,
      watches: 178, 
      updated: "2025/2/21",
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
      stars: 534, 
      downloads: 1150,
      views: 387600,
      watches: 156,
      updated: "2025/3/10", 
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
      stars: 467, 
      downloads: 1050,
      views: 342800,
      watches: 132,
      updated: "2025/2/14", 
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
      stars: 412, 
      downloads: 980,
      views: 289400,
      watches: 98,
      updated: "2025/3/5", 
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
      stars: 387, 
      downloads: 920,
      views: 267300,
      watches: 87,
      updated: "2025/1/29", 
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
      stars: 352, 
      downloads: 870,
      views: 245600,
      watches: 76,
      updated: "2025/2/8", 
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
      stars: 328, 
      downloads: 820,
      views: 234500,
      watches: 64,
      updated: "2025/3/22", 
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
    }, 1500);
  };

  const formatDownloadCount = (count: number) => {
    return `${(count / 1000).toFixed(1)}K`;
  };
  
  const handleNavigateToServers = () => {
  };

  const formatNumber = (num: number | undefined) => {
    if (!num) return "0";
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
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
        {/* Empty Connected Hosts Card */}
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
        
        {/* Empty Active Profiles Card */}
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
        
        {/* Empty Server Instances Card */}
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
          {selectedServer && (
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="bg-blue-600 text-white p-6 relative flex flex-col">
                <div className="flex items-start justify-between">
                  <h2 className="text-2xl font-bold">{selectedServer.name}</h2>
                  <DialogClose className="text-white hover:bg-blue-700 rounded-full p-1">
                    <X className="w-5 h-5" />
                  </DialogClose>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <Badge variant="secondary" className="bg-blue-500 text-white border-none">
                    {selectedServer.type}
                  </Badge>
                  {selectedServer.isOfficial && (
                    <Badge variant="secondary" className="flex items-center gap-1 bg-green-500 text-white border-none">
                      <CheckCircle className="h-3 w-3" />
                      Official
                    </Badge>
                  )}
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="overview" className="flex-1 overflow-auto">
                <div className="border-b">
                  <div className="px-6">
                    <TabsList className="bg-transparent">
                      <TabsTrigger value="overview" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none">
                        <Info className="h-4 w-4 mr-2" />
                        Overview
                      </TabsTrigger>
                      <TabsTrigger value="tools" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none">
                        <Server className="h-4 w-4 mr-2" />
                        Tools
                        {selectedServer.tools && selectedServer.tools.length > 0 && (
                          <Badge className="ml-2 bg-gray-200 text-gray-800">
                            {selectedServer.tools.length}
                          </Badge>
                        )}
                      </TabsTrigger>
                    </TabsList>
                  </div>
                </div>

                <TabsContent value="overview" className="p-6 mt-0">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                      {/* Description */}
                      <div>
                        <h3 className="text-lg font-medium mb-2">Description</h3>
                        <p className="text-muted-foreground">{selectedServer.description}</p>
                      </div>

                      {/* Author */}
                      <div>
                        <h3 className="text-lg font-medium mb-2">Author</h3>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedServer.author}</span>
                        </div>
                      </div>

                      {/* Features */}
                      {selectedServer.features && selectedServer.features.length > 0 && (
                        <div>
                          <h3 className="text-lg font-medium mb-2">Features</h3>
                          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                            {selectedServer.features.map((feature, i) => (
                              <li key={i}>{feature}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Categories */}
                      {selectedServer.categories && selectedServer.categories.length > 0 && (
                        <div>
                          <h3 className="text-lg font-medium mb-2">Categories</h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedServer.categories.map((category, i) => (
                              <Badge key={i} variant="outline" className="flex items-center gap-1 py-1">
                                <Tag className="h-3 w-3 mr-1" />
                                {category}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Repository */}
                      <div>
                        <h3 className="text-lg font-medium mb-2">Repository</h3>
                        <a 
                          href={selectedServer.repository} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline flex items-center"
                        >
                          <Globe className="h-4 w-4 mr-2" />
                          {selectedServer.repository}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Metadata */}
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Version</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p>{selectedServer.version}</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Last Updated</CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <p>{selectedServer.updated}</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Usage Statistics</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div>
                              <p className="text-2xl font-bold">{formatNumber(selectedServer.views)}</p>
                              <p className="text-xs text-muted-foreground">Views</p>
                            </div>
                            <div>
                              <p className="text-2xl font-bold">{formatNumber(selectedServer.downloads)}</p>
                              <p className="text-xs text-muted-foreground">Installs</p>
                            </div>
                            <div>
                              <p className="text-2xl font-bold">{formatNumber(selectedServer.stars)}</p>
                              <p className="text-xs text-muted-foreground">Stars</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="tools" className="mt-0 p-6">
                  {selectedServer.tools && selectedServer.tools.length > 0 ? (
                    <div className="space-y-6">
                      {selectedServer.tools.map((tool) => (
                        <Card key={tool.id}>
                          <CardHeader>
                            <CardTitle className="text-lg">{tool.name}</CardTitle>
                            <CardDescription>{tool.description}</CardDescription>
                          </CardHeader>
                          {tool.parameters && tool.parameters.length > 0 && (
                            <CardContent>
                              <h4 className="text-sm font-medium mb-2">Parameters</h4>
                              <div className="space-y-3">
                                {tool.parameters.map((param, i) => (
                                  <div key={i} className="bg-muted p-3 rounded-md">
                                    <div className="flex justify-between">
                                      <div className="font-medium">{param.name}</div>
                                      <Badge variant="outline">{param.type}</Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">{param.description}</p>
                                    {param.required && (
                                      <Badge className="mt-2 bg-red-100 text-red-800 border-red-200">Required</Badge>
                                    )}
                                    {param.default !== undefined && (
                                      <div className="text-sm mt-2">
                                        <span className="text-muted-foreground">Default:</span> {JSON.stringify(param.default)}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          )}
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="bg-muted rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                        <Server className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium">No Tools Available</h3>
                      <p className="text-muted-foreground mt-1">This server doesn't provide any tools.</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              {/* Footer */}
              <div className="border-t p-4 flex justify-end gap-2 bg-muted/30">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Close
                </Button>
                {installedServers[selectedServer.id] ? (
                  <Button variant="outline" className="bg-green-50 text-green-600 border-green-200 hover:bg-green-100">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Installed
                  </Button>
                ) : isInstalling[selectedServer.id] ? (
                  <Button disabled className="bg-blue-500 text-white">
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    Installing...
                  </Button>
                ) : (
                  <Button onClick={() => handleInstall(selectedServer.id)} className="bg-blue-500 hover:bg-blue-600 text-white">
                    <Download className="h-4 w-4 mr-1" />
                    Install
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
