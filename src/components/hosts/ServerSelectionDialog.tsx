import React, { useState, useEffect } from "react";
import { 
  Search, X, Server, Plus, Check, ArrowRight, AlertTriangle, Info, Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { EndpointLabel } from "@/components/status/EndpointLabel";
import { serverDefinitions, Profile, ServerInstance } from "@/data/mockData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { AddInstanceDialog } from "@/components/servers/AddInstanceDialog";

interface ServerSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddServers: (servers: ServerInstance[]) => void;
}

// Mock data with descriptions for existing instances
const existingInstances: Array<ServerInstance & { description?: string }> = [
  {
    id: "instance-1",
    name: "Local PostgreSQL",
    definitionId: "def-http-sse",
    status: "stopped",
    connectionDetails: "https://localhost:5432",
    enabled: false,
    description: "Local PostgreSQL database server instance"
  },
  {
    id: "instance-2",
    name: "Development Redis",
    definitionId: "def-stdio",
    status: "stopped",
    connectionDetails: "redis://localhost:6379",
    enabled: false,
    description: "Development Redis cache server"
  }
];

export const ServerSelectionDialog: React.FC<ServerSelectionDialogProps> = ({
  open,
  onOpenChange,
  onAddServers,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("discovery");
  const [selectedServer, setSelectedServer] = useState<ServerDefinition | null>(null);
  const [showInstanceDialog, setShowInstanceDialog] = useState(false);
  const [showCustomServerForm, setShowCustomServerForm] = useState(false);
  const { toast } = useToast();
  
  // Custom server form state
  const [customServer, setCustomServer] = useState({
    name: "",
    type: "HTTP_SSE" as "HTTP_SSE" | "STDIO" | "WS",
    connectionDetails: "",
    description: "",
    enabled: false
  });

  // Reset when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setSearchQuery("");
      setSelectedTab("discovery");
      setSelectedServer(null);
      setShowInstanceDialog(false);
      setShowCustomServerForm(false);
      setCustomServer({
        name: "",
        type: "HTTP_SSE",
        connectionDetails: "",
        description: "",
        enabled: false
      });
    }
  }, [open]);

  const handleServerSelect = (server: ServerDefinition | ServerInstance) => {
    if (selectedTab === "added") {
      // If it's an existing instance, add it directly
      const serverInstance = server as ServerInstance;
      onAddServers([serverInstance]);
      toast({
        title: "Server added",
        description: `${serverInstance.name} has been added to your profile`
      });
      onOpenChange(false);
    } else {
      // If it's a definition, show the instance dialog
      setSelectedServer(server as ServerDefinition);
      setShowInstanceDialog(true);
    }
  };

  const handleCreateInstance = (data: any) => {
    const newInstance: ServerInstance = {
      id: `instance-${Date.now()}`,
      name: data.name,
      definitionId: selectedServer?.id || "",
      status: "stopped",
      connectionDetails: data.url || data.args || "",
      enabled: false
    };

    onAddServers([newInstance]);
    toast({
      title: "Server instance created",
      description: `${newInstance.name} has been added to your profile`
    });
    setShowInstanceDialog(false);
    onOpenChange(false);
  };

  const handleCustomServerSubmit = () => {
    if (!customServer.name || !customServer.connectionDetails) {
      toast({
        title: "Missing information",
        description: "Please fill in required fields",
        variant: "destructive"
      });
      return;
    }

    const newCustomServer: ServerInstance = {
      id: `custom-server-${Date.now()}`,
      name: customServer.name,
      definitionId: `custom-${customServer.type.toLowerCase()}`,
      status: "stopped",
      connectionDetails: customServer.connectionDetails,
      enabled: customServer.enabled,
    };

    onAddServers([newCustomServer]);
    toast({
      title: "Custom server added",
      description: `${customServer.name} has been added successfully`
    });
    onOpenChange(false);
  };

  const filteredServers = selectedTab === "added"
    ? existingInstances.filter(server =>
        server.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : serverDefinitions.filter(server =>
        server.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{showCustomServerForm ? "Add Custom Server" : "Select Server"}</DialogTitle>
            <DialogDescription>
              {showCustomServerForm 
                ? "Configure your custom server parameters"
                : "Choose a server to add to your profile"}
            </DialogDescription>
          </DialogHeader>

          {!showCustomServerForm ? (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search servers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              
              <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="discovery">Discovery</TabsTrigger>
                  <TabsTrigger value="added">Added</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex justify-end mb-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowCustomServerForm(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Custom Server
                </Button>
              </div>

              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {filteredServers.map((server) => {
                    const definition = serverDefinitions.find(def => def.id === server.definitionId);
                    
                    return (
                      <div
                        key={server.id}
                        className="flex items-start space-x-4 p-4 border rounded-lg hover:border-primary hover:bg-accent/5 cursor-pointer transition-colors"
                        onClick={() => handleServerSelect(server)}
                      >
                        <ServerLogo name={server.name} className="flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium truncate">{server.name}</h4>
                            {definition && (
                              <EndpointLabel type={definition.type} />
                            )}
                            {server.id.startsWith('custom-') && (
                              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Custom</Badge>
                            )}
                          </div>
                          {(selectedTab === "discovery" && 'description' in server || 
                           selectedTab === "added" && server.description) && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {selectedTab === "discovery" 
                                ? (server as any).description 
                                : server.description}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {filteredServers.length === 0 && (
                    <div className="text-center py-8 border border-dashed rounded-md">
                      <p className="text-muted-foreground">No servers found</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          ) : (
            <div className="space-y-4">
              <Button 
                variant="ghost" 
                className="px-0" 
                onClick={() => setShowCustomServerForm(false)}
              >
                <ArrowRight className="h-4 w-4 mr-1 rotate-180" />
                Back to Server Selection
              </Button>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="custom-name">
                    Server Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="custom-name"
                    value={customServer.name}
                    onChange={(e) => setCustomServer({...customServer, name: e.target.value})}
                    placeholder="My Custom Server"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="custom-type">Server Type</Label>
                  <Select 
                    value={customServer.type} 
                    onValueChange={(value: "HTTP_SSE" | "STDIO" | "WS") => 
                      setCustomServer({...customServer, type: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select server type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HTTP_SSE">HTTP SSE</SelectItem>
                      <SelectItem value="STDIO">STDIO</SelectItem>
                      <SelectItem value="WS">WebSocket</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="custom-connection">
                    Connection Details <span className="text-destructive">*</span>
                  </Label>
                  {customServer.type === "HTTP_SSE" && (
                    <Input
                      id="custom-connection"
                      value={customServer.connectionDetails}
                      onChange={(e) => setCustomServer({...customServer, connectionDetails: e.target.value})}
                      placeholder="http://localhost:3000/api"
                    />
                  )}
                  {customServer.type === "STDIO" && (
                    <Input
                      id="custom-connection"
                      value={customServer.connectionDetails}
                      onChange={(e) => setCustomServer({...customServer, connectionDetails: e.target.value})}
                      placeholder="python server.py --port 8000"
                    />
                  )}
                  {customServer.type === "WS" && (
                    <Input
                      id="custom-connection"
                      value={customServer.connectionDetails}
                      onChange={(e) => setCustomServer({...customServer, connectionDetails: e.target.value})}
                      placeholder="ws://localhost:8080"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="custom-description">Description</Label>
                  <Textarea
                    id="custom-description"
                    value={customServer.description}
                    onChange={(e) => setCustomServer({...customServer, description: e.target.value})}
                    placeholder="Describe your custom server"
                    className="resize-none"
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox 
                    id="custom-enabled"
                    checked={customServer.enabled}
                    onCheckedChange={(checked) => 
                      setCustomServer({...customServer, enabled: checked === true})
                    }
                  />
                  <Label htmlFor="custom-enabled">Enable server immediately after adding</Label>
                </div>

                <Alert variant="outline" className="bg-blue-50 border-blue-200 text-blue-800">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Information</AlertTitle>
                  <AlertDescription>
                    Custom servers require proper configuration to work correctly. Make sure your connection details are accurate.
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          )}

          <DialogFooter>
            {showCustomServerForm ? (
              <>
                <Button variant="outline" onClick={() => setShowCustomServerForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCustomServerSubmit}>
                  Add Custom Server
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AddInstanceDialog
        open={showInstanceDialog}
        onOpenChange={setShowInstanceDialog}
        serverDefinition={selectedServer}
        onCreateInstance={handleCreateInstance}
      />
    </>
  );
};

// Helper component for server logo
const ServerLogo = ({ name, className = "" }: { name: string; className?: string }) => {
  return (
    <div className={`h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center ${className}`}>
      <Server className="h-5 w-5" />
    </div>
  );
};
