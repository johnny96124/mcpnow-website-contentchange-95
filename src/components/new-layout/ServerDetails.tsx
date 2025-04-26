import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Check, Info, RefreshCw, Trash2, X, Plus, ExternalLink } from "lucide-react";
import { EndpointLabel } from "@/components/status/EndpointLabel";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";

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
  const [isRefreshingTools, setIsRefreshingTools] = useState(false);
  const { toast } = useToast();
  
  // Environment variables state
  const [envVars, setEnvVars] = useState<Record<string, string>>(
    server?.environment || {}
  );
  const [newEnvKey, setNewEnvKey] = useState("");
  const [newEnvValue, setNewEnvValue] = useState("");
  
  // Find the definition with null checking for server
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
    if (!newEnvKey.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Variable name cannot be empty"
      });
      return;
    }

    setEnvVars(prev => ({
      ...prev,
      [newEnvKey]: newEnvValue
    }));
    setNewEnvKey("");
    setNewEnvValue("");
  };

  const handleDeleteEnvVar = (key: string) => {
    const newEnvVars = { ...envVars };
    delete newEnvVars[key];
    setEnvVars(newEnvVars);
  };

  const handleRefreshTools = () => {
    setIsRefreshingTools(true);
    // Simulate tool refresh
    setTimeout(() => {
      setIsRefreshingTools(false);
      toast({
        title: "Tools Refreshed",
        description: "Available tools list has been updated"
      });
    }, 1000);
  };

  const handleViewResourceDetails = () => {
    toast({
      title: "View Resource Details",
      description: "Resource details view will be implemented soon"
    });
  };
  
  // If server is null, don't render the dialog content
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
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) setConfirmDelete(false);
      onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Server Details</span>
            <Badge variant="outline">{definition?.name || "Unknown"}</Badge>
            <EndpointLabel type={definition?.type || "STDIO"} />
          </DialogTitle>
          <DialogDescription>
            View and manage server instance settings
          </DialogDescription>
        </DialogHeader>
        
        <Tabs
          defaultValue="general"
          value={activeTab}
          onValueChange={setActiveTab}
          className="mt-2"
        >
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
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
                  className="text-blue-600 hover:text-blue-700"
                  onClick={handleViewResourceDetails}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </div>
              <div className="border rounded-md p-4 bg-muted/30">
                <div className="flex items-start gap-4">
                  {definition?.icon && (
                    <div className="text-2xl">{definition.icon}</div>
                  )}
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{definition?.name || "Unknown"}</h4>
                      <EndpointLabel type={definition?.type || "STDIO"} />
                    </div>
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
          
          <TabsContent value="configuration" className="pt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">Environment Variables</h4>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setNewEnvKey("");
                    setNewEnvValue("");
                    handleAddEnvVar();
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Variable
                </Button>
              </div>
              
              <Card className="p-4">
                {Object.keys(envVars).length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Info className="h-8 w-8 text-muted-foreground/50 mb-2" />
                    <p className="text-muted-foreground">
                      No environment variables defined. Click 'Add Variable' to add one.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(envVars).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-4">
                        <Input 
                          value={key} 
                          placeholder="Variable Name"
                          className="flex-1"
                          readOnly
                        />
                        <Input 
                          value={value} 
                          placeholder="Value"
                          className="flex-1"
                          readOnly
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteEnvVar(key)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="tools" className="pt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Available Tools</h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefreshTools}
                  disabled={isRefreshingTools}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshingTools ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
              
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
  );
}
