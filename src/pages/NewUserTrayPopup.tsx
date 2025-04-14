
import { useState } from "react";
import { 
  ExternalLink, 
  ChevronRight, 
  Download, 
  Settings, 
  User, 
  Link 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusIndicator } from "@/components/status/StatusIndicator";
import { ScrollArea } from "@/components/ui/scroll-area";

/**
 * A component that displays a first-time user experience in the System Tray.
 * This guides new users through the initial steps of setting up and using the application.
 */
const NewUserTrayPopup = () => {
  // Open specific pages directly
  const openDiscoveryPage = () => {
    window.open("/discovery", "_blank");
  };

  const openDashboard = () => {
    window.open("/", "_blank");
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
            
            <div className="flex justify-center pb-6">
              <Button 
                onClick={openDiscoveryPage}
                className="gap-1 min-w-[180px]"
                size="lg"
              >
                Get Started
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default NewUserTrayPopup;

