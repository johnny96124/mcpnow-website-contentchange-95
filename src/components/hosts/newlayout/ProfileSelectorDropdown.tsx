
import { useState } from "react";
import { ChevronDown, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useHostProfiles } from "@/hooks/useHostProfiles";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ProfileSelectorDropdownProps {
  hostId: string;
  profileId: string;
  onChange: (hostId: string, profileId: string) => void;
}

export function ProfileSelectorDropdown({ hostId, profileId, onChange }: ProfileSelectorDropdownProps) {
  const { allProfiles, getProfileById } = useHostProfiles();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [newProfileName, setNewProfileName] = useState("");
  const [profileToDelete, setProfileToDelete] = useState<string | null>(null);
  
  const currentProfile = profileId ? getProfileById(profileId) : null;
  
  const handleCreateProfile = () => {
    if (!newProfileName.trim()) {
      toast.error("Profile name cannot be empty");
      return;
    }
    
    const newProfile = {
      id: `profile-${Date.now()}`,
      name: newProfileName,
      endpointType: "HTTP_SSE", // Default type
      enabled: true,
      endpoint: "",
      instances: []
    };
    
    // In a real app this would make an API call
    console.log("Created new profile:", newProfile);
    toast.success(`Profile "${newProfileName}" created successfully`);
    
    // Close dialog and reset form
    setShowCreateDialog(false);
    setNewProfileName("");
  };
  
  const handleDeleteProfile = () => {
    if (!profileToDelete) return;
    
    // In a real app this would make an API call
    console.log("Deleted profile:", profileToDelete);
    
    // In a real scenario, we would get the profile name from the API
    const profileToDeleteName = getProfileById(profileToDelete)?.name || "Unknown";
    
    toast.success(`Profile "${profileToDeleteName}" deleted successfully`);
    
    // Close dialog and reset
    setShowDeleteDialog(false);
    setProfileToDelete(null);
  };
  
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs font-normal pl-2 pr-1 h-7 border-dashed ml-2"
          >
            {currentProfile?.name || "Select Profile"}
            <ChevronDown className="ml-1 h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {allProfiles.map(profile => (
            <DropdownMenuItem 
              key={profile.id}
              onClick={() => onChange(hostId, profile.id)}
              className="flex items-center justify-between"
            >
              <span className={profile.id === profileId ? "font-medium" : ""}>
                {profile.name}
              </span>
              
              {profile.id !== profileId && (
                <Trash 
                  className="h-3 w-3 text-destructive hover:text-destructive/80 cursor-pointer" 
                  onClick={(e) => {
                    e.stopPropagation();
                    setProfileToDelete(profile.id);
                    setShowDeleteDialog(true);
                  }}
                />
              )}
            </DropdownMenuItem>
          ))}
          
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => setShowCreateDialog(true)}
            className="text-primary"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create new profile
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Create Profile Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create new profile</DialogTitle>
            <DialogDescription>
              Enter a name for the new profile
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Input
              value={newProfileName}
              onChange={(e) => setNewProfileName(e.target.value)}
              placeholder="Profile name"
              className="w-full"
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateProfile}>
              Create Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Profile Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete profile</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this profile? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>
              All server instances associated with this profile will be unlinked.
            </AlertDescription>
          </Alert>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProfile}>
              Delete Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
