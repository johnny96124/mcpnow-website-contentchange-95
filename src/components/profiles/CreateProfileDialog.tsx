
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PlusCircle, Trash2, Info } from "lucide-react";
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
import { ServerInstance, serverInstances } from "@/data/mockData";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  simpleMode?: boolean;
}

export function CreateProfileDialog({ 
  open, 
  onOpenChange, 
  onCreateProfile,
  instances,
  simpleMode = false
}: CreateProfileDialogProps) {
  const { toast } = useToast();
  const [selectedInstances, setSelectedInstances] = useState<string[]>([]);
  const [selectedInstance, setSelectedInstance] = useState<string>("");
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
    },
  });

  // Reset selected instances when dialog opens or closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedInstances([]);
      setSelectedInstance("");
      form.reset();
    }
    onOpenChange(open);
  };

  const handleSubmit = (values: ProfileFormValues) => {
    onCreateProfile({
      name: values.name,
      instances: selectedInstances,
    });
    
    form.reset();
    setSelectedInstances([]);
    setSelectedInstance("");
    onOpenChange(false);
    
    toast({
      title: "Profile created",
      description: `Created profile "${values.name}" with ${selectedInstances.length} instance(s)`,
    });
  };

  const handleAddInstance = () => {
    if (selectedInstance && !selectedInstances.includes(selectedInstance)) {
      setSelectedInstances([...selectedInstances, selectedInstance]);
      setSelectedInstance("");
    }
  };

  const handleRemoveInstance = (instanceId: string) => {
    setSelectedInstances(selectedInstances.filter(id => id !== instanceId));
  };

  const availableInstances = instances.filter(
    instance => !selectedInstances.includes(instance.id)
  );
  
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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

            {!simpleMode && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-md font-medium">Server Instances</h3>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={handleAddInstance}
                    disabled={!selectedInstance}
                    className="flex items-center gap-1"
                  >
                    <PlusCircle className="w-4 h-4" /> Add Instance
                  </Button>
                </div>

                <div className="flex gap-3 w-full">
                  <div className="flex-1">
                    <Select
                      value={selectedInstance}
                      onValueChange={setSelectedInstance}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select instance" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableInstances.length > 0 ? (
                          availableInstances.map((instance) => (
                            <SelectItem key={instance.id} value={instance.id}>
                              {instance.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-instances" disabled>
                            No instances available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="border rounded-md p-3 max-h-[200px] overflow-y-auto">
                  {selectedInstances.length > 0 ? (
                    <div className="space-y-2">
                      {selectedInstances.map((instanceId) => {
                        const instance = instances.find(i => i.id === instanceId);
                        return instance ? (
                          <div key={instanceId} className="flex justify-between items-center p-2 bg-secondary rounded-md">
                            <span className="text-sm">{instance.name}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveInstance(instanceId)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        ) : null;
                      })}
                    </div>
                  ) : (
                    <div className="text-center p-4 text-muted-foreground">
                      No instances added
                    </div>
                  )}
                </div>

                <Alert className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900">
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-blue-500" />
                    <AlertDescription className="text-sm text-blue-700 dark:text-blue-400">
                      Each server definition can only be selected once. Profiles can be saved
                      with zero instances if needed.
                    </AlertDescription>
                  </div>
                </Alert>
              </div>
            )}

            <DialogFooter className="pt-4">
              <Button variant="outline" onClick={() => handleOpenChange(false)} type="button">Cancel</Button>
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
