import { Link, useNavigate } from "react-router-dom";
import { CheckCircle, ExternalLink, Info, Loader2, Server, UsersRound, Download, X, Database, HelpCircle, ChevronRight, ChevronDown, ChevronUp, Computer, Settings2, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { profiles, hosts, serverInstances, serverDefinitions } from "@/data/mockData";
import { useState, useEffect } from "react";
import { useServerContext } from "@/context/ServerContext";
import { EndpointLabel } from "@/components/status/EndpointLabel";
import { OfficialBadge } from "@/components/discovery/OfficialBadge";
import type { ServerDefinition, EndpointType } from "@/data/mockData";
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
    repository: "https://github.com/devtools/code-assistant"
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
  const beginnerGuideSteps = [{
    title: "Install Servers from Discovery",
    description: "Browse and install server definitions for your workflow.",
    icon: <Download className="h-6 w-6" />,
    content: <div className="space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Start by installing server definitions from our Discovery page:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Navigate to the <Link to="/discovery" className="text-blue-500 hover:underline">Discovery</Link> page</li>
            <li>Browse available server types based on your needs</li>
            <li>Click "Install" to add server definitions to your environment</li>
            <li>Explore official and community-created server options</li>
          </ol>
          <div className="pt-2">
            <Button asChild size="sm" variant="outline" className="gap-1">
              <Link to="/discovery">
                Go to Discovery
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
  }, {
    title: "Create Instances & Configure Parameters",
    description: "Create and customize server instances with specific settings.",
    icon: <Settings2 className="h-6 w-6" />,
    content: <div className="space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Once you've installed server definitions, create instances with custom configurations:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Go to <Link to="/servers" className="text-blue-500 hover:underline">Servers</Link> page</li>
            <li>Click "Add Instance" on an installed server</li>
            <li>Set name, parameters, and environment variables</li>
            <li>Configure connection details specific to your needs</li>
          </ol>
          <div className="pt-2">
            <Button asChild size="sm" variant="outline" className="gap-1">
              <Link to="/servers">
                Manage Servers
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
  }, {
    title: "Create Profiles & Add Instances",
    description: "Organize server instances into profiles for easier management.",
    icon: <Layers className="h-6 w-6" />,
    content: <div className="space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Create profiles to group your server instances logically:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Visit the <Link to="/profiles" className="text-blue-500 hover:underline">Profiles</Link> page</li>
            <li>Create a new profile with a relevant name</li>
            <li>Add your configured server instances to the profile</li>
            <li>Enable the profile to activate all included instances</li>
          </ol>
          <div className="pt-2">
            <Button asChild size="sm" variant="outline" className="gap-1">
              <Link to="/profiles">
                Create Profiles
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
  }, {
    title: "Associate Hosts with Profiles",
    description: "Connect your profiles to hosts to deploy server instances.",
    icon: <Computer className="h-6 w-6" />,
    content: <div className="space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Finally, associate your profiles with hosts to run your server instances:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Go to the <Link to="/hosts" className="text-blue-500 hover:underline">Hosts</Link> page</li>
            <li>Add a new host or select an existing one</li>
            <li>Assign your created profile to the host</li>
            <li>Monitor status and control your server instances</li>
          </ol>
          <div className="pt-2">
            <Button asChild size="sm" variant="outline" className="gap-1">
              <Link to="/hosts">
                Manage Hosts
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
  }];
  return <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Overview</h1>
        <p className="text-muted-foreground">Monitor your servers, profiles and hosts from a single dashboard.</p>
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
              {trendingServers.map(server => <CarouselItem key={server.id} className="pl-2 md:pl-4 basis-full md:basis-1/3 lg:basis-1/4">
                  <Card className="h-full border border-gray-200 dark:border-gray-700 transition-all duration-300">
                    <CardHeader className="space-y-0 p-4">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">
                          {server.name}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4 p-4 pt-0">
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
                </CarouselItem>)}
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
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-lg font-medium">Hosts</CardTitle>
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
            <CardFooter className="pt-2 mt-auto border-t px-[16px] my-0 mx-0 py-[12px]">
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
                <CardTitle className="text-lg font-medium">Profiles</CardTitle>
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
            <CardFooter className="pt-2 mt-auto border-t px-[16px] py-[12px]">
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
                <CardTitle className="text-lg font-medium">Instances</CardTitle>
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
            <CardFooter className="pt-2 mt-auto border-t px-[16px] py-[12px]">
              <Button asChild className="w-full">
                <Link to="/servers">
                  View All
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="h-5 w-5 text-blue-500" />
          <h2 className="text-2xl font-bold tracking-tight">Getting Started with MCP Now</h2>
        </div>
        
        <Card className="border-blue-100 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20">
          <CardContent className="pt-6">
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Follow these simple steps to configure and start using MCP Now effectively.
            </p>
            
            <div className="space-y-3">
              {beginnerGuideSteps.map((step, index) => <div key={index} className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden bg-white dark:bg-gray-900">
                  <button className="w-full flex items-center justify-between p-4 text-left" onClick={() => toggleStep(index)}>
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full p-2">
                        {step.icon}
                      </div>
                      <div>
                        <h3 className="font-medium">Step {index + 1}: {step.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{step.description}</p>
                      </div>
                    </div>
                    {expandedStep === index ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />}
                  </button>
                  
                  {expandedStep === index && <div className="p-4 pt-0 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                      {step.content}
                    </div>}
                </div>)}
            </div>
            
            <div className="mt-6 flex justify-center">
              <Button asChild className="gap-2">
                <Link to="/discovery">
                  Start Setup Process
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
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
    </div>;
};
export default Dashboard;