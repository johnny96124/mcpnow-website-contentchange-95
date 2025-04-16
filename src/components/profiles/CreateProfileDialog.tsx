import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PlusCircle, Trash2, Plus, Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ServerInstance, serverDefinitions } from "@/data/mockData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

const profileSchema = z.object({
  name: z.string().min(1, { message: "Profile name is required" }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface InstanceSelection {
  id: string;
  definitionId: string;
  instanceId: string;
}

interface CreateProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateProfile: (profile: {
    name: string;
    instances: string[];
  }) => void;
  instances: ServerInstance[];
  showInstanceSelection?: boolean;
}

export function CreateProfileDialog({ 
  open, 
  onOpenChange, 
  onCreateProfile,
  instances,
  showInstanceSelection = false
}: CreateProfileDialogProps) {
  const { toast } = useToast();
  const [selections, setSelections] = useState<InstanceSelection[]>([
    { id: `selection-${Date.now()}`, definitionId: "", instanceId: "" }
  ]);
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
    },
  });
  
  const instancesByDefinition = instances.reduce((acc, instance) => {
    if (!acc[instance.definitionId]) {
      acc[instance.definitionId] = [];
    }
    acc[instance.definitionId].push(instance);
    return acc;
  }, {} as Record<string, ServerInstance[]>);
  
  const definitionIds = [...new Set(instances.map(instance => instance.definitionId))];

  const handleSubmit = (values: ProfileFormValues) => {
    const selectedInstanceIds = showInstanceSelection 
      ? selections
          .filter(selection => selection.instanceId)
          .map(selection => selection.instanceId)
      : [];

    onCreateProfile({
      name: values.name,
      instances: selectedInstanceIds,
    });
    
    form.reset();
    setSelections([{ id: `selection-${Date.now()}`, definitionId: "", instanceId: "" }]);
    onOpenChange(false);
    
    toast({
      title: "Profile created",
      description: `Created profile "${values.name}" with ${selectedInstanceIds.length} instance(s)`,
    });
  };

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

  const removeSelection = (id: string) => {
    if (selections.length > 1) {
      setSelections(selections.filter(selection => selection.id !== id));
    }
  };

  const updateDefinitionId = (id: string, definitionId: string) => {
    setSelections(selections.map(selection => 
      selection.id === id ? { ...selection, definitionId, instanceId: "" } : selection
    ));
  };

  const updateInstanceId = (id: string, instanceId: string) => {
    setSelections(selections.map(selection => 
      selection.id === id ? { ...selection, instanceId } : selection
    ));
  };

  const getDefinitionName = (definitionId: string) => {
    const definition = serverDefinitions.find(def => def.id === definitionId);
    return definition ? definition.name : 'Unknown Definition';
  };

  const getAvailableDefinitionIds = (currentSelectionId: string) => {
    const usedDefinitionIds = selections
      .filter(s => s.id !== currentSelectionId && s.definitionId)
      .map(s => s.definitionId);
    
    return definitionIds.filter(defId => !usedDefinitionIds.includes(defId));
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Profile</DialogTitle>
          <DialogDescription>
            Group server instances into a managed profile.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter profile name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {showInstanceSelection && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Server Instances</h4>
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
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <Alert variant="default" className="bg-blue-50 border-blue-200">
                  <Info className="h-4 w-4 text-blue-500" />
                  <AlertDescription className="text-xs text-blue-700">
                    Each server definition can only be selected once.
                    Profiles can be saved with zero instances if needed.
                  </AlertDescription>
                </Alert>
              </div>
            )}

            <DialogFooter className="pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)} type="button">Cancel</Button>
              <Button 
                type="submit"
                disabled={!form.formState.isValid}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Profile
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
