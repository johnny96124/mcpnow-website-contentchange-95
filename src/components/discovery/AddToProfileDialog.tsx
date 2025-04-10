
import { useState } from "react";
import { 
  ArrowRight, 
  Check, 
  ChevronsUpDown, 
  Info, 
  Server, 
  Settings, 
  UserPlus 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Profile, ServerInstance } from "@/data/mockData";
import { StatusIndicator } from "@/components/status/StatusIndicator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AddToProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  instance: ServerInstance | null;
  profiles: Profile[];
  onAddToProfile: (profileId: string) => void;
}

export function AddToProfileDialog({
  open,
  onOpenChange,
  instance,
  profiles,
  onAddToProfile,
}: AddToProfileDialogProps) {
  const [selectedProfileId, setSelectedProfileId] = useState<string>("");
  const [profileSearchOpen, setProfileSearchOpen] = useState(false);
  const [hostConfigDialogOpen, setHostConfigDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAddToProfile = () => {
    if (!selectedProfileId) {
      toast({
        title: "Select a profile",
        description: "Please select a profile to continue",
        variant: "destructive",
      });
      return;
    }

    onAddToProfile(selectedProfileId);
    
    toast({
      title: "Added to profile",
      description: `Instance added to profile successfully.`,
    });
    
    // Close the dialog and open the host configuration dialog
    onOpenChange(false);
    setHostConfigDialogOpen(true);
  };

  const handleNavigateToHosts = () => {
    navigate("/hosts");
    setHostConfigDialogOpen(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add to Profile</DialogTitle>
            <DialogDescription>
              Add this instance to a profile for easy access and configuration.
            </DialogDescription>
          </DialogHeader>

          <div className="py-6 space-y-4">
            {instance && (
              <div className="bg-muted/50 p-3 rounded-md">
                <div className="flex items-center space-x-2">
                  <StatusIndicator 
                    status={
                      instance.status === 'running' ? 'active' : 
                      instance.status === 'error' ? 'error' : 'inactive'
                    } 
                  />
                  <div>
                    <div className="font-medium">{instance.name}</div>
                    <div className="text-sm text-muted-foreground">{instance.definitionId}</div>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Select Profile</label>
              <Popover open={profileSearchOpen} onOpenChange={setProfileSearchOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={profileSearchOpen}
                    className="w-full justify-between"
                  >
                    {selectedProfileId
                      ? profiles.find(profile => profile.id === selectedProfileId)?.name
                      : "Select a profile..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search profiles..." />
                    <CommandList>
                      <CommandEmpty>No profiles found.</CommandEmpty>
                      <CommandGroup>
                        {profiles.map(profile => (
                          <CommandItem
                            key={profile.id}
                            onSelect={() => {
                              setSelectedProfileId(profile.id);
                              setProfileSearchOpen(false);
                            }}
                            className="flex items-center justify-between w-full cursor-pointer"
                          >
                            <div className="flex items-center">
                              <UserPlus className="mr-2 h-4 w-4" />
                              <span>{profile.name}</span>
                            </div>
                            {selectedProfileId === profile.id && (
                              <Check className="ml-2 h-4 w-4" />
                            )}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
            <Button onClick={handleAddToProfile}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add to Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Host Configuration Guide Dialog */}
      <AlertDialog open={hostConfigDialogOpen} onOpenChange={setHostConfigDialogOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <Info className="mr-2 h-5 w-5 text-blue-500" />
              Host Configuration Guide
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p>
                Now that you've added this instance to a profile, you can apply it to hosts 
                in your network to manage remote servers.
              </p>
              <div className="bg-muted p-3 rounded-md space-y-2 mt-4">
                <div className="flex items-start space-x-3">
                  <Server className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium">Apply to Hosts</h4>
                    <p className="text-sm text-muted-foreground">
                      Go to the Hosts page to apply this profile to one or more hosts in your network.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Settings className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium">Configure Connection</h4>
                    <p className="text-sm text-muted-foreground">
                      Set up connection details including authentication and network settings.
                    </p>
                  </div>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-between space-x-2">
            <AlertDialogCancel onClick={() => setHostConfigDialogOpen(false)}>
              Close
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleNavigateToHosts}>
              Go to Hosts
              <ArrowRight className="ml-2 h-4 w-4" />
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
