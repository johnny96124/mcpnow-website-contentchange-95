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
  ArrowRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { serverInstances } from "@/data/mockData";
import { markProfilesOnboardingAsSeen } from "@/utils/localStorage";
import { CreateProfileDialog } from "@/components/profiles/CreateProfileDialog";

const ProfilesNewUser = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [createProfileDialogOpen, setCreateProfileDialogOpen] = useState(false);

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
      {/* Header */}
      <div className="space-y-1.5">
        <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 px-3 py-1 rounded-full inline-flex items-center gap-1.5 mb-1">
          <Zap className="h-3.5 w-3.5" />
          <span className="text-xs font-medium">Getting Started</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome to Profiles</h1>
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
            and deploy related services.
          </p>
        </div>
        
        <div className="space-y-4 pt-2">
          <div className="flex items-start gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-900/30 rounded-md transition-colors">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-md text-blue-600 dark:text-blue-400">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium">Organize instances</h3>
              <p className="text-sm text-muted-foreground">
                Group related server instances into logical collections
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-900/30 rounded-md transition-colors">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-md text-purple-600 dark:text-purple-400">
              <Server className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium">Deploy as a unit</h3>
              <p className="text-sm text-muted-foreground">
                Deploy multiple instances together on specific hosts
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-900/30 rounded-md transition-colors">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-md text-green-600 dark:text-green-400">
              <Share2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium">Share endpoints</h3>
              <p className="text-sm text-muted-foreground">
                Access multiple instances through a single connection point
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 pt-3">
          <Button 
            onClick={() => setCreateProfileDialogOpen(true)}
            variant="default"
            className="gap-2"
          >
            Create Profile
            <ArrowRight className="h-4 w-4" />
          </Button>
          
          <Button 
            onClick={handleSkip} 
            variant="outline" 
          >
            Skip for Now
          </Button>
        </div>
      </div>
      
      {/* Supported profile types */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Profile Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-card border p-4 rounded-lg flex items-start gap-3 shadow-sm">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-md text-blue-600 dark:text-blue-400">
              <Boxes className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium">Group Instances</h3>
              <p className="text-sm text-muted-foreground">
                Combine multiple server instances into organized profiles
              </p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-card border p-4 rounded-lg flex items-start gap-3 shadow-sm">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-md text-purple-600 dark:text-purple-400">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium">Flexible Configuration</h3>
              <p className="text-sm text-muted-foreground">
                Customize settings for each profile independently
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
