
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Layers,
  Settings,
  Share2,
  ArrowRight,
  Zap,
  HelpCircle,
  Server,
  Boxes,
  PlusCircle,
  Network,
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
      icon: <Boxes className="h-10 w-10 text-blue-500" />,
      name: "Group Instances",
      description: "Combine multiple server instances into organized profiles"
    },
    {
      icon: <Share2 className="h-10 w-10 text-purple-500" />,
      name: "Shared Endpoints",
      description: "Define a single endpoint for a collection of instances"
    },
    {
      icon: <Settings className="h-10 w-10 text-green-500" />,
      name: "Configurable Settings",
      description: "Customize how profiles handle requests and connections"
    },
    {
      icon: <Network className="h-10 w-10 text-amber-500" />,
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

  return (
    <div className="container py-8 max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-4 py-1 rounded-full inline-flex items-center gap-1.5 mb-2">
          <Zap className="h-3.5 w-3.5" />
          <span className="text-xs font-medium">Getting Started</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome to Profiles</h1>
        <p className="text-muted-foreground text-lg">
          Profiles help you organize and manage server instances for different use cases and environments.
        </p>
      </div>
      
      <Card className="border-2 border-dashed bg-card/50 hover:bg-card/80 transition-colors">
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold mb-4">What are profiles?</h2>
                <p className="text-muted-foreground">
                  Profiles allow you to group server instances together, making it easier to manage 
                  and deploy related services. A profile can include multiple server instances 
                  with a shared endpoint.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <div className="mt-1 p-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <Layers className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Organize instances</h3>
                    <p className="text-xs text-muted-foreground">
                      Group related server instances into logical collections
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
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
                
                <div className="flex items-start gap-2">
                  <div className="mt-1 p-1.5 rounded-full bg-green-100 dark:bg-green-900/30">
                    <Share2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Share one endpoint</h3>
                    <p className="text-xs text-muted-foreground">
                      Access multiple instances through a single connection point
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
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
                >
                  <PlusCircle className="h-4 w-4" />
                  Create Profile
                </Button>
                
                <Button 
                  onClick={() => {
                    markProfilesOnboardingAsSeen();
                    navigate("/servers");
                  }}
                  variant="outline" 
                  size="lg"
                >
                  Create Server Instance First
                </Button>
                
                <Button 
                  onClick={handleSkip} 
                  variant="ghost" 
                  size="lg"
                >
                  Skip for Now
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Profile features</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {profileFeatures.map((feature) => (
                  <Card key={feature.name} className="border hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex gap-3 items-start">
                      <div>{feature.icon}</div>
                      <div>
                        <h3 className="font-medium">{feature.name}</h3>
                        <p className="text-xs text-muted-foreground">{feature.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 p-4 rounded-lg flex items-start gap-3">
                <HelpCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-indigo-800 dark:text-indigo-300">Profile workflow</h3>
                  <p className="text-sm text-indigo-700 dark:text-indigo-400 mt-1">
                    The recommended workflow is to first create server instances, then group them into profiles,
                    and finally assign those profiles to hosts for execution. This approach provides maximum flexibility
                    and organization.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
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

