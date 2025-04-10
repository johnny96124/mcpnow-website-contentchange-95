
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ServerDefinition } from "@/data/mockData";
import { Plus, X, Variable, Link as LinkIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EditServerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateServer: (data: EditServerFormValues) => void;
  serverDefinition: ServerDefinition | null;
}

const editServerFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters long" }),
  url: z.string().optional(),
  commandArgs: z.string().optional(),
  description: z.string().max(100, { 
    message: "Description must not exceed 100 characters" 
  }).optional(),
  environment: z.record(z.string()),
  headers: z.record(z.string()),
});

export type EditServerFormValues = z.infer<typeof editServerFormSchema>;

export function EditServerDialog({
  open,
  onOpenChange,
  onUpdateServer,
  serverDefinition
}: EditServerDialogProps) {
  const [envVars, setEnvVars] = useState<{ key: string, value: string }[]>([]);
  const [httpHeaders, setHttpHeaders] = useState<{ key: string, value: string }[]>([]);
  const [envKeyError, setEnvKeyError] = useState<string | null>(null);
  const [headerKeyError, setHeaderKeyError] = useState<string | null>(null);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [commandArgsError, setCommandArgsError] = useState<string | null>(null);
  const [showEnvironmentVars, setShowEnvironmentVars] = useState(false);
  const [showUrlParams, setShowUrlParams] = useState(false);
  const { toast } = useToast();
  
  const isHttpSse = serverDefinition?.type === "HTTP_SSE";
  const isCustomServer = serverDefinition ? !serverDefinition.isOfficial : false;
  
  const form = useForm<EditServerFormValues>({
    resolver: zodResolver(editServerFormSchema),
    defaultValues: {
      name: "",
      url: "",
      commandArgs: "",
      description: "",
      environment: {},
      headers: {}
    },
  });
  
  // Reset form when server definition changes
  useEffect(() => {
    if (!serverDefinition) return;
    
    form.setValue("name", serverDefinition.name || "");
    form.setValue("description", serverDefinition.description || "");
    
    if (isHttpSse) {
      form.setValue("url", serverDefinition.url || "");
      setHttpHeaders(Object.entries(serverDefinition.headers || {}).map(([key, value]) => ({ key, value: value.toString() })));
      setShowUrlParams(Object.keys(serverDefinition.headers || {}).length > 0);
    } else {
      form.setValue("commandArgs", serverDefinition.commandArgs || "");
      setEnvVars(Object.entries(serverDefinition.environment || {}).map(([key, value]) => ({ key, value: value.toString() })));
      setShowEnvironmentVars(Object.keys(serverDefinition.environment || {}).length > 0);
    }
  }, [serverDefinition, form, isHttpSse]);
  
  const handleAddEnvVar = () => {
    setEnvVars([...envVars, { key: "", value: "" }]);
    if (!showEnvironmentVars) setShowEnvironmentVars(true);
  };
  
  const handleAddHeader = () => {
    setHttpHeaders([...httpHeaders, { key: "", value: "" }]);
    if (!showUrlParams) setShowUrlParams(true);
  };
  
  const handleEnvChange = (index: number, field: 'key' | 'value', value: string) => {
    const newEnvVars = [...envVars];
    newEnvVars[index][field] = value;
    setEnvVars(newEnvVars);
    
    // Check for duplicate keys
    if (field === 'key') {
      const keyCount = newEnvVars.filter(item => item.key === value && item.key !== "").length;
      setEnvKeyError(keyCount > 1 ? "Duplicate key names are not allowed" : null);
    }
    
    // Update the form value
    const envObject: Record<string, string> = {};
    newEnvVars.forEach(item => {
      if (item.key.trim()) { // Only add if key is not empty
        envObject[item.key] = item.value;
      }
    });
    form.setValue("environment", envObject);
  };
  
  const handleHeaderChange = (index: number, field: 'key' | 'value', value: string) => {
    const newHeaders = [...httpHeaders];
    newHeaders[index][field] = value;
    setHttpHeaders(newHeaders);
    
    // Check for duplicate keys
    if (field === 'key') {
      const keyCount = newHeaders.filter(item => item.key === value && item.key !== "").length;
      setHeaderKeyError(keyCount > 1 ? "Duplicate key names are not allowed" : null);
    }
    
    // Update the form value
    const headerObject: Record<string, string> = {};
    newHeaders.forEach(item => {
      if (item.key.trim()) { // Only add if key is not empty
        headerObject[item.key] = item.value;
      }
    });
    form.setValue("headers", headerObject);
  };
  
  const handleRemoveEnvVar = (index: number) => {
    const newEnvVars = [...envVars];
    newEnvVars.splice(index, 1);
    setEnvVars(newEnvVars);
    
    // Update the form value
    const envObject: Record<string, string> = {};
    newEnvVars.forEach(item => {
      if (item.key.trim()) {
        envObject[item.key] = item.value;
      }
    });
    form.setValue("environment", envObject);
    setEnvKeyError(null);
  };
  
  const handleRemoveHeader = (index: number) => {
    const newHeaders = [...httpHeaders];
    newHeaders.splice(index, 1);
    setHttpHeaders(newHeaders);
    
    // Update the form value
    const headerObject: Record<string, string> = {};
    newHeaders.forEach(item => {
      if (item.key.trim()) {
        headerObject[item.key] = item.value;
      }
    });
    form.setValue("headers", headerObject);
    setHeaderKeyError(null);
  };
  
  const validateRequiredFields = () => {
    let isValid = true;
    
    if (isHttpSse) {
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
  
  const onSubmit = (formData: EditServerFormValues) => {
    // Validate required fields based on server type
    if (!validateRequiredFields()) {
      // Don't proceed if validation fails
      return;
    }

    onUpdateServer(formData);
  };
  
  if (!serverDefinition) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md overflow-y-auto max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>Edit Server: {serverDefinition.name}</DialogTitle>
          <DialogDescription>
            Modify the server configuration parameters
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      Server Name
                      <span className="text-destructive ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter server name" 
                        {...field}
                        disabled={!isCustomServer}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex items-center space-x-2">
                <div className="font-medium text-sm">Server Type:</div>
                <div className="text-sm">{serverDefinition.type}</div>
              </div>
              
              {isHttpSse && (
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        URL
                        <span className="text-destructive ml-1">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter server URL" 
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
              
              {!isHttpSse && (
                <FormField
                  control={form.control}
                  name="commandArgs"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        Command Arguments
                        <span className="text-destructive ml-1">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter command line arguments" 
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
              
              {!isHttpSse && (
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
                          onClick={handleAddEnvVar}
                        >
                          <Plus className="h-4 w-4 mr-1" /> Add
                        </Button>
                      </div>
                      
                      {envKeyError && (
                        <p className="text-sm font-medium text-destructive">{envKeyError}</p>
                      )}
                      
                      {envVars.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No environment variables defined</p>
                      ) : (
                        <div className="space-y-2">
                          {envVars.map((env, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Input
                                placeholder="Key"
                                value={env.key}
                                onChange={(e) => handleEnvChange(index, 'key', e.target.value)}
                                className="flex-1"
                              />
                              <Input
                                placeholder="Value"
                                value={env.value}
                                onChange={(e) => handleEnvChange(index, 'value', e.target.value)}
                                className="flex-1"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="text-destructive h-9 w-9 p-0"
                                onClick={() => handleRemoveEnvVar(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              {isHttpSse && (
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
                          onClick={handleAddHeader}
                        >
                          <Plus className="h-4 w-4 mr-1" /> Add
                        </Button>
                      </div>
                      
                      {headerKeyError && (
                        <p className="text-sm font-medium text-destructive">{headerKeyError}</p>
                      )}
                      
                      {httpHeaders.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No header parameters defined</p>
                      ) : (
                        <div className="space-y-2">
                          {httpHeaders.map((header, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Input
                                placeholder="Key"
                                value={header.key}
                                onChange={(e) => handleHeaderChange(index, 'key', e.target.value)}
                                className="flex-1"
                              />
                              <Input
                                placeholder="Value"
                                value={header.value}
                                onChange={(e) => handleHeaderChange(index, 'value', e.target.value)}
                                className="flex-1"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="text-destructive h-9 w-9 p-0"
                                onClick={() => handleRemoveHeader(index)}
                              >
                                <X className="h-4 w-4" />
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
                        disabled={!isCustomServer}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="pt-4">
                <Button 
                  type="submit"
                  disabled={!!envKeyError || !!headerKeyError}
                >
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
