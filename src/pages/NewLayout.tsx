import { useState, useEffect } from "react";
import { 
  Plus, 
  PlusCircle,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Settings2,
  RefreshCw,
  ArrowRight,
  Server,
  FileText,
  ScanLine,
  Edit,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { StatusIndicator } from "@/components/status/StatusIndicator";
import { 
  serverInstances, 
  serverDefinitions, 
  profiles, 
  hosts, 
  Profile, 
  ServerInstance,
  Host
} from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { AddServerDialog } from "@/components/new-layout/AddServerDialog";
import { AddHostDialog } from "@/components/new-layout/AddHostDialog";
import { ServerDetails } from "@/components/new-layout/ServerDetails";
import { ConfigFileDialog } from "@/components/hosts/ConfigFileDialog";
import { useConfigDialog } from "@/hooks/useConfigDialog";

const mockJsonConfig = {
  "mcpServers": {
    "mcpnow": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/mcpnow", "http://localhost:8008/mcp"]
    }
  }
};

const NewLayout = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTab, setCurrentTab] = useState<"servers" | "hosts">("servers");
  const [selectedServer, setSelectedServer] = useState<string | null>(null);
  const [selectedServerDetails, setSelectedServerDetails] = useState<ServerInstance | null>(null);
  const [serversList, setServersList] = useState<ServerInstance[]>([...serverInstances]);
  const [profilesList, setProfilesList] = useState<Profile[]>([...profiles]);
  const [hostsList, setHostsList] = useState<Host[]>([...hosts]);
  const [addServerDialogOpen, setAddServerDialogOpen] = useState(false);
  const [addHostDialogOpen, setAddHostDialogOpen] = useState(false);
  const [serverDetailOpen, setServerDetailOpen] = useState(false);
  const [isAddToProfileDialogOpen, setIsAddToProfileDialogOpen] = useState(false);
  const [selectedServerForProfile, setSelectedServerForProfile] = useState<ServerInstance | null>(null);
  const [filteredServers, setFilteredServers] = useState<ServerInstance[]>([...serverInstances]);
  const [filteredHosts, setFilteredHosts] = useState<Host[]>([...hosts]);
  const [isScanning, setIsScanning] = useState(false);

  const { toast } = useToast();

  const {
    configDialog,
    openConfigDialog,
    setDialogOpen,
    resetConfigDialog
  } = useConfigDialog(mockJsonConfig);

  useEffect(() => {
    // Filter servers based on search query
    const filtered = serversList.filter(server => 
      server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      serverDefinitions.find(def => def.id === server.definitionId)?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredServers(filtered);
    
    // Filter hosts based on search query
    const filteredHostsResult = hostsList.filter(host => 
      host.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredHosts(filteredHostsResult);
  }, [searchQuery, serversList, hostsList]);

  const getDefinitionName = (definitionId: string): string => {
    const definition = serverDefinitions.find(def => def.id === definitionId);
    return definition ? definition.name : "Unknown";
  };

  const handleAddServerSuccess = (newServer: ServerInstance) => {
    setServersList(prev => [...prev, newServer]);
    toast({
      title: "Server Added",
      description: `${newServer.name} has been added successfully`
    });
  };

  const handleAddHostSuccess = (newHost: Host) => {
    setHostsList(prev => [...prev, newHost]);
    toast({
      title: "Host Added",
      description: `${newHost.name} has been added successfully`
    });
  };

  const handleOpenServerDetails = (server: ServerInstance) => {
    setSelectedServerDetails(server);
    setServerDetailOpen(true);
  };

  const handleDeleteServer = (serverId: string) => {
    setServersList(prev => prev.filter(s => s.id !== serverId));
    
    // Also remove from profiles
    setProfilesList(prev => prev.map(profile => ({
      ...profile,
      instances: profile.instances.filter(id => id !== serverId)
    })));
    
    toast({
      title: "Server Removed",
      description: `Server has been removed successfully`
    });
  };

  const handleDeleteHost = (hostId: string) => {
    setHostsList(prev => prev.filter(h => h.id !== hostId));
    toast({
      title: "Host Deleted",
      description: "The host has been removed successfully"
    });
  };

  const handleAddToProfile = (serverId: string) => {
    const server = serversList.find(s => s.id === serverId);
    if (server) {
      setSelectedServerForProfile(server);
      setIsAddToProfileDialogOpen(true);
    }
  };

  const confirmAddToProfile = (profileId: string) => {
    if (!selectedServerForProfile || !profileId) return;
    
    // Add server to profile
    setProfilesList(prev => prev.map(profile => 
      profile.id === profileId ? 
        { ...profile, instances: [...profile.instances, selectedServerForProfile.id] } : 
        profile
    ));
    
    toast({
      title: "Added to Profile",
      description: `${selectedServerForProfile.name} has been added to the profile`
    });
    
    setIsAddToProfileDialogOpen(false);
  };

  const handleCreateNewProfile = (name: string) => {
    if (!selectedServerForProfile) return;
    
    const newProfile: Profile = {
      id: `profile-${Date.now()}`,
      name,
      endpointType: "HTTP_SSE",
      endpoint: "http://localhost:8008/mcp",
      enabled: true,
      instances: [selectedServerForProfile.id]
    };
    
    setProfilesList(prev => [...prev, newProfile]);
    toast({
      title: "Profile Created",
      description: `New profile "${name}" has been created with ${selectedServerForProfile.name}`
    });
    
    setIsAddToProfileDialogOpen(false);
  };

  const getServerProfileNames = (serverId: string): string[] => {
    return profilesList
      .filter(profile => profile.instances.includes(serverId))
      .map(profile => profile.name);
  };

  const handleCreateConfigDialog = (hostId: string) => {
    const host = hostsList.find(h => h.id === hostId);
    if (host) {
      const defaultConfigPath = `/Users/user/.mcp/hosts/${host.name.toLowerCase().replace(/\s+/g, '-')}.json`;
      openConfigDialog(hostId, defaultConfigPath, 'http://localhost:8008/mcp', true, true, false, false, true, true);
    }
  };

  const handleUpdateConfig = (config: string, configPath: string) => {
    if (configDialog.hostId) {
      setHostsList(prev => prev.map(host => host.id === configDialog.hostId ? {
        ...host,
        configPath,
        configStatus: 'configured',
        connectionStatus: 'connected'
      } : host));
      
      toast({
        title: "Configuration complete",
        description: "Host configuration has been updated successfully."
      });
    }
    resetConfigDialog();
  };

  const handleScanForHosts = () => {
    setIsScanning(true);
    setTimeout(() => {
      const foundHost = Math.random() > 0.5;
      if (foundHost) {
        const newId = `host-${Date.now()}`;
        const newHost: Host = {
          id: newId,
          name: "Local Host",
          icon: "💻",
          connectionStatus: "disconnected",
          configStatus: "unknown"
        };
        
        setHostsList(prevHosts => [...prevHosts, newHost]);
        
        toast({
          title: "Host discovered",
          description: "A new local host has been found and added to your hosts list."
        });
      } else {
        toast({
          title: "No hosts found",
          description: "No new hosts were discovered on your network.",
          variant: "destructive"
        });
      }
      setIsScanning(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">MCP Now</h1>
          <p className="text-muted-foreground">
            Unified management for servers, hosts, and profiles
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleScanForHosts}
            disabled={isScanning}
          >
            {isScanning ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <ScanLine className="h-4 w-4 mr-2" />
                Scan for Hosts
              </>
            )}
          </Button>
          <Button onClick={() => currentTab === "servers" ? 
            setAddServerDialogOpen(true) : 
            setAddHostDialogOpen(true)
          }>
            <PlusCircle className="h-4 w-4 mr-2" />
            {currentTab === "servers" ? "Add Server" : "Add Host"}
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Search ${currentTab}...`}
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Tabs
          value={currentTab}
          onValueChange={(value) => setCurrentTab(value as "servers" | "hosts")}
          className="w-[400px]"
        >
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="servers">Servers</TabsTrigger>
            <TabsTrigger value="hosts">Hosts</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="min-h-[500px]">
        <Tabs value={currentTab} className="w-full">
          <TabsContent value="servers" className="mt-0">
            {filteredServers.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[300px]">Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Profiles</TableHead>
                      <TableHead className="w-[250px]">Connection</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredServers.map((server) => {
                      const serverProfiles = getServerProfileNames(server.id);
                      
                      return (
                        <TableRow key={server.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <span 
                                className="cursor-pointer hover:text-primary transition-colors flex items-center gap-2"
                                onClick={() => handleOpenServerDetails(server)}
                              >
                                <Server className="h-4 w-4" />
                                {server.name}
                              </span>
                              <Badge variant="outline" className="ml-2">
                                {getDefinitionName(server.definitionId)}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <StatusIndicator
                              status={server.status === "running" ? "active" : 
                                      server.status === "error" ? "error" : 
                                      server.status === "connecting" ? "warning" : "inactive"}
                              label={server.status.charAt(0).toUpperCase() + server.status.slice(1)}
                            />
                          </TableCell>
                          <TableCell>
                            {serverProfiles.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {serverProfiles.map((profileName, index) => (
                                  <Badge key={index} variant="secondary" className="mr-1">
                                    {profileName}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">No profiles</span>
                            )}
                          </TableCell>
                          <TableCell className="truncate max-w-[200px]">
                            <span className="text-sm">{server.connectionDetails}</span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleAddToProfile(server.id)}
                              >
                                Add to Profile
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleOpenServerDetails(server)}
                              >
                                <Settings2 className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline"
                                size="sm" 
                                className="text-destructive"
                                onClick={() => handleDeleteServer(server.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] border border-dashed rounded-md p-6">
                <Server className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Servers Found</h3>
                <p className="text-muted-foreground text-center mb-4">
                  {searchQuery ? `No results for "${searchQuery}"` : "Add your first server to get started."}
                </p>
                {searchQuery ? (
                  <Button onClick={() => setSearchQuery("")}>Clear Search</Button>
                ) : (
                  <Button onClick={() => setAddServerDialogOpen(true)}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Server
                  </Button>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="hosts" className="mt-0 grid gap-6 md:grid-cols-2">
            {filteredHosts.length > 0 ? (
              filteredHosts.map(host => (
                <Card key={host.id} className="overflow-hidden flex flex-col">
                  <CardHeader className="bg-muted/50 pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {host.icon && <span className="text-xl">{host.icon}</span>}
                        <CardTitle className="font-medium">{host.name}</CardTitle>
                      </div>
                      <StatusIndicator 
                        status={
                          host.connectionStatus === "connected" ? "active" : 
                          host.connectionStatus === "misconfigured" ? "error" : 
                          host.configStatus === "misconfigured" ? "error" : "inactive"
                        } 
                        label={
                          host.connectionStatus === "connected" ? "Connected" : 
                          host.connectionStatus === "misconfigured" ? "Misconfigured" : 
                          host.configStatus === "misconfigured" ? "Configuration Error" : "Disconnected"
                        }
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4 flex-1">
                    {host.configStatus === "unknown" ? (
                      <div className="text-center space-y-4 py-6">
                        <div className="mx-auto w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                          <FileText className="h-6 w-6 text-blue-500" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-medium">Configuration Required</h3>
                          <p className="text-muted-foreground text-sm">
                            Configure this host to connect servers to it
                          </p>
                        </div>
                        <Button 
                          onClick={() => handleCreateConfigDialog(host.id)}
                          className="bg-blue-500 hover:bg-blue-600"
                        >
                          Create Configuration
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Servers</label>
                          {serversList.length > 0 ? (
                            <ScrollArea className="h-[180px] border rounded-md p-2">
                              <div className="space-y-2">
                                {serversList.map(server => (
                                  <div 
                                    key={server.id}
                                    className="flex items-center justify-between p-2 bg-muted/40 rounded-md"
                                  >
                                    <div className="flex items-center gap-2">
                                      <StatusIndicator 
                                        status={
                                          server.status === "running" ? "active" : 
                                          server.status === "error" ? "error" : 
                                          server.status === "connecting" ? "warning" : "inactive"
                                        } 
                                      />
                                      <span className="text-sm font-medium">{server.name}</span>
                                    </div>
                                    <Switch checked={true} />
                                  </div>
                                ))}
                              </div>
                            </ScrollArea>
                          ) : (
                            <div className="h-[180px] flex flex-col items-center justify-center border border-dashed rounded-md p-4">
                              <p className="text-muted-foreground text-center text-sm mb-3">
                                No servers are connected to this host
                              </p>
                              <Button variant="outline" size="sm">
                                Connect Servers
                              </Button>
                            </div>
                          )}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Config Path</label>
                            <Button variant="ghost" size="sm">
                              <FileText className="h-3.5 w-3.5 mr-1" />
                              <span className="text-xs">Edit</span>
                            </Button>
                          </div>
                          <div className="bg-muted/50 p-2 rounded-md text-sm font-mono truncate">
                            {host.configPath || "/Users/user/.mcp/hosts/default.json"}
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                  <CardFooter className="border-t p-3 bg-muted/10">
                    <div className="flex justify-between w-full">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-destructive"
                        onClick={() => handleDeleteHost(host.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                        Delete
                      </Button>
                      {host.configStatus !== "unknown" && (
                        <Button variant="outline" size="sm">
                          <Settings2 className="h-3.5 w-3.5 mr-1.5" />
                          Settings
                        </Button>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-2 flex flex-col items-center justify-center h-[400px] border border-dashed rounded-md p-6">
                <Server className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Hosts Found</h3>
                <p className="text-muted-foreground text-center mb-4">
                  {searchQuery ? `No results for "${searchQuery}"` : "Add your first host or scan for local hosts."}
                </p>
                {searchQuery ? (
                  <Button onClick={() => setSearchQuery("")}>Clear Search</Button>
                ) : (
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={handleScanForHosts} disabled={isScanning}>
                      {isScanning ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Scanning...
                        </>
                      ) : (
                        <>
                          <ScanLine className="h-4 w-4 mr-2" />
                          Scan for Hosts
                        </>
                      )}
                    </Button>
                    <Button onClick={() => setAddHostDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Host Manually
                    </Button>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Add to Profile Dialog */}
      <Dialog open={isAddToProfileDialogOpen} onOpenChange={setIsAddToProfileDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Profile</DialogTitle>
            <DialogDescription>
              Add this server to an existing profile or create a new one
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Profile</label>
              <Select onValueChange={(value) => confirmAddToProfile(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a profile" />
                </SelectTrigger>
                <SelectContent>
                  {profilesList.map(profile => (
                    <SelectItem key={profile.id} value={profile.id}>
                      {profile.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Or Create New Profile</label>
              <div className="flex items-center gap-2">
                <Input 
                  placeholder="Profile name" 
                  id="new-profile-name"
                />
                <Button onClick={() => {
                  const nameInput = document.getElementById('new-profile-name') as HTMLInputElement;
                  if (nameInput && nameInput.value) {
                    handleCreateNewProfile(nameInput.value);
                  }
                }}>
                  Create
                </Button>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddToProfileDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Server Details Dialog */}
      {selectedServerDetails && (
        <ServerDetails
          open={serverDetailOpen}
          onOpenChange={setServerDetailOpen}
          server={selectedServerDetails}
          onDelete={handleDeleteServer}
        />
      )}
      
      {/* Add Server Dialog */}
      <AddServerDialog
        open={addServerDialogOpen}
        onOpenChange={setAddServerDialogOpen}
        onAddServer={handleAddServerSuccess}
      />
      
      {/* Add Host Dialog */}
      <AddHostDialog
        open={addHostDialogOpen}
        onOpenChange={setAddHostDialogOpen}
        onAddHost={handleAddHostSuccess}
      />
      
      {/* Config File Dialog */}
      <ConfigFileDialog 
        open={configDialog.isOpen} 
        onOpenChange={setDialogOpen} 
        configPath={configDialog.configPath} 
        initialConfig={configDialog.configContent} 
        onSave={handleUpdateConfig} 
        profileEndpoint={configDialog.profileEndpoint} 
        needsUpdate={configDialog.needsUpdate} 
        allowPathEdit={configDialog.allowPathEdit} 
        isViewOnly={configDialog.isViewOnly} 
        isFixMode={configDialog.isFixMode} 
        isUpdateMode={configDialog.isUpdateMode} 
        isCreateMode={configDialog.isCreateMode} 
      />
    </div>
  );
};

export default NewLayout;
