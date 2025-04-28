
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { DeleteProfileDialog } from "./DeleteProfileDialog";
import { CreateProfileDialog } from "@/components/profiles/CreateProfileDialog";
import { serverInstances } from "@/data/mockData";

interface ProfileSelectorProps {
  profiles: any[];
  selectedProfile: any;
  onSelect: (profile: any) => void;
  className?: string;
}

export function ProfileSelector({
  profiles,
  selectedProfile,
  onSelect,
  className
}: ProfileSelectorProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<any>(null);

  const handleDeleteClick = (profile: any) => {
    setProfileToDelete(profile);
    setDeleteDialogOpen(true);
  };

  const handleProfileCreated = (newProfile: any) => {
    // In real app, this would add to the profiles list
    // For now, we'll just close the dialog
    setCreateDialogOpen(false);
    // Assume onSelect would be called with the new profile after it's added to the state
  };

  const handleConfirmDelete = () => {
    // In a real app, this would remove from the profiles list
    // For now, we'll just close the dialog
    setDeleteDialogOpen(false);
  };

  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1 text-xs">
            {selectedProfile.name}
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Profiles</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {profiles.map((profile) => (
            <DropdownMenuItem
              key={profile.id}
              className="flex justify-between"
              onClick={() => onSelect(profile)}
            >
              <span>{profile.name}</span>
              {profiles.length > 1 && selectedProfile.id === profile.id && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 px-1 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(profile);
                  }}
                >
                  Delete
                </Button>
              )}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setCreateDialogOpen(true)}>
            New Profile...
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {profileToDelete && (
        <DeleteProfileDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          profileName={profileToDelete.name}
          onConfirmDelete={handleConfirmDelete}
        />
      )}

      <CreateProfileDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreateProfile={handleProfileCreated}
        instances={serverInstances}
      />
    </div>
  );
}
