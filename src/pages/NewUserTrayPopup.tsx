
import { useState } from "react";
import { ExternalLink, Info, ChevronRight, ArrowRight, PlusCircle } from "lucide-react";
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
  const [currentStep, setCurrentStep] = useState<'welcome' | 'discover' | 'connect'>('welcome');
  
  // Open the main dashboard in a new window
  const openDashboard = () => {
    window.open("/", "_blank");
  };

  // Open the hosts page directly
  const openHostsPage = () => {
    window.open("/hosts", "_blank");
  };

  // Navigation between steps
  const goToStep = (step: 'welcome' | 'discover' | 'connect') => {
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
                  Let's get you started with connecting to your first host
                </p>
              </div>
              
              <Card className="overflow-hidden">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
                  <h4 className="font-medium mb-2">Getting Started Guide</h4>
                  <p className="text-sm text-muted-foreground">
                    MCP Now helps you manage host connections and server profiles. Follow these simple steps:
                  </p>
                </div>
                
                <div className="p-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full p-1 h-7 w-7 flex items-center justify-center text-primary text-sm font-medium mt-0.5">
                      1
                    </div>
                    <div>
                      <h5 className="font-medium text-sm">Discover Hosts</h5>
                      <p className="text-xs text-muted-foreground">
                        Scan your network to find available MCP hosts or add them manually
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full p-1 h-7 w-7 flex items-center justify-center text-primary text-sm font-medium mt-0.5">
                      2
                    </div>
                    <div>
                      <h5 className="font-medium text-sm">Configure Hosts</h5>
                      <p className="text-xs text-muted-foreground">
                        Set up configuration files to establish connections
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full p-1 h-7 w-7 flex items-center justify-center text-primary text-sm font-medium mt-0.5">
                      3
                    </div>
                    <div>
                      <h5 className="font-medium text-sm">Select Profiles</h5>
                      <p className="text-xs text-muted-foreground">
                        Choose profiles to connect hosts to server instances
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
              
              <div className="flex justify-end gap-2 pt-2">
                <Button 
                  onClick={() => goToStep('discover')}
                  className="gap-1"
                >
                  Get Started
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Discover Step */}
          {currentStep === 'discover' && (
            <div className="space-y-4 px-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Find Your First Host</h3>
                <StatusIndicator status="warning" label="No Hosts" />
              </div>
              
              <Card className="overflow-hidden">
                <div className="p-6 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                    <Info className="h-10 w-10 text-muted-foreground opacity-70" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">No hosts detected yet</h4>
                    <p className="text-sm text-muted-foreground">
                      Scan your network to find MCP hosts or add one manually
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 w-full mt-4">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full">
                          <Info className="h-4 w-4 mr-2" />
                          <span>What's a Host?</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="text-sm">
                        <h5 className="font-medium mb-1">About Hosts</h5>
                        <p className="text-muted-foreground text-xs">
                          A Host is a machine or device running MCP that can be connected to and managed through MCP Now.
                        </p>
                      </PopoverContent>
                    </Popover>
                    
                    <Button onClick={openHostsPage} className="w-full gap-1">
                      <PlusCircle className="h-4 w-4" />
                      Find Hosts
                    </Button>
                  </div>
                </div>
              </Card>
              
              <Card className={cn(
                "overflow-hidden border-2 border-dashed p-6",
                "hover:border-primary/50 hover:bg-primary/5 transition-colors duration-300"
              )}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-900 text-white p-1 rounded w-10 h-10 flex items-center justify-center">
                      <span className="text-lg">💻</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Local Machine</h4>
                      <p className="text-xs text-muted-foreground">Your computer can be configured as a host</p>
                    </div>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="opacity-70">
                          <Info className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Connect to your local machine</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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
                  onClick={() => goToStep('connect')}
                  className="gap-1"
                >
                  Next Step
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Connect Step */}
          {currentStep === 'connect' && (
            <div className="space-y-4 px-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Configure and Connect</h3>
                <StatusIndicator status="none" />
              </div>
              
              <Card className="overflow-hidden">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
                  <h4 className="font-medium">Ready to Connect</h4>
                </div>
                
                <div className="p-4">
                  <div className="space-y-4">
                    <div className="bg-muted/40 p-3 rounded-md">
                      <h5 className="font-medium text-sm mb-1 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-orange-400"></span>
                        Configure Host
                      </h5>
                      <p className="text-xs text-muted-foreground mb-2">
                        Set up configuration files to establish connections
                      </p>
                      <Button variant="outline" size="sm" className="w-full text-xs">
                        Open Configuration Guide
                      </Button>
                    </div>
                    
                    <div className="bg-muted/40 p-3 rounded-md">
                      <h5 className="font-medium text-sm mb-1 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-blue-400"></span>
                        Select Profile
                      </h5>
                      <p className="text-xs text-muted-foreground mb-2">
                        Choose profiles to connect hosts to server instances
                      </p>
                      <Button variant="outline" size="sm" className="w-full text-xs">
                        Browse Profiles
                      </Button>
                    </div>
                    
                    <div className="bg-muted/40 p-3 rounded-md">
                      <h5 className="font-medium text-sm mb-1 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-green-400"></span>
                        Manage Servers
                      </h5>
                      <p className="text-xs text-muted-foreground mb-2">
                        Control server instances after connecting
                      </p>
                      <Button variant="outline" size="sm" className="w-full text-xs">
                        View Servers
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
              
              <div className="flex justify-between gap-2 pt-2">
                <Button 
                  variant="ghost" 
                  onClick={() => goToStep('discover')}
                >
                  Back
                </Button>
                <Button 
                  onClick={openDashboard}
                  variant="default"
                  className="gap-1"
                >
                  Open Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="mt-4 border-t pt-4">
                <p className="text-xs text-center text-muted-foreground">
                  MCP Now will continue running in your system tray.
                  <br />Access it anytime by clicking the icon in your taskbar.
                </p>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default NewUserTrayPopup;
