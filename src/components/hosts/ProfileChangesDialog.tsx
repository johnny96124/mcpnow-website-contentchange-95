
import React, { useState } from "react";
import { 
  AlertTriangle, Save, X, Plus, Check 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ServerInstance } from "@/data/mockData";

interface ProfileChangesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentProfileName: string;
  addedServers: ServerInstance[];
  removedServers: ServerInstance[];
  onSaveChanges: (createNew: boolean, profileName?: string) => void;
  onDiscardChanges: () => void;
}

export const ProfileChangesDialog: React.FC<ProfileChangesDialogProps> = ({
  open,
  onOpenChange,
  currentProfileName,
  addedServers,
  removedServers,
  onSaveChanges,
  onDiscardChanges
}) => {
  const [saveOption, setSaveOption] = useState<"update" | "new">("update");
  const [newProfileName, setNewProfileName] = useState("");

  // Reset state when dialog opens
  React.useEffect(() => {
    if (open) {
      setSaveOption("update");
      setNewProfileName(`${currentProfileName} (Copy)`);
    }
  }, [open, currentProfileName]);

  const handleConfirm = () => {
    if (saveOption === "new" && !newProfileName.trim()) {
      return;
    }
    
    onSaveChanges(
      saveOption === "new", 
      saveOption === "new" ? newProfileName : undefined
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Save Profile Changes</DialogTitle>
          <DialogDescription>
            You've made changes to the profile. How would you like to save them?
          </DialogDescription>
        </DialogHeader>

        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800">Unsaved Changes</AlertTitle>
          <AlertDescription className="text-yellow-700">
            Your changes to profile "{currentProfileName}" need to be saved.
          </AlertDescription>
        </Alert>
        
        <div className="py-3 space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Changes Summary:</h3>
            <div className="bg-muted/20 rounded-md p-3 space-y-2 text-sm">
              {addedServers.length > 0 && (
                <div>
                  <Badge variant="secondary" className="mb-1">Added</Badge>
                  <div className="pl-2 space-y-1">
                    {addedServers.map(server => (
                      <div key={server.id} className="flex items-center gap-1">
                        <Plus className="h-3.5 w-3.5 text-green-500" />
                        {server.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {removedServers.length > 0 && (
                <div>
                  <Badge variant="outline" className="mb-1">Removed</Badge>
                  <div className="pl-2 space-y-1">
                    {removedServers.map(server => (
                      <div key={server.id} className="flex items-center gap-1">
                        <X className="h-3.5 w-3.5 text-red-500" />
                        {server.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <RadioGroup value={saveOption} onValueChange={(value) => setSaveOption(value as "update" | "new")}>
            <div className="flex items-start space-x-2 border rounded-md p-3">
              <RadioGroupItem value="update" id="option-update" />
              <Label htmlFor="option-update" className="cursor-pointer">
                <div>
                  <p className="font-medium">Update existing profile</p>
                  <p className="text-sm text-muted-foreground">
                    Save changes to "{currentProfileName}" directly
                  </p>
                </div>
              </Label>
            </div>
            
            <div className="flex items-start space-x-2 border rounded-md p-3">
              <RadioGroupItem value="new" id="option-new" />
              <Label htmlFor="option-new" className="w-full cursor-pointer">
                <div>
                  <p className="font-medium">Create new profile</p>
                  <p className="text-sm text-muted-foreground mb-2">
                    Save as a new profile with your changes
                  </p>
                  <div className="space-y-1">
                    <Label htmlFor="new-profile-name">Profile Name</Label>
                    <Input
                      id="new-profile-name"
                      value={newProfileName}
                      onChange={(e) => setNewProfileName(e.target.value)}
                      disabled={saveOption !== "new"}
                    />
                  </div>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <DialogFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            className="text-destructive"
            onClick={onDiscardChanges}
          >
            Discard Changes
          </Button>
          
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleConfirm}
              disabled={saveOption === "new" && !newProfileName.trim()}
            >
              <Save className="h-4 w-4 mr-2" />
              {saveOption === "update" ? "Update Profile" : "Save as New Profile"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
