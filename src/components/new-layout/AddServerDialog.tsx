
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
import { Plus, X } from "lucide-react";
import { EndpointType } from "@/data/mockData";

// We're restricting the schema to only allow HTTP_SSE or STDIO connection types
const serverSchema = z.object({
  name: z.string().min(1, { message: "Server name is required" }),
  description: z.string().optional(),
  type: z.enum(["HTTP_SSE", "STDIO"]),
  connectionDetails: z.string().min(1, { message: "Connection details are required" }),
});

type ServerFormValues = z.infer<typeof serverSchema>;

interface HeaderField {
  key: string;
  value: string;
}

interface EnvVarField {
  key: string;
  value: string;
}

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
  // Restrict type to only HTTP_SSE or STDIO
  const [selectedType, setSelectedType] = useState<"HTTP_SSE" | "STDIO">("HTTP_SSE");
  const [headers, setHeaders] = useState<HeaderField[]>([]);
  const [envVars, setEnvVars] = useState<EnvVarField[]>([]);
  
  const form = useForm<ServerFormValues>({
    resolver: zodResolver(serverSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "HTTP_SSE",
      connectionDetails: "",
    },
  });

  // Updated handleTypeChange to use the restricted type
  const handleTypeChange = (type: "HTTP_SSE" | "STDIO") => {
    setSelectedType(type);
    form.setValue("type", type);
    form.setValue("connectionDetails", "");
    // Reset headers and envVars when changing type
    setHeaders([]);
    setEnvVars([]);
  };

  const handleAddHeader = () => {
    setHeaders([...headers, { key: "", value: "" }]);
  };

  const handleHeaderChange = (index: number, field: keyof HeaderField, value: string) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  const handleRemoveHeader = (index: number) => {
    // Modified to allow removing the last header
    const newHeaders = [...headers];
    newHeaders.splice(index, 1);
    setHeaders(newHeaders);
  };

  const handleAddEnvVar = () => {
    setEnvVars([...envVars, { key: "", value: "" }]);
  };

  const handleEnvVarChange = (index: number, field: keyof EnvVarField, value: string) => {
    const newEnvVars = [...envVars];
    newEnvVars[index][field] = value;
    setEnvVars(newEnvVars);
  };

  const handleRemoveEnvVar = (index: number) => {
    // Modified to allow removing the last environment variable
    const newEnvVars = [...envVars];
    newEnvVars.splice(index, 1);
    setEnvVars(newEnvVars);
  };

  const handleSubmit = (values: ServerFormValues) => {
    let headersObj: Record<string, string> | undefined;
    let environmentObj: Record<string, string> | undefined;

    if (values.type === "HTTP_SSE") {
      headersObj = headers.reduce((acc, header) => {
        if (header.key && header.value) {
          acc[header.key] = header.value;
        }
        return acc;
      }, {} as Record<string, string>);

      if (Object.keys(headersObj).length === 0) headersObj = undefined;
    }

    if (values.type === "STDIO") {
      environmentObj = envVars.reduce((acc, envVar) => {
        if (envVar.key && envVar.value) {
          acc[envVar.key] = envVar.value;
        }
        return acc;
      }, {} as Record<string, string>);

      if (Object.keys(environmentObj).length === 0) environmentObj = undefined;
    }

    const newServer: ServerInstance = {
      id: `server-${Date.now()}`,
      name: values.name,
      definitionId: `custom-${values.type.toLowerCase()}`,
      status: "stopped",
      connectionDetails: values.connectionDetails,
      environment: environmentObj,
      enabled: true,
    };

    // Add headers separately only if we're using HTTP_SSE
    if (values.type === "HTTP_SSE" && headersObj) {
      (newServer as any).headers = headersObj;
    }

    onAddServer(newServer);
    form.reset();
    setHeaders([]);
    setEnvVars([]);
    onOpenChange(false);
  };

  const resetForm = () => {
    form.reset();
    setHeaders([]);
    setEnvVars([]);
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(newOpen) => {
        if (!newOpen) resetForm();
        onOpenChange(newOpen);
      }}
    >
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Custom Server</DialogTitle>
          <DialogDescription>
            Configure a new custom server by entering the details below
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
                    <Input {...field} placeholder="Enter server name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter a brief description"
                      rows={2}
                      className="resize-none"
                    />
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
                    Connection Type <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value: "HTTP_SSE" | "STDIO") => {
                        field.onChange(value);
                        handleTypeChange(value);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select connection type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="HTTP_SSE">HTTP-SSE</SelectItem>
                        <SelectItem value="STDIO">STDIO</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {selectedType === "HTTP_SSE" ? (
              <>
                <FormField
                  control={form.control}
                  name="connectionDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        URL <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="http://localhost:8080"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <FormLabel>HTTP Headers (Optional)</FormLabel>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={handleAddHeader}
                      className="h-8"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Header
                    </Button>
                  </div>
                  
                  {headers.map((header, index) => (
                    <div key={index} className="flex gap-2 items-center">
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
                        size="sm"
                        onClick={() => handleRemoveHeader(index)}
                        className="px-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </>
            ) : selectedType === "STDIO" ? (
              <>
                <FormField
                  control={form.control}
                  name="connectionDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Command Arguments <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="command --arg1 --arg2"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <FormLabel>Environment Variables (Optional)</FormLabel>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={handleAddEnvVar}
                      className="h-8"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Variable
                    </Button>
                  </div>
                  
                  {envVars.map((envVar, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Input
                        placeholder="Key"
                        value={envVar.key}
                        onChange={(e) => handleEnvVarChange(index, 'key', e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        placeholder="Value"
                        value={envVar.value}
                        onChange={(e) => handleEnvVarChange(index, 'value', e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveEnvVar(index)}
                        className="px-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </>
            ) : null}

            <DialogFooter className="pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
                Cancel
              </Button>
              <Button type="submit">Add Server</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
