
import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { Profile } from "@/data/mockData";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

interface ProfileDropdownProps {
  profiles: Profile[];
  currentProfileId: string;
  onProfileChange: (profileId: string) => void;
  onCreateProfile: (name: string) => string;
  onDeleteProfile: (profileId: string) => void;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  profiles,
  currentProfileId,
  onProfileChange,
  onCreateProfile,
  onDeleteProfile
}) => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newProfileName, setNewProfileName] = useState("");
  const [profileToDelete, setProfileToDelete] = useState<Profile | null>(null);
  
  const currentProfile = profiles.find(p => p.id === currentProfileId);
  
  // Use useCallback to memoize handlers
  const handleProfileCreate = useCallback(() => {
    if (!newProfileName.trim()) {
      toast({
        title: "Invalid profile name",
        description: "Please enter a valid profile name",
        type: "error"
      });
      return;
    }
    
    const profileId = onCreateProfile(newProfileName);
    setNewProfileName("");
    setCreateDialogOpen(false);
    
    if (profileId) {
      onProfileChange(profileId);
      toast({
        title: "Profile created",
        description: `Profile "${newProfileName}" has been created`,
        type: "success"
      });
    }
  }, [newProfileName, onCreateProfile, onProfileChange]);
  
  const confirmDeleteProfile = useCallback((profile: Profile) => {
    setProfileToDelete(profile);
    setDeleteDialogOpen(true);
  }, []);
  
  const handleProfileDelete = useCallback(() => {
    if (profileToDelete) {
      onDeleteProfile(profileToDelete.id);
      setDeleteDialogOpen(false);
      
      toast({
        title: "Profile deleted",
        description: `Profile "${profileToDelete.name}" has been deleted`,
        type: "success"
      });
    }
  }, [profileToDelete, onDeleteProfile]);
  
  // Reset form state when dialog opens
  const handleCreateDialogOpenChange = useCallback((open: boolean) => {
    setCreateDialogOpen(open);
    if (!open) {
      // Reset form state when dialog closes
      setNewProfileName("");
    }
  }, []);
  
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1 h-8">
            <Badge variant="outline" className="font-normal">
              Profile:
            </Badge>
            {currentProfile?.name || "Select Profile"}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Select Profile</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {profiles.map((profile) => (
            <DropdownMenuItem
              key={profile.id}
              className="flex justify-between items-center"
              onSelect={(e) => { 
                e.preventDefault();
                if (profile.id !== currentProfileId) {
                  onProfileChange(profile.id);
                }
              }}
            >
              <span className={profile.id === currentProfileId ? "font-medium" : ""}>
                {profile.name}
              </span>
              {profile.id === currentProfileId ? (
                <Badge variant="secondary" className="ml-2">Current</Badge>
              ) : (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 ml-2 opacity-50 hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    confirmDeleteProfile(profile);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Profile
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Create Profile Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={handleCreateDialogOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Profile</DialogTitle>
            <DialogDescription>
              Create a new profile to organize your server connections
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="profile-name">Profile Name</Label>
              <Input 
                id="profile-name" 
                placeholder="Enter profile name" 
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleProfileCreate}>
              Create Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Profile Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Profile</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this profile? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <p className="font-medium">{profileToDelete?.name}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Deleting this profile will remove all server associations, but will not delete the servers themselves.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleProfileDelete}>
              Delete Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
