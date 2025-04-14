
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Laptop,
  Server,
  Search,
  ArrowRight,
  RefreshCw,
  Globe,
  TerminalSquare,
  Zap,
  HelpCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { hosts } from "@/data/mockData";
import { HostConfigGuideDialog } from "@/components/discovery/HostConfigGuideDialog";
import { useHostProfiles } from "@/hooks/useHostProfiles";

const HostsNewUser = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { getAvailableHosts } = useHostProfiles();
  
  const hostTypes = [
    {
      icon: <Laptop className="h-10 w-10 text-blue-500" />,
      name: "Local Machine",
      description: "Your own computer can act as a host for development and testing"
    },
    {
      icon: <Server className="h-10 w-10 text-purple-500" />,
      name: "Dedicated Servers",
      description: "Physical or cloud servers running Linux, macOS, or Windows"
    },
    {
      icon: <Globe className="h-10 w-10 text-green-500" />,
      name: "Cloud Instances",
      description: "AWS, GCP, or Azure virtual machines configured as hosts"
    },
    {
      icon: <TerminalSquare className="h-10 w-10 text-amber-500" />,
      name: "Docker Containers",
      description: "Containerized environments that can act as isolated hosts"
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
    <div className="container py-8 max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-4 py-1 rounded-full inline-flex items-center gap-1.5 mb-2">
          <Zap className="h-3.5 w-3.5" />
          <span className="text-xs font-medium">Getting Started</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome to Hosts</h1>
        <p className="text-muted-foreground text-lg">
          Hosts are machines that run your server profiles and instances. Let's set up your first host.
        </p>
      </div>
      
      {/* Main content */}
      <Card className="border-2 border-dashed bg-card/50 hover:bg-card/80 transition-colors">
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">What are hosts?</h2>
                <p className="text-muted-foreground">
                  Hosts are computers or servers that run your model profiles and instances.
                  You need at least one host to start using the platform.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <div className="mt-1 p-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <Search className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Scan for hosts</h3>
                    <p className="text-xs text-muted-foreground">
                      We'll automatically detect hosts on your local network
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="mt-1 p-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30">
                    <Server className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Add hosts manually</h3>
                    <p className="text-xs text-muted-foreground">
                      Configure remote hosts or servers with custom settings
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="mt-1 p-1.5 rounded-full bg-green-100 dark:bg-green-900/30">
                    <ArrowRight className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Connect profiles to hosts</h3>
                    <p className="text-xs text-muted-foreground">
                      Link your model profiles to the appropriate hosts
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
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
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Supported host types</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {hostTypes.map((type) => (
                  <Card key={type.name} className="border hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex gap-3 items-start">
                      <div>{type.icon}</div>
                      <div>
                        <h3 className="font-medium">{type.name}</h3>
                        <p className="text-xs text-muted-foreground">{type.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
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
          </div>
        </CardContent>
      </Card>

      <HostConfigGuideDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        profile={null}
        hosts={getAvailableHosts()}
      />
    </div>
  );
};

export default HostsNewUser;
