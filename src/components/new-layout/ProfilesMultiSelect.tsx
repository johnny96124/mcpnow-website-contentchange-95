
import React from 'react';
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Profile } from "@/data/mockData";
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
import { Button } from '@/components/ui/button';

interface ProfilesMultiSelectProps {
  profiles: Profile[];
  selectedProfileIds: string[];
  onProfileToggle: (profileId: string) => void;
}

export function ProfilesMultiSelect({
  profiles,
  selectedProfileIds,
  onProfileToggle,
}: ProfilesMultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedProfileIds.length > 0
            ? `${selectedProfileIds.length} profile${selectedProfileIds.length === 1 ? '' : 's'} selected`
            : "Select profiles..."}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search profiles..." className="h-9" />
          <CommandEmpty>No profile found.</CommandEmpty>
          <CommandGroup className="max-h-[200px] overflow-auto">
            {profiles.map((profile) => (
              <CommandItem
                key={profile.id}
                onSelect={() => {
                  onProfileToggle(profile.id);
                }}
                className="cursor-pointer"
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedProfileIds.includes(profile.id) 
                      ? "opacity-100" 
                      : "opacity-0"
                  )}
                />
                {profile.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
