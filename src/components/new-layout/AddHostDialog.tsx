
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
import { Host } from "@/data/mockData";

const hostSchema = z.object({
  name: z.string().min(1, { message: "Host name is required" }),
  icon: z.string().optional(),
});

type HostFormValues = z.infer<typeof hostSchema>;

interface AddHostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddHost: (host: Host) => void;
}

export function AddHostDialog({
  open,
  onOpenChange,
  onAddHost,
}: AddHostDialogProps) {
  const [selectedIcon, setSelectedIcon] = useState<string>("💻");
  
  const form = useForm<HostFormValues>({
    resolver: zodResolver(hostSchema),
    defaultValues: {
      name: "",
      icon: "💻",
    },
  });

  const handleSubmit = (values: HostFormValues) => {
    const newHost: Host = {
      id: `host-${Date.now()}`,
      name: values.name,
      type: 'external',
      icon: selectedIcon,
      connectionStatus: "disconnected",
      configStatus: "unknown",
    };

    onAddHost(newHost);
    form.reset();
    setSelectedIcon("💻");
    onOpenChange(false);
  };

  const iconOptions = [
    { label: "Computer", value: "💻" },
    { label: "Server", value: "🖥️" },
    { label: "Cloud", value: "☁️" },
    { label: "Network", value: "🌐" },
    { label: "External", value: "🔌" },
    { label: "Database", value: "🗄️" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Host</DialogTitle>
          <DialogDescription>
            Add a new host to connect servers to
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Host Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter host name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Host Icon</FormLabel>
                  <FormControl>
                    <Select 
                      value={selectedIcon}
                      onValueChange={(value) => {
                        setSelectedIcon(value);
                        field.onChange(value);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an icon">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{selectedIcon}</span>
                            <span>{iconOptions.find(i => i.value === selectedIcon)?.label}</span>
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {iconOptions.map(icon => (
                          <SelectItem key={icon.value} value={icon.value}>
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{icon.value}</span>
                              <span>{icon.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
                Cancel
              </Button>
              <Button type="submit">Add Host</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
