import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ExternalLink, ChevronDown, ChevronUp, HelpCircle, Server, Settings2, Database, Monitor, Info, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GettingStartedDialog } from "@/components/onboarding/GettingStartedDialog";
import { hasSeenOnboarding, markOnboardingAsSeen } from "@/utils/localStorage";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const NewUserDashboard = () => {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [isGuideOpen, setIsGuideOpen] = useState(true);
  const navigate = useNavigate();
  const [showCarouselControls, setShowCarouselControls] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedServer, setSelectedServer] = useState<any | null>(null);
  const [isInstalling, setIsInstalling] = useState<Record<string, boolean>>({});
  const [installedServers, setInstalledServers] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Check if user has seen onboarding before
    if (hasSeenOnboarding()) {
      navigate('/');
    }
  }, [navigate]);

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    markOnboardingAsSeen();
  };

  const trendingServers = [{
    id: "trend1",
    name: "FastGPT Server",
    icon: "🚀",
    type: "HTTP_SSE" as any,
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
    type: "STDIO" as any,
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
    type: "HTTP_SSE" as any,
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
    type: "HTTP_SSE" as any,
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
    type: "HTTP_SSE" as any,
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
    type: "HTTP_SSE" as any,
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
    type: "STDIO" as any,
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
    type: "STDIO" as any,
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
    type: "HTTP_SSE" as any,
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
    type: "HTTP_SSE" as any,
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

  const handleViewDetails = (server: any) => {
    setSelectedServer(server);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Overview</h1>
        <p className="text-muted-foreground">Welcome to MCP Now. Let's get you started.</p>
      </div>
      
      {/* Trending Servers Section */}
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
                  <Card className="h-full relative overflow-hidden group border-0 shadow-lg">
                    {/* Background Image with Glassmorphism */}
                    <div 
                      className="absolute inset-0 opacity-15 bg-cover bg-center bg-no-repeat"
                      style={{
                        backgroundImage: `url(${getCompanyLogo(server.author)})`,
                        filter: 'blur(8px)'
                      }}
                    />
                    
                    {/* Glassmorphic Overlay */}
                    <div className="absolute inset-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md" />
                    
                    {/* Content */}
                    <CardHeader className="space-y-0 p-4 relative">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl text-gray-900 dark:text-white group-hover:text-primary transition-colors font-bold">
                          {server.name}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4 p-4 pt-0 relative">
                      <p className="text-sm text-gray-700 dark:text-gray-200 line-clamp-2 h-10 font-medium">
                        {server.description}
                      </p>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                          <Download className="h-4 w-4" />
                          {(server.downloads / 1000).toFixed(1)}k
                        </span>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleViewDetails(server)}
                          className="bg-white/80 dark:bg-gray-800/80 hover:bg-primary hover:text-primary-foreground backdrop-blur-sm"
                        >
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

      {/* Status Overview - Empty State */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Status</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {["Hosts", "Profiles", "Server Instances"].map((item, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px] text-center">
                <p className="text-muted-foreground">
                  No {item.toLowerCase()} configured yet
                </p>
                {/* <Button className="mt-4" asChild>
                  <Link to="/discovery">Browse Discovery</Link>
                </Button> */}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Collapsible Getting Started Guide */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
        <Collapsible open={isGuideOpen} onOpenChange={setIsGuideOpen} className="w-full">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-blue-500" />
              <h2 className="text-2xl font-bold tracking-tight">Getting Started with MCP Now</h2>
            </div>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="p-1">
                {isGuideOpen ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
                <span className="sr-only">
                  {isGuideOpen ? "Hide" : "Show"} getting started guide
                </span>
              </Button>
            </CollapsibleTrigger>
          </div>
          
          <CollapsibleContent className="animate-accordion-down">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <Card className="border-blue-100 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20">
                <CardContent className="p-4 h-full flex flex-col">
                  <div className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full p-2 w-10 h-10 flex items-center justify-center mb-3">
                    <Server className="h-5 w-5" />
                  </div>
                  <h3 className="font-medium mb-2">1. Install Servers</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex-grow">
                    Browse and install server definitions for your workflow.
                  </p>
                  <Button asChild size="sm" variant="outline" className="gap-1 mt-auto w-full">
                    <Link to="/discovery">
                      Go to Discovery
                      <ExternalLink className="h-3.5 w-3.5 ml-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-purple-100 dark:border-purple-900 bg-purple-50/50 dark:bg-purple-950/20">
                <CardContent className="p-4 h-full flex flex-col">
                  <div className="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-full p-2 w-10 h-10 flex items-center justify-center mb-3">
                    <Settings2 className="h-5 w-5" />
                  </div>
                  <h3 className="font-medium mb-2">2. Create Instances</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex-grow">
                    Configure server instances with your specific settings.
                  </p>
                  <Button asChild size="sm" variant="outline" className="gap-1 mt-auto w-full">
                    <Link to="/servers">
                      Manage Servers
                      <ExternalLink className="h-3.5 w-3.5 ml-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-green-100 dark:border-green-900 bg-green-50/50 dark:bg-green-950/20">
                <CardContent className="p-4 h-full flex flex-col">
                  <div className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-full p-2 w-10 h-10 flex items-center justify-center mb-3">
                    <Database className="h-5 w-5" />
                  </div>
                  <h3 className="font-medium mb-2">3. Create Profiles</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex-grow">
                    Group server instances into functional profiles.
                  </p>
                  <Button asChild size="sm" variant="outline" className="gap-1 mt-auto w-full">
                    <Link to="/profiles">
                      Manage Profiles
                      <ExternalLink className="h-3.5 w-3.5 ml-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-amber-100 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20">
                <CardContent className="p-4 h-full flex flex-col">
                  <div className="bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-300 rounded-full p-2 w-10 h-10 flex items-center justify-center mb-3">
                    <Monitor className="h-5 w-5" />
                  </div>
                  <h3 className="font-medium mb-2">4. Connect Hosts</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex-grow">
                    Link your profiles to hosts for deployment.
                  </p>
                  <Button asChild size="sm" variant="outline" className="gap-1 mt-auto w-full">
                    <Link to="/hosts">
                      Manage Hosts
                      <ExternalLink className="h-3.5 w-3.5 ml-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
      
      <GettingStartedDialog 
        open={showOnboarding}
        onOpenChange={setShowOnboarding}
      />
    </div>
  );
};

// Helper function to get company logo URL based on company name
const getCompanyLogo = (company: string): string => {
  const logos: Record<string, string> = {
    'AI Systems Inc': 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    'DevTools Ltd': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
    'PromptLabs': 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
    'SearchTech': 'https://images.unsplash.com/photo-1518770660439-4636190af475',
    'DocTools': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
    'VectorTech': 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    'PixelWorks': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
    'AudioLabs': 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
    'DataWorks': 'https://images.unsplash.com/photo-1518770660439-4636190af475',
    'ChatTech': 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
  };
  
  return logos[company] || logos['AI Systems Inc']; // Default fallback logo
};

export default NewUserDashboard;
