
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Server,
  FileCode,
  Database,
  ArrowRight,
  Zap,
  HelpCircle,
  Globe,
  Terminal,
  CirclePlus,
  Search,
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
      icon: <Terminal className="h-5 w-5 text-blue-500" />,
      name: "HTTP SSE Servers",
      description: "Server-sent events over HTTP for real-time communication"
    },
    {
      icon: <FileCode className="h-5 w-5 text-indigo-500" />,
      name: "STDIO Servers",
      description: "Standard input/output servers for command-line execution"
    },
    {
      icon: <Database className="h-5 w-5 text-green-500" />,
      name: "Proprietary APIs",
      description: "Custom server implementations for specific use cases"
    },
    {
      icon: <Server className="h-5 w-5 text-orange-500" />,
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

  const leftSideFeatures = [
    {
      icon: <Server className="h-4 w-4 text-blue-500" />,
      name: "Create custom servers",
      description: "Define your own servers with specific connection details"
    },
    {
      icon: <Globe className="h-4 w-4 text-indigo-600" />,
      name: "Discover popular servers",
      description: "Browse our catalog of pre-configured server definitions"
    },
    {
      icon: <CirclePlus className="h-4 w-4 text-green-500" />,
      name: "Create server instances",
      description: "Set up multiple instances of the same server with different configurations"
    }
  ];

  return (
    <div className="py-6 max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Getting Started Badge */}
      <div className="flex justify-center">
        <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-4 py-1.5 rounded-full inline-flex items-center gap-1.5">
          <Zap className="h-3.5 w-3.5" />
          <span className="text-xs font-medium">Getting Started</span>
        </div>
      </div>

      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight">Welcome to Servers</h1>
        <p className="text-muted-foreground text-base">
          Servers define the endpoints and connection types used to interact with models and services.
        </p>
      </div>
      
      {/* Main content */}
      <Card className="bg-white dark:bg-card shadow-sm border">
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Left side */}
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">What are servers?</h2>
                <p className="text-muted-foreground text-sm">
                  Servers define how your application connects to models and external services.
                  They can be HTTP endpoints, standard I/O processes, or custom implementations.
                </p>
              </div>
              
              <div className="space-y-3.5">
                {leftSideFeatures.map((feature) => (
                  <div key={feature.name} className="flex items-start gap-3">
                    <div className="mt-0.5 p-1.5 rounded-full bg-gray-100 dark:bg-gray-800">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">{feature.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button 
                  onClick={handleNavigateToDiscovery}
                  variant="default"
                  size="lg"
                  className="gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Globe className="h-4 w-4" />
                  Browse Servers
                </Button>
                
                <Button 
                  onClick={handleSkip} 
                  variant="outline" 
                  size="lg"
                >
                  Skip for Now
                </Button>
              </div>
            </div>
            
            {/* Right side */}
            <div className="space-y-5">
              <h2 className="text-xl font-semibold">Supported server types</h2>
              
              <div className="grid grid-cols-1 gap-4">
                {serverTypes.map((type, index) => (
                  <div 
                    key={type.name} 
                    className="flex gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-colors"
                  >
                    <div className="p-2 rounded-md bg-white dark:bg-gray-800 shadow-sm">
                      {type.icon}
                    </div>
                    <div>
                      <h3 className="font-medium">{type.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{type.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 p-4 rounded-lg flex items-start gap-3 mt-4">
                <HelpCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-amber-800 dark:text-amber-300">Need help?</h3>
                  <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                    If you're not sure how to set up a server,{" "}
                    <a href="#" className="text-amber-800 dark:text-amber-300 underline font-medium">
                      view our configuration guide
                    </a>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
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
