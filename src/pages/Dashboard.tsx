import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, ExternalLink, Info, Loader2, Server, UsersRound, Download, X, Database, HelpCircle, ChevronDown, ChevronUp, Computer, Settings2, Layers, MessageSquare, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { profiles, hosts, serverInstances, serverDefinitions } from '@/data/mockData';
import { useServerContext } from '@/context/ServerContext';
import { EndpointLabel } from '@/components/status/EndpointLabel';
import { OfficialBadge } from '@/components/discovery/OfficialBadge';
import { ServerLogo } from '@/components/servers/ServerLogo';
import { MCPNowHostCard } from '@/components/dashboard/MCPNowHostCard';
import { IntegratedChatInterface } from '@/components/dashboard/IntegratedChatInterface';
import type { ServerDefinition, EndpointType } from '@/data/mockData';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const formatDownloadCount = (count: number): string => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
};

const AUTOPLAY_INTERVAL = 5000; // 5 seconds between slides

const Dashboard = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedServer, setSelectedServer] = useState<ServerDefinition | null>(null);
  const [isInstalling, setIsInstalling] = useState<Record<string, boolean>>({});
  const [installedServers, setInstalledServers] = useState<Record<string, boolean>>({});
  const [showCarouselControls, setShowCarouselControls] = useState(false);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [isUserFlowOpen, setIsUserFlowOpen] = useState(true);
  const [selectedTab, setSelectedTab] = useState("visual");
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const {
    openAddInstanceDialog
  } = useServerContext();
  const navigate = useNavigate();
  
  const activeProfiles = profiles.filter(p => p.enabled).length;
  const runningInstances = serverInstances.filter(s => s.status === 'running').length;
  const connectedHosts = hosts.filter(h => h.connectionStatus === 'connected').length;

  const handleNavigateToServers = () => {
    navigate('/servers');
  };

  const handleStartChat = () => {
    setIsChatOpen(true);
  };

  const handleManageServers = () => {
    navigate('/servers');
  };

  const handleViewDetails = (server: ServerDefinition) => {
    setSelectedServer(server);
    setIsDialogOpen(true);
  };

  const handleInstall = (serverId: string) => {
    const server = trendingServers.find(item => item.id === serverId);
    if (!server) return;
    setIsInstalling(prev => ({
      ...prev,
      [serverId]: true
    }));
    setTimeout(() => {
      setIsInstalling(prev => ({
        ...prev,
        [serverId]: false
      }));
      setInstalledServers(prev => ({
        ...prev,
        [serverId]: true
      }));
    }, 1500);
  };

  const toggleStep = (stepIndex: number) => {
    setExpandedStep(expandedStep === stepIndex ? null : stepIndex);
  };

  const trendingServers = [{
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
    features: ["High throughput streaming responses", "Automatic model quantization", "Multi-model support", "Custom prompt templates"],
    repository: "https://github.com/ai-systems/fastgpt-server"
  }, {
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
    features: ["Multi-language support", "Context-aware completions", "Semantic code search", "Integration with popular IDEs"],
    repository: "https://github.devtools/code-assistant"
  }, {
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
    features: ["Prompt versioning", "A/B testing framework", "Performance analytics", "Template library"],
    repository: "https://github.com/promptlabs/prompt-wizard"
  }, {
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
    features: ["Multiple vector DB integrations", "Hybrid search capabilities", "Custom embeddings support", "Query optimization"],
    repository: "https://github.com/searchtech/semantic-search"
  }, {
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
    features: ["Multi-format support (PDF, DOCX, TXT)", "Extraction of structured data", "Document chunking", "Metadata extraction"],
    repository: "https://github.com/doctools/document-loader"
  }, {
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
    features: ["Fast similarity search", "Efficient vector storage", "Hybrid queries", "Multi-tenancy support"],
    repository: "https://github.com/vectortech/vector-store"
  }, {
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
    features: ["Object detection", "Image classification", "Image transformations", "Batch processing"],
    repository: "https://github.com/pixelworks/image-processor"
  }, {
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
    features: ["Multi-language transcription", "Speaker diarization", "Noise reduction", "Audio summarization"],
    repository: "https://github.com/audiolabs/audio-transcriber"
  }, {
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
    features: ["Statistical analysis", "Data visualization", "Automated insights", "Report generation"],
    repository: "https://github.com/dataworks/data-analyzer"
  }, {
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
    features: ["Multiple personality templates", "Context management", "Knowledge base integration", "Multi-turn conversations"],
    repository: "https://github.com/chattech/chatbot"
  }];

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Overview</h1>
        <p className="text-muted-foreground">Monitor your servers, profiles and hosts from a single dashboard.</p>
      </div>
      
      {/* MCP Now Host Card Section */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">MCP Now AI Chat</h2>
        <div className="max-w-md">
          <MCPNowHostCard
            onStartChat={handleStartChat}
            onManageServers={handleManageServers}
            serverCount={serverDefinitions.length}
            activeServers={runningInstances}
          />
        </div>
      </div>
      
      <div className="relative group">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold tracking-tight">Trending MCP Servers</h2>
          <Button variant="outline" size="sm" asChild>
            <Link to="/discovery">
              View All
              <ExternalLink className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <div className="w-full relative group" onMouseEnter={() => setShowCarouselControls(true)} onMouseLeave={() => setShowCarouselControls(false)}>
          <Carousel opts={{
            align: "start",
            loop: true,
            skipSnaps: true,
            startIndex: 1
          }} className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {trendingServers.map(server => (
                <CarouselItem key={server.id} className="pl-2 md:pl-4 basis-full md:basis-1/3 lg:basis-1/4">
                  <Card className="h-full border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-lg">
                    <CardHeader className="space-y-0 p-4 pb-0">
                      <div className="flex items-start justify-start gap-3">
                        <ServerLogo name={server.name} />
                        <div>
                          <CardTitle className="text-xl group-hover:text-primary transition-colors">
                            {server.name}
                          </CardTitle>
                          
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4 p-4 pt-2">
                      <p className="text-sm text-muted-foreground line-clamp-2 h-10">
                        {server.description}
                      </p>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm flex items-center gap-1.5 text-muted-foreground">
                          <Download className="h-4 w-4" />
                          {(server.downloads / 1000).toFixed(1)}k
                        </span>
                        
                        <Button variant="outline" size="sm" onClick={() => handleViewDetails(server)} className="hover:bg-primary hover:text-primary-foreground">
                          <Info className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <div className={`transition-opacity duration-300 ${showCarouselControls ? 'opacity-100' : 'opacity-0'}`}>
              <CarouselPrevious className="absolute -left-4 hover:bg-primary hover:text-primary-foreground" />
              <CarouselNext className="absolute -right-4 hover:bg-primary hover:text-primary-foreground" />
            </div>
          </Carousel>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Status</h2>
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-lg font-medium">Connected Hosts</CardTitle>
                <CardDescription>{connectedHosts} of {hosts.length} hosts connected</CardDescription>
              </div>
              <UsersRound className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="space-y-2">
                {hosts.slice(0, 3).map(host => <div key={host.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{host.icon}</span>
                      <span className="font-medium">{host.name}</span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${host.connectionStatus === 'connected' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : host.connectionStatus === 'disconnected' ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'}`}>
                      {host.connectionStatus === 'connected' ? 'Connected' : host.connectionStatus === 'disconnected' ? 'Disconnected' : 'Unknown'}
                    </span>
                  </div>)}
                {hosts.length > 3 && <p className="text-xs text-muted-foreground text-center">
                    +{hosts.length - 3} more hosts
                  </p>}
              </div>
            </CardContent>
            <CardFooter className="pt-2 mt-auto border-t">
              <Button asChild className="w-full">
                <Link to="/hosts">
                  View All
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-lg font-medium">Created Profiles</CardTitle>
                <CardDescription>{activeProfiles} of {profiles.length} profiles enabled</CardDescription>
              </div>
              <Database className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="space-y-2">
                {profiles.slice(0, 3).map(profile => <div key={profile.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                    <span className="font-medium">{profile.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${profile.enabled ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'}`}>
                      {profile.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>)}
                {profiles.length > 3 && <p className="text-xs text-muted-foreground text-center">
                    +{profiles.length - 3} more profiles
                  </p>}
              </div>
            </CardContent>
            <CardFooter className="pt-2 mt-auto border-t">
              <Button asChild className="w-full">
                <Link to="/profiles">
                  View All
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-lg font-medium">Server Instances</CardTitle>
                <CardDescription>{runningInstances} of {serverInstances.length} instances running</CardDescription>
              </div>
              <Server className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="space-y-2">
                {serverDefinitions.slice(0, 3).map(definition => <div key={definition.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                    <span className="font-medium">{definition.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${definition.type === 'HTTP_SSE' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'}`}>
                      {definition.type === 'HTTP_SSE' ? 'HTTP' : 'STDIO'}
                    </span>
                  </div>)}
                {serverDefinitions.length > 3 && <p className="text-xs text-muted-foreground text-center">
                    +{serverDefinitions.length - 3} more servers
                  </p>}
              </div>
            </CardContent>
            <CardFooter className="pt-2 mt-auto border-t">
              <Button asChild className="w-full">
                <Link to="/servers">
                  View All
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-200 border-blue-100 dark:border-blue-900 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-lg font-medium">AI Chat</CardTitle>
                <CardDescription>Chat with AI using MCP servers</CardDescription>
              </div>
              <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="flex items-center justify-center flex-col py-4">
                <Bot className="h-12 w-12 text-blue-500 mb-2" />
                <p className="text-sm text-center text-muted-foreground">
                  Start an AI conversation with your connected MCP servers
                </p>
              </div>
            </CardContent>
            <CardFooter className="pt-2 mt-auto border-t">
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <Link to="/ai-chat">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Start Chat
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden bg-white dark:bg-gray-900">
          {selectedServer && <div className="h-full">
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
                    {formatDownloadCount(selectedServer.downloads)}
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
                      {selectedServer.author}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Version</h3>
                    <p className="font-medium">
                      {selectedServer.version}
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Category</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedServer.categories?.map(category => <Badge key={category} variant="outline" className="py-1 px-2 bg-gray-50 text-gray-700 border-gray-200">
                        {category}
                      </Badge>)}
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Features</h3>
                  <ul className="list-disc list-inside space-y-1 ml-1">
                    {selectedServer.features?.map((feature, index) => <li key={index} className="text-sm">{feature}</li>)}
                  </ul>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800/30 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Repository</h3>
                  <a href="#" className="text-blue-500 flex items-center hover:underline text-sm" target="_blank" rel="noopener noreferrer">
                    {selectedServer.repository}
                    <ExternalLink className="h-3.5 w-3.5 ml-1" />
                  </a>
                </div>
              </div>
              
              <div className="flex justify-end p-4 border-t gap-2 bg-gray-50 dark:bg-gray-800/50">
                {installedServers[selectedServer.id] ? <div className="flex gap-2">
                    <Button variant="outline" className="text-green-600 bg-green-50 border-green-200 hover:bg-green-100">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Installed
                    </Button>
                    <Button variant="outline" onClick={handleNavigateToServers} className="px-2">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div> : isInstalling[selectedServer.id] ? <Button disabled className="bg-blue-50 text-blue-600 border-blue-200">
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    Installing...
                  </Button> : <Button onClick={() => handleInstall(selectedServer.id)} className="bg-blue-500 hover:bg-blue-600">
                    <Download className="h-4 w-4 mr-1" />
                    Install Server
                  </Button>}
              </div>
            </div>}
        </DialogContent>
      </Dialog>

      <div className="pt-4 border-t border-gray-200 dark:border-gray-800 animate-fade-in mb-10">
        <Collapsible open={isUserFlowOpen} onOpenChange={setIsUserFlowOpen} className="w-full rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-900 rounded-t-lg">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-blue-500" />
              <h2 className="text-xl font-bold">MCP Now Setup Process</h2>
            </div>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="p-1">
                {isUserFlowOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                <span className="sr-only">
                  {isUserFlowOpen ? "Hide" : "Show"} setup guide
                </span>
              </Button>
            </CollapsibleTrigger>
          </div>
          
          <CollapsibleContent className="p-4 bg-white dark:bg-gray-950 rounded-b-lg animate-accordion-down mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <Card className="border-blue-100 dark:border-blue-900 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/20 flex flex-col">
                <CardHeader className="pb-2">
                  <div className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full p-2 w-10 h-10 flex items-center justify-center mb-3">
                    <span className="font-bold text-lg">1</span>
                  </div>
                  <CardTitle className="text-lg">Install Servers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 flex-grow">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Browse and install server definitions from Discovery.
                  </p>
                  <div className="flex justify-center text-5xl flex-grow items-center">
                    <Download className="h-12 w-12 text-blue-500/70" />
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button asChild size="sm" variant="outline" className="w-full">
                    <Link to="/discovery">Explore Discovery</Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-purple-100 dark:border-purple-900 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/20 flex flex-col">
                <CardHeader className="pb-2">
                  <div className="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-full p-2 w-10 h-10 flex items-center justify-center mb-3">
                    <span className="font-bold text-lg">2</span>
                  </div>
                  <CardTitle className="text-lg">Create Instances</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 flex-grow">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Configure server instances with specific settings.
                  </p>
                  <div className="flex justify-center text-5xl flex-grow items-center">
                    <Settings2 className="h-12 w-12 text-purple-500/70" />
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button asChild size="sm" variant="outline" className="w-full">
                    <Link to="/servers">
                      Manage Servers
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-green-100 dark:border-green-900 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/20 flex flex-col">
                <CardHeader className="pb-2">
                  <div className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-full p-2 w-10 h-10 flex items-center justify-center mb-3">
                    <span className="font-bold text-lg">3</span>
                  </div>
                  <CardTitle className="text-lg">Create Profiles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 flex-grow">
                  <p className="text-sm text-gray-600 dark:text-gray-300">Group multiple server instances into logical profiles. </p>
                  <div className="flex justify-center text-5xl flex-grow items-center">
                    <Layers className="h-12 w-12 text-green-500/70" />
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button asChild size="sm" variant="outline" className="w-full">
                    <Link to="/profiles">
                      Manage Profiles
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-amber-100 dark:border-amber-900 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/50 dark:to-amber-900/20 flex flex-col">
                <CardHeader className="pb-2">
                  <div className="bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-300 rounded-full p-2 w-10 h-10 flex items-center justify-center mb-3">
                    <span className="font-bold text-lg">4</span>
                  </div>
                  <CardTitle className="text-lg">Connect Hosts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 flex-grow">
                  <p className="text-sm text-gray-600 dark:text-gray-300">Link your profiles to hosts where they can run MCP. </p>
                  <div className="flex justify-center text-5xl flex-grow items-center">
                    <Computer className="h-12 w-12 text-amber-500/70" />
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button asChild size="sm" variant="outline" className="w-full">
                    <Link to="/hosts">
                      Manage Hosts
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Integrated Chat Interface */}
      <IntegratedChatInterface
        open={isChatOpen}
        onOpenChange={setIsChatOpen}
      />
    </div>
  );
};

export default Dashboard;
