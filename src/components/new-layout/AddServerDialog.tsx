
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

const serverSchema = z.object({
  name: z.string().min(1, { message: "Server name is required" }),
  definitionId: z.string().min(1, { message: "Server definition is required" }),
  connectionDetails: z.string().optional(),
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
  
  const form = useForm<ServerFormValues>({
    resolver: zodResolver(serverSchema),
    defaultValues: {
      name: "",
      definitionId: "",
      connectionDetails: "",
    },
  });

  const handleSubmit = (values: ServerFormValues) => {
    const newServer: ServerInstance = {
      id: `server-${Date.now()}`,
      name: values.name,
      definitionId: values.definitionId,
      status: "stopped",
      connectionDetails: values.connectionDetails || "http://localhost:8008/mcp",
      enabled: true,
      isCustom: true, // Mark the server as custom
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] overflow-y-auto max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>Add Custom Server</DialogTitle>
          <DialogDescription>
            Create a custom server with your own configuration
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Server Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter server name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="definitionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Server Type</FormLabel>
                  <FormControl>
                    <Select 
                      value={field.value} 
                      onValueChange={(value) => handleDefinitionChange(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a server type" />
                      </SelectTrigger>
                      <SelectContent>
                        {serverDefinitions.map(definition => (
                          <SelectItem key={definition.id} value={definition.id}>
                            <div className="flex items-center gap-2">
                              {definition.icon && (
                                <span>{definition.icon}</span>
                              )}
                              <span>{definition.name}</span>
                              <span className="text-muted-foreground text-xs">v{definition.version}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  {selectedDefinition && (
                    <div className="mt-2 text-sm">
                      <p className="text-muted-foreground">{selectedDefinition.description}</p>
                      {selectedDefinition.categories && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {selectedDefinition.categories.map(category => (
                            <Badge key={category} variant="secondary" className="text-xs">
                              {category}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="connectionDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Connection Details</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Enter connection URL or details"
                      rows={2}
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
