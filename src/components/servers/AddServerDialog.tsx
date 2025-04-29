
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface AddServerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateServer: (serverData: any) => void;
  onNavigateToDiscovery: () => void;
}

export const AddServerDialog: React.FC<AddServerDialogProps> = ({
  open,
  onOpenChange,
  onCreateServer,
}) => {
  const [serverType, setServerType] = useState<"HTTP_SSE" | "STDIO" | "WS" | "">("");
  const [serverName, setServerName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [commandArgs, setCommandArgs] = useState("");

  const resetForm = () => {
    setServerType("");
    setServerName("");
    setDescription("");
    setUrl("");
    setCommandArgs("");
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!serverName || !serverType) return;

    const serverData = {
      name: serverName,
      type: serverType,
      description: description,
      url: serverType === "HTTP_SSE" ? url : undefined,
      commandArgs: serverType === "STDIO" ? commandArgs : undefined
    };

    onCreateServer(serverData);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) handleClose();
    }}>
      <DialogContent className="sm:max-w-[550px] overflow-y-auto max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>Add Custom Server</DialogTitle>
          <DialogDescription>
            Create a custom server with your own configuration
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="server-name">Server Name <span className="text-destructive">*</span></Label>
              <Input 
                id="server-name"
                placeholder="Enter server name"
                value={serverName}
                onChange={(e) => setServerName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="server-type">Server Type <span className="text-destructive">*</span></Label>
              <Select
                value={serverType}
                onValueChange={(value) => setServerType(value as "HTTP_SSE" | "STDIO" | "WS")}
              >
                <SelectTrigger id="server-type">
                  <SelectValue placeholder="Select server type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HTTP_SSE">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">HTTP SSE</Badge>
                      <span className="text-xs text-muted-foreground">HTTP with Server-Sent Events</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="STDIO">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-purple-100 text-purple-800 border-purple-200">STDIO</Badge>
                      <span className="text-xs text-muted-foreground">Standard I/O</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="WS">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-800 border-green-200">WebSocket</Badge>
                      <span className="text-xs text-muted-foreground">WebSocket Connection</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {serverType === "HTTP_SSE" && (
              <div className="space-y-2">
                <Label htmlFor="url">URL <span className="text-destructive">*</span></Label>
                <Input
                  id="url"
                  placeholder="http://localhost:8080"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required={serverType === "HTTP_SSE"}
                />
                <p className="text-sm text-muted-foreground">
                  HTTP endpoint for the server
                </p>
              </div>
            )}

            {serverType === "STDIO" && (
              <div className="space-y-2">
                <Label htmlFor="command-args">Command Arguments <span className="text-destructive">*</span></Label>
                <Input
                  id="command-args"
                  placeholder="python3 server.py --arg1=value"
                  value={commandArgs}
                  onChange={(e) => setCommandArgs(e.target.value)}
                  required={serverType === "STDIO"}
                />
                <p className="text-sm text-muted-foreground">
                  Command line to start the server
                </p>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter server description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="resize-none"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!serverName || !serverType || (serverType === "HTTP_SSE" && !url) || (serverType === "STDIO" && !commandArgs)}>
              Add Server
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
