
import { useState, useEffect } from "react";
import { Plus, PlusCircle, Check } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Profile, ServerInstance } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

interface AddToProfilesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddToProfiles: (profileIds: string[]) => void;
  onCreateProfile: () => void;
  server: ServerInstance | null;
  profiles: Profile[];
  serverProfiles: Profile[];
}

export function AddToProfilesDialog({
  open,
  onOpenChange,
  onAddToProfiles,
  onCreateProfile,
  server,
  profiles,
  serverProfiles,
}: AddToProfilesDialogProps) {
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);
  const { toast } = useToast();

  // Reset selections when dialog opens
  useEffect(() => {
    if (open) {
      // Pre-select profiles that already contain this server
      setSelectedProfiles(serverProfiles.map(profile => profile.id));
    }
  }, [open, serverProfiles]);

  const handleToggleProfile = (profileId: string) => {
    setSelectedProfiles(prev => 
      prev.includes(profileId)
        ? prev.filter(id => id !== profileId)
        : [...prev, profileId]
    );
  };

  const handleSave = () => {
    if (selectedProfiles.length === 0) {
      toast({
        title: "No profiles selected",
        description: "Please select at least one profile or create a new one.",
        variant: "destructive"
      });
      return;
    }

    onAddToProfiles(selectedProfiles);
    onOpenChange(false);
  };

  // Check if profile is already selected
  const isProfileSelected = (profileId: string) => {
    return selectedProfiles.includes(profileId);
  };

  // Check if all available profiles are already selected
  const allProfilesSelected = profiles.length > 0 && selectedProfiles.length === profiles.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add to Profiles</DialogTitle>
          <DialogDescription>
            {server ? `Add ${server.name} to one or more profiles` : "Select profiles to add the server to"}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {profiles.length === 0 ? (
            <div className="text-center py-8 space-y-4 border rounded-md bg-muted/20 p-4">
              <h3 className="font-medium text-lg">No profiles yet</h3>
              <p className="text-muted-foreground">
                Create your first profile to start organizing your servers.
              </p>
              <Button onClick={onCreateProfile}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Profile
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                <label className="text-sm font-medium leading-none">
                  Select profiles ({selectedProfiles.length} of {profiles.length} selected)
                </label>
                <ScrollArea className="h-[200px] rounded-md border">
                  <div className="p-4 space-y-2">
                    {profiles.map(profile => (
                      <div key={profile.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            checked={isProfileSelected(profile.id)}
                            onCheckedChange={() => handleToggleProfile(profile.id)}
                            id={`profile-${profile.id}`}
                          />
                          <label 
                            htmlFor={`profile-${profile.id}`}
                            className="font-medium cursor-pointer flex-1"
                          >
                            {profile.name}
                          </label>
                        </div>
                        {serverProfiles.some(p => p.id === profile.id) && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                            Already added
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              <div className="flex justify-between items-center">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setSelectedProfiles(profiles.map(p => p.id))}
                  disabled={allProfilesSelected}
                >
                  Select All
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setSelectedProfiles([])}
                  disabled={selectedProfiles.length === 0}
                >
                  Clear Selection
                </Button>
              </div>
            </>
          )}

          <Separator />
          
          <div className="pt-2">
            <Button variant="outline" className="w-full" onClick={onCreateProfile}>
              <Plus className="mr-2 h-4 w-4" />
              Create New Profile
            </Button>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          
          {profiles.length > 0 && (
            <Button 
              onClick={handleSave}
              disabled={selectedProfiles.length === 0}
            >
              <Check className="mr-2 h-4 w-4" />
              {selectedProfiles.length === 1 
                ? "Add to 1 Profile" 
                : `Add to ${selectedProfiles.length} Profiles`}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
