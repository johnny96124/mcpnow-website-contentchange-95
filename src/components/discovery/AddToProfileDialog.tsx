
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
import { Layers, X, PlusCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CreateProfileDialog } from "@/components/profiles/CreateProfileDialog";
import { useToast } from "@/hooks/use-toast";

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
  const [showInfoBox, setShowInfoBox] = useState<boolean>(true);
  const [createProfileDialogOpen, setCreateProfileDialogOpen] = useState<boolean>(false);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (selectedProfileId) {
      onAddToProfile(selectedProfileId);
      // Simply close the dialog after adding to profile
      // No redirection to Hosts page - will stay on Discovery
      onOpenChange(false);
    }
  };

  const handleDialogClose = (isOpen: boolean) => {
    if (!isOpen) {
      // Reset the selected profile when closing the dialog
      setSelectedProfileId("");
      setShowInfoBox(true);
    }
    onOpenChange(isOpen);
  };

  const handleCreateProfile = ({ name, instances }: { name: string; instances: string[] }) => {
    // In a real app, this would create the profile in the backend
    // For this mock implementation, we'll just show a toast
    toast({
      title: "Profile Created",
      description: `${name} has been created successfully.`,
    });
    
    setCreateProfileDialogOpen(false);
    // In a real implementation, we would fetch the updated profiles list here
  };

  const handleSelectChange = (value: string) => {
    if (value === "create-new") {
      setCreateProfileDialogOpen(true);
    } else {
      setSelectedProfileId(value);
    }
  };

  return (
    <>
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
            {/* What is a Profile explanation box - with close button */}
            {showInfoBox && (
              <Alert className="bg-blue-50 dark:bg-blue-950/30 rounded-md p-4 border border-blue-100 dark:border-blue-900 mb-4 relative">
                <div className="flex gap-2 items-center">
                  <Layers className="h-4 w-4 text-blue-500" />
                  <h3 className="font-medium text-blue-800 dark:text-blue-300">
                    What is a Profile?
                  </h3>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-2 right-2 h-6 w-6 p-1 text-blue-600"
                  onClick={() => setShowInfoBox(false)}
                >
                  <X className="h-3 w-3" />
                </Button>
                <AlertDescription className="mt-2 text-sm text-blue-700 dark:text-blue-400">
                  Profiles are groups of server instances that work together. By organizing instances into profiles, 
                  you can manage and deploy related services as a single unit. A profile can contain multiple 
                  instances of different server types.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Select Profile
                </label>
                <Select
                  value={selectedProfileId}
                  onValueChange={handleSelectChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a profile" />
                  </SelectTrigger>
                  <SelectContent>
                    {profiles.length > 0 ? (
                      <>
                        {profiles.map((profile) => (
                          <SelectItem key={profile.id} value={profile.id}>
                            {profile.name}
                          </SelectItem>
                        ))}
                        <SelectItem value="create-new" className="text-primary flex items-center gap-2">
                          <PlusCircle className="h-4 w-4" />
                          Create new profile
                        </SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="no-profiles" disabled>
                          No profiles available
                        </SelectItem>
                        <SelectItem value="create-new" className="text-primary flex items-center gap-2">
                          <PlusCircle className="h-4 w-4" />
                          Create new profile
                        </SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-between">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Skip
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedProfileId || selectedProfileId === "create-new"}
            >
              Add to Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CreateProfileDialog
        open={createProfileDialogOpen}
        onOpenChange={setCreateProfileDialogOpen}
        onCreateProfile={handleCreateProfile}
        instances={[]}
      />
    </>
  );
}
