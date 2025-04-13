
import { useState } from "react";
import { 
  ExternalLink, 
  ChevronRight, 
  ArrowRight, 
  PlusCircle, 
  Download, 
  Settings, 
  Server, 
  User, 
  Link 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusIndicator } from "@/components/status/StatusIndicator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";

/**
 * A component that displays a first-time user experience in the System Tray.
 * This guides new users through the initial steps of setting up and using the application.
 */
const NewUserTrayPopup = () => {
  const [currentStep, setCurrentStep] = useState<'welcome' | 'install-servers' | 'create-instances' | 'create-profiles' | 'associate-hosts'>('welcome');
  
  // Open the main dashboard in a new window
  const openDashboard = () => {
    window.open("/", "_blank");
  };

  // Open specific pages directly
  const openDiscoveryPage = () => {
    window.open("/discovery", "_blank");
  };

  const openServersPage = () => {
    window.open("/servers", "_blank");
  };

  const openProfilesPage = () => {
    window.open("/profiles", "_blank");
  };

  const openHostsPage = () => {
    window.open("/hosts", "_blank");
  };

  // Navigation between steps
  const goToStep = (step: 'welcome' | 'install-servers' | 'create-instances' | 'create-profiles' | 'associate-hosts') => {
    setCurrentStep(step);
  };

  return (
    <div className="w-[420px] p-2 bg-background rounded-lg shadow-lg animate-fade-in max-h-[80vh]">
      {/* Header */}
      <div className="flex items-center justify-between p-2 mb-4">
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/0ad4c791-4d08-4e94-bbeb-3ac78aae67ef.png" 
            alt="MCP Now Logo" 
            className="h-6 w-6" 
          />
          <h2 className="font-medium">MCP Now</h2>
        </div>
        <Button 
          size="sm" 
          variant="ghost"
          className="text-xs flex items-center gap-1"
          onClick={openDashboard}
        >
          <span>Open Dashboard</span>
          <ExternalLink className="h-3 w-3" />
        </Button>
      </div>

      <ScrollArea className="h-full max-h-[calc(80vh-70px)]">
        <div className="pr-3">
          {/* Welcome Step */}
          {currentStep === 'welcome' && (
            <div className="space-y-4 px-1">
              <div className="text-center py-4">
                <h3 className="text-xl font-semibold mb-2">Welcome to MCP Now!</h3>
                <p className="text-muted-foreground">
                  Let's get you started with setting up your environment
                </p>
              </div>
              
              <Card className="overflow-hidden">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
                  <h4 className="font-medium mb-2">Getting Started Guide</h4>
                  <p className="text-sm text-muted-foreground">
                    MCP Now helps you manage servers, profiles, and hosts. Follow these simple steps:
                  </p>
                </div>
                
                <div className="p-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full p-1 h-7 w-7 flex items-center justify-center text-primary text-sm font-medium mt-0.5">
                      1
                    </div>
                    <div>
                      <h5 className="font-medium text-sm">Install Servers from Discovery</h5>
                      <p className="text-xs text-muted-foreground">
                        Browse and install server definitions from the Discovery page
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full p-1 h-7 w-7 flex items-center justify-center text-primary text-sm font-medium mt-0.5">
                      2
                    </div>
                    <div>
                      <h5 className="font-medium text-sm">Create Instances</h5>
                      <p className="text-xs text-muted-foreground">
                        Create and configure server instances with custom parameters
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full p-1 h-7 w-7 flex items-center justify-center text-primary text-sm font-medium mt-0.5">
                      3
                    </div>
                    <div>
                      <h5 className="font-medium text-sm">Create Profiles</h5>
                      <p className="text-xs text-muted-foreground">
                        Create profiles and add instances to them
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full p-1 h-7 w-7 flex items-center justify-center text-primary text-sm font-medium mt-0.5">
                      4
                    </div>
                    <div>
                      <h5 className="font-medium text-sm">Associate Hosts with Profiles</h5>
                      <p className="text-xs text-muted-foreground">
                        Connect your profiles to hosts to deploy server instances
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
              
              <div className="flex justify-end gap-2 pt-2">
                <Button 
                  onClick={() => goToStep('install-servers')}
                  className="gap-1"
                >
                  Get Started
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Install Servers Step */}
          {currentStep === 'install-servers' && (
            <div className="space-y-4 px-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Step 1: Install Servers</h3>
                <StatusIndicator status="none" />
              </div>
              
              <Card className="overflow-hidden">
                <div className="p-6 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                    <Download className="h-10 w-10 text-muted-foreground opacity-70" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Discover and Install Servers</h4>
                    <p className="text-sm text-muted-foreground">
                      Browse the Discovery page to find and install server definitions
                    </p>
                  </div>
                  
                  <Button onClick={openDiscoveryPage} className="mt-2 gap-1">
                    <Download className="h-4 w-4" />
                    Open Discovery Page
                  </Button>
                </div>
              </Card>

              <Card className="p-4">
                <h4 className="font-medium mb-2">Available Server Types</h4>
                <div className="space-y-2">
                  <div className="bg-muted/40 p-3 rounded-md">
                    <h5 className="font-medium text-sm">Web Servers</h5>
                    <p className="text-xs text-muted-foreground">
                      HTTP/HTTPS servers for web applications
                    </p>
                  </div>
                  <div className="bg-muted/40 p-3 rounded-md">
                    <h5 className="font-medium text-sm">Database Servers</h5>
                    <p className="text-xs text-muted-foreground">
                      Manage SQL, NoSQL, and other database instances
                    </p>
                  </div>
                  <div className="bg-muted/40 p-3 rounded-md">
                    <h5 className="font-medium text-sm">API Servers</h5>
                    <p className="text-xs text-muted-foreground">
                      For building and managing RESTful APIs
                    </p>
                  </div>
                </div>
              </Card>
              
              <div className="flex justify-between gap-2 pt-2">
                <Button 
                  variant="ghost" 
                  onClick={() => goToStep('welcome')}
                >
                  Back
                </Button>
                <Button 
                  onClick={() => goToStep('create-instances')}
                  className="gap-1"
                >
                  Next Step
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Create Instances Step */}
          {currentStep === 'create-instances' && (
            <div className="space-y-4 px-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Step 2: Create Instances</h3>
                <StatusIndicator status="none" />
              </div>
              
              <Card className="overflow-hidden">
                <div className="p-6 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                    <Settings className="h-10 w-10 text-muted-foreground opacity-70" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Configure Server Instances</h4>
                    <p className="text-sm text-muted-foreground">
                      Create instances of installed servers with specific configurations
                    </p>
                  </div>
                  
                  <Button onClick={openServersPage} className="mt-2 gap-1">
                    <PlusCircle className="h-4 w-4" />
                    Create Instances
                  </Button>
                </div>
              </Card>

              <Card className="p-4">
                <h4 className="font-medium mb-2">Instance Configuration</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Instances are specific configurations of server definitions. You can customize:
                </p>
                <div className="space-y-2">
                  <div className="bg-muted/40 p-3 rounded-md">
                    <h5 className="font-medium text-sm">Environment Variables</h5>
                    <p className="text-xs text-muted-foreground">
                      Set custom environment variables for your server
                    </p>
                  </div>
                  <div className="bg-muted/40 p-3 rounded-md">
                    <h5 className="font-medium text-sm">Command Arguments</h5>
                    <p className="text-xs text-muted-foreground">
                      Specify startup arguments for server processes
                    </p>
                  </div>
                  <div className="bg-muted/40 p-3 rounded-md">
                    <h5 className="font-medium text-sm">Connection Details</h5>
                    <p className="text-xs text-muted-foreground">
                      Configure URL paths, ports, and request headers
                    </p>
                  </div>
                </div>
              </Card>
              
              <div className="flex justify-between gap-2 pt-2">
                <Button 
                  variant="ghost" 
                  onClick={() => goToStep('install-servers')}
                >
                  Back
                </Button>
                <Button 
                  onClick={() => goToStep('create-profiles')}
                  className="gap-1"
                >
                  Next Step
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Create Profiles Step */}
          {currentStep === 'create-profiles' && (
            <div className="space-y-4 px-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Step 3: Create Profiles</h3>
                <StatusIndicator status="none" />
              </div>
              
              <Card className="overflow-hidden">
                <div className="p-6 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-10 w-10 text-muted-foreground opacity-70" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Create Profiles</h4>
                    <p className="text-sm text-muted-foreground">
                      Create profiles and add your server instances to them
                    </p>
                  </div>
                  
                  <Button onClick={openProfilesPage} className="mt-2 gap-1">
                    <PlusCircle className="h-4 w-4" />
                    Manage Profiles
                  </Button>
                </div>
              </Card>

              <Card className="p-4">
                <h4 className="font-medium mb-2">What are Profiles?</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Profiles are collections of server instances that can be applied to hosts. They help organize your server configurations:
                </p>
                <div className="space-y-2">
                  <div className="bg-muted/40 p-3 rounded-md">
                    <h5 className="font-medium text-sm">Group Related Servers</h5>
                    <p className="text-xs text-muted-foreground">
                      Organize instances that work together in a single profile
                    </p>
                  </div>
                  <div className="bg-muted/40 p-3 rounded-md">
                    <h5 className="font-medium text-sm">Different Environments</h5>
                    <p className="text-xs text-muted-foreground">
                      Create separate profiles for development, testing, and production
                    </p>
                  </div>
                </div>
              </Card>
              
              <div className="flex justify-between gap-2 pt-2">
                <Button 
                  variant="ghost" 
                  onClick={() => goToStep('create-instances')}
                >
                  Back
                </Button>
                <Button 
                  onClick={() => goToStep('associate-hosts')}
                  className="gap-1"
                >
                  Next Step
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Associate Hosts Step */}
          {currentStep === 'associate-hosts' && (
            <div className="space-y-4 px-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Step 4: Associate Hosts</h3>
                <StatusIndicator status="none" />
              </div>
              
              <Card className="overflow-hidden">
                <div className="p-6 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                    <Link className="h-10 w-10 text-muted-foreground opacity-70" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Link Hosts with Profiles</h4>
                    <p className="text-sm text-muted-foreground">
                      Associate your hosts with profiles to deploy server instances
                    </p>
                  </div>
                  
                  <Button onClick={openHostsPage} className="mt-2 gap-1">
                    <Link className="h-4 w-4" />
                    Manage Hosts
                  </Button>
                </div>
              </Card>

              <Card className="overflow-hidden p-4">
                <h4 className="font-medium mb-2">Complete Your Setup</h4>
                <div className="space-y-4">
                  <div className="bg-muted/40 p-3 rounded-md">
                    <h5 className="font-medium text-sm mb-1 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-green-400"></span>
                      All Set Up!
                    </h5>
                    <p className="text-xs text-muted-foreground mb-2">
                      You're now ready to start using MCP Now. Head to the Discovery page to begin exploring servers.
                    </p>
                  </div>
                  
                  <div className="bg-muted/40 p-3 rounded-md">
                    <h5 className="font-medium text-sm mb-1 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-blue-400"></span>
                      System Tray Access
                    </h5>
                    <p className="text-xs text-muted-foreground">
                      MCP Now will continue running in your system tray. Access it anytime by clicking the icon in your taskbar.
                    </p>
                  </div>
                </div>
              </Card>
              
              <div className="flex justify-between gap-2 pt-2">
                <Button 
                  variant="ghost" 
                  onClick={() => goToStep('create-profiles')}
                >
                  Back
                </Button>
                <Button 
                  onClick={openDiscoveryPage}
                  variant="default"
                  className="gap-1"
                >
                  Go to Discovery
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default NewUserTrayPopup;
