
import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { Profile } from "@/data/mockData";

interface ProfileDropdownProps {
  profiles: Profile[];
  currentProfileId: string;
  onSelectProfile: (profileId: string) => void;
  onCreateProfile: () => void;
  onDeleteProfile: (profileId: string) => void;
}

export function ProfileDropdown({
  profiles,
  currentProfileId,
  onSelectProfile,
  onCreateProfile,
  onDeleteProfile
}: ProfileDropdownProps) {
  const [deleteProfileId, setDeleteProfileId] = React.useState<string | null>(null);
  const currentProfile = profiles.find(p => p.id === currentProfileId);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="ml-2">
            {currentProfile?.name || "Select Profile"}
            <ChevronDown className="ml-1 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>Switch Profile</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {profiles.map((profile) => (
            <DropdownMenuItem
              key={profile.id}
              onSelect={() => onSelectProfile(profile.id)}
              className="flex items-center justify-between"
            >
              {profile.name}
              {profile.id !== currentProfileId && (
                <Trash2
                  className="h-4 w-4 text-destructive hover:text-destructive/90"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteProfileId(profile.id);
                  }}
                />
              )}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={onCreateProfile}>
            <Plus className="mr-2 h-4 w-4" />
            New Profile
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={!!deleteProfileId} onOpenChange={() => setDeleteProfileId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Profile</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this profile? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deleteProfileId) {
                  onDeleteProfile(deleteProfileId);
                  setDeleteProfileId(null);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
