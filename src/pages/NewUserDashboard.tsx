
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ExternalLink, ChevronRight, HelpCircle, Server, Settings2, Database, Monitor, Download, Layers, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GettingStartedDialog } from "@/components/onboarding/GettingStartedDialog";
import { hasSeenOnboarding, markOnboardingAsSeen } from "@/utils/localStorage";

const NewUserDashboard = () => {
  const [showOnboarding, setShowOnboarding] = useState(true);
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

  const steps = [
    {
      number: 1,
      title: "Install Servers",
      icon: <Download className="h-5 w-5" />,
      description: "Browse and install server definitions for your workflow.",
      link: "/discovery",
      linkText: "Go to Discovery",
      color: "bg-gradient-to-br from-blue-500/20 to-blue-600/30 text-blue-700 dark:text-blue-300",
      iconBg: "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300",
      borderColor: "border-blue-200 dark:border-blue-800"
    },
    {
      number: 2,
      title: "Create Instances",
      icon: <Settings2 className="h-5 w-5" />,
      description: "Configure server instances with specific settings.",
      link: "/servers",
      linkText: "Manage Servers",
      color: "bg-gradient-to-br from-purple-500/20 to-purple-600/30 text-purple-700 dark:text-purple-300",
      iconBg: "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300",
      borderColor: "border-purple-200 dark:border-purple-800"
    },
    {
      number: 3,
      title: "Create Profiles",
      icon: <Layers className="h-5 w-5" />,
      description: "Group server instances into functional profiles.",
      link: "/profiles",
      linkText: "Manage Profiles",
      color: "bg-gradient-to-br from-green-500/20 to-green-600/30 text-green-700 dark:text-green-300",
      iconBg: "bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300",
      borderColor: "border-green-200 dark:border-green-800"
    },
    {
      number: 4,
      title: "Connect Hosts",
      icon: <Link2 className="h-5 w-5" />,
      description: "Link your profiles to hosts for deployment.",
      link: "/hosts",
      linkText: "Manage Hosts",
      color: "bg-gradient-to-br from-amber-500/20 to-amber-600/30 text-amber-700 dark:text-amber-300",
      iconBg: "bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-300",
      borderColor: "border-amber-200 dark:border-amber-800"
    }
  ];

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
      
      {/* Horizontal Getting Started Steps */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle className="h-5 w-5 text-blue-500" />
          <h2 className="text-2xl font-bold tracking-tight">Getting Started with MCP Now</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step, index) => (
            <Card 
              key={index} 
              className={`relative overflow-hidden group hover:shadow-lg transition-all duration-300 border ${step.borderColor}`}
            >
              <div className={`absolute inset-0 opacity-40 ${step.color} transition-opacity duration-300 group-hover:opacity-60`}></div>
              <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full bg-white/10 dark:bg-black/10"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 -ml-6 -mb-6 rounded-full bg-white/10 dark:bg-black/10"></div>
              
              <CardContent className="p-5 relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`rounded-full p-2 ${step.iconBg}`}>
                    {step.icon}
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider opacity-70">Step {step.number}</span>
                    <h3 className="font-bold text-lg">{step.title}</h3>
                  </div>
                </div>
                
                <p className="text-sm mb-4 flex-grow">{step.description}</p>
                
                <Button 
                  asChild 
                  variant="outline" 
                  className="mt-auto gap-1 w-full justify-between bg-background/80 backdrop-blur-sm"
                >
                  <Link to={step.link}>
                    <span>{step.linkText}</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
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
