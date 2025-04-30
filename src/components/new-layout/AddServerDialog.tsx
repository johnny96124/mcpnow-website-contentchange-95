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
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface AddServerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddServer: (server: any) => void;
}

export const AddServerDialog = ({ open, onOpenChange, onAddServer }: AddServerDialogProps) => {
  const [serverData, setServerData] = useState({
    name: "",
    url: "",
    type: "HTTP_SSE"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setServerData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddServer = () => {
    const newServer = {
      id: `custom-${Date.now()}`,
      name: serverData.name,
      definitionId: "custom-server",
      status: "stopped",
      connectionDetails: serverData.url,
      enabled: false
    };
    
    onAddServer(newServer);
    setServerData({
      name: "",
      url: "",
      type: "HTTP_SSE"
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
        <DialogHeader>
          <DialogTitle>Add Custom Server</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              value={serverData.name}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="url" className="text-right">
              URL
            </Label>
            <Input
              id="url"
              name="url"
              value={serverData.url}
              onChange={handleChange}
              className="col-span-3"
              placeholder="http://localhost:8000"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddServer} disabled={!serverData.name}>
            Add Server
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
