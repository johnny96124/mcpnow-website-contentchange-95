
import { useState, useEffect } from "react";
import { Check, ChevronsUpDown, FolderOpen, LinkIcon, UserPlus } from "lucide-react";
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
import { useHostProfiles } from "@/hooks/useHostProfiles";
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
  const [showNavigateDialog, setShowNavigateDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { handleProfileChange } = useHostProfiles();

  // Reset selection when dialog opens
  useEffect(() => {
    if (open) {
      // Don't set default selected profile
      setSelectedProfileId("");
    }
  }, [open]);

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
    
    // Close the dialog and show the navigation dialog
    onOpenChange(false);
    setShowNavigateDialog(true);
  };

  const handleNavigateToHosts = () => {
    // Close the navigation dialog
    setShowNavigateDialog(false);
    // Navigate to hosts page
    navigate("/hosts");
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
                    {/* We access definitionId instead of type which doesn't exist on ServerInstance */}
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
                    <CommandEmpty>No profiles found.</CommandEmpty>
                    <CommandList>
                      <CommandGroup>
                        {profiles.map(profile => (
                          <CommandItem
                            key={profile.id}
                            onSelect={() => {
                              setSelectedProfileId(profile.id);
                              setProfileSearchOpen(false);
                            }}
                          >
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center">
                                <UserPlus className="mr-2 h-4 w-4" />
                                <span>{profile.name}</span>
                              </div>
                              {selectedProfileId === profile.id && (
                                <Check className="ml-2 h-4 w-4" />
                              )}
                            </div>
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

      {/* Navigation guidance dialog */}
      <AlertDialog open={showNavigateDialog} onOpenChange={setShowNavigateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Configure Profile on Host</AlertDialogTitle>
            <AlertDialogDescription>
              Would you like to apply this profile to a host now?
              Navigate to the Hosts page to configure which hosts should use this profile.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowNavigateDialog(false)}>
              Stay on Discovery
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleNavigateToHosts}>
              <LinkIcon className="h-4 w-4 mr-2" />
              Go to Hosts
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
