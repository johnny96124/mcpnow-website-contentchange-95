
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PlusCircle, AlertCircle, Info, Plus, X } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StatusIndicator } from "@/components/status/StatusIndicator";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronsUpDown } from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(1, { message: "Profile name is required" }),
  endpointType: z.enum(["HTTP_SSE", "STDIO"], { 
    required_error: "Endpoint type is required" 
  }),
  endpoint: z.string().min(1, { message: "Endpoint URL or path is required" }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface CreateProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateProfile: (profile: {
    name: string;
    endpointType: EndpointType;
    endpoint: string;
    instances: string[];
  }) => void;
  instances: ServerInstance[];
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
  const [selectedInstanceIds, setSelectedInstanceIds] = useState<string[]>([]);
  const [availableInstances, setAvailableInstances] = useState<ServerInstance[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  
  useEffect(() => {
    setHasInstances(instances.length > 0);
    
    // Reset selections and update available instances when dialog opens
    if (open) {
      setSelectedInstanceIds([]);
      updateAvailableInstances([]);
    }
  }, [open, instances]);

  // Function to update available instances based on current selections
  const updateAvailableInstances = (currentSelectedIds: string[]) => {
    // Filter out instances that are already selected
    const available = instances.filter(
      instance => !currentSelectedIds.includes(instance.id)
    );
    setAvailableInstances(available);
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      endpointType: "HTTP_SSE",
      endpoint: "",
    },
  });

  // Add an instance to the selected list and update available instances
  const addInstance = (instanceId: string) => {
    const newSelectedIds = [...selectedInstanceIds, instanceId];
    setSelectedInstanceIds(newSelectedIds);
    updateAvailableInstances(newSelectedIds);
  };

  // Remove an instance from the selected list and update available instances
  const removeInstance = (instanceId: string) => {
    const newSelectedIds = selectedInstanceIds.filter(id => id !== instanceId);
    setSelectedInstanceIds(newSelectedIds);
    updateAvailableInstances(newSelectedIds);
  };

  // Helper to get definition name
  const getDefinitionName = (definitionId: string) => {
    const definition = serverDefinitions.find(def => def.id === definitionId);
    return definition ? definition.name : 'Unknown Definition';
  };

  const selectedInstances = instances.filter(
    instance => selectedInstanceIds.includes(instance.id)
  );

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
      endpointType: values.endpointType,
      endpoint: values.endpoint,
      instances: selectedInstanceIds,
    });
    
    form.reset();
    setSelectedInstanceIds([]);
    onOpenChange(false);
    
    toast({
      title: "Profile created",
      description: `Created profile "${values.name}"`,
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Profile</DialogTitle>
          <DialogDescription>
            Profiles allow you to group server instances and connect to hosts.
          </DialogDescription>
        </DialogHeader>
        
        {!hasInstances ? (
          <div className="py-4">
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You need to create server instances before creating a profile.
              </AlertDescription>
            </Alert>
            <Button onClick={() => {
              navigate("/servers");
              onOpenChange(false);
            }} className="w-full">
              Go to Servers Page
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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

              {/* Connection endpoint configuration */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">Connection Settings</Label>
                
                <FormField
                  control={form.control}
                  name="endpointType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-muted-foreground">Endpoint Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select endpoint type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="HTTP_SSE">HTTP SSE</SelectItem>
                          <SelectItem value="STDIO">Standard I/O</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="endpoint"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-muted-foreground">Connection Endpoint</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder={
                            form.watch("endpointType") === "HTTP_SSE" 
                              ? "http://localhost:8008/mcp" 
                              : "/usr/local/bin/mcp-stdio"
                          } 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Server Instance Selection */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">Server Instances</Label>
                
                <Alert variant="default" className="bg-blue-50 border-blue-200">
                  <Info className="h-4 w-4 text-blue-500" />
                  <AlertDescription className="text-xs text-blue-700">
                    You must select at least one server instance for the profile.
                  </AlertDescription>
                </Alert>

                <div>
                  <label className="text-sm font-medium mb-2 block">Add Server Instance</label>
                  <Popover open={searchOpen} onOpenChange={setSearchOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={searchOpen}
                        className="w-full justify-between"
                      >
                        Select a server instance...
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0">
                      <Command>
                        <CommandList>
                          <CommandGroup>
                            {availableInstances.length > 0 ? (
                              availableInstances.map(instance => (
                                <CommandItem
                                  key={instance.id}
                                  className="flex items-center justify-between py-2 px-2"
                                  onSelect={() => {}} // We'll handle the click manually via the button
                                  value={instance.name}
                                >
                                  <div className="flex items-center gap-2">
                                    <StatusIndicator 
                                      status={
                                        instance.status === 'running' ? 'active' : 
                                        instance.status === 'error' ? 'error' : 'inactive'
                                      } 
                                    />
                                    <div className="flex flex-col">
                                      <span className="font-medium">
                                        {instance.name}
                                      </span>
                                      <span className="text-xs text-muted-foreground">
                                        {getDefinitionName(instance.definitionId)}
                                      </span>
                                    </div>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="ml-auto flex h-8 w-8 p-0 data-[state=open]:bg-accent"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      addInstance(instance.id);
                                    }}
                                  >
                                    <Plus className="h-4 w-4" />
                                    <span className="sr-only">Add</span>
                                  </Button>
                                </CommandItem>
                              ))
                            ) : (
                              <CommandEmpty>No available instances</CommandEmpty>
                            )}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Selected Instances ({selectedInstanceIds.length})</label>
                  <ScrollArea className="h-[200px] rounded-md border">
                    {selectedInstances.length > 0 ? (
                      <div className="p-0">
                        {selectedInstances.map(instance => (
                          <div 
                            key={instance.id}
                            className="flex items-center justify-between p-3 border-b last:border-b-0 hover:bg-muted/50"
                          >
                            <div className="flex items-center gap-2">
                              <StatusIndicator 
                                status={
                                  instance.status === 'running' ? 'active' : 
                                  instance.status === 'error' ? 'error' : 'inactive'
                                }
                              />
                              <div className="flex flex-col">
                                <span className="font-medium">{instance.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  {getDefinitionName(instance.definitionId)}
                                </span>
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-destructive hover:text-destructive"
                              onClick={() => removeInstance(instance.id)}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        No instances selected
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </div>

              <DialogFooter className="pt-4">
                <Button variant="outline" onClick={() => onOpenChange(false)} type="button">Cancel</Button>
                <Button 
                  type="submit"
                  disabled={!form.formState.isValid || selectedInstanceIds.length === 0}
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
