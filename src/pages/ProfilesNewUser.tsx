
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Layers,
  Zap,
  Share2,
  Network,
  Settings,
  HelpCircle,
  Server,
  Boxes,
  PlusCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { serverInstances } from "@/data/mockData";
import { markProfilesOnboardingAsSeen } from "@/utils/localStorage";
import { CreateProfileDialog } from "@/components/profiles/CreateProfileDialog";
import { StatusIndicator } from "@/components/status/StatusIndicator";
import { Switch } from "@/components/ui/switch";

const ProfilesNewUser = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [createProfileDialogOpen, setCreateProfileDialogOpen] = useState(false);
  
  const profileFeatures = [
    {
      icon: <Boxes className="h-8 w-8 text-purple-500" />,
      name: "Group Instances",
      description: "Combine multiple server instances into organized profiles"
    },
    {
      icon: <Share2 className="h-8 w-8 text-indigo-500" />,
      name: "Shared Endpoints",
      description: "Define a single endpoint for a collection of instances"
    },
    {
      icon: <Settings className="h-8 w-8 text-blue-500" />,
      name: "Configurable Settings",
      description: "Customize how profiles handle requests and connections"
    },
    {
      icon: <Network className="h-8 w-8 text-teal-500" />,
      name: "Host Assignment",
      description: "Assign profiles to specific hosts for execution"
    }
  ];
  
  const exampleProfiles = [
    {
      name: "Production APIs",
      instances: 3,
      status: "active",
      description: "API servers for the production environment"
    },
    {
      name: "Development Tools",
      instances: 2,
      status: "inactive",
      description: "Local development environment setup"
    },
    {
      name: "Machine Learning",
      instances: 4,
      status: "active",
      description: "ML model inference servers"
    }
  ];

  const handleCreateProfile = ({ name, instances }: { name: string; instances: string[] }) => {
    toast({
      title: "Profile Created",
      description: `${name} has been created successfully with ${instances.length} instance(s).`,
    });
    
    markProfilesOnboardingAsSeen();
    setCreateProfileDialogOpen(false);
    navigate("/profiles");
  };
  
  const handleSkip = () => {
    markProfilesOnboardingAsSeen();
    navigate("/profiles");
  };

  return (
    <div className="container max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Header with purple gradient background */}
      <div className="mb-8 py-10 px-8 rounded-lg bg-gradient-to-r from-purple-500/20 via-purple-400/15 to-purple-300/10 border border-purple-100 dark:border-purple-900/30">
        <div className="flex items-center mb-2">
          <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-3 py-1 rounded-full flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">Getting Started</span>
          </div>
        </div>
        
        <h1 className="text-4xl font-bold tracking-tight mb-2 text-purple-900 dark:text-purple-50">Welcome to Profiles</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Profiles help you organize and manage server instances for different use cases and environments
        </p>
      </div>
      
      {/* Main content */}
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">What are profiles?</h2>
          <Card className="border-2 border-dashed bg-card/50 hover:bg-card/80 transition-colors">
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-6">
                Profiles allow you to group server instances together, making it easier to manage 
                and deploy related services. A profile can include multiple server instances 
                with a shared endpoint and configuration.
              </p>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30">
                    <Layers className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Organize instances</h3>
                    <p className="text-xs text-muted-foreground">
                      Group related server instances into logical collections
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30">
                    <Server className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Deploy as a unit</h3>
                    <p className="text-xs text-muted-foreground">
                      Deploy multiple instances together on specific hosts
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30">
                    <Share2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Share one endpoint</h3>
                    <p className="text-xs text-muted-foreground">
                      Access multiple instances through a single connection point
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-row gap-3">
                <Button 
                  onClick={() => {
                    if (serverInstances.length === 0) {
                      toast({
                        title: "No instances available",
                        description: "Please create at least one server instance first.",
                        variant: "destructive",
                      });
                      return;
                    }
                    setCreateProfileDialogOpen(true);
                  }} 
                  className="gap-2" 
                  size="lg"
                  variant="default"
                >
                  <PlusCircle className="h-4 w-4" />
                  Create Profile
                </Button>
                
                <Button 
                  onClick={handleSkip} 
                  variant="outline" 
                  size="lg"
                >
                  Skip for Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Separator />
        
        <div>
          <h2 className="text-2xl font-semibold mb-4">Profile Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {profileFeatures.map((feature) => (
              <Card 
                key={feature.name} 
                className="border hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="p-3 rounded-full bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 mb-3">
                    {feature.icon}
                  </div>
                  <h3 className="font-medium">{feature.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h2 className="text-2xl font-semibold mb-4">Example Profiles</h2>
          <div className="space-y-3">
            {exampleProfiles.map((profile) => (
              <Card 
                key={profile.name} 
                className="border hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors"
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{profile.name}</h3>
                        <StatusIndicator 
                          status={profile.status as any} 
                          label={profile.status} 
                          size="sm" 
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{profile.description}</p>
                    </div>
                    <Switch disabled checked={profile.status === "active"} />
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground">
                    <span className="font-medium">{profile.instances} instances</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 p-4 rounded-lg flex items-start gap-3">
          <HelpCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-amber-800 dark:text-amber-300">Need help?</h3>
            <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
              If you're not sure how to set up a profile, 
              <a href="#" className="text-amber-800 dark:text-amber-300 underline font-medium ml-1">
                view our configuration guide
              </a>.
            </p>
          </div>
        </div>
      </div>

      <CreateProfileDialog
        open={createProfileDialogOpen}
        onOpenChange={setCreateProfileDialogOpen}
        onCreateProfile={handleCreateProfile}
        instances={serverInstances}
      />
    </div>
  );
};

export default ProfilesNewUser;
