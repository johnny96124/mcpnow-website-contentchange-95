
import { useState } from "react";
import { Profile } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Server, Check } from "lucide-react";

interface ProfileSelectorProps {
  profiles: Profile[];
  onSelectProfile: (profileId: string) => void;
  onCreateProfile: (name: string) => void;
}

export function ProfileSelector({ profiles, onSelectProfile, onCreateProfile }: ProfileSelectorProps) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newProfileName, setNewProfileName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProfiles = profiles.filter(profile => 
    profile.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateProfile = () => {
    if (newProfileName.trim()) {
      onCreateProfile(newProfileName);
      setNewProfileName("");
      setCreateDialogOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Choose a Profile</h2>
        <Button 
          onClick={() => setCreateDialogOpen(true)}
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Create New
        </Button>
      </div>

      <Input
        placeholder="Search profiles..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full"
      />

      <ScrollArea className="h-[400px] rounded-md border">
        {filteredProfiles.length > 0 ? (
          <div className="p-4 grid gap-3">
            {filteredProfiles.map((profile) => (
              <Card 
                key={profile.id}
                className="cursor-pointer hover:bg-accent transition-colors"
                onClick={() => onSelectProfile(profile.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-medium">{profile.name}</h3>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Server className="h-3.5 w-3.5 inline-block" />
                        <span>
                          {profile.instances.length} service{profile.instances.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                    <Button size="sm" className="flex items-center gap-1.5">
                      <Check className="h-4 w-4" />
                      Select
                    </Button>
                  </div>

                  {profile.instances.length > 0 && (
                    <div className="mt-3">
                      <div className="text-xs text-muted-foreground mb-1.5">Services:</div>
                      <div className="flex flex-wrap gap-1">
                        {profile.instances.slice(0, 5).map((instanceId, index) => (
                          <Badge key={instanceId} variant="outline" className="bg-muted/50">
                            Instance {index + 1}
                          </Badge>
                        ))}
                        {profile.instances.length > 5 && (
                          <Badge variant="outline">+{profile.instances.length - 5} more</Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-8">
            <p className="text-muted-foreground mb-2">No profiles found</p>
            {searchQuery ? (
              <Button variant="link" onClick={() => setSearchQuery("")}>
                Clear search
              </Button>
            ) : (
              <Button variant="outline" onClick={() => setCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-1" />
                Create New Profile
              </Button>
            )}
          </div>
        )}
      </ScrollArea>

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Profile</DialogTitle>
            <DialogDescription>
              Enter a name for your new profile.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Input
              placeholder="Profile name"
              value={newProfileName}
              onChange={(e) => setNewProfileName(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateProfile} 
              disabled={!newProfileName.trim()}
            >
              Create Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
