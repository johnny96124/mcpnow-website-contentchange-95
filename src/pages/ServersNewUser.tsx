import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  ArrowRight,
  Zap,
  Terminal,
  FileCode,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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
    setAddServerDialogOpen(false);
    navigate("/servers");
  };
  
  const handleSkip = () => {
    navigate("/servers");
  };

  return (
    <div className="container max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div className="mb-8 py-10 px-8 rounded-lg bg-gradient-to-r from-blue-500/20 via-blue-400/15 to-blue-300/10 border border-blue-100 dark:border-blue-900/30">
        <div className="flex items-center mb-2">
          <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">Getting Started</span>
          </div>
        </div>
        
        <h1 className="text-4xl font-bold tracking-tight mb-2 text-blue-900 dark:text-blue-50">Welcome to Servers</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Servers define the endpoints and connection types used to interact with models and services.
        </p>
      </div>
      
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">What are servers?</h2>
          <Card className="border-2 border-dashed bg-card/50 hover:bg-card/80 transition-colors">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Servers define how your application connects to models and external services. They can be HTTP endpoints, standard I/O processes, or custom implementations.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30">
                        <Terminal className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Create custom servers</h3>
                        <p className="text-xs text-muted-foreground">
                          Define your own servers with specific connection details
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30">
                        <Search className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Discover popular servers</h3>
                        <p className="text-xs text-muted-foreground">
                          Browse our catalog of pre-configured server definitions
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30">
                        <ArrowRight className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Create server instances</h3>
                        <p className="text-xs text-muted-foreground">
                          Set up multiple instances of the same server with different configurations
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium mb-3">Supported server types</h3>
                  {serverTypes.map((type) => (
                    <Card key={type.name} className="border hover:shadow-md transition-shadow">
                      <CardContent className="p-4 flex items-center gap-4">
                        <div>{type.icon}</div>
                        <div>
                          <h4 className="font-medium">{type.name}</h4>
                          <p className="text-xs text-muted-foreground">{type.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-row gap-3">
                <Button 
                  onClick={() => setAddServerDialogOpen(true)}
                  className="gap-2" 
                  size="lg"
                >
                  <Search className="h-4 w-4" />
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
            </CardContent>
          </Card>
        </div>
      </div>

      <AddServerDialog 
        open={addServerDialogOpen}
        onOpenChange={setAddServerDialogOpen}
        onCreateServer={handleCreateServer}
        onNavigateToDiscovery={() => navigate("/discovery")}
      />
    </div>
  );
};

export default ServersNewUser;
