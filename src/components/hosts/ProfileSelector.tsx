
import React, { useState } from "react";
import { 
  AlertTriangle, Check, Info, Plus, Save, X 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Profile, ServerInstance } from "@/data/mockData";

interface ProfileSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profiles: Profile[];
  serverInstances: ServerInstance[];
  onSelectProfile: (profileId: string) => void;
  onCreateProfile: (profileName: string) => void;
  hasUnsavedChanges?: boolean;
  currentProfileId?: string;
}

export const ProfileSelector: React.FC<ProfileSelectorProps> = ({
  open,
  onOpenChange,
  profiles,
  serverInstances,
  onSelectProfile,
  onCreateProfile,
  hasUnsavedChanges = false,
  currentProfileId
}) => {
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [newProfileMode, setNewProfileMode] = useState(false);
  const [newProfileName, setNewProfileName] = useState("");
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(hasUnsavedChanges);

  // Reset state when dialog opens
  React.useEffect(() => {
    if (open) {
      setSelectedProfileId(null);
      setNewProfileMode(false);
      setNewProfileName("");
      setShowUnsavedWarning(hasUnsavedChanges);
    }
  }, [open, hasUnsavedChanges]);

  const handleConfirm = () => {
    if (newProfileMode) {
      if (newProfileName.trim()) {
        onCreateProfile(newProfileName.trim());
        onOpenChange(false);
      }
    } else if (selectedProfileId) {
      onSelectProfile(selectedProfileId);
      onOpenChange(false);
    }
  };

  const getServerCountByProfile = (profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    return profile ? profile.instances.length : 0;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {hasUnsavedChanges ? "Save Changes Before Switching" : "Select Profile"}
          </DialogTitle>
          <DialogDescription>
            {hasUnsavedChanges 
              ? "You have unsaved changes. Choose how to proceed." 
              : "Select an existing profile or create a new one."}
          </DialogDescription>
        </DialogHeader>

        {showUnsavedWarning && hasUnsavedChanges && (
          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-800">Unsaved Changes</AlertTitle>
            <AlertDescription className="text-yellow-700">
              Your current profile has unsaved changes that will be lost if you switch without saving.
            </AlertDescription>
          </Alert>
        )}

        <div className="py-4 space-y-4">
          {!newProfileMode ? (
            <>
              <div className="flex justify-between mb-2">
                <h3 className="font-medium">Existing Profiles</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setNewProfileMode(true)}
                  className="text-sm flex items-center"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  New Profile
                </Button>
              </div>

              {profiles.length > 0 ? (
                <RadioGroup value={selectedProfileId || ""} onValueChange={setSelectedProfileId}>
                  {profiles.map(profile => {
                    const serverCount = getServerCountByProfile(profile.id);
                    const isCurrentProfile = profile.id === currentProfileId;
                    
                    return (
                      <div key={profile.id} className={`flex items-center space-x-2 border rounded-md p-3 ${isCurrentProfile ? 'bg-muted/20 border-primary/30' : ''}`}>
                        <RadioGroupItem value={profile.id} id={profile.id} />
                        <Label 
                          htmlFor={profile.id} 
                          className="flex-grow flex items-center justify-between cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{profile.name}</span>
                            {isCurrentProfile && (
                              <Badge variant="outline" className="ml-2">Current</Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {serverCount} {serverCount === 1 ? 'server' : 'servers'}
                          </div>
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              ) : (
                <div className="text-center py-6 border border-dashed rounded-md">
                  <Info className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No profiles available</p>
                  <Button 
                    variant="link" 
                    className="mt-2" 
                    onClick={() => setNewProfileMode(true)}
                  >
                    Create your first profile
                  </Button>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex justify-between mb-2">
                <h3 className="font-medium">Create New Profile</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setNewProfileMode(false)}
                  className="text-sm"
                >
                  Back to existing profiles
                </Button>
              </div>
              
              <div className="space-y-4">
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
            </>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          {hasUnsavedChanges && showUnsavedWarning && (
            <div className="flex gap-2 mr-auto">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setShowUnsavedWarning(false)}
              >
                Discard Changes
              </Button>
              <Button 
                type="button"
                variant="default"
                className="bg-green-500 hover:bg-green-600"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Current Profile
              </Button>
            </div>
          )}
          
          <div className="flex gap-2 ml-auto">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleConfirm}
              disabled={(newProfileMode && !newProfileName.trim()) || (!newProfileMode && !selectedProfileId)}
            >
              {newProfileMode ? "Create Profile" : "Select Profile"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
