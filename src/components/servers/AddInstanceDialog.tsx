import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ServerDefinition, ServerInstance } from "@/data/mockData";

export interface InstanceFormValues {
  instanceId?: string; // For edit mode
  name: string;
  url?: string;
  args?: string;
  env?: Record<string, string>;
}

export interface AddInstanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serverDefinition: ServerDefinition | null;
  selectedInstance?: ServerInstance | null;
  onCreateInstance: (data: InstanceFormValues) => void;
}

export function AddInstanceDialog({ 
  open, 
  onOpenChange, 
  serverDefinition, 
  selectedInstance,
  onCreateInstance 
}: AddInstanceDialogProps) {
  const [name, setName] = useState(selectedInstance?.name || '');
  const [url, setUrl] = useState(selectedInstance?.connectionDetails || serverDefinition?.url || '');
  const [args, setArgs] = useState(selectedInstance?.arguments?.join(' ') || serverDefinition?.commandArgs || '');
  const [env, setEnv] = useState<Record<string, string>>({});
  const [envString, setEnvString] = useState('');
  const [activeTab, setActiveTab] = useState<'general' | 'environment'>('general');

  useEffect(() => {
    if (selectedInstance?.environment) {
      setEnv(selectedInstance.environment);
      setEnvString(
        Object.entries(selectedInstance.environment)
          .map(([key, value]) => `${key}=${value}`)
          .join('\n')
      );
    } else {
      setEnv(serverDefinition?.environment || {});
      setEnvString(
        Object.entries(serverDefinition?.environment || {})
          .map(([key, value]) => `${key}=${value}`)
          .join('\n')
      );
    }
  }, [selectedInstance, serverDefinition]);

  useEffect(() => {
    try {
      const parsedEnv: Record<string, string> = {};
      envString.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
          parsedEnv[key.trim()] = value.trim();
        }
      });
      setEnv(parsedEnv);
    } catch (error) {
      console.error("Failed to parse environment variables:", error);
    }
  }, [envString]);

  const handleSubmit = () => {
    const data: InstanceFormValues = {
      instanceId: selectedInstance?.id,
      name: name,
      url: url,
      args: args,
      env: env
    };
    onCreateInstance(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{selectedInstance ? "Edit Instance" : "Create New Instance"}</DialogTitle>
          <DialogDescription>
            {selectedInstance ? "Edit the details of this instance." : "Create a new instance for the selected server."}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="general" className="mt-4" value={activeTab} onValueChange={(val) => setActiveTab(val as 'general' | 'environment')}>
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="environment">Environment</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="col-span-3" 
                />
              </div>
              
              {serverDefinition?.type === 'HTTP_SSE' && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="url" className="text-right">
                    URL
                  </Label>
                  <Input 
                    id="url" 
                    value={url} 
                    onChange={(e) => setUrl(e.target.value)} 
                    className="col-span-3" 
                  />
                </div>
              )}
              
              {serverDefinition?.type === 'STDIO' && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="args" className="text-right">
                    Arguments
                  </Label>
                  <Input
                    id="args"
                    value={args}
                    onChange={(e) => setArgs(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="environment">
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 items-center gap-4">
                <Label htmlFor="env">
                  Environment Variables
                </Label>
                <Textarea
                  id="env"
                  value={envString}
                  onChange={(e) => setEnvString(e.target.value)}
                  className="col-span-3 font-mono text-sm"
                  placeholder="DATABASE_URL=postgres://user:password@host:port/database&#x0a;API_KEY=your_api_key"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button type="button" onClick={handleSubmit}>
            {selectedInstance ? "Update Instance" : "Create Instance"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
