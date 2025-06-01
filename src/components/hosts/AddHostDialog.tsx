import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type ConnectionStatus } from "@/data/mockData";

const hostSchema = z.object({
  name: z.string().min(1, {
    message: "Host name is required"
  }),
  configPath: z.string().optional(),
  icon: z.string().optional()
});
type HostFormValues = z.infer<typeof hostSchema>;
interface AddHostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddHost: (host: {
    name: string;
    configPath?: string;
    icon?: string;
    configStatus: "configured" | "unknown";
    connectionStatus: ConnectionStatus;
    type: 'external';
  }) => void;
}
export function AddHostDialog({
  open,
  onOpenChange,
  onAddHost
}: AddHostDialogProps) {
  const form = useForm<HostFormValues>({
    resolver: zodResolver(hostSchema),
    defaultValues: {
      name: "",
      configPath: "",
      icon: "💻"
    }
  });
  const handleSubmit = (values: HostFormValues) => {
    onAddHost({
      name: values.name,
      configPath: values.configPath || undefined,
      icon: values.icon || undefined,
      configStatus: "unknown",
      connectionStatus: "unknown",
      type: 'external'
    });
    form.reset();
    onOpenChange(false);
  };
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Host Manually</DialogTitle>
          <DialogDescription>
            Add a new host connection to your MCP configuration.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({
            field
          }) => <FormItem>
                  <FormLabel>Host Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Cursor, VSCode, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>} />
            
            <FormField control={form.control} name="configPath" render={({
            field
          }) => <FormItem>
                  <FormLabel>Config Path</FormLabel>
                  <FormControl>
                    <Input placeholder="/path/to/config.json" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>} />
            
            <FormField control={form.control} name="icon" render={({
            field
          }) => <FormItem>
                  <FormLabel>Icon (Emoji)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 💻, 🖥️, ⌨️" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>} />
            
            <DialogFooter>
              <Button type="submit" className="mt-4">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Host
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>;
}
