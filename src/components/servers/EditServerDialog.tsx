
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ServerDefinition } from "@/data/mockData";
import { Plus, X } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface EditServerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateServer: (data: EditServerFormValues) => void;
  serverDefinition: ServerDefinition | null;
}

const editServerFormSchema = z.object({
  url: z.string().optional(),
  commandArgs: z.string().optional(),
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
  
  const isHttpSse = serverDefinition?.type === "HTTP_SSE";
  
  const form = useForm<EditServerFormValues>({
    resolver: zodResolver(editServerFormSchema),
    defaultValues: {
      url: "",
      commandArgs: "",
      environment: {},
      headers: {}
    },
  });
  
  // Reset form when server definition changes
  useEffect(() => {
    if (!serverDefinition) return;
    
    if (isHttpSse) {
      form.setValue("url", serverDefinition.url || "");
      setHttpHeaders(Object.entries(serverDefinition.headers || {}).map(([key, value]) => ({ key, value: value.toString() })));
    } else {
      form.setValue("commandArgs", serverDefinition.commandArgs || "");
      setEnvVars(Object.entries(serverDefinition.environment || {}).map(([key, value]) => ({ key, value: value.toString() })));
    }
  }, [serverDefinition, form, isHttpSse]);
  
  const handleAddEnvVar = () => {
    setEnvVars([...envVars, { key: "", value: "" }]);
  };
  
  const handleAddHeader = () => {
    setHttpHeaders([...httpHeaders, { key: "", value: "" }]);
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
  };
  
  const handleRemoveEnvVar = (index: number) => {
    const newEnvVars = [...envVars];
    newEnvVars.splice(index, 1);
    setEnvVars(newEnvVars);
    setEnvKeyError(null);
  };
  
  const handleRemoveHeader = (index: number) => {
    const newHeaders = [...httpHeaders];
    newHeaders.splice(index, 1);
    setHttpHeaders(newHeaders);
    setHeaderKeyError(null);
  };
  
  const onSubmit = (formData: EditServerFormValues) => {
    // Convert arrays to record objects
    const environment = envVars.reduce((acc, { key, value }) => {
      if (key.trim()) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, string>);
    
    const headers = httpHeaders.reduce((acc, { key, value }) => {
      if (key.trim()) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, string>);
    
    onUpdateServer({
      ...formData,
      environment,
      headers
    });
  };
  
  if (!serverDefinition) return null;
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Server: {serverDefinition.name}</SheetTitle>
          <SheetDescription>
            Modify the server configuration parameters
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {isHttpSse ? (
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter server URL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="commandArgs"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Command Arguments</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter command line arguments" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              {!isHttpSse && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-base">Environment Variables</FormLabel>
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
                      {envVars.map((envVar, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            value={envVar.key}
                            onChange={(e) => handleEnvChange(index, 'key', e.target.value)}
                            placeholder="Key"
                            className="flex-1"
                          />
                          <Input
                            value={envVar.value}
                            onChange={(e) => handleEnvChange(index, 'value', e.target.value)}
                            placeholder="Value"
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
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
              
              {isHttpSse && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-base">HTTP Headers</FormLabel>
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
                    <p className="text-sm text-muted-foreground">No HTTP headers defined</p>
                  ) : (
                    <div className="space-y-2">
                      {httpHeaders.map((header, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            value={header.key}
                            onChange={(e) => handleHeaderChange(index, 'key', e.target.value)}
                            placeholder="Key"
                            className="flex-1"
                          />
                          <Input
                            value={header.value}
                            onChange={(e) => handleHeaderChange(index, 'value', e.target.value)}
                            placeholder="Value"
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
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
              
              <div className="flex justify-end pt-4">
                <Button 
                  type="submit" 
                  disabled={!!envKeyError || !!headerKeyError}
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
