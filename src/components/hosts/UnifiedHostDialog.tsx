
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { RefreshCw, Plus, Check, X, Scan, Computer } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Host } from "@/data/mockData";

const hostSchema = z.object({
  name: z.string().min(1, { message: "Host name is required" }),
  configPath: z.string().min(1, { message: "Config path is required" }),
});

type HostFormValues = z.infer<typeof hostSchema>;

type AddMode = 'scan' | 'manual';

interface UnifiedHostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddHosts: (hosts: Host[]) => void;
}

export function UnifiedHostDialog({
  open,
  onOpenChange,
  onAddHosts,
}: UnifiedHostDialogProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedHosts, setScannedHosts] = useState<Host[]>([]);
  const [selectedHosts, setSelectedHosts] = useState<Set<string>>(new Set());
  const [addMode, setAddMode] = useState<AddMode>('scan');
  const { toast } = useToast();

  const form = useForm<HostFormValues>({
    resolver: zodResolver(hostSchema),
    defaultValues: {
      name: "",
      configPath: "",
    },
  });

  useEffect(() => {
    if (open) {
      handleScan();
      setAddMode('scan');
      setSelectedHosts(new Set());
      form.reset();
    } else {
      setScannedHosts([]);
      setSelectedHosts(new Set());
      form.reset();
    }
  }, [open]);

  const handleScan = () => {
    setIsScanning(true);
    // Simulate scanning for hosts
    setTimeout(() => {
      const mockScannedHosts: Host[] = [
        {
          id: `host-${Date.now()}-1`,
          name: "Local Host",
          icon: "💻",
          configStatus: "configured",
          connectionStatus: "connected",
          configPath: "/Users/user/.mcp/hosts/localhost.json"
        },
        {
          id: `host-${Date.now()}-2`,
          name: "Network Host",
          icon: "🌐",
          configStatus: "configured",
          connectionStatus: "connected",
          configPath: "/Users/user/.mcp/hosts/network.json"
        }
      ];
      
      setScannedHosts(mockScannedHosts);
      setIsScanning(false);
    }, 2000);
  };

  const validateConfigPath = (path: string): boolean => {
    return path.endsWith('.json') && path.startsWith('/');
  };

  const handleAddManualHost = (values: HostFormValues) => {
    if (!validateConfigPath(values.configPath)) {
      toast({
        title: "Invalid Configuration Path",
        description: "Please provide a valid JSON file path starting with '/'",
        variant: "destructive",
      });
      return;
    }

    const newHost: Host = {
      id: `host-${Date.now()}-manual`,
      name: values.name,
      icon: "💻",
      configStatus: "configured",
      connectionStatus: "connected",
      configPath: values.configPath,
    };

    setScannedHosts((prev) => [...prev, newHost]);
    form.reset();
  };

  const handleConfirm = () => {
    const selectedHostsList = scannedHosts.filter((host) =>
      selectedHosts.has(host.id)
    );
    
    if (selectedHostsList.length === 0) {
      toast({
        title: "No Hosts Selected",
        description: "Please select at least one host to add",
        variant: "destructive",
      });
      return;
    }

    onAddHosts(selectedHostsList);
    onOpenChange(false);
  };

  const toggleHostSelection = (hostId: string) => {
    const newSelected = new Set(selectedHosts);
    if (newSelected.has(hostId)) {
      newSelected.delete(hostId);
    } else {
      newSelected.add(hostId);
    }
    setSelectedHosts(newSelected);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Hosts</DialogTitle>
          <DialogDescription>
            Scan for available hosts or add them manually
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <RadioGroup
            value={addMode}
            onValueChange={(value) => setAddMode(value as AddMode)}
            className="grid grid-cols-2 gap-4"
          >
            <div className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 p-4 cursor-pointer ${
              addMode === 'scan' ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'
            }`}>
              <RadioGroupItem value="scan" id="scan" className="sr-only" />
              <Scan className="h-6 w-6" />
              <label htmlFor="scan" className="font-medium cursor-pointer">
                Scan for Hosts
              </label>
            </div>
            <div className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 p-4 cursor-pointer ${
              addMode === 'manual' ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'
            }`}>
              <RadioGroupItem value="manual" id="manual" className="sr-only" />
              <Computer className="h-6 w-6" />
              <label htmlFor="manual" className="font-medium cursor-pointer">
                Add Manually
              </label>
            </div>
          </RadioGroup>

          {addMode === 'scan' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Available Hosts</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleScan}
                  disabled={isScanning}
                >
                  {isScanning ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Rescan
                    </>
                  )}
                </Button>
              </div>

              <ScrollArea className="h-[200px] rounded-md border p-2">
                {scannedHosts.length > 0 ? (
                  <div className="space-y-2">
                    {scannedHosts.map((host) => (
                      <div
                        key={host.id}
                        className="flex items-center space-x-2 p-2 hover:bg-accent rounded-md"
                      >
                        <Checkbox
                          checked={selectedHosts.has(host.id)}
                          onCheckedChange={() => toggleHostSelection(host.id)}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{host.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {host.configPath}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                    {isScanning ? "Scanning for hosts..." : "No hosts found"}
                  </div>
                )}
              </ScrollArea>
            </div>
          )}

          {addMode === 'manual' && (
            <div className="space-y-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleAddManualHost)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Host Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter host name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="configPath"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Config Path</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="/path/to/config.json"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add to List
                  </Button>
                </form>
              </Form>

              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Added Hosts</h3>
                <ScrollArea className="h-[200px] rounded-md border p-2">
                  {scannedHosts.length > 0 ? (
                    <div className="space-y-2">
                      {scannedHosts.map((host) => (
                        <div
                          key={host.id}
                          className="flex items-center space-x-2 p-2 hover:bg-accent rounded-md"
                        >
                          <Checkbox
                            checked={selectedHosts.has(host.id)}
                            onCheckedChange={() => toggleHostSelection(host.id)}
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{host.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {host.configPath}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                      No hosts added yet
                    </div>
                  )}
                </ScrollArea>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleConfirm}>
            <Check className="h-4 w-4 mr-2" />
            Confirm Selection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
