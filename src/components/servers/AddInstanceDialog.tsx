import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Info, Plus, Trash2, Check } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ServerDefinition, Host } from "@/data/mockData";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EndpointLabel } from "@/components/status/EndpointLabel";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";

interface AddInstanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serverDefinition: ServerDefinition | null;
  onCreateInstance: (data: InstanceFormValues, selectedHosts?: string[]) => void;
  editMode?: boolean;
  initialValues?: InstanceFormValues;
  instanceId?: string;
  availableHosts?: Host[];
}

const instanceFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  args: z.string().optional(),
  url: z.string().optional(),
  env: z.record(z.string(), z.string()).optional(),
  headers: z.record(z.string(), z.string()).optional(),
  instanceId: z.string().optional(),
});

export type InstanceFormValues = z.infer<typeof instanceFormSchema>;

export function AddInstanceDialog({ 
  open, 
  onOpenChange, 
  serverDefinition, 
  onCreateInstance,
  editMode = false,
  initialValues,
  instanceId,
  availableHosts = []
}: AddInstanceDialogProps) {
  const [envFields, setEnvFields] = useState<{name: string; value: string}[]>([]);
  const [headerFields, setHeaderFields] = useState<{name: string; value: string}[]>([]);
  const [selectedHosts, setSelectedHosts] = useState<string[]>([]);
  
  const form = useForm<InstanceFormValues>({
    resolver: zodResolver(instanceFormSchema),
    defaultValues: {
      name: '',
      args: '',
      url: '',
      env: {},
      headers: {},
      instanceId: instanceId,
    },
  });

  useEffect(() => {
    if (open && serverDefinition) {
      form.reset({
        name: initialValues?.name || (serverDefinition ? `${serverDefinition.name}` : ""),
        args: initialValues?.args || (serverDefinition?.type === 'STDIO' ? 
          serverDefinition?.commandArgs || `npx -y @smithery/cli@latest install @block/${serverDefinition?.type.toLowerCase()} --client ${serverDefinition?.name?.toLowerCase()} --key ad3dda05-c241-44f6-bcb8-283ef9149d88` 
          : ""),
        url: initialValues?.url || (serverDefinition?.type === 'HTTP_SSE' ? serverDefinition?.url || "http://localhost:3000/api" : ""),
        env: initialValues?.env || {},
        headers: initialValues?.headers || {},
        instanceId: instanceId,
      });
      
      setSelectedHosts([]);
      
      if (editMode && initialValues?.env) {
        const envEntries = Object.entries(initialValues.env);
        setEnvFields(envEntries.map(([name, value]) => ({ name, value: value.toString() })));
      } else if (serverDefinition?.type === 'STDIO') {
        if (serverDefinition.environment && Object.keys(serverDefinition.environment).length > 0) {
          setEnvFields(Object.entries(serverDefinition.environment).map(([name, value]) => ({ name, value: value.toString() })));
        } else {
          setEnvFields([
            { name: "API_KEY", value: "" },
            { name: "MODEL_NAME", value: "" },
            { name: "MAX_TOKENS", value: "4096" },
          ]);
        }
      }
      
      if (editMode && initialValues?.headers) {
        const headerEntries = Object.entries(initialValues.headers);
        setHeaderFields(headerEntries.map(([name, value]) => ({ name, value: value.toString() })));
      } else if (serverDefinition?.type === 'HTTP_SSE') {
        if (serverDefinition.headers && Object.keys(serverDefinition.headers).length > 0) {
          setHeaderFields(Object.entries(serverDefinition.headers).map(([name, value]) => ({ name, value: value.toString() })));
        } else {
          setHeaderFields([
            { name: "Authorization", value: "" },
            { name: "Content-Type", value: "application/json" },
          ]);
        }
      }
    }
  }, [open, initialValues, serverDefinition, form, editMode, instanceId]);

  const onSubmit = (data: InstanceFormValues) => {
    if (serverDefinition?.type === 'STDIO') {
      const envData: Record<string, string> = {};
      
      envFields.forEach(field => {
        if (field.name && field.value) {
          envData[field.name] = field.value;
        }
      });
      
      data.env = envData;
    }
    
    if (serverDefinition?.type === 'HTTP_SSE') {
      const headerData: Record<string, string> = {};
      
      headerFields.forEach(field => {
        if (field.name && field.value) {
          headerData[field.name] = field.value;
        }
      });
      
      data.headers = headerData;
    }
    
    data.instanceId = instanceId; 
    onCreateInstance(data, selectedHosts);
    if (!editMode) form.reset();
  };

  const addEnvField = () => {
    setEnvFields([...envFields, { name: "", value: "" }]);
  };

  const addHeaderField = () => {
    setHeaderFields([...headerFields, { name: "", value: "" }]);
  };
  
  const removeEnvField = (index: number) => {
    const newFields = [...envFields];
    newFields.splice(index, 1);
    setEnvFields(newFields);
  };

  const removeHeaderField = (index: number) => {
    const newFields = [...headerFields];
    newFields.splice(index, 1);
    setHeaderFields(newFields);
  };

  const toggleHostSelection = (hostId: string) => {
    setSelectedHosts(prev => 
      prev.includes(hostId)
        ? prev.filter(id => id !== hostId)
        : [...prev, hostId]
    );
  };

  if (!serverDefinition) return null;

  const isStdio = serverDefinition.type === 'STDIO';
  const isCustom = serverDefinition.isOfficial === false;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>{editMode ? "Edit Instance" : serverDefinition.name}</span>
            <EndpointLabel type={serverDefinition.type} />
            {isCustom && (
              <Badge variant="outline" className="text-gray-600 border-gray-300 rounded-md">
                Custom
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription className="pt-2">
            {editMode ? "Edit the instance settings" : serverDefinition.description}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    Name
                    <span className="text-destructive ml-1">*</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="ml-1 cursor-help">
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>A unique name to identify this server instance</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="My Server Instance" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {isStdio ? (
              <>
                <FormField
                  control={form.control}
                  name="args"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        Command Arguments
                        <span className="text-destructive ml-1">*</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="ml-1 cursor-help">
                                <Info className="h-4 w-4 text-muted-foreground" />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Command line arguments to initialize the server</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="npx -y @smithery/cli@latest install @block/server-type" 
                          className="font-mono text-sm h-20" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium flex items-center">
                      Environment Variables
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="ml-1 cursor-help">
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>These variables will be passed to the server instance</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addEnvField}
                      className="flex items-center gap-1"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add Variable
                    </Button>
                  </div>
                  
                  <div className="space-y-4 max-h-[200px] overflow-y-auto border rounded-md p-4">
                    {envFields.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-2">
                        No environment variables defined. Click 'Add Variable' to add one.
                      </p>
                    ) : (
                      envFields.map((field, index) => (
                        <div key={index} className="grid grid-cols-12 gap-2 items-start">
                          <div className="col-span-5">
                            <Input
                              value={field.name}
                              onChange={(e) => {
                                const newFields = [...envFields];
                                newFields[index].name = e.target.value;
                                setEnvFields(newFields);
                              }}
                              placeholder="Variable Name"
                              className="text-sm"
                            />
                          </div>
                          <div className="col-span-6">
                            <Input
                              value={field.value}
                              onChange={(e) => {
                                const newFields = [...envFields];
                                newFields[index].value = e.target.value;
                                setEnvFields(newFields);
                              }}
                              placeholder="Value"
                              className="text-sm"
                            />
                          </div>
                          <div className="col-span-1 flex justify-center items-center h-full">
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-destructive"
                              onClick={() => removeEnvField(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        URL
                        <span className="text-destructive ml-1">*</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="ml-1 cursor-help">
                                <Info className="h-4 w-4 text-muted-foreground" />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>The URL endpoint for the HTTP SSE server</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="http://localhost:3000/api" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium flex items-center">
                      HTTP Headers
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="ml-1 cursor-help">
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Headers to send with requests to the server</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addHeaderField}
                      className="flex items-center gap-1"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add Header
                    </Button>
                  </div>
                  
                  <div className="space-y-4 max-h-[200px] overflow-y-auto border rounded-md p-4">
                    {headerFields.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-2">
                        No HTTP headers defined. Click 'Add Header' to add one.
                      </p>
                    ) : (
                      headerFields.map((field, index) => (
                        <div key={index} className="grid grid-cols-12 gap-2 items-start">
                          <div className="col-span-5">
                            <Input
                              value={field.name}
                              onChange={(e) => {
                                const newFields = [...headerFields];
                                newFields[index].name = e.target.value;
                                setHeaderFields(newFields);
                              }}
                              placeholder="Header Name"
                              className="text-sm"
                            />
                          </div>
                          <div className="col-span-6">
                            <Input
                              value={field.value}
                              onChange={(e) => {
                                const newFields = [...headerFields];
                                newFields[index].value = e.target.value;
                                setHeaderFields(newFields);
                              }}
                              placeholder="Value"
                              className="text-sm"
                            />
                          </div>
                          <div className="col-span-1 flex justify-center items-center h-full">
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-destructive"
                              onClick={() => removeHeaderField(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
            
            {!editMode && availableHosts.length > 0 && (
              <>
                <Separator className="my-2" />
                
                <div className="space-y-3">
                  <h4 className="text-sm font-medium flex items-center">
                    Add to Hosts (Optional)
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="ml-1 cursor-help">
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Add this server to selected hosts immediately after creation</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </h4>
                  
                  <div className="max-h-[150px] overflow-y-auto border rounded-md p-3 space-y-2">
                    {availableHosts.map((host) => (
                      <div key={host.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`host-${host.id}`} 
                          checked={selectedHosts.includes(host.id)}
                          onCheckedChange={() => toggleHostSelection(host.id)}
                        />
                        <label
                          htmlFor={`host-${host.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
                        >
                          <span className="mr-2">{host.icon || '🖥️'}</span>
                          {host.name}
                          <Badge variant="outline" className="ml-2 text-xs">
                            {host.connectionStatus === "connected" ? "Connected" : "Disconnected"}
                          </Badge>
                        </label>
                      </div>
                    ))}
                    {availableHosts.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-2">
                        No available hosts. You can add hosts in the Hosts page.
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}
            
            <DialogFooter className="flex justify-between">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editMode ? "Save Changes" : "Add"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
