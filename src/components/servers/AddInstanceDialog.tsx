
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { ServerDefinition } from "@/data/mockData";

export interface InstanceFormValues {
  name: string;
  url: string;
  args: string;
  description: string;
  env?: Record<string, string>;
  headers?: Record<string, string>;
  instanceId?: string;
}

interface AddInstanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serverDefinition: ServerDefinition | null;
  onCreateInstance: (data: InstanceFormValues, selectedHosts?: string[]) => void;
  initialValues?: InstanceFormValues;
  editMode?: boolean;
  instanceId?: string;
  availableHosts?: any[];
}

export const AddInstanceDialog: React.FC<AddInstanceDialogProps> = ({
  open,
  onOpenChange,
  serverDefinition,
  onCreateInstance,
  initialValues,
  editMode = false,
  instanceId,
  availableHosts
}) => {
  const [formData, setFormData] = useState<InstanceFormValues>({
    name: initialValues?.name || "",
    url: initialValues?.url || "",
    args: initialValues?.args || "",
    description: initialValues?.description || "",
    env: initialValues?.env || {},
    headers: initialValues?.headers || {},
    instanceId: instanceId
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (availableHosts && availableHosts.length > 0) {
      // If availableHosts is provided, pass an empty array as selectedHosts
      // In a real implementation, you would collect selected hosts from the UI
      onCreateInstance(formData, []);
    } else {
      onCreateInstance(formData);
    }
  };

  if (!serverDefinition) return null;

  const isStdio = serverDefinition.type === 'STDIO';
  const isCustom = serverDefinition.isOfficial === false;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {editMode ? `Edit ${serverDefinition.name}` : `Configure ${serverDefinition.name}`}
            {isCustom && <Badge variant="outline">Custom</Badge>}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Instance Name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>

          <Separator />

          {isStdio ? (
            <div className="grid gap-2">
              <Label htmlFor="args">Command Arguments</Label>
              <Textarea
                id="args"
                name="args"
                placeholder="e.g., --host localhost --port 8080"
                value={formData.args}
                onChange={handleInputChange}
              />
            </div>
          ) : (
            <div className="grid gap-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                name="url"
                placeholder="http://localhost:8080"
                type="url"
                value={formData.url}
                onChange={handleInputChange}
              />
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe this instance"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!formData.name || (!isStdio && !formData.url)}>
            {editMode ? "Update" : "Create"} Instance
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
