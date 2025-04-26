import { useState, useEffect } from "react";
import { ServerInstance, serverDefinitions } from "@/data/mockData";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Check, Info, Settings2, Trash2, X } from "lucide-react";
import { EndpointLabel } from "@/components/status/EndpointLabel";

interface ServerDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  server: ServerInstance | null;
  onDelete: (id: string) => void;
}

export function ServerDetails({
  open,
  onOpenChange,
  server,
  onDelete
}: ServerDetailsProps) {
  const [activeTab, setActiveTab] = useState("general");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showResourceDetails, setShowResourceDetails] = useState(false);
  const [envVars, setEnvVars] = useState<{[key: string]: string}>({});
  const [newEnvKey, setNewEnvKey] = useState("");
  const [newEnvValue, setNewEnvValue] = useState("");
  
  // Initialize environment variables when server changes
  useEffect(() => {
    if (server?.environment) {
      setEnvVars(server.environment);
    }
  }, [server]);
  
  const definition = server && serverDefinitions.find(def => def.id === server.definitionId);
  
  const handleDelete = () => {
    if (confirmDelete && server) {
      onDelete(server.id);
      onOpenChange(false);
      setConfirmDelete(false);
    } else {
      setConfirmDelete(true);
    }
  };

  const handleAddEnvVar = () => {
    if (!newEnvKey.trim()) return;
    
    setEnvVars(prev => ({
      ...prev,
      [newEnvKey]: newEnvValue
    }));
    setNewEnvKey("");
    setNewEnvValue("");
  };

  const handleDeleteEnvVar = (key: string) => {
    setEnvVars(prev => {
      const newVars = { ...prev };
      delete newVars[key];
      return newVars;
    });
  };
  
  if (!server) {
    return (
      <Dialog open={open} onOpenChange={(isOpen) => {
        if (!isOpen) setConfirmDelete(false);
        onOpenChange(isOpen);
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Server Details</DialogTitle>
            <DialogDescription>
              No server selected
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
  
  return (
    <>
      <Dialog open={open} onOpenChange={(isOpen) => {
        if (!isOpen) setConfirmDelete(false);
        onOpenChange(isOpen);
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>Server Details</span>
              <EndpointLabel type={definition?.type || "HTTP_SSE"} />
              <Badge variant="outline">{definition?.name || "Unknown"}</Badge>
            </DialogTitle>
            <DialogDescription>
              View and manage server instance settings
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="mt-2">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="environment">Environment</TabsTrigger>
              <TabsTrigger value="tools">Tools</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={server.name} readOnly />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <div className="flex items-center h-10 px-3 border rounded-md">
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      server.status === "running" ? "bg-green-500" : 
                      server.status === "error" ? "bg-red-500" : 
                      server.status === "connecting" ? "bg-yellow-500" : "bg-gray-500"
                    }`}></div>
                    <span className="capitalize">{server.status}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Connection Details</Label>
                <Input value={server.connectionDetails} readOnly />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Server Resource</Label>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowResourceDetails(true)}
                  >
                    View Details
                  </Button>
                </div>
                <div className="border rounded-md p-4 bg-muted/30">
                  <div className="flex items-start gap-4">
                    {definition?.icon && (
                      <div className="text-2xl">{definition.icon}</div>
                    )}
                    <div className="space-y-1 flex-1">
                      <h4 className="font-medium">{definition?.name || "Unknown"}</h4>
                      <p className="text-sm text-muted-foreground">
                        {definition?.description || "No description available"}
                      </p>
                      {definition?.categories && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {definition.categories.map(category => (
                            <Badge key={category} variant="secondary" className="text-xs">
                              {category}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="environment" className="pt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Environment Variables</h4>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Key"
                      value={newEnvKey}
                      onChange={(e) => setNewEnvKey(e.target.value)}
                      className="w-[150px]"
                    />
                    <Input
                      placeholder="Value"
                      value={newEnvValue}
                      onChange={(e) => setNewEnvValue(e.target.value)}
                      className="w-[150px]"
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleAddEnvVar}
                    >
                      Add
                    </Button>
                  </div>
                </div>
                
                {Object.keys(envVars).length > 0 ? (
                  <ScrollArea className="h-[250px] border rounded-md p-2">
                    <div className="space-y-2">
                      {Object.entries(envVars).map(([key, value]) => (
                        <div key={key} className="grid grid-cols-[1fr,auto,1fr,auto] items-center gap-2">
                          <div className="font-mono text-sm bg-muted p-2 rounded-md">
                            {key}
                          </div>
                          <span className="text-muted-foreground">=</span>
                          <div className="font-mono text-sm bg-muted p-2 rounded-md truncate">
                            {value}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleDeleteEnvVar(key)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="border-2 border-dashed rounded-md h-[200px] flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <Info className="h-10 w-10 mx-auto mb-2 opacity-50" />
                      <p>No environment variables set</p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="tools" className="pt-4">
              <div className="space-y-4">
                <h4 className="font-medium">Available Tools</h4>
                
                {definition?.tools && definition.tools.length > 0 ? (
                  <ScrollArea className="h-[250px] border rounded-md">
                    <div className="p-1 space-y-3">
                      {definition.tools.map(tool => (
                        <div key={tool.id} className="border rounded-md p-3">
                          <div className="flex items-center justify-between">
                            <h5 className="font-medium">{tool.name}</h5>
                            <Badge variant="outline" className="text-xs">Tool</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {tool.description}
                          </p>
                          
                          {tool.parameters && tool.parameters.length > 0 && (
                            <div className="mt-3">
                              <h6 className="text-xs font-medium text-muted-foreground mb-2">Parameters</h6>
                              <div className="space-y-1.5">
                                {tool.parameters.map(param => (
                                  <div key={param.name} className="text-xs grid grid-cols-[120px,1fr] gap-2 bg-muted/60 p-1.5 rounded-sm">
                                    <div className="font-mono">{param.name}</div>
                                    <div className="text-muted-foreground">{param.type}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="border-2 border-dashed rounded-md h-[200px] flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <Info className="h-10 w-10 mx-auto mb-2 opacity-50" />
                      <p>No tools available for this server</p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="flex justify-between">
            <Button 
              variant="outline" 
              className={confirmDelete ? "bg-red-100 text-red-600 hover:bg-red-200" : "text-destructive"}
              onClick={handleDelete}
            >
              {confirmDelete ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Confirm Delete
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </>
              )}
            </Button>
            
            <div className="flex gap-2">
              {confirmDelete && (
                <Button variant="ghost" onClick={() => setConfirmDelete(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              )}
              <Button onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showResourceDetails} onOpenChange={setShowResourceDetails}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Server Resource Details</DialogTitle>
          </DialogHeader>
          
          {definition && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={definition.name} readOnly />
              </div>
              
              <div className="space-y-2">
                <Label>Type</Label>
                <div className="flex items-center gap-2">
                  <EndpointLabel type={definition.type} />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Description</Label>
                <div className="p-3 border rounded-md bg-muted/30">
                  {definition.description}
                </div>
              </div>
              
              {definition.categories && (
                <div className="space-y-2">
                  <Label>Categories</Label>
                  <div className="flex flex-wrap gap-1">
                    {definition.categories.map(category => (
                      <Badge key={category} variant="secondary">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setShowResourceDetails(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
