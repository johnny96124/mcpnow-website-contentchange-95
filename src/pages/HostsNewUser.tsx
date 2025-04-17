
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Search,
  ArrowRight,
  RefreshCw,
  HelpCircle,
  Zap,
  MousePointer,
  CloudCog,
  Cpu,
  Bot,
  ServerIcon,
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
  
  const hostFeatures = [
    {
      icon: <ServerIcon className="h-5 w-5" />,
      name: "Deploy Instances",
      description: "Run your instances on specific hosts"
    },
    {
      icon: <CloudCog className="h-5 w-5" />,
      name: "Remote Management",
      description: "Control hosts from a central interface"
    },
    {
      icon: <Search className="h-5 w-5" />,
      name: "Auto-Discovery",
      description: "Find hosts on your network automatically"
    }
  ];

  const hostTypes = [
    {
      icon: <MousePointer className="h-5 w-5" />,
      name: "Cursor",
      description: "AI-powered code editor with intelligent completions"
    },
    {
      icon: <CloudCog className="h-5 w-5" />,
      name: "Windsurf",
      description: "Cloud-based development environment with deployment features"
    },
    {
      icon: <Cpu className="h-5 w-5" />,
      name: "Cline",
      description: "High-performance computing platform for AI inference"
    },
    {
      icon: <Bot className="h-5 w-5" />,
      name: "Claude",
      description: "Advanced AI assistant with language understanding"
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
    <div className="container py-8 max-w-3xl mx-auto space-y-8 animate-fade-in">
      {/* Header with teal gradient background */}
      <div className="text-center space-y-3">
        <div className="bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-300 px-3 py-1 rounded-full inline-flex items-center gap-1.5 mb-1">
          <Zap className="h-3.5 w-3.5" />
          <span className="text-xs font-medium">Getting Started</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-teal-600">Welcome to Hosts</h1>
        <p className="text-muted-foreground">
          Hosts are machines that run your server profiles and instances. Let's set up your first host.
        </p>
      </div>
      
      {/* Main content */}
      <div className="bg-white dark:bg-card border rounded-lg p-6 space-y-6 shadow-sm">
        <div className="space-y-2.5">
          <h2 className="text-xl font-semibold">What are hosts?</h2>
          <p className="text-muted-foreground">
            Hosts are computers or servers that run your model profiles and instances.
            You need at least one host to start using the platform.
          </p>
        </div>
        
        <div className="space-y-4 pt-2">
          {hostFeatures.map((feature) => (
            <div 
              key={feature.name}
              className="flex items-start gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-900/30 rounded-md transition-colors"
            >
              <div className="p-2 bg-teal-100 dark:bg-teal-900/20 rounded-md text-teal-600 dark:text-teal-400">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-medium">{feature.name}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex gap-3 pt-3">
          <Button 
            onClick={handleScan} 
            className="gap-2" 
            variant="default"
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
          >
            Skip for Now
          </Button>
        </div>
      </div>
      
      {/* Supported host types */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Supported host types</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {hostTypes.map((type) => (
            <div 
              key={type.name}
              className="bg-white dark:bg-card border p-4 rounded-lg flex items-start gap-3 shadow-sm"
            >
              <div className="p-2 bg-teal-100 dark:bg-teal-900/20 rounded-md text-teal-600 dark:text-teal-400">
                {type.icon}
              </div>
              <div>
                <h3 className="font-medium">{type.name}</h3>
                <p className="text-sm text-muted-foreground">{type.description}</p>
              </div>
            </div>
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
