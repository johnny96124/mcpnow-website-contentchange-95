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
  Bot,
  Cpu,
  ServerIcon,
  Network as NetworkIcon,
  Globe,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
    <div className="container py-8 max-w-3xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="space-y-1.5">
        <div className="bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-300 px-3 py-1 rounded-full inline-flex items-center gap-1.5 mb-1">
          <Zap className="h-3.5 w-3.5" />
          <span className="text-xs font-medium">Getting Started</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome to Hosts</h1>
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
          <div className="flex items-start gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-900/30 rounded-md transition-colors">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-md text-blue-600 dark:text-blue-400">
              <MousePointer className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium">Add local hosts</h3>
              <p className="text-sm text-muted-foreground">
                Configure your local machine as a host
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-900/30 rounded-md transition-colors">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-md text-purple-600 dark:text-purple-400">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium">Connect remote hosts</h3>
              <p className="text-sm text-muted-foreground">
                Add remote machines as execution hosts
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-900/30 rounded-md transition-colors">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-md text-green-600 dark:text-green-400">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium">Configure resources</h3>
              <p className="text-sm text-muted-foreground">
                Manage CPU, memory and GPU allocations
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 pt-3">
          <Button 
            onClick={() => setIsScanning(true)}
            variant="default"
            className="gap-2"
          >
            Scan for Hosts
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
      
      {/* Supported host types */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Supported host types</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-card border p-4 rounded-lg flex items-start gap-3 shadow-sm">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-md text-blue-600 dark:text-blue-400">
              <ServerIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium">Local Hosts</h3>
              <p className="text-sm text-muted-foreground">
                Use your local machine for development and testing
              </p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-card border p-4 rounded-lg flex items-start gap-3 shadow-sm">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-md text-purple-600 dark:text-purple-400">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium">Remote Hosts</h3>
              <p className="text-sm text-muted-foreground">
                Connect to remote machines via SSH or API
              </p>
            </div>
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
