
import React, { useState } from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ServerDefinition, Profile } from "@/data/mockData";

interface AddToProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddToProfile: (profileId: string) => void;
  serverDefinition: ServerDefinition | null;
  profiles: Profile[];
}

export function AddToProfileDialog({
  open,
  onOpenChange,
  onAddToProfile,
  serverDefinition,
  profiles,
}: AddToProfileDialogProps) {
  const [selectedProfileId, setSelectedProfileId] = useState<string>("");

  const handleSubmit = () => {
    if (selectedProfileId) {
      onAddToProfile(selectedProfileId);
    }
  };

  const handleDialogClose = (isOpen: boolean) => {
    if (!isOpen) {
      // Reset the selected profile when closing the dialog
      setSelectedProfileId("");
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Add Instance to Profile
          </DialogTitle>
          <DialogDescription>
            Select a profile to add the {serverDefinition?.name} instance to.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Select Profile
              </label>
              <Select
                value={selectedProfileId}
                onValueChange={setSelectedProfileId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a profile" />
                </SelectTrigger>
                <SelectContent>
                  {profiles.length > 0 ? (
                    profiles.map((profile) => (
                      <SelectItem key={profile.id} value={profile.id}>
                        {profile.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-profiles" disabled>
                      No profiles available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedProfileId}
          >
            Add to Profile
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
