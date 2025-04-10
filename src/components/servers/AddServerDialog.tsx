
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowRight, Download, Plus, Variable, Link as LinkIcon } from "lucide-react";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { EndpointLabel } from "@/components/status/EndpointLabel";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type EndpointType } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

interface AddServerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateServer: (data: ServerFormValues) => void;
  onNavigateToDiscovery: () => void;
}

const serverFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters long" }),
  type: z.enum(["HTTP_SSE", "STDIO"]),
  url: z.string().optional(),
  commandArgs: z.string().optional(),
  description: z.string().max(100, { 
    message: "Description must not exceed 100 characters" 
  }).optional(),
  environment: z.record(z.string(), z.string()).optional(),
  headers: z.record(z.string(), z.string()).optional(),
});

type ServerFormValues = z.infer<typeof serverFormSchema>;

export function AddServerDialog({
  open,
  onOpenChange,
  onCreateServer,
  onNavigateToDiscovery
}: AddServerDialogProps) {
  const [activeTab, setActiveTab] = useState<"local" | "discovery">("local");
  const [urlError, setUrlError] = useState<string | null>(null);
  const [commandArgsError, setCommandArgsError] = useState<string | null>(null);
  const [showEnvironmentVars, setShowEnvironmentVars] = useState(false);
  const [showUrlParams, setShowUrlParams] = useState(false);
  const [environmentVars, setEnvironmentVars] = useState<{ key: string; value: string }[]>([]);
  const [urlParams, setUrlParams] = useState<{ key: string; value: string }[]>([]);
  const [envKeyError, setEnvKeyError] = useState<string | null>(null);
  const [headerKeyError, setHeaderKeyError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const form = useForm<ServerFormValues>({
    resolver: zodResolver(serverFormSchema),
    defaultValues: {
      name: "",
      type: "HTTP_SSE",
      url: "",
      commandArgs: "",
      description: "",
      environment: {},
      headers: {},
    },
  });
  
  const serverType = form.watch("type");
  
  // Reset URL and commandArgs when server type changes
  useEffect(() => {
    if (serverType === "HTTP_SSE") {
      form.setValue("commandArgs", "");
      setCommandArgsError(null);
      setShowEnvironmentVars(false);
      setEnvironmentVars([]);
    } else {
      form.setValue("url", "");
      setUrlError(null);
      setShowUrlParams(false);
      setUrlParams([]);
    }
  }, [serverType, form]);
  
  const validateRequiredFields = () => {
    let isValid = true;
    
    if (serverType === "HTTP_SSE") {
      const url = form.getValues("url");
      if (!url || url.trim() === "") {
        setUrlError("URL is required for HTTP_SSE server types");
        isValid = false;
      } else {
        setUrlError(null);
      }
    } else {
      const commandArgs = form.getValues("commandArgs");
      if (!commandArgs || commandArgs.trim() === "") {
        setCommandArgsError("Command Arguments are required for STDIO server types");
        isValid = false;
      } else {
        setCommandArgsError(null);
      }
    }
    
    return isValid;
  };
  
  const handleEnvironmentVarChange = (index: number, field: 'key' | 'value', value: string) => {
    const newVars = [...environmentVars];
    newVars[index][field] = value;
    setEnvironmentVars(newVars);
    
    // Check for duplicate keys
    if (field === 'key') {
      const keyCount = newVars.filter(item => item.key === value && item.key !== "").length;
      setEnvKeyError(keyCount > 1 ? "Duplicate key names are not allowed" : null);
    }
    
    // Update the form value
    const envObject: Record<string, string> = {};
    newVars.forEach(item => {
      if (item.key.trim()) { // Only add if key is not empty
        envObject[item.key] = item.value;
      }
    });
    form.setValue("environment", envObject);
  };
  
  const handleUrlParamChange = (index: number, field: 'key' | 'value', value: string) => {
    const newParams = [...urlParams];
    newParams[index][field] = value;
    setUrlParams(newParams);
    
    // Check for duplicate keys
    if (field === 'key') {
      const keyCount = newParams.filter(item => item.key === value && item.key !== "").length;
      setHeaderKeyError(keyCount > 1 ? "Duplicate key names are not allowed" : null);
    }
    
    // Update the form value
    const headerObject: Record<string, string> = {};
    newParams.forEach(item => {
      if (item.key.trim()) { // Only add if key is not empty
        headerObject[item.key] = item.value;
      }
    });
    form.setValue("headers", headerObject);
  };
  
  const addEnvironmentVar = () => {
    setEnvironmentVars([...environmentVars, { key: "", value: "" }]);
  };
  
  const addUrlParam = () => {
    setUrlParams([...urlParams, { key: "", value: "" }]);
  };
  
  const removeEnvironmentVar = (index: number) => {
    const newVars = environmentVars.filter((_, i) => i !== index);
    setEnvironmentVars(newVars);
    
    // Update the form value
    const envObject: Record<string, string> = {};
    newVars.forEach(item => {
      if (item.key.trim()) {
        envObject[item.key] = item.value;
      }
    });
    form.setValue("environment", envObject);
    setEnvKeyError(null);
  };
  
  const removeUrlParam = (index: number) => {
    const newParams = urlParams.filter((_, i) => i !== index);
    setUrlParams(newParams);
    
    // Update the form value
    const headerObject: Record<string, string> = {};
    newParams.forEach(item => {
      if (item.key.trim()) {
        headerObject[item.key] = item.value;
      }
    });
    form.setValue("headers", headerObject);
    setHeaderKeyError(null);
  };
  
  const onSubmit = (data: ServerFormValues) => {
    // Validate required fields based on server type
    if (!validateRequiredFields()) {
      // Don't proceed if validation fails
      return;
    }
    
    onCreateServer(data);
  };
  
  const handleDiscoveryNavigation = () => {
    onOpenChange(false);
    onNavigateToDiscovery();
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Add New Server</DialogTitle>
          <DialogDescription>
            Choose how you want to add a new server
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as "local" | "discovery")}>
          <TabsList className="grid grid-cols-2 w-full mb-4">
            <TabsTrigger value="local">Create Local Server</TabsTrigger>
            <TabsTrigger value="discovery">Find in Discovery</TabsTrigger>
          </TabsList>
          
          <TabsContent value="local" className="space-y-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Server Name <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="My Custom Server" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Server Type <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select server type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="HTTP_SSE">HTTP SSE</SelectItem>
                          <SelectItem value="STDIO">STDIO</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {serverType === "HTTP_SSE" && (
                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          URL <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter server URL (e.g., http://localhost:3000/stream)"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              if (e.target.value.trim() !== "") {
                                setUrlError(null);
                              }
                            }} 
                          />
                        </FormControl>
                        {urlError && (
                          <p className="text-sm font-medium text-destructive">{urlError}</p>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                {serverType === "STDIO" && (
                  <FormField
                    control={form.control}
                    name="commandArgs"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Command Arguments <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter command line arguments (e.g., --port 3000 --verbose)"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              if (e.target.value.trim() !== "") {
                                setCommandArgsError(null);
                              }
                            }}
                          />
                        </FormControl>
                        {commandArgsError && (
                          <p className="text-sm font-medium text-destructive">{commandArgsError}</p>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                {serverType === "STDIO" && (
                  <div className="space-y-2 mt-6">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setShowEnvironmentVars(!showEnvironmentVars)}
                    >
                      <Variable className="mr-2 h-4 w-4" />
                      Configure Environment Variables
                    </Button>
                    
                    {showEnvironmentVars && (
                      <div className="space-y-4 p-4 border rounded-md bg-secondary/10">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">Environment Variables</div>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm" 
                            onClick={addEnvironmentVar}
                          >
                            <Plus className="h-4 w-4 mr-1" /> Add
                          </Button>
                        </div>
                        
                        {envKeyError && (
                          <p className="text-sm font-medium text-destructive">{envKeyError}</p>
                        )}
                        
                        {environmentVars.length === 0 ? (
                          <p className="text-sm text-muted-foreground">No environment variables defined</p>
                        ) : (
                          <div className="space-y-2">
                            {environmentVars.map((env, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <Input
                                  placeholder="Key"
                                  value={env.key}
                                  onChange={(e) => handleEnvironmentVarChange(index, 'key', e.target.value)}
                                  className="flex-1"
                                />
                                <Input
                                  placeholder="Value"
                                  value={env.value}
                                  onChange={(e) => handleEnvironmentVarChange(index, 'value', e.target.value)}
                                  className="flex-1"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive h-9 w-9 p-0"
                                  onClick={() => removeEnvironmentVar(index)}
                                >
                                  <span className="sr-only">Remove</span>
                                  ✕
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
                
                {serverType === "HTTP_SSE" && (
                  <div className="space-y-2 mt-6">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setShowUrlParams(!showUrlParams)}
                    >
                      <LinkIcon className="mr-2 h-4 w-4" />
                      Configure URL Parameters
                    </Button>
                    
                    {showUrlParams && (
                      <div className="space-y-4 p-4 border rounded-md bg-secondary/10">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">Header Parameters</div>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm" 
                            onClick={addUrlParam}
                          >
                            <Plus className="h-4 w-4 mr-1" /> Add
                          </Button>
                        </div>
                        
                        {headerKeyError && (
                          <p className="text-sm font-medium text-destructive">{headerKeyError}</p>
                        )}
                        
                        {urlParams.length === 0 ? (
                          <p className="text-sm text-muted-foreground">No header parameters defined</p>
                        ) : (
                          <div className="space-y-2">
                            {urlParams.map((param, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <Input
                                  placeholder="Key"
                                  value={param.key}
                                  onChange={(e) => handleUrlParamChange(index, 'key', e.target.value)}
                                  className="flex-1"
                                />
                                <Input
                                  placeholder="Value"
                                  value={param.value}
                                  onChange={(e) => handleUrlParamChange(index, 'value', e.target.value)}
                                  className="flex-1"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive h-9 w-9 p-0"
                                  onClick={() => removeUrlParam(index)}
                                >
                                  <span className="sr-only">Remove</span>
                                  ✕
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Description <span className="text-muted-foreground text-sm">(optional)</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your server's purpose and functionality"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button 
                    type="submit"
                    disabled={!!envKeyError || !!headerKeyError}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Server
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="discovery" className="space-y-6">
            <div className="grid gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center gap-4 text-center">
                    <Download className="h-12 w-12 text-muted-foreground" />
                    <div>
                      <h3 className="text-lg font-semibold">Find in Discovery</h3>
                      <CardDescription>
                        Find and install pre-built servers from our official catalog
                      </CardDescription>
                    </div>
                    <Button className="mt-2" onClick={handleDiscoveryNavigation}>
                      Go to Discovery
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
