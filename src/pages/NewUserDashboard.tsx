
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ExternalLink, ChevronDown, ChevronUp, HelpCircle, Server, Settings2, Database, Monitor, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GettingStartedDialog } from "@/components/onboarding/GettingStartedDialog";
import { hasSeenOnboarding, markOnboardingAsSeen } from "@/utils/localStorage";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const NewUserDashboard = () => {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [isGuideOpen, setIsGuideOpen] = useState(true);
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

  const userFlowSteps = [
    {
      title: "Install Servers",
      description: "Browse and install server types from discovery",
      icon: <Server />,
      color: "blue",
      link: "/discovery"
    },
    {
      title: "Create Instances",
      description: "Configure server instances with parameters",
      icon: <Settings2 />,
      color: "purple",
      link: "/servers"
    },
    {
      title: "Create Profiles",
      description: "Group server instances into profiles",
      icon: <Database />,
      color: "green",
      link: "/profiles"
    },
    {
      title: "Connect Hosts",
      description: "Deploy profiles to your hosts",
      icon: <Monitor />,
      color: "amber",
      link: "/hosts"
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Overview</h1>
        <p className="text-muted-foreground">Welcome to MCP Now. Let's get you started.</p>
      </div>
      
      {/* Horizontal User Flow */}
      <Collapsible 
        open={isGuideOpen} 
        onOpenChange={setIsGuideOpen}
        className="border border-gray-100 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden bg-white dark:bg-gray-950"
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-semibold">Getting Started with MCP Now</h2>
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="p-1">
              {isGuideOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
              <span className="sr-only">
                {isGuideOpen ? "Hide" : "Show"} getting started guide
              </span>
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent>
          <div className="p-4">
            <Tabs defaultValue="cards" className="w-full">
              <TabsList className="grid grid-cols-2 mb-4 w-[250px]">
                <TabsTrigger value="cards">Visual Guide</TabsTrigger>
                <TabsTrigger value="steps">Step by Step</TabsTrigger>
              </TabsList>
              
              <TabsContent value="cards" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {userFlowSteps.map((step, index) => (
                    <Card key={index} className={`border-${step.color}-100 dark:border-${step.color}-900/30 hover:shadow-md transition-shadow duration-200`}>
                      <CardContent className="p-4 flex flex-col h-full">
                        <div className={`bg-${step.color}-100 dark:bg-${step.color}-900/30 text-${step.color}-600 dark:text-${step.color}-400 rounded-full p-2 w-10 h-10 flex items-center justify-center mb-3`}>
                          {step.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium mb-1">{index + 1}. {step.title}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                            {step.description}
                          </p>
                        </div>
                        <Button asChild size="sm" variant="outline" className="mt-auto">
                          <Link to={step.link}>
                            Go to {step.title}
                            <ChevronRight className="h-3.5 w-3.5 ml-1" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="steps" className="mt-0">
                <div className="space-y-4">
                  {userFlowSteps.map((step, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
                      <div className={`bg-${step.color}-100 dark:bg-${step.color}-900/30 text-${step.color}-600 dark:text-${step.color}-400 rounded-full p-2 flex-shrink-0`}>
                        {step.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">Step {index + 1}: {step.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {step.description}
                        </p>
                        <Button asChild size="sm" variant="link" className="mt-2 p-0 h-auto">
                          <Link to={step.link}>
                            Go to {step.title}
                            <ChevronRight className="h-3 w-3 ml-1" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 flex justify-center">
              <Button asChild>
                <Link to="/discovery">
                  Start Setup Process
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
      
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
      
      <GettingStartedDialog 
        open={showOnboarding}
        onOpenChange={setShowOnboarding}
      />
    </div>
  );
};

export default NewUserDashboard;
