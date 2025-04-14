
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  Settings2, 
  Computer, 
  Layers,
  BookOpen,
  X
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogClose,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { markOnboardingAsSeen } from "@/utils/localStorage";

interface GettingStartedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GettingStartedDialog = ({ open, onOpenChange }: GettingStartedDialogProps) => {
  const [expandedStep, setExpandedStep] = useState<number | null>(0);
  const [closing, setClosing] = useState(false);
  const [animationTarget, setAnimationTarget] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const dialogRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!open && !closing) {
      setClosing(false);
    }
  }, [open, closing]);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      // Get sidebar help icon position (approximate position in the bottom left)
      const helpIconPosition = {
        x: 40, // Approximate x position of help icon
        y: window.innerHeight - 60 // Approximate y position of help icon
      };
      
      // Calculate current dialog position
      const dialogRect = dialogRef.current?.getBoundingClientRect();
      if (dialogRect) {
        setAnimationTarget({
          x: helpIconPosition.x - (dialogRect.x + dialogRect.width / 2),
          y: helpIconPosition.y - (dialogRect.y + dialogRect.height / 2)
        });
        
        // Start animation
        setClosing(true);
        
        // Delay actual closing to allow animation to play
        setTimeout(() => {
          markOnboardingAsSeen();
          setClosing(false);
          onOpenChange(false);
        }, 300); // Match the animation duration
      } else {
        markOnboardingAsSeen();
        onOpenChange(false);
      }
    } else {
      onOpenChange(true);
    }
  };

  const toggleStep = (stepIndex: number) => {
    setExpandedStep(expandedStep === stepIndex ? null : stepIndex);
  };

  const beginnerGuideSteps = [
    {
      title: "Install Servers from Discovery",
      description: "Browse and install server definitions for your workflow.",
      icon: <BookOpen className="h-6 w-6" />,
      content: (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Start by installing server definitions from our Discovery page:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Navigate to the <Link to="/discovery" className="text-blue-500 hover:underline">Discovery</Link> page</li>
            <li>Browse available server types based on your needs</li>
            <li>Click "Install" to add server definitions to your environment</li>
            <li>Explore official and community-created server options</li>
          </ol>
          <div className="pt-2">
            <Button asChild size="sm" variant="outline" className="gap-1">
              <Link to="/discovery">
                Go to Discovery
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      )
    },
    {
      title: "Create Instances & Configure Parameters",
      description: "Create and customize server instances with specific settings.",
      icon: <Settings2 className="h-6 w-6" />,
      content: (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Once you've installed server definitions, create instances with custom configurations:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Go to <Link to="/servers" className="text-blue-500 hover:underline">Servers</Link> page</li>
            <li>Click "Add Instance" on an installed server</li>
            <li>Set name, parameters, and environment variables</li>
            <li>Configure connection details specific to your needs</li>
          </ol>
          <div className="pt-2">
            <Button asChild size="sm" variant="outline" className="gap-1">
              <Link to="/servers">
                Manage Servers
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      )
    },
    {
      title: "Create Profiles & Add Instances",
      description: "Organize server instances into profiles for easier management.",
      icon: <Layers className="h-6 w-6" />,
      content: (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Create profiles to group your server instances logically:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Visit the <Link to="/profiles" className="text-blue-500 hover:underline">Profiles</Link> page</li>
            <li>Create a new profile with a relevant name</li>
            <li>Add your configured server instances to the profile</li>
            <li>Enable the profile to activate all included instances</li>
          </ol>
          <div className="pt-2">
            <Button asChild size="sm" variant="outline" className="gap-1">
              <Link to="/profiles">
                Create Profiles
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      )
    },
    {
      title: "Associate Hosts with Profiles",
      description: "Connect your profiles to hosts to deploy server instances.",
      icon: <Computer className="h-6 w-6" />,
      content: (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Finally, associate your profiles with hosts to run your server instances:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Go to the <Link to="/hosts" className="text-blue-500 hover:underline">Hosts</Link> page</li>
            <li>Add a new host or select an existing one</li>
            <li>Assign your created profile to the host</li>
            <li>Monitor status and control your server instances</li>
          </ol>
          <div className="pt-2">
            <Button asChild size="sm" variant="outline" className="gap-1">
              <Link to="/hosts">
                Manage Hosts
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      )
    }
  ];

  return (
    <Dialog open={open || closing} onOpenChange={handleOpenChange}>
      <DialogContent 
        ref={dialogRef}
        className={`max-w-2xl ${closing ? 'animate-collapse' : ''}`}
        style={
          closing 
            ? { 
                animation: `collapseDialog 300ms ease-in forwards`,
                transformOrigin: 'center',
                transform: `scale(0.8) translate(${animationTarget.x}px, ${animationTarget.y}px)`,
                opacity: 0
              } 
            : {}
        }
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Welcome to MCP Now</DialogTitle>
          <DialogClose className="absolute top-4 right-4 rounded-full p-1">
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <p className="text-muted-foreground">
            Follow these simple steps to configure and start using MCP Now effectively.
          </p>
          
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
            {beginnerGuideSteps.map((step, index) => (
              <div 
                key={index}
                className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden bg-white dark:bg-gray-900"
              >
                <button 
                  className="w-full flex items-center justify-between p-4 text-left"
                  onClick={() => toggleStep(index)}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full p-2">
                      {step.icon}
                    </div>
                    <div>
                      <h3 className="font-medium">Step {index + 1}: {step.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{step.description}</p>
                    </div>
                  </div>
                  {expandedStep === index ? (
                    <ChevronUp className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  )}
                </button>
                
                {expandedStep === index && (
                  <div className="p-4 pt-0 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                    {step.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between sm:justify-between">
          <div className="text-xs text-muted-foreground">
            You can reopen this guide anytime from the sidebar.
          </div>
          <DialogClose asChild>
            <Button variant="outline">
              Got it
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
