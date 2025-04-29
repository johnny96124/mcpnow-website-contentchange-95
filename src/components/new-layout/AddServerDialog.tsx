
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { ServerDefinition, serverDefinitions, ServerInstance } from "@/data/mockData";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Info, Plus, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const serverSchema = z.object({
  name: z.string().min(1, { message: "Server name is required" }),
  definitionId: z.string().min(1, { message: "Server definition is required" }),
  type: z.enum(["HTTP_SSE", "STDIO"]),
  url: z.string().optional(),
  commandArgs: z.string().optional(),
  connectionDetails: z.string().optional(),
  description: z.string().optional(),
  environment: z.record(z.string(), z.string()).optional(),
  headers: z.record(z.string(), z.string()).optional(),
});

type ServerFormValues = z.infer<typeof serverSchema>;

interface AddServerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddServer: (server: ServerInstance) => void;
}

export function AddServerDialog({
  open,
  onOpenChange,
  onAddServer,
}: AddServerDialogProps) {
  const [selectedDefinition, setSelectedDefinition] = useState<ServerDefinition | null>(null);
  const [environmentVars, setEnvironmentVars] = useState<{ key: string; value: string }[]>([]);
  const [urlParams, setUrlParams] = useState<{ key: string; value: string }[]>([]);
  const [envKeyError, setEnvKeyError] = useState<string | null>(null);
  const [headerKeyError, setHeaderKeyError] = useState<string | null>(null);
  
  const form = useForm<ServerFormValues>({
    resolver: zodResolver(serverSchema),
    defaultValues: {
      name: "",
      definitionId: "",
      type: undefined,
      url: "",
      commandArgs: "",
      connectionDetails: "",
      description: "",
      environment: {},
      headers: {},
    },
  });

  const serverType = form.watch("type");
  
  const handleSubmit = (values: ServerFormValues) => {
    const newServer: ServerInstance = {
      id: `server-${Date.now()}`,
      name: values.name,
      definitionId: values.definitionId || `custom-${Date.now()}`,
      status: "stopped",
      connectionDetails: values.connectionDetails || 
        (values.type === "HTTP_SSE" ? values.url : values.commandArgs) || 
        "http://localhost:8008/mcp",
      enabled: true,
      isCustom: true,
    };

    onAddServer(newServer);
    form.reset();
    onOpenChange(false);
  };

  const handleDefinitionChange = (definitionId: string) => {
    form.setValue("definitionId", definitionId);
    const definition = serverDefinitions.find(d => d.id === definitionId);
    setSelectedDefinition(definition || null);
    
    // Auto-populate connection details if available
    if (definition && definition.url) {
      form.setValue("connectionDetails", definition.url);
    }
  };

  const handleEnvironmentVarChange = (index: number, field: 'key' | 'value', value: string) => {
    const newVars = [...environmentVars];
    newVars[index][field] = value;
    setEnvironmentVars(newVars);
    
    if (field === 'key') {
      const keyCount = newVars.filter(item => item.key === value && item.key !== "").length;
      setEnvKeyError(keyCount > 1 ? "Duplicate key names are not allowed" : null);
    }
    
    const envObject: Record<string, string> = {};
    newVars.forEach(item => {
      if (item.key.trim()) {
        envObject[item.key] = item.value;
      }
    });
    form.setValue("environment", envObject);
  };
  
  const handleUrlParamChange = (index: number, field: 'key' | 'value', value: string) => {
    const newParams = [...urlParams];
    newParams[index][field] = value;
    setUrlParams(newParams);
    
    if (field === 'key') {
      const keyCount = newParams.filter(item => item.key === value && item.key !== "").length;
      setHeaderKeyError(keyCount > 1 ? "Duplicate key names are not allowed" : null);
    }
    
    const headerObject: Record<string, string> = {};
    newParams.forEach(item => {
      if (item.key.trim()) {
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
    
    const headerObject: Record<string, string> = {};
    newParams.forEach(item => {
      if (item.key.trim()) {
        headerObject[item.key] = item.value;
      }
    });
    form.setValue("headers", headerObject);
    setHeaderKeyError(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] overflow-y-auto max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>Add Custom Server</DialogTitle>
          <DialogDescription>
            Define a custom server to add to your profile
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                  <Select onValueChange={(value) => {
                    field.onChange(value);
                    // Reset form fields when type changes
                    if (value === "HTTP_SSE") {
                      form.setValue("commandArgs", "");
                      setEnvironmentVars([]);
                    } else {
                      form.setValue("url", "");
                      setUrlParams([]);
                    }
                  }} value={field.value}>
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
                      /> 
                    </FormControl>
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
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            {serverType === "STDIO" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <FormLabel className="flex items-center gap-1.5">
                    Environment Variables
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">Environment variables to be passed to the server process</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={addEnvironmentVar}
                    className="gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    Add Variable
                  </Button>
                </div>
                
                {envKeyError && (
                  <p className="text-sm font-medium text-destructive">{envKeyError}</p>
                )}
                
                {environmentVars.length === 0 ? (
                  <div className="border rounded-md p-4 text-center text-muted-foreground text-sm">
                    No environment variables defined. Click 'Add Variable' to add one.
                  </div>
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
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {serverType === "HTTP_SSE" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <FormLabel className="flex items-center gap-1.5">
                    HTTP Headers
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">HTTP headers to be sent with requests to the server</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormLabel>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={addUrlParam}
                    className="gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    Add Header
                  </Button>
                </div>
                
                {headerKeyError && (
                  <p className="text-sm font-medium text-destructive">{headerKeyError}</p>
                )}
                
                {urlParams.length === 0 ? (
                  <div className="border rounded-md p-4 text-center text-muted-foreground text-sm">
                    No HTTP headers defined. Click 'Add Header' to add one.
                  </div>
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
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            <DialogFooter className="flex justify-between pt-4">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={!!envKeyError || !!headerKeyError}
              >
                Add Server
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
