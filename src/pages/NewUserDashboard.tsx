
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ExternalLink, ChevronUp, ChevronDown, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GettingStartedDialog } from "@/components/onboarding/GettingStartedDialog";
import { hasSeenOnboarding, markOnboardingAsSeen } from "@/utils/localStorage";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const NewUserDashboard = () => {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [isGuideCollapsed, setIsGuideCollapsed] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user has seen onboarding before
    if (hasSeenOnboarding()) {
      navigate('/');
    }
  }, [navigate]);

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    markOnboardingAsSeen();
  };

  const toggleGuide = () => {
    setIsGuideCollapsed(!isGuideCollapsed);
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
          <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px] text-center">
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
      <Collapsible 
        open={!isGuideCollapsed}
        onOpenChange={(open) => setIsGuideCollapsed(!open)}
        className="pt-4 border-t border-gray-200 dark:border-gray-800"
      >
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="h-5 w-5 text-blue-500" />
          <h2 className="text-2xl font-bold tracking-tight">Getting Started with MCP Now</h2>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="ml-auto">
              {isGuideCollapsed ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
              <span className="sr-only">{isGuideCollapsed ? "Expand" : "Collapse"}</span>
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="transition-all duration-300 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
          <Card className="border-blue-100 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20">
            <CardContent className="pt-6">
              <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                Follow these simple steps to configure and start using MCP Now effectively.
              </p>
              
              <div className="space-y-3 mb-6">
                {["Install Servers from Discovery", "Create Instances & Configure Parameters", "Create Profiles & Add Instances", "Associate Hosts with Profiles"].map((step, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-white dark:bg-gray-800 rounded-md border border-gray-100 dark:border-gray-700">
                    <div className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full p-1.5">
                      <span className="font-medium text-sm">{index + 1}</span>
                    </div>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center">
                <Button asChild className="gap-2">
                  <Link to="/discovery">
                    Start Setup Process
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
      
      <GettingStartedDialog 
        open={showOnboarding}
        onOpenChange={setShowOnboarding}
      />
    </div>
  );
};

export default NewUserDashboard;
