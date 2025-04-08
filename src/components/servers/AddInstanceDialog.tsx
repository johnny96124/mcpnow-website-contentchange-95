
import * as React from "react";
import { useState, useEffect } from "react";
import { Plus, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ServerDefinition } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { EndpointLabel } from "../status/EndpointLabel";
import { Alert, AlertDescription } from "@/components/ui/alert";

export interface InstanceFormValues {
  name: string;
  args?: string;
  env?: Record<string, string>;
  url?: string;
  headers?: Record<string, string>;
  instanceId?: string;
}

export interface EnvVar {
  key: string;
  value: string;
}

interface AddInstanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serverDefinition: ServerDefinition | null;
  onCreateInstance: (data: InstanceFormValues) => void;
  editMode?: boolean;
  initialValues?: InstanceFormValues;
  instanceId?: string;
  clearFormOnOpen?: boolean;
}

export function AddInstanceDialog({
  open,
  onOpenChange,
  serverDefinition,
  onCreateInstance,
  editMode = false,
  initialValues,
  instanceId,
  clearFormOnOpen = false
}: AddInstanceDialogProps) {
  const [instanceName, setInstanceName] = useState("");
  const [args, setArgs] = useState("");
  const [envVars, setEnvVars] = useState<EnvVar[]>([]);
  const [newEnvKey, setNewEnvKey] = useState("");
  const [newEnvValue, setNewEnvValue] = useState("");
  const [url, setUrl] = useState("");
  const isCustomServer = serverDefinition && !serverDefinition.isOfficial;
  
  // Reset form when dialog opens or when editing different instance
  useEffect(() => {
    if (open) {
      if (editMode && initialValues) {
        setInstanceName(initialValues.name);
        setArgs(initialValues.args || "");
        setUrl(initialValues.url || "");
        
        const envVarsArray: EnvVar[] = [];
        if (initialValues.env) {
          Object.entries(initialValues.env).forEach(([key, value]) => {
            envVarsArray.push({ key, value });
          });
        }
        setEnvVars(envVarsArray);
      } else if (clearFormOnOpen) {
        // Clear form for new instance creation
        setInstanceName("");
        setArgs("");
        setUrl("");
        setEnvVars([]);
      }
    }
  }, [open, editMode, initialValues, clearFormOnOpen]);
  
  const handleAddEnvVar = () => {
    if (newEnvKey.trim() === "") return;
    
    setEnvVars([...envVars, { key: newEnvKey, value: newEnvValue }]);
    setNewEnvKey("");
    setNewEnvValue("");
  };
  
  const handleRemoveEnvVar = (index: number) => {
    const updatedVars = [...envVars];
    updatedVars.splice(index, 1);
    setEnvVars(updatedVars);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const env: Record<string, string> = {};
    envVars.forEach(({ key, value }) => {
      env[key] = value;
    });
    
    onCreateInstance({
      name: instanceName,
      args,
      env,
      url,
      instanceId
    });
  };
  
  if (!serverDefinition) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {editMode ? "Edit Instance" : "Create New Instance"}
            <div className="flex items-center gap-1">
              <EndpointLabel type={serverDefinition.type} />
              {isCustomServer && (
                <Badge variant="outline" className="text-gray-600 border-gray-300 rounded-md">
                  Custom
                </Badge>
              )}
            </div>
          </DialogTitle>
          <DialogDescription>
            {editMode 
              ? "Edit the server instance settings." 
              : `Configure a new ${serverDefinition.name} server instance.`}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Instance Name</Label>
              <Input
                id="name"
                value={instanceName}
                placeholder="Enter instance name"
                onChange={(e) => setInstanceName(e.target.value)}
                required
              />
            </div>
            
            {serverDefinition.type === "HTTP_SSE" && (
              <div className="grid gap-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  value={url}
                  placeholder="http://localhost:8080"
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
            )}
            
            <div className="grid gap-2">
              <Label htmlFor="args">Arguments</Label>
              <Input
                id="args"
                value={args}
                placeholder="--port 8080 --verbose"
                onChange={(e) => setArgs(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Optional command-line arguments
              </p>
            </div>
            
            <div className="border-t pt-4 mt-2">
              <div className="flex justify-between items-center mb-4">
                <Label>Environment Variables</Label>
                <div className="flex gap-2 items-end">
                  <div>
                    <Label htmlFor="env-key" className="text-xs">Key</Label>
                    <Input
                      id="env-key"
                      value={newEnvKey}
                      placeholder="KEY"
                      onChange={(e) => setNewEnvKey(e.target.value)}
                      className="h-8 w-[140px]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="env-value" className="text-xs">Value</Label>
                    <Input
                      id="env-value"
                      value={newEnvValue}
                      placeholder="value"
                      onChange={(e) => setNewEnvValue(e.target.value)}
                      className="h-8 w-[140px]"
                    />
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="h-8 px-2"
                    onClick={handleAddEnvVar}
                    disabled={!newEnvKey.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {envVars.length === 0 ? (
                <div className="text-center py-4 text-sm text-muted-foreground border border-dashed rounded-md">
                  No environment variables configured
                </div>
              ) : (
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                  {envVars.map((env, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-secondary/30 rounded-md">
                      <div className="flex gap-2 items-center overflow-hidden">
                        <Badge variant="outline" className="bg-background shrink-0">
                          {env.key}
                        </Badge>
                        <span className="text-sm truncate">{env.value}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemoveEnvVar(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!instanceName}>
              {editMode ? "Save Changes" : "Create Instance"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
