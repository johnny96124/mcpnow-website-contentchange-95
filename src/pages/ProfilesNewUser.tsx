import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Layers,
  Zap,
  Share2,
  Network,
  Server,
  PlusCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { serverInstances } from "@/data/mockData";
import { markProfilesOnboardingAsSeen } from "@/utils/localStorage";
import { CreateProfileDialog } from "@/components/profiles/CreateProfileDialog";
import { Separator } from "@/components/ui/separator";
import { HelpCircle } from "lucide-react";
import { Message } from "@/components/ui/Message";

const ProfilesNewUser = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [createProfileDialogOpen, setCreateProfileDialogOpen] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error" | "info";
    show: boolean;
  }>({ text: "", type: "info", show: false });

  const handleCreateProfile = ({ name, instances }: { name: string; instances: string[] }) => {
    setMessage({
      text: `${name} has been created successfully with ${instances.length} instance(s).`,
      type: "success",
      show: true,
    });
    markProfilesOnboardingAsSeen();
    setCreateProfileDialogOpen(false);

    setTimeout(() => {
      setMessage((msg) => ({ ...msg, show: false }));
      navigate("/profiles");
    }, 1200);
  };

  const handleSkip = () => {
    markProfilesOnboardingAsSeen();
    navigate("/profiles");
  };

  return (
    <div className="container max-w-5xl mx-auto space-y-8 animate-fade-in">
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
      
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">What are profiles?</h2>
          <Card className="border-2 border-dashed bg-card/50 hover:bg-card/80 transition-colors">
            <CardContent className="p-6">
              {message.show && (
                <Message
                  type={message.type}
                  className="mb-4"
                  onClose={() => setMessage((msg) => ({ ...msg, show: false }))}
                >
                  <span>Profile Created: {message.text}</span>
                </Message>
              )}
              
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
      </div>

      <Separator />
      
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 p-4 rounded-lg flex items-start gap-3">
        <HelpCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="font-medium text-amber-800 dark:text-amber-300">Need help?</h3>
          <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
            If you're not sure how to set up a profile, 
            <Button 
              variant="link" 
              className="h-auto p-0 text-sm text-amber-700 dark:text-amber-400 font-medium underline"
              onClick={() => setCreateProfileDialogOpen(true)}
            >
              view our configuration guide
            </Button>
            .
          </p>
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
