
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Server,
  FileCode,
  ArrowRight,
  Zap,
  Search,
  Plus,
  Terminal,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { markServersOnboardingAsSeen } from "@/utils/localStorage";
import { AddServerDialog } from "@/components/servers/AddServerDialog";

const ServersNewUser = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [addServerDialogOpen, setAddServerDialogOpen] = useState(false);
  
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
    <div className="container py-8 max-w-3xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="space-y-1.5">
        <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-3 py-1 rounded-full inline-flex items-center gap-1.5 mb-1">
          <Zap className="h-3.5 w-3.5" />
          <span className="text-xs font-medium">Getting Started</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome to Servers</h1>
        <p className="text-muted-foreground">
          Servers define the endpoints and connection types used to interact with models and services.
        </p>
      </div>
      
      {/* Main content */}
      <div className="bg-white dark:bg-card border rounded-lg p-6 space-y-6 shadow-sm">
        <div className="space-y-2.5">
          <h2 className="text-xl font-semibold">What are servers?</h2>
          <p className="text-muted-foreground">
            Servers define how your application connects to models and external services. They can be HTTP endpoints, standard I/O processes, or custom implementations.
          </p>
        </div>
        
        <div className="space-y-4 pt-2">
          <div className="flex items-start gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-900/30 rounded-md transition-colors">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-md text-blue-600 dark:text-blue-400">
              <Terminal className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium">Create custom servers</h3>
              <p className="text-sm text-muted-foreground">
                Define your own servers with specific connection details
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-900/30 rounded-md transition-colors">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-md text-purple-600 dark:text-purple-400">
              <Search className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium">Discover popular servers</h3>
              <p className="text-sm text-muted-foreground">
                Browse our catalog of pre-configured server definitions
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-900/30 rounded-md transition-colors">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-md text-green-600 dark:text-green-400">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium">Create server instances</h3>
              <p className="text-sm text-muted-foreground">
                Set up multiple instances of the same server with different configurations
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 pt-3">
          <Button 
            onClick={() => setAddServerDialogOpen(true)}
            variant="default"
            className="gap-2"
          >
            Browse Servers
            <ArrowRight className="h-4 w-4" />
          </Button>
          
          <Button 
            onClick={handleSkip} 
            variant="outline" 
          >
            Skip for Now
          </Button>
        </div>
      </div>
      
      {/* Supported server types */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Supported server types</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-card border p-4 rounded-lg flex items-start gap-3 shadow-sm">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-md text-blue-600 dark:text-blue-400">
              <Server className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium">HTTP SSE Servers</h3>
              <p className="text-sm text-muted-foreground">
                Server-sent events over HTTP for real-time communication
              </p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-card border p-4 rounded-lg flex items-start gap-3 shadow-sm">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-md text-purple-600 dark:text-purple-400">
              <FileCode className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium">STDIO Servers</h3>
              <p className="text-sm text-muted-foreground">
                Standard input/output servers for command-line execution
              </p>
            </div>
          </div>
        </div>
      </div>

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
