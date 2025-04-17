
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Layers,
  Settings,
  Share2,
  Zap,
  HelpCircle,
  Server,
  Network,
  PlusCircle,
  CirclePlus,
  Search,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { serverInstances } from "@/data/mockData";
import { markProfilesOnboardingAsSeen } from "@/utils/localStorage";
import { CreateProfileDialog } from "@/components/profiles/CreateProfileDialog";

const ProfilesNewUser = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [createProfileDialogOpen, setCreateProfileDialogOpen] = useState(false);
  
  const profileFeatures = [
    {
      icon: <Layers className="h-5 w-5 text-blue-500" />,
      name: "Group Instances",
      description: "Combine multiple server instances into organized profiles"
    },
    {
      icon: <Share2 className="h-5 w-5 text-indigo-500" />,
      name: "Shared Endpoints",
      description: "Define a single endpoint for a collection of instances"
    },
    {
      icon: <Settings className="h-5 w-5 text-green-500" />,
      name: "Configurable Settings",
      description: "Customize how profiles handle requests and connections"
    },
    {
      icon: <Network className="h-5 w-5 text-orange-500" />,
      name: "Host Assignment",
      description: "Assign profiles to specific hosts for execution"
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

  const leftSideFeatures = [
    {
      icon: <Layers className="h-4 w-4 text-blue-500" />,
      name: "Organize instances",
      description: "Group related server instances into logical collections"
    },
    {
      icon: <Server className="h-4 w-4 text-indigo-600" />,
      name: "Deploy as a unit",
      description: "Deploy multiple instances together on specific hosts"
    },
    {
      icon: <Share2 className="h-4 w-4 text-green-500" />,
      name: "Share one endpoint",
      description: "Access multiple instances through a single connection point"
    }
  ];

  return (
    <div className="py-6 max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Getting Started Badge */}
      <div className="flex justify-center">
        <div className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 px-4 py-1.5 rounded-full inline-flex items-center gap-1.5">
          <Zap className="h-3.5 w-3.5" />
          <span className="text-xs font-medium">Getting Started</span>
        </div>
      </div>

      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight">Welcome to Profiles</h1>
        <p className="text-muted-foreground text-base">
          Profiles help you organize and manage server instances for different use cases and environments.
        </p>
      </div>
      
      {/* Main content */}
      <Card className="bg-white dark:bg-card shadow-sm border">
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Left side */}
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">What are profiles?</h2>
                <p className="text-muted-foreground text-sm">
                  Profiles allow you to group server instances together, making it easier to manage 
                  and deploy related services. A profile can include multiple server instances 
                  with a shared endpoint.
                </p>
              </div>
              
              <div className="space-y-3.5">
                {leftSideFeatures.map((feature) => (
                  <div key={feature.name} className="flex items-start gap-3">
                    <div className="mt-0.5 p-1.5 rounded-full bg-gray-100 dark:bg-gray-800">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">{feature.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
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
                  className="gap-2 bg-indigo-600 hover:bg-indigo-700" 
                  size="lg"
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
            </div>
            
            {/* Right side */}
            <div className="space-y-5">
              <h2 className="text-xl font-semibold">Profile features</h2>
              
              <div className="grid grid-cols-1 gap-4">
                {profileFeatures.map((feature, index) => (
                  <div 
                    key={feature.name} 
                    className="flex gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-colors"
                  >
                    <div className="p-2 rounded-md bg-white dark:bg-gray-800 shadow-sm">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-medium">{feature.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 p-4 rounded-lg flex items-start gap-3 mt-4">
                <HelpCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-amber-800 dark:text-amber-300">Need help?</h3>
                  <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                    If you're not sure how to set up a profile,{" "}
                    <a href="#" className="text-amber-800 dark:text-amber-300 underline font-medium">
                      view our configuration guide
                    </a>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

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
