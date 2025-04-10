
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { profiles } from "@/data/mockData";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface AddToProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  instanceName: string;
  onAddToProfile: (profileId: string) => void;
}

export function AddToProfileDialog({
  open,
  onOpenChange,
  instanceName,
  onAddToProfile,
}: AddToProfileDialogProps) {
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  
  // Reset the selected profile when the dialog is opened
  useEffect(() => {
    if (open) {
      setSelectedProfile(null);
    }
  }, [open]);
  
  const getProfileNameById = (id: string) => {
    const profile = profiles.find(p => p.id === id);
    return profile ? profile.name : '';
  };
  
  const handleAddToProfile = () => {
    if (selectedProfile) {
      onAddToProfile(selectedProfile);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add to Profile</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Instance <span className="font-medium text-foreground">{instanceName}</span> has been created. 
              You can add this instance to a profile for easier management.
            </p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Profile</label>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={popoverOpen}
                  className="w-full justify-between"
                >
                  {selectedProfile
                    ? getProfileNameById(selectedProfile)
                    : "Select profile..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search profiles..." className="h-9" />
                  <CommandEmpty>No profile found.</CommandEmpty>
                  <CommandGroup className="max-h-64 overflow-auto">
                    {profiles.map((profile) => (
                      <CommandItem
                        key={profile.id}
                        value={profile.name}
                        onSelect={() => {
                          setSelectedProfile(profile.id === selectedProfile ? null : profile.id);
                          setPopoverOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedProfile === profile.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {profile.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button 
            onClick={handleAddToProfile}
            disabled={!selectedProfile}
          >
            Add to Profile
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
