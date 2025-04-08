
import { useState, useEffect } from "react";
import { PlusCircle, Trash2, Plus, AlertCircle, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Profile, ServerInstance, serverDefinitions } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { EndpointLabel } from "@/components/status/EndpointLabel";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: Profile;
  allInstances: ServerInstance[];
  onSave: (profile: Profile, newName: string, selectedInstanceIds: string[], endpoint: string, endpointType: string) => void;
}

interface InstanceSelection {
  id: string;
  definitionId: string;
  instanceId: string;
}

export function EditProfileDialog({
  open,
  onOpenChange,
  profile,
  allInstances,
  onSave,
}: EditProfileDialogProps) {
  const { toast } = useToast();
  const [profileName, setProfileName] = useState(profile.name);
  const [selections, setSelections] = useState<InstanceSelection[]>([]);
  
  // Group instances by definition for easier selection
  const instancesByDefinition = allInstances.reduce((acc, instance) => {
    if (!acc[instance.definitionId]) {
      acc[instance.definitionId] = [];
    }
    acc[instance.definitionId].push(instance);
    return acc;
  }, {} as Record<string, ServerInstance[]>);
  
  // Get unique definition IDs
  const definitionIds = [...new Set(allInstances.map(instance => instance.definitionId))];

  // Reset state when dialog opens with profile data
  useEffect(() => {
    if (open) {
      setProfileName(profile.name);
      
      // Convert profile instances to selections format
      const initialSelections: InstanceSelection[] = [];
      
      // Get all selected instances with their details
      const selectedInstances = profile.instances.map(
        instanceId => allInstances.find(inst => inst.id === instanceId)
      ).filter(Boolean) as ServerInstance[];
      
      // Create selection objects for each instance
      selectedInstances.forEach(instance => {
        initialSelections.push({
          id: `selection-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          definitionId: instance.definitionId,
          instanceId: instance.id
        });
      });
      
      // If no instances, add an empty selection
      if (initialSelections.length === 0) {
        initialSelections.push({ 
          id: `selection-${Date.now()}`, 
          definitionId: "", 
          instanceId: "" 
        });
      }
      
      setSelections(initialSelections);
    }
  }, [open, profile, allInstances]);

  // Add a new instance selection row
  const addSelection = () => {
    setSelections([
      ...selections, 
      { 
        id: `selection-${Date.now()}`, 
        definitionId: "", 
        instanceId: "" 
      }
    ]);
  };

  // Remove an instance selection row
  const removeSelection = (id: string) => {
    if (selections.length > 1) {
      setSelections(selections.filter(selection => selection.id !== id));
    }
  };

  // Update a selection's definition ID
  const updateDefinitionId = (id: string, definitionId: string) => {
    setSelections(selections.map(selection => 
      selection.id === id ? { ...selection, definitionId, instanceId: "" } : selection
    ));
  };

  // Update a selection's instance ID
  const updateInstanceId = (id: string, instanceId: string) => {
    setSelections(selections.map(selection => 
      selection.id === id ? { ...selection, instanceId } : selection
    ));
  };

  // Helper to get definition name
  const getDefinitionName = (definitionId: string) => {
    const definition = serverDefinitions.find(def => def.id === definitionId);
    return definition ? definition.name : 'Unknown Definition';
  };

  // Filter out used definition IDs for each selection
  const getAvailableDefinitionIds = (currentSelectionId: string) => {
    const usedDefinitionIds = selections
      .filter(s => s.id !== currentSelectionId && s.definitionId)
      .map(s => s.definitionId);
    
    return definitionIds.filter(defId => !usedDefinitionIds.includes(defId));
  };

  const handleSave = () => {
    // Filter out incomplete selections and get only instance IDs
    const selectedInstanceIds = selections
      .filter(selection => selection.instanceId)
      .map(selection => selection.instanceId);

    if (selectedInstanceIds.length === 0) {
      toast({
        title: "No instances selected",
        description: "You must select at least one server instance for the profile.",
        variant: "destructive",
      });
      return;
    }

    onSave(profile, profileName, selectedInstanceIds, profile.endpoint, profile.endpointType);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onOpenChange(false)}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Modify profile name and server instances.
            </DialogDescription>
          </div>
          <EndpointLabel type="HTTP_SSE" />
        </DialogHeader>

        <div className="py-4 space-y-6">
          <div>
            <label className="text-sm font-medium">Profile Name</label>
            <Input 
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              placeholder="Enter profile name"
              className="mt-1.5"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Server Instances</label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={addSelection}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Instance
              </Button>
            </div>

            {selections.map((selection) => (
              <div key={selection.id} className="flex items-center gap-2">
                <div className="flex-1">
                  <Select
                    value={selection.definitionId}
                    onValueChange={(value) => updateDefinitionId(selection.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select definition" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableDefinitionIds(selection.id).map(defId => (
                        <SelectItem key={defId} value={defId}>
                          {getDefinitionName(defId)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1">
                  <Select
                    value={selection.instanceId}
                    onValueChange={(value) => updateInstanceId(selection.id, value)}
                    disabled={!selection.definitionId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select instance" />
                    </SelectTrigger>
                    <SelectContent>
                      {selection.definitionId && 
                        instancesByDefinition[selection.definitionId]?.map(instance => (
                          <SelectItem key={instance.id} value={instance.id}>
                            {instance.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSelection(selection.id)}
                  disabled={selections.length <= 1}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <Alert variant="default" className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-xs text-blue-700">
              Each server definition can only be selected once.
              At least one server instance must be selected for the profile.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button 
            onClick={handleSave}
            disabled={!profileName.trim() || selections.every(s => !s.instanceId)}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
