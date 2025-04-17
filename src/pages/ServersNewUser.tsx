
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Server,
  FileCode,
  Database,
  ArrowRight,
  Zap,
  HelpCircle,
  ServerCrash,
  Globe,
  Terminal,
  CirclePlus,
  Sparkles,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { serverDefinitions } from "@/data/mockData";
import { markServersOnboardingAsSeen } from "@/utils/localStorage";
import { AddServerDialog } from "@/components/servers/AddServerDialog";

const ServersNewUser = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [addServerDialogOpen, setAddServerDialogOpen] = useState(false);
  
  const serverTypes = [
    {
      icon: <Terminal className="h-10 w-10 text-blue-500" />,
      name: "HTTP SSE Servers",
      description: "Server-sent events over HTTP for real-time communication"
    },
    {
      icon: <FileCode className="h-10 w-10 text-purple-500" />,
      name: "STDIO Servers",
      description: "Standard input/output servers for command-line execution"
    },
    {
      icon: <Database className="h-10 w-10 text-green-500" />,
      name: "Proprietary APIs",
      description: "Custom server implementations for specific use cases"
    },
    {
      icon: <Server className="h-10 w-10 text-amber-500" />,
      name: "Open-source Models",
      description: "Compatible with popular open-source model implementations"
    }
  ];

  const handleCreateServer = (serverData: {
    name: string;
    type: 'HTTP_SSE' | 'STDIO';
    description?: string;
    url?: string;
    commandArgs?: string;
  }) => {
    toast({
      title: "Server Created",
      description: `${serverData.name} has been created successfully.`,
    });
    
    markServersOnboardingAsSeen();
    setAddServerDialogOpen(false);
    navigate("/servers");
  };
  
  const handleSkip = () => {
    markServersOnboardingAsSeen();
    navigate("/servers");
  };
  
  const handleNavigateToDiscovery = () => {
    markServersOnboardingAsSeen();
    navigate("/discovery");
  };

  return (
    <div className="container py-8 max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-4 py-1.5 rounded-full inline-flex items-center gap-2 mb-2 shadow-sm">
          <Sparkles className="h-3.5 w-3.5" />
          <span className="text-xs font-medium">Getting Started</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome to Servers</h1>
        <p className="text-muted-foreground text-lg">
          Servers define the endpoints and connection types used to interact with models and services.
        </p>
      </div>
      
      {/* Main content */}
      <Card className="border-2 border-dashed bg-card/50 hover:bg-card/80 transition-colors overflow-hidden shadow-sm hover:shadow-md">
        <div className="absolute inset-0 bg-gradient-subtle from-blue-50/20 to-purple-50/20 dark:from-blue-950/10 dark:to-purple-950/10"></div>
        <CardContent className="pt-6 relative">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold mb-4">What are servers?</h2>
                <p className="text-muted-foreground">
                  Servers define how your application connects to models and external services.
                  They can be HTTP endpoints, standard I/O processes, or custom implementations.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3 group hover-lift hover:bg-blue-50/50 dark:hover:bg-blue-900/20 p-3 rounded-lg">
                  <div className="mt-1 p-2 rounded-full bg-blue-100 dark:bg-blue-900/50 shadow-sm group-hover:shadow">
                    <Server className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">Create custom servers</h3>
                    <p className="text-xs text-muted-foreground">
                      Define your own servers with specific connection details
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 group hover-lift hover:bg-purple-50/50 dark:hover:bg-purple-900/20 p-3 rounded-lg">
                  <div className="mt-1 p-2 rounded-full bg-purple-100 dark:bg-purple-900/50 shadow-sm group-hover:shadow">
                    <Globe className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">Discover popular servers</h3>
                    <p className="text-xs text-muted-foreground">
                      Browse our catalog of pre-configured server definitions
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 group hover-lift hover:bg-green-50/50 dark:hover:bg-green-900/20 p-3 rounded-lg">
                  <div className="mt-1 p-2 rounded-full bg-green-100 dark:bg-green-900/50 shadow-sm group-hover:shadow">
                    <CirclePlus className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">Create server instances</h3>
                    <p className="text-xs text-muted-foreground">
                      Set up multiple instances of the same server with different configurations
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={handleNavigateToDiscovery}
                  variant="default"
                  size="lg"
                  className="gap-2 animate-pulse-subtle shadow-md"
                >
                  <Globe className="h-4 w-4" />
                  Browse Servers
                </Button>
                
                <Button 
                  onClick={handleSkip} 
                  variant="ghost" 
                  size="lg"
                >
                  Skip for Now
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Supported server types</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {serverTypes.map((type, index) => (
                  <Card 
                    key={type.name} 
                    className="border hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-secondary/20 dark:to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <CardContent className="p-4 flex gap-3 items-start relative">
                      <div className="p-2 rounded-full bg-card shadow-soft">{type.icon}</div>
                      <div>
                        <h3 className="font-medium">{type.name}</h3>
                        <p className="text-xs text-muted-foreground">{type.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 p-4 rounded-lg flex items-start gap-3 shadow-sm">
                <HelpCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-amber-800 dark:text-amber-300">Need help?</h3>
                  <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                    If you're not sure how to set up a host,{" "}
                    <a href="#" className="text-amber-800 dark:text-amber-300 underline font-medium hover:text-amber-900 transition-colors">
                      view our configuration guide
                    </a>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AddServerDialog 
        open={addServerDialogOpen}
        onOpenChange={setAddServerDialogOpen}
        onCreateServer={handleCreateServer}
        onNavigateToDiscovery={handleNavigateToDiscovery}
      />
    </div>
  );
};

export default ServersNewUser;
