import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ExternalLink, ChevronDown, ChevronUp, HelpCircle, Server, Settings2, Database, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GettingStartedDialog } from "@/components/onboarding/GettingStartedDialog";
import { hasSeenOnboarding, markOnboardingAsSeen } from "@/utils/localStorage";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ServerLogo } from '@/components/servers/ServerLogo';

const NewUserDashboard = () => {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [isGuideOpen, setIsGuideOpen] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (hasSeenOnboarding()) {
      navigate('/');
    }
  }, [navigate]);

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    markOnboardingAsSeen();
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Overview</h1>
        <p className="text-muted-foreground">Welcome to MCP Now. Let's get you started.</p>
      </div>
      
      {/* Trending Servers - Empty State */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold tracking-tight">Trending MCP Servers</h2>
          <Button variant="outline" size="sm" asChild>
            <Link to="/discovery">
              View All
              <ExternalLink className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <Card className="bg-muted/30">
          <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px] text-center relative overflow-hidden">
            <ServerLogo 
              server={{
                id: 'example',
                name: 'API',
                type: 'HTTP_SSE',
                description: 'Example server'
              }}
            />
            <p className="text-muted-foreground">
              Discover trending server types in the Discovery section to get started.
            </p>
            <Button className="mt-4" asChild>
              <Link to="/discovery">Browse Discovery</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Status Overview - Empty State */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Status</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {["Hosts", "Profiles", "Server Instances"].map((item, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-6 flex flex-col items-center justify-center h-[180px] text-center">
                <p className="text-muted-foreground">No {item.toLowerCase()} configured yet</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Collapsible Getting Started Guide */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
        <Collapsible open={isGuideOpen} onOpenChange={setIsGuideOpen} className="w-full">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-blue-500" />
              <h2 className="text-2xl font-bold tracking-tight">Getting Started with MCP Now</h2>
            </div>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="p-1">
                {isGuideOpen ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
                <span className="sr-only">
                  {isGuideOpen ? "Hide" : "Show"} getting started guide
                </span>
              </Button>
            </CollapsibleTrigger>
          </div>
          
          <CollapsibleContent className="animate-accordion-down">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <Card className="border-blue-100 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20">
                <CardContent className="p-4 h-full flex flex-col">
                  <div className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full p-2 w-10 h-10 flex items-center justify-center mb-3">
                    <Server className="h-5 w-5" />
                  </div>
                  <h3 className="font-medium mb-2">1. Install Servers</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex-grow">
                    Browse and install server definitions for your workflow.
                  </p>
                  <Button asChild size="sm" variant="outline" className="gap-1 mt-auto w-full">
                    <Link to="/discovery">
                      Go to Discovery
                      <ExternalLink className="h-3.5 w-3.5 ml-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-purple-100 dark:border-purple-900 bg-purple-50/50 dark:bg-purple-950/20">
                <CardContent className="p-4 h-full flex flex-col">
                  <div className="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-full p-2 w-10 h-10 flex items-center justify-center mb-3">
                    <Settings2 className="h-5 w-5" />
                  </div>
                  <h3 className="font-medium mb-2">2. Create Instances</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex-grow">
                    Configure server instances with your specific settings.
                  </p>
                  <Button asChild size="sm" variant="outline" className="gap-1 mt-auto w-full">
                    <Link to="/servers">
                      Manage Servers
                      <ExternalLink className="h-3.5 w-3.5 ml-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-green-100 dark:border-green-900 bg-green-50/50 dark:bg-green-950/20">
                <CardContent className="p-4 h-full flex flex-col">
                  <div className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-full p-2 w-10 h-10 flex items-center justify-center mb-3">
                    <Database className="h-5 w-5" />
                  </div>
                  <h3 className="font-medium mb-2">3. Create Profiles</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex-grow">
                    Group server instances into functional profiles.
                  </p>
                  <Button asChild size="sm" variant="outline" className="gap-1 mt-auto w-full">
                    <Link to="/profiles">
                      Manage Profiles
                      <ExternalLink className="h-3.5 w-3.5 ml-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-amber-100 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20">
                <CardContent className="p-4 h-full flex flex-col">
                  <div className="bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-300 rounded-full p-2 w-10 h-10 flex items-center justify-center mb-3">
                    <Monitor className="h-5 w-5" />
                  </div>
                  <h3 className="font-medium mb-2">4. Connect Hosts</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex-grow">
                    Link your profiles to hosts for deployment.
                  </p>
                  <Button asChild size="sm" variant="outline" className="gap-1 mt-auto w-full">
                    <Link to="/hosts">
                      Manage Hosts
                      <ExternalLink className="h-3.5 w-3.5 ml-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
      
      <GettingStartedDialog 
        open={showOnboarding}
        onOpenChange={setShowOnboarding}
      />
    </div>
  );
};

export default NewUserDashboard;
