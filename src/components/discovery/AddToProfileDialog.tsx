
import { useState, useEffect } from "react";
import { Check, ChevronDown, FolderOpen, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { profiles, hosts } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

interface AddToProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  instanceId: string;
  instanceName: string;
}

export function AddToProfileDialog({
  open,
  onOpenChange,
  instanceId,
  instanceName,
}: AddToProfileDialogProps) {
  const [selectedProfile, setSelectedProfile] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showHostsDialog, setShowHostsDialog] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Filter profiles based on search query
  const filteredProfiles = profiles.filter(
    (profile) =>
      profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Get available hosts for the selected profile
  const availableHosts = hosts.filter(
    (host) => host.profileId === selectedProfile
  );
  
  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setSelectedProfile("");
      setSearchQuery("");
      setShowHostsDialog(false);
    }
  }, [open]);

  const handleAddToProfile = () => {
    if (!selectedProfile) {
      toast({
        title: "No profile selected",
        description: "Please select a profile to continue.",
        variant: "destructive",
      });
      return;
    }

    // Add instance to the selected profile (mock implementation)
    const profileName = profiles.find(p => p.id === selectedProfile)?.name || selectedProfile;
    
    toast({
      title: "Instance added to profile",
      description: `${instanceName} was added to ${profileName}`,
    });
    
    // Close the current dialog and show the hosts guidance dialog
    onOpenChange(false);
    setShowHostsDialog(true);
  };

  const handleNavigateToHosts = () => {
    navigate("/hosts");
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Add to Profile</DialogTitle>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Add <span className="font-medium text-foreground">{instanceName}</span> to an existing profile to make it available on hosts.
              </p>
              
              <div className="space-y-1">
                <label htmlFor="profile-select" className="text-sm font-medium">
                  Select Profile
                </label>
                <Select value={selectedProfile} onValueChange={setSelectedProfile}>
                  <SelectTrigger id="profile-select" className="w-full">
                    <SelectValue placeholder="Select a profile" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="flex items-center px-2 pb-1.5 sticky top-0 bg-popover z-10 border-b">
                      <Search className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                      <Input
                        placeholder="Search profiles..."
                        className="h-8 p-2 border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <ScrollArea className="max-h-[300px]">
                      {filteredProfiles.length > 0 ? (
                        filteredProfiles.map((profile) => (
                          <SelectItem key={profile.id} value={profile.id}>
                            <div className="flex items-center">
                              <FolderOpen className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                              <div className="font-medium">{profile.name}</div>
                            </div>
                          </SelectItem>
                        ))
                      ) : (
                        <div className="p-2 text-sm text-center text-muted-foreground">
                          No profiles found
                        </div>
                      )}
                    </ScrollArea>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4 mr-1" />
              Close
            </Button>
            <Button
              onClick={handleAddToProfile}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={!selectedProfile}
            >
              <Check className="h-4 w-4 mr-1" />
              Add to Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Hosts Guidance Dialog */}
      <AlertDialog open={showHostsDialog} onOpenChange={setShowHostsDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold">Configure Host for Your Instance</AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              <div className="space-y-4">
                <p>
                  Your instance has been added to the profile successfully! To use it, you'll need to configure a host.
                </p>
                
                {availableHosts.length > 0 ? (
                  <div className="border rounded-md p-4 bg-muted/30">
                    <h4 className="font-medium mb-2 flex items-center">
                      <FolderOpen className="h-4 w-4 mr-2" />
                      Available Hosts
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {availableHosts.map(host => (
                        <li key={host.id}>{host.name}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                
                <p>
                  Visit the Hosts page to configure your environment and make your instance operational.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-between sm:justify-between">
            <AlertDialogCancel>Stay Here</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleNavigateToHosts}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Go to Hosts
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
