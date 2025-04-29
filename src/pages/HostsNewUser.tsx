
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import {
  Search,
  ArrowRight,
  RefreshCw,
  MousePointer,
  CloudCog,
  Cpu,
  Bot,
  Zap,
  Server,
  ChevronRight,
  HelpCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { hosts } from "@/data/mockData";
import { useHostProfiles } from "@/hooks/useHostProfiles";
import { HostConfigGuideDialog } from "@/components/discovery/HostConfigGuideDialog";

const HostsNewUser = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { getAvailableHosts } = useHostProfiles();
  
  const mainHostTypes = [
    {
      icon: <MousePointer className="h-10 w-10 text-blue-500" />,
      name: "Cursor",
      description: "AI-powered code editor with intelligent completions and suggestions"
    },
    {
      icon: <CloudCog className="h-10 w-10 text-purple-500" />,
      name: "Windsurf",
      description: "Cloud-based development environment with seamless deployment features"
    },
    {
      icon: <Cpu className="h-10 w-10 text-green-500" />,
      name: "Cline",
      description: "High-performance computing platform specialized for AI model inference"
    },
    {
      icon: <Bot className="h-10 w-10 text-amber-500" />,
      name: "Claude",
      description: "Advanced AI assistant with natural language understanding and reasoning"
    }
  ];

  const handleScan = () => {
    setIsScanning(true);
    
    // Simulate scanning process
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% chance of success
      
      if (success) {
        toast({
          title: "Host discovered!",
          description: "We found a local host on your network.",
        });
        
        // Redirect to main hosts page after successful scan
        setTimeout(() => {
          navigate("/hosts");
        }, 1500);
      } else {
        toast({
          title: "No hosts found",
          description: "We couldn't find any hosts automatically.",
          variant: "destructive",
        });
        setDialogOpen(true);
      }
      
      setIsScanning(false);
    }, 2500);
  };
  
  const handleSkip = () => {
    navigate("/hosts");
  };
  
  const handleOpenGuide = () => {
    setDialogOpen(true);
  };

  return (
    <div className="container max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Header with teal gradient background */}
      <div className="mb-8 py-10 px-8 rounded-lg bg-gradient-to-r from-teal-500/20 via-teal-400/15 to-teal-300/10 border border-teal-100 dark:border-teal-900/30">
        <div className="flex items-center mb-2">
          <div className="bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300 px-3 py-1 rounded-full flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">Getting Started</span>
          </div>
        </div>
        
        <h1 className="text-4xl font-bold tracking-tight mb-2 text-teal-900 dark:text-teal-50">Welcome to Hosts</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Hosts are machines that run your server profiles and instances. Let's set up your first host.
        </p>
      </div>
      
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">What are hosts?</h2>
          <Card className="border-2 border-dashed bg-card/50 hover:bg-card/80 transition-colors">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Hosts are computers or servers that run your model profiles and instances.
                    You need at least one host to start using the platform.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-1.5 rounded-full bg-teal-100 dark:bg-teal-900/30">
                        <Search className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Scan for hosts</h3>
                        <p className="text-xs text-muted-foreground">
                          We'll automatically detect hosts on your local network
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-1.5 rounded-full bg-teal-100 dark:bg-teal-900/30">
                        <Server className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Add hosts manually</h3>
                        <p className="text-xs text-muted-foreground">
                          Configure remote hosts or servers with custom settings
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-1.5 rounded-full bg-teal-100 dark:bg-teal-900/30">
                        <ArrowRight className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Connect profiles to hosts</h3>
                        <p className="text-xs text-muted-foreground">
                          Link your model profiles to the appropriate hosts
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Supported host types</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mainHostTypes.map((type) => (
                      <HoverCard key={type.name}>
                        <HoverCardTrigger asChild>
                          <Card className="border hover:shadow-md transition-shadow cursor-pointer">
                            <CardContent className="p-4 flex items-center gap-4">
                              <div>{type.icon}</div>
                              <h4 className="font-medium">{type.name}</h4>
                            </CardContent>
                          </Card>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <div className="flex justify-between space-x-4">
                            <div>
                              <h4 className="font-semibold">{type.name}</h4>
                              <p className="text-sm text-muted-foreground">{type.description}</p>
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    ))}
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    className="mt-4 w-full justify-between text-muted-foreground hover:text-foreground"
                  >
                    Explore more host types
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-row gap-3">
                <Button 
                  onClick={handleScan} 
                  className="gap-2" 
                  size="lg"
                  disabled={isScanning}
                >
                  {isScanning ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4" />
                      Scan for Hosts
                    </>
                  )}
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
        
        <Separator />
        
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 p-4 rounded-lg flex items-start gap-3">
          <HelpCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-amber-800 dark:text-amber-300">Need help?</h3>
            <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
              If you're not sure how to set up a host, 
              <Button 
                variant="link" 
                className="h-auto p-0 text-sm text-amber-700 dark:text-amber-400 font-medium underline"
                onClick={handleOpenGuide}
              >
                view our configuration guide
              </Button>
              .
            </p>
          </div>
        </div>
      </div>

      <HostConfigGuideDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        profile={null}
        hosts={getAvailableHosts()} // Call the function to get hosts
      />
    </div>
  );
};

export default HostsNewUser;
