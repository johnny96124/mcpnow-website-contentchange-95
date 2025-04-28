
import React, { useState } from "react";
import { Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Profile } from "@/data/mockData";

interface AddServerToHostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profiles: Profile[];
  onAddToProfiles: (profileIds: string[]) => void;
}

export const AddServerToHostDialog = ({
  open,
  onOpenChange,
  profiles,
  onAddToProfiles,
}: AddServerToHostDialogProps) => {
  const [selectedProfileIds, setSelectedProfileIds] = useState<string[]>([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleProfileSelect = (profileId: string) => {
    setSelectedProfileIds((prev) => {
      if (prev.includes(profileId)) {
        return prev.filter(id => id !== profileId);
      }
      return [...prev, profileId];
    });
  };

  const handleSave = () => {
    onAddToProfiles(selectedProfileIds);
    setSelectedProfileIds([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add to Profiles</DialogTitle>
          <DialogDescription>
            Select one or more profiles to add this server to
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <Plus className="h-4 w-4 mr-2" />
                {selectedProfileIds.length === 0 
                  ? "Select profiles" 
                  : `${selectedProfileIds.length} profile${selectedProfileIds.length > 1 ? 's' : ''} selected`}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-[300px]">
              <Command>
                <CommandList>
                  <CommandEmpty>No profiles found</CommandEmpty>
                  <CommandGroup>
                    {profiles.map((profile) => (
                      <CommandItem
                        key={profile.id}
                        onSelect={() => handleProfileSelect(profile.id)}
                      >
                        <div className="flex items-center gap-2 w-full">
                          <div className={`w-4 h-4 border rounded-sm flex items-center justify-center
                            ${selectedProfileIds.includes(profile.id) 
                              ? 'bg-primary border-primary text-primary-foreground' 
                              : 'border-input'}`}
                          >
                            {selectedProfileIds.includes(profile.id) && (
                              <Check className="h-3 w-3" />
                            )}
                          </div>
                          <span>{profile.name}</span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {selectedProfileIds.length > 0 && (
            <div className="text-sm text-muted-foreground">
              Selected profiles:
              <div className="mt-1 space-y-1">
                {profiles
                  .filter(p => selectedProfileIds.includes(p.id))
                  .map(profile => (
                    <div key={profile.id} className="pl-2">
                      • {profile.name}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={selectedProfileIds.length === 0}
          >
            Add to Profiles
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
