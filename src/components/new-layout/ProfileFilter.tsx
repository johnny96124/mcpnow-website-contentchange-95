
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { X, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Profile } from "@/data/mockData";

interface ProfileFilterProps {
  profiles: Profile[];
  selectedProfile: string | null;
  onSelectProfile: (profileId: string | null) => void;
}

export function ProfileFilter({ profiles, selectedProfile, onSelectProfile }: ProfileFilterProps) {
  return (
    <div className="flex items-center gap-2">
      {selectedProfile ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSelectProfile(null)}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4 mr-1" />
          Clear filter
        </Button>
      ) : null}
      <Select
        value={selectedProfile || ""}
        onValueChange={(value) => onSelectProfile(value)}
      >
        <SelectTrigger className="w-[200px]">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <SelectValue placeholder="Filter by profile" />
          </div>
        </SelectTrigger>
        <SelectContent>
          {profiles.map((profile) => (
            <SelectItem key={profile.id} value={profile.id}>
              {profile.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
