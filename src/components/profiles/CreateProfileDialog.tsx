
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PlusCircle, Trash2, Plus, AlertCircle } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EndpointType, ServerInstance, serverDefinitions } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { EndpointLabel } from "@/components/status/EndpointLabel";

const profileSchema = z.object({
  name: z.string().min(1, { message: "Profile name is required" }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface CreateProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateProfile: (profile: {
    name: string;
    instances: string[];
  }) => void;
  instances: ServerInstance[];
}

interface InstanceSelection {
  id: string;
  definitionId: string;
  instanceId: string;
}

export function CreateProfileDialog({ 
  open, 
  onOpenChange, 
  onCreateProfile,
  instances
}: CreateProfileDialogProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [hasInstances, setHasInstances] = useState(true);
  const [selections, setSelections] = useState<InstanceSelection[]>([{ 
    id: `selection-${Date.now()}`, 
    definitionId: "", 
    instanceId: "" 
  }]);
  
  // Group instances by definition for easier selection
  const instancesByDefinition = instances.reduce((acc, instance) => {
    if (!acc[instance.definitionId]) {
      acc[instance.definitionId] = [];
    }
    acc[instance.definitionId].push(instance);
    return acc;
  }, {} as Record<string, ServerInstance[]>);
  
  // Get unique definition IDs
  const definitionIds = [...new Set(instances.map(instance => instance.definitionId))];
  
  useEffect(() => {
    setHasInstances(instances.length > 0);
    
    // Reset selections when dialog opens
    if (open) {
      setSelections([{ 
        id: `selection-${Date.now()}`, 
        definitionId: "", 
        instanceId: "" 
      }]);
    }
  }, [open, instances]);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
    },
  });

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

  const handleSubmit = (values: ProfileFormValues) => {
    if (!hasInstances) {
      navigate("/servers");
      onOpenChange(false);
      toast({
        title: "No server instances available",
        description: "You need to create server instances first before creating a profile.",
      });
      return;
    }

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

    onCreateProfile({
      name: values.name,
      instances: selectedInstanceIds,
    });
    
    form.reset();
    setSelections([{ 
      id: `selection-${Date.now()}`, 
      definitionId: "", 
      instanceId: "" 
    }]);
    onOpenChange(false);
    
    toast({
      title: "Profile created",
      description: `Created profile "${values.name}"`,
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div>
            <DialogTitle>Create New Profile</DialogTitle>
            <DialogDescription>
              Group server instances into a managed profile.
            </DialogDescription>
          </div>
          <EndpointLabel type="HTTP_SSE" />
        </DialogHeader>
        
        {!hasInstances ? (
          <div className="py-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You need to create server instances before creating a profile.
              </AlertDescription>
            </Alert>
            <Button 
              onClick={() => {
                navigate("/servers");
                onOpenChange(false);
              }} 
              className="w-full mt-4"
            >
              Go to Servers Page
            </Button>
          </div>
        ) : (
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

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <FormLabel>Server Instances</FormLabel>
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

                {selections.map((selection, index) => (
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
                          {definitionIds.map(defId => (
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

              <DialogFooter className="pt-4">
                <Button variant="outline" onClick={() => onOpenChange(false)} type="button">Cancel</Button>
                <Button 
                  type="submit"
                  disabled={!form.formState.isValid || selections.every(s => !s.instanceId)}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Profile
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
