
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
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

const ProfilesNewUser = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [createProfileDialogOpen, setCreateProfileDialogOpen] = useState(false);
  
  const profileFeatures = [
    {
      icon: <Boxes className="h-5 w-5" />,
      name: "Group Instances",
      description: "Combine multiple server instances into organized profiles"
    },
    {
      icon: <Share2 className="h-5 w-5" />,
      name: "Shared Endpoints",
      description: "Define a single endpoint for a collection of instances"
    },
    {
      icon: <Settings className="h-5 w-5" />,
      name: "Configurable Settings",
      description: "Customize how profiles handle requests and connections"
    },
    {
      icon: <Network className="h-5 w-5" />,
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
    <div className="container py-8 max-w-3xl mx-auto space-y-8 animate-fade-in">
      {/* Header with purple gradient background */}
      <div className="text-center space-y-3">
        <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 px-3 py-1 rounded-full inline-flex items-center gap-1.5 mb-1">
          <Zap className="h-3.5 w-3.5" />
          <span className="text-xs font-medium">Getting Started</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-purple-600">Welcome to Profiles</h1>
        <p className="text-muted-foreground">
          Profiles help you organize and manage server instances for different use cases and environments
        </p>
      </div>
      
      {/* Main content */}
      <div className="bg-white dark:bg-card border rounded-lg p-6 space-y-6 shadow-sm">
        <div className="space-y-2.5">
          <h2 className="text-xl font-semibold">What are profiles?</h2>
          <p className="text-muted-foreground">
            Profiles allow you to group server instances together, making it easier to manage 
            and deploy related services. A profile can include multiple server instances 
            with a shared endpoint and configuration.
          </p>
        </div>
        
        <div className="space-y-4 pt-2">
          {profileFeatures.map((feature) => (
            <div 
              key={feature.name}
              className="flex items-start gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-900/30 rounded-md transition-colors"
            >
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-md text-purple-600 dark:text-purple-400">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-medium">{feature.name}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex gap-3 pt-3">
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
            variant="default"
          >
            <PlusCircle className="h-4 w-4" />
            Create Profile
          </Button>
          
          <Button 
            onClick={handleSkip} 
            variant="outline" 
          >
            Skip for Now
          </Button>
        </div>
      </div>
      
      {/* What you can do with profiles */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">What you can do with profiles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-card border p-4 rounded-lg flex items-start gap-3 shadow-sm">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-md text-purple-600 dark:text-purple-400">
              <Boxes className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium">Organize Related Services</h3>
              <p className="text-sm text-muted-foreground">
                Group instances by environment, project, or function
              </p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-card border p-4 rounded-lg flex items-start gap-3 shadow-sm">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-md text-purple-600 dark:text-purple-400">
              <Server className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium">Simplified Management</h3>
              <p className="text-sm text-muted-foreground">
                Control multiple instances with a single configuration
              </p>
            </div>
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
