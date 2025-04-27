
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Profile, ServerInstance } from "@/data/mockData";
import { Info, Save, FileText } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface ProfileChangesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentProfile: Profile | null;
  availableProfiles: Profile[];
  changedInstances: {
    added: ServerInstance[];
    removed: ServerInstance[];
  };
  onSaveChanges: (saveType: "current" | "new" | "none", newProfileName?: string) => void;
  onSwitchWithoutSaving: () => void;
}

export function ProfileChangesDialog({
  open,
  onOpenChange,
  currentProfile,
  availableProfiles,
  changedInstances,
  onSaveChanges,
  onSwitchWithoutSaving
}: ProfileChangesDialogProps) {
  const [saveType, setSaveType] = useState<"current" | "new" | "none">("current");
  const [newProfileName, setNewProfileName] = useState("");
  const [activeTab, setActiveTab] = useState<"save" | "discard">("save");

  const handleSave = () => {
    if (saveType === "new" && !newProfileName.trim()) {
      return; // Don't save if new profile name is empty
    }
    onSaveChanges(saveType, newProfileName);
  };

  const handleDiscard = () => {
    onSwitchWithoutSaving();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Unsaved Profile Changes</DialogTitle>
          <DialogDescription>
            You have made changes to the current profile. What would you like to do?
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "save" | "discard")} className="mt-4">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="save" className="flex items-center gap-1">
              <Save className="h-4 w-4" />
              Save Changes
            </TabsTrigger>
            <TabsTrigger value="discard" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              Switch Without Saving
            </TabsTrigger>
          </TabsList>

          <TabsContent value="save" className="space-y-4 py-4">
            <Alert variant="default" className="bg-amber-50 border-amber-200">
              <Info className="h-4 w-4 text-amber-500" />
              <AlertDescription className="text-amber-700 text-sm">
                Your changes to "{currentProfile?.name}" have not been saved
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <RadioGroup 
                value={saveType} 
                onValueChange={(v) => setSaveType(v as "current" | "new" | "none")}
                className="gap-4"
              >
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="current" id="save-current" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="save-current" className="font-medium">
                      Save to current profile
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Update "{currentProfile?.name}" with your changes
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="new" id="save-new" />
                  <div className="grid gap-1.5 flex-1">
                    <Label htmlFor="save-new" className="font-medium">
                      Create a new profile
                    </Label>
                    <div className="grid gap-2">
                      <p className="text-sm text-muted-foreground">
                        Save your changes as a new profile
                      </p>
                      <Input
                        placeholder="Enter new profile name"
                        value={newProfileName}
                        onChange={(e) => setNewProfileName(e.target.value)}
                        disabled={saveType !== "new"}
                      />
                    </div>
                  </div>
                </div>
              </RadioGroup>

              <div className="pt-2">
                <div className="text-sm font-medium mb-1">Changes summary:</div>
                <div className="text-sm space-y-1 ml-1">
                  {changedInstances.added.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                        Added
                      </Badge>
                      <span className="text-muted-foreground">
                        {changedInstances.added.length} service{changedInstances.added.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
                  
                  {changedInstances.removed.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200">
                        Removed
                      </Badge>
                      <span className="text-muted-foreground">
                        {changedInstances.removed.length} service{changedInstances.removed.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="discard" className="space-y-4 py-4">
            <Alert variant="destructive" className="bg-red-50 border-red-200">
              <Info className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-700 text-sm">
                Your changes will be lost if you switch profiles without saving
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <p className="text-sm">The following changes will be discarded:</p>
              
              {changedInstances.added.length > 0 && (
                <div className="space-y-1 ml-4">
                  <p className="text-sm font-medium">Added services:</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {changedInstances.added.slice(0, 3).map(instance => (
                      <li key={instance.id}>{instance.name}</li>
                    ))}
                    {changedInstances.added.length > 3 && (
                      <li>And {changedInstances.added.length - 3} more...</li>
                    )}
                  </ul>
                </div>
              )}
              
              {changedInstances.removed.length > 0 && (
                <div className="space-y-1 ml-4">
                  <p className="text-sm font-medium">Removed services:</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {changedInstances.removed.slice(0, 3).map(instance => (
                      <li key={instance.id}>{instance.name}</li>
                    ))}
                    {changedInstances.removed.length > 3 && (
                      <li>And {changedInstances.removed.length - 3} more...</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          
          {activeTab === "save" ? (
            <Button 
              onClick={handleSave}
              disabled={saveType === "new" && !newProfileName.trim()}
            >
              Save Changes
            </Button>
          ) : (
            <Button variant="destructive" onClick={handleDiscard}>
              Discard Changes & Switch
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
