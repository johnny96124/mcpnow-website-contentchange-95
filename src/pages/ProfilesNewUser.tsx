
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
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header with gradient background */}
      <div className="rounded-lg py-16 px-8 text-center bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-blue-500/10 border border-purple-100 dark:border-purple-900/30">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-4 py-1.5 rounded-full inline-flex items-center gap-1.5 mb-2">
            <Zap className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">Getting Started</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
            Welcome to Profiles
          </h1>
          <p className="text-muted-foreground text-lg">
            Profiles help you organize and manage server instances for different use cases and environments
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left side - What are profiles */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-card rounded-xl p-6 shadow-md border">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Layers className="mr-2 h-6 w-6 text-purple-500" />
              What are profiles?
            </h2>
            <p className="text-muted-foreground">
              Profiles allow you to group server instances together, making it easier to manage 
              and deploy related services. A profile can include multiple server instances 
              with a shared endpoint and configuration.
            </p>
            
            <div className="mt-6 space-y-3">
              <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-900/30 rounded-lg">
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
              
              <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-900/30 rounded-lg">
                <div className="mt-1 p-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                  <Server className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-sm font-medium">Deploy as a unit</h3>
                  <p className="text-xs text-muted-foreground">
                    Deploy multiple instances together on specific hosts
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-900/30 rounded-lg">
                <div className="mt-1 p-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <Share2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-sm font-medium">Share one endpoint</h3>
                  <p className="text-xs text-muted-foreground">
                    Access multiple instances through a single connection point
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
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
          </div>
          
          {/* Help banner */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 p-5 rounded-xl flex items-start gap-3">
            <HelpCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-amber-800 dark:text-amber-300">Need help?</h3>
              <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                If you're not sure how to set up a host,{" "}
                <a href="#" className="text-amber-800 dark:text-amber-300 underline font-medium">
                  view our configuration guide
                </a>.
              </p>
            </div>
          </div>
        </div>
        
        {/* Right side - Feature list and example profiles */}
        <div className="space-y-6">
          {/* Feature grid */}
          <div className="bg-gradient-to-br from-white to-purple-50 dark:from-card dark:to-purple-950/10 rounded-xl p-6 shadow-md border">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <PlusCircle className="mr-2 h-6 w-6 text-indigo-500" />
              Profile Features
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profileFeatures.map((feature) => (
                <div 
                  key={feature.name} 
                  className="bg-white dark:bg-card rounded-lg p-4 border hover:shadow-lg transition-shadow flex flex-col items-center text-center"
                >
                  <div className="p-3 rounded-full bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 mb-3">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-lg">{feature.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Example profiles */}
          <div className="bg-white dark:bg-card rounded-xl p-6 shadow-md border">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Server className="mr-2 h-5 w-5 text-blue-500" />
              Example Profiles
            </h2>
            
            <div className="space-y-3">
              {exampleProfiles.map((profile) => (
                <div 
                  key={profile.name} 
                  className="border rounded-lg p-4 hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors"
                >
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
                </div>
              ))}
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
