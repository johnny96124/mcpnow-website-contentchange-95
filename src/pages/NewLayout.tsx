import { useState, useEffect } from "react";
import { Plus, PlusCircle, ChevronDown, ChevronUp, Search, Filter, Settings2, RefreshCw, ArrowRight, Server, FileText, ScanLine, Edit, Trash2, Wrench, MessageSquare, Circle, CircleDot, Loader } from "lucide-react";
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
import { Progress } from "@/components/ui/progress";
import { EndpointLabel } from "@/components/status/EndpointLabel";
import { serverInstances, serverDefinitions, profiles, hosts, Profile, ServerInstance, Host } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { AddServerDialog } from "@/components/new-layout/AddServerDialog";
import { AddHostDialog } from "@/components/new-layout/AddHostDialog";
import { ServerDetails } from "@/components/new-layout/ServerDetails";
import { ConfigFileDialog } from "@/components/hosts/ConfigFileDialog";
import { useConfigDialog } from "@/hooks/useConfigDialog";
import { useHostProfiles } from "@/hooks/useHostProfiles";
import { ServerDebugDialog } from "@/components/new-layout/ServerDebugDialog";
import { ServerHistoryDialog } from "@/components/new-layout/ServerHistoryDialog";

const mockJsonConfig = {
  "mcpServers": {
    "mcpnow": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/mcpnow", "http://localhost:8008/mcp"]
    }
  }
};

const NewLayout = () => {
  const [currentTab, setCurrentTab] = useState<"servers" | "hosts">("servers");
  const [searchQuery, setSearchQuery] = useState("");
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
  const [selectedProfileId, setSelectedProfileId] = useState<string>("all");
  const [selectedHostId, setSelectedHostId] = useState<string | null>(hostsList[0]?.id || null);
  const [createProfileDialogOpen, setCreateProfileDialogOpen] = useState(false);
  const [newProfileName, setNewProfileName] = useState("");
  const [isDebuggingServer, setIsDebuggingServer] = useState(false);
  const [selectedDebugServer, setSelectedDebugServer] = useState<ServerInstance | null>(null);
  const [messageHistoryOpen, setMessageHistoryOpen] = useState(false);
  const [serverInstanceStatuses, setServerInstanceStatuses] = useState<Record<string, any>>({});
  const [addServerToHostOpen, setAddServerToHostOpen] = useState(false);
  const [selectedHostForAddServer, setSelectedHostForAddServer] = useState<Host | null>(null);
  const [importByProfileOpen, setImportByProfileOpen] = useState(false);
  const [isDebugDialogOpen, setIsDebugDialogOpen] = useState(false);
  const {
    toast
  } = useToast();
  const {
    configDialog,
    openConfigDialog,
    setDialogOpen,
    resetConfigDialog
  } = useConfigDialog(mockJsonConfig);
  const {
    hostProfiles,
    allProfiles,
    handleProfileChange,
    getProfileById
  } = useHostProfiles();

  useEffect(() => {
    let filtered = [...serversList];
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(server => server.name.toLowerCase().includes(searchLower) || serverDefinitions.find(def => def.id === server.definitionId)?.name.toLowerCase().includes(searchLower));
    }

    if (selectedProfileId !== "all") {
      const profile = profilesList.find(p => p.id === selectedProfileId);
      if (profile) {
        filtered = filtered.filter(server => profile.instances.includes(server.id));
      }
    }
    setFilteredServers(filtered);

    const filteredHostsResult = hostsList.filter(host => host.name.toLowerCase().includes(searchQuery.toLowerCase()));
    setFilteredHosts(filteredHostsResult);
  }, [searchQuery, serversList, hostsList, selectedProfileId, profilesList]);

  const getDefinitionName = (definitionId: string): string => {
    const definition = serverDefinitions.find(def => def.id === definitionId);
    return definition ? definition.name : "Unknown";
  };

  const getDefinitionType = (definitionId: string): string => {
    const definition = serverDefinitions.find(def => def.id === definitionId);
    return definition ? definition.type : "Unknown";
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
    setSelectedHostId(newHost.id);
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
    if (selectedHostId === hostId) {
      setSelectedHostId(prev => {
        const remainingHosts = hostsList.filter(h => h.id !== hostId);
        return remainingHosts.length > 0 ? remainingHosts[0].id : null;
      });
    }
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

    const profile = profilesList.find(p => p.id === profileId);
    if (profile && profile.instances.includes(selectedServerForProfile.id)) {
      toast({
        title: "Already Added",
        description: `${selectedServerForProfile.name} is already in this profile`,
        variant: "destructive"
      });
      return;
    }

    setProfilesList(prev => prev.map(profile => profile.id === profileId ? {
      ...profile,
      instances: [...profile.instances, selectedServerForProfile.id]
    } : profile));
    toast({
      title: "Added to Profile",
      description: `${selectedServerForProfile.name} has been added to the profile`
    });
    setIsAddToProfileDialogOpen(false);
  };

  const handleCreateNewProfile = () => {
    if (!newProfileName.trim()) {
      toast({
        title: "Profile Name Required",
        description: "Please enter a name for your profile",
        variant: "destructive"
      });
      return;
    }

    const instances = selectedServerForProfile ? [selectedServerForProfile.id] : [];
    const newProfile: Profile = {
      id: `profile-${Date.now()}`,
      name: newProfileName,
      endpointType: "HTTP_SSE",
      endpoint: "http://localhost:8008/mcp",
      enabled: true,
      instances
    };
    setProfilesList(prev => [...prev, newProfile]);
    setSelectedProfileId(newProfile.id);
    toast({
      title: "Profile Created",
      description: `New profile "${newProfileName}" has been created`
    });
    setCreateProfileDialogOpen(false);
    setIsAddToProfileDialogOpen(false);
    setNewProfileName("");
  };

  const getProfilesForServer = (serverId: string): Profile[] => {
    return profilesList.filter(profile => profile.instances.includes(serverId));
  };

  const handleServerStatusChange = (serverId: string, status: 'running' | 'stopped' | 'error' | 'connecting') => {
    setServerInstanceStatuses(prev => ({
      ...prev,
      [serverId]: status
    }));

    if (status === 'running') {
      setServersList(prev => prev.map(server => server.id === serverId ? {
        ...server,
        status: 'running'
      } : server));
    } else if (status === 'stopped') {
      setServersList(prev => prev.map(server => server.id === serverId ? {
        ...server,
        status: 'stopped'
      } : server));
    } else if (status === 'error') {
      setServersList(prev => prev.map(server => server.id === serverId ? {
        ...server,
        status: 'error'
      } : server));
    }
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
        setSelectedHostId(newId);
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

  const handleOpenDebugTools = (server: ServerInstance) => {
    setServerInstanceStatuses(prev => ({
      ...prev,
      [server.id]: { ...prev[server.id], isLoading: true }
    }));
    
    setTimeout(() => {
      setServerInstanceStatuses(prev => ({
        ...prev,
        [server.id]: { ...prev[server.id], isLoading: false }
      }));
      
      setSelectedDebugServer(server);
      setIsDebugDialogOpen(true);
    }, 1000);
  };

  const handleOpenMessageHistory = (server: ServerInstance) => {
    setSelectedDebugServer(server);
    setMessageHistoryOpen(true);
  };

  const handleAddServerToHost = (host: Host) => {
    setSelectedHostForAddServer(host);
    setAddServerToHostOpen(true);
  };

  const confirmAddServerToHost = (serverId: string) => {
    if (!selectedHostForAddServer) return;
    toast({
      title: "Server Added to Host",
      description: `Server has been successfully added to ${selectedHostForAddServer.name}`
    });

    setHostsList(prev => prev.map(h => h.id === selectedHostForAddServer.id ? {
      ...h,
      configStatus: h.configStatus === "unknown" ? "configured" : h.configStatus,
      connectionStatus: "connected"
    } : h));
    setAddServerToHostOpen(false);
  };

  const handleImportByProfile = (host: Host) => {
    setSelectedHostForAddServer(host);
    setImportByProfileOpen(true);
  };

  const confirmImportProfileToHost = (profileId: string) => {
    if (!selectedHostForAddServer) return;
    const profile = profilesList.find(p => p.id === profileId);
    if (!profile) return;
    toast({
      title: "Profile Imported",
      description: `${profile.name} has been imported to ${selectedHostForAddServer.name} with ${profile.instances.length} servers`
    });

    setHostsList(prev => prev.map(h => h.id === selectedHostForAddServer.id ? {
      ...h,
      configStatus: h.configStatus === "unknown" ? "configured" : h.configStatus,
      connectionStatus: "connected",
      profileId: profileId
    } : h));
    handleProfileChange(selectedHostForAddServer.id, profileId);
    setImportByProfileOpen(false);
  };

  const selectedHost = hostsList.find(h => h.id === selectedHostId);

  const formatStatusLabel = (status: any): string => {
    if (typeof status !== 'string') {
      return 'Unknown';
    }
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return <div className="space-y-6 animate-fade-in">
      <Tabs value={currentTab} onValueChange={value => setCurrentTab(value as "servers" | "hosts")} className="w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">MCP Now</h1>
            <p className="text-muted-foreground">
              Unified management for servers, hosts, and profiles
            </p>
          </div>
          <div className="flex gap-2">
            <TabsList className="grid grid-cols-2 w-[300px]">
              <TabsTrigger value="servers">Servers</TabsTrigger>
              <TabsTrigger value="hosts">Hosts</TabsTrigger>
            </TabsList>
            
            {currentTab === "servers" && <Button onClick={() => setAddServerDialogOpen(true)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Server
              </Button>}
            
            {currentTab === "hosts" && <div className="flex gap-2">
                <Button variant="outline" onClick={handleScanForHosts} disabled={isScanning}>
                  {isScanning ? <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Scanning...
                    </> : <>
                      <ScanLine className="h-4 w-4 mr-2" />
                      Scan for Hosts
                    </>}
                </Button>
                <Button onClick={() => setAddHostDialogOpen(true)}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Host
                </Button>
              </div>}
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder={`Search ${currentTab}...`} className="pl-8" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
        </div>
        
        <TabsContent value="servers" className="mt-0 space-y-6">
          <div className="flex items-center justify-between bg-muted/20 p-3 rounded-lg">
            <div className="flex items-center gap-2 overflow-x-auto">
              <Button variant={selectedProfileId === "all" ? "default" : "outline"} size="sm" className="whitespace-nowrap" onClick={() => setSelectedProfileId("all")}>
                All Servers
              </Button>
              
              {profilesList.map(profile => <Button key={profile.id} variant={selectedProfileId === profile.id ? "default" : "outline"} size="sm" className="whitespace-nowrap" onClick={() => setSelectedProfileId(profile.id)}>
                  {profile.name}
                </Button>)}
            </div>
            
            <Button variant="outline" size="sm" onClick={() => {
            setSelectedServerForProfile(null);
            setCreateProfileDialogOpen(true);
          }} className="whitespace-nowrap">
              <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
              New Profile
            </Button>
          </div>
          
          {filteredServers.length > 0 ? <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[220px]">Name</TableHead>
                    
                    <TableHead>Type</TableHead>
                    <TableHead>Profiles</TableHead>
                    <TableHead>Connection</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServers.map(server => {
                const serverProfiles = getProfilesForServer(server.id);
                const status = serverInstanceStatuses[server.id] || server.status || 'stopped';
                return <TableRow key={server.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <span className="cursor-pointer hover:text-primary transition-colors flex items-center gap-2" onClick={() => handleOpenServerDetails(server)}>
                              <Server className="h-4 w-4" />
                              {server.name}
                            </span>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <EndpointLabel type={getDefinitionType(server.definitionId) as any} />
                        </TableCell>
                        <TableCell>
                          {serverProfiles.length > 0 ? <div className="flex flex-wrap gap-1 max-w-[200px]">
                              {serverProfiles.map((profile, index) => <Badge key={index} variant="secondary" className="whitespace-nowrap">
                                  {profile.name}
                                </Badge>)}
                            </div> : <span className="text-muted-foreground text-sm">No profiles</span>}
                        </TableCell>
                        <TableCell className="max-w-[160px] truncate">
                          <span className="text-sm font-mono">{server.connectionDetails}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1.5">
                            <Button variant="outline" size="sm" onClick={() => handleAddToProfile(server.id)}>
                              <Plus className="h-3.5 w-3.5 mr-1.5" />
                              Profile
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-purple-600 hover:text-purple-700 hover:border-purple-600" 
                              onClick={() => handleOpenDebugTools(server)}
                              disabled={serverInstanceStatuses[server.id]?.isLoading}
                            >
                              {serverInstanceStatuses[server.id]?.isLoading ? (
                                <Loader className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                              ) : (
                                <Wrench className="h-3.5 w-3.5 mr-1.5" />
                              )}
                              Debug
                            </Button>
                            
                            <Button variant="outline" size="sm" className="text-blue-600 hover:text-blue-700 hover:border-blue-600" onClick={() => handleOpenMessageHistory(server)}>
                              <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
                              History
                            </Button>
                            
                            <Button variant="outline" size="sm" className="text-destructive" onClick={() => handleDeleteServer(server.id)}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>;
              })}
                </TableBody>
              </Table>
            </div> : <div className="flex flex-col items-center justify-center h-[400px] border border-dashed rounded-md p-6">
              <Server className="h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Servers Found</h3>
              <p className="text-muted-foreground text-center mb-4">
                {searchQuery ? `No results for "${searchQuery}"` : "Add your first server to get started."}
              </p>
              {searchQuery ? <Button onClick={() => setSearchQuery("")}>Clear Search</Button> : <Button onClick={() => setAddServerDialogOpen(true)}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Server
                </Button>}
            </div>}
        </TabsContent>

        <TabsContent value="hosts" className="mt-0 space-y-6">
          <div className="bg-muted/20 p-3 rounded-lg">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {hostsList.map(host => <Button key={host.id} variant={selectedHostId === host.id ? "default" : "outline"} size="sm" className="whitespace-nowrap flex items-center gap-1.5" onClick={() => setSelectedHostId(host.id)}>
                  {host.icon && <span className="text-sm">{host.icon}</span>}
                  {host.name}
                  <StatusIndicator status={host.connectionStatus === "connected" ? "active" : host.connectionStatus === "misconfigured" ? "error" : host.configStatus === "misconfigured" ? "error" : "inactive"} iconOnly size="sm" />
                </Button>)}
            </div>
          </div>
          
          {selectedHost ? <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-muted/30 p-3 rounded-full">
                    <span className="text-2xl">{selectedHost.icon || '🖥️'}</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{selectedHost.name}</h2>
                    <div className="flex items-center gap-2">
                      <StatusIndicator status={selectedHost.connectionStatus === "connected" ? "active" : selectedHost.connectionStatus === "misconfigured" ? "error" : selectedHost.configStatus === "misconfigured" ? "error" : "inactive"} label={selectedHost.connectionStatus === "connected" ? "Connected" : selectedHost.connectionStatus === "misconfigured" ? "Misconfigured" : selectedHost.configStatus === "misconfigured" ? "Configuration Error" : "Disconnected"} />
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {selectedHost.configStatus === "unknown" ? <Button onClick={() => handleCreateConfigDialog(selectedHost.id)} className="bg-blue-500 hover:bg-blue-600">
                      <FileText className="h-4 w-4 mr-2" />
                      Create Configuration
                    </Button> : <>
                      <Button variant="outline" onClick={() => handleImportByProfile(selectedHost)}>
                        <Plus className="h-4 w-4 mr-1.5" />
                        Import by Profile
                      </Button>
                      <Button onClick={() => handleAddServerToHost(selectedHost)}>
                        <Plus className="h-4 w-4 mr-1.5" />
                        Add Server
                      </Button>
                    </>}
                </div>
              </div>
              
              {selectedHost.configStatus === "unknown" ? <Card>
                  <CardContent className="p-6">
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
                      <Button onClick={() => handleCreateConfigDialog(selectedHost.id)} className="bg-blue-500 hover:bg-blue-600">
                        Create Configuration
                      </Button>
                    </div>
                  </CardContent>
                </Card> : <div className="space-y-4">
                  <div className="bg-muted/10 p-3 rounded-md flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-mono truncate max-w-[500px]">
                        {selectedHost.configPath || "/Users/user/.mcp/hosts/default.json"}
                      </span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-3.5 w-3.5 mr-1" />
                      Edit Config
                    </Button>
                  </div>
                  
                  {hostProfiles[selectedHost.id] && <div className="bg-muted/10 p-3 rounded-md">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Profile</Badge>
                          <span className="font-medium">
                            {profilesList.find(p => p.id === hostProfiles[selectedHost.id])?.name || 'Unknown Profile'}
                          </span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleImportByProfile(selectedHost)}>
                          <Edit className="h-3.5 w-3.5 mr-1" />
                          Change
                        </Button>
                      </div>
                    </div>}
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Connected Servers</CardTitle>
                      <CardDescription>
                        Servers running on this host
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {selectedHost.connectionStatus === "connected" ? <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[180px]">Name</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Load</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {serversList.slice(0, 3).map(server => {
                      const status = serverInstanceStatuses[server.id] || server.status || 'stopped';
                      const load = Math.floor(Math.random() * 90) + 10; // Simulate random load

                      return <TableRow key={server.id}>
                                  <TableCell className="font-medium">
                                    {server.name}
                                  </TableCell>
                                  <TableCell>
                                    <StatusIndicator 
                                      status={status === "running" ? "active" : status === "error" ? "error" : status === "connecting" ? "warning" : "inactive"} 
                                      label={formatStatusLabel(status)} 
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <EndpointLabel type={getDefinitionType(server.definitionId) as any} />
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2 w-32">
                                      <Progress value={load} className="h-2" />
                                      <span className="text-xs text-muted-foreground w-8">{load}%</span>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex justify-end gap-1.5">
                                      <Button variant="outline" size="sm" className="text-purple-600 hover:text-purple-700 hover:border-purple-600" onClick={() => handleOpenDebugTools(server)}>
                                        <Wrench className="h-3.5 w-3.5" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>;
                    })}
                          </TableBody>
                        </Table> : <div className="text-center p-6 border rounded-md bg-secondary/10 flex flex-col items-center">
                          <p className="text-muted-foreground mb-4">No servers are connected to this host</p>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleImportByProfile(selectedHost)}>
                              Import by Profile
                            </Button>
                            <Button size="sm" onClick={() => handleAddServerToHost(selectedHost)}>
                              Add Server
                            </Button>
                          </div>
                        </div>}
                    </CardContent>
                  </Card>
                </div>}
            </div> : <div className="flex flex-col items-center justify-center h-[400px] border border-dashed rounded-md p-6">
              <Server className="h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Hosts Found</h3>
              <p className="text-muted-foreground text-center mb-4">
                {searchQuery ? `No results for "${searchQuery}"` : "Add your first host to get started."}
              </p>
              {searchQuery ? <Button onClick={() => setSearchQuery("")}>Clear Search</Button> : <Button onClick={() => setAddHostDialogOpen(true)}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Host
                </Button>}
            </div>}
        </TabsContent>
      </Tabs>

      <AddServerDialog open={addServerDialogOpen} onOpenChange={setAddServerDialogOpen} onAddServer={handleAddServerSuccess} />

      <AddHostDialog open={addHostDialogOpen} onOpenChange={setAddHostDialogOpen} onAddHost={handleAddHostSuccess} />

      <ServerDetails open={serverDetailOpen} onOpenChange={setServerDetailOpen} server={selectedServerDetails} onDelete={handleDeleteServer} />

      <ConfigFileDialog open={configDialog.isOpen} onOpenChange={setDialogOpen} initialConfig={JSON.stringify(mockJsonConfig, null, 2)} configPath={configDialog.configPath} onSave={handleUpdateConfig} />

      <ServerDebugDialog
        open={isDebugDialogOpen}
        onOpenChange={setIsDebugDialogOpen}
        server={selectedDebugServer}
      />

      <Dialog open={isAddToProfileDialogOpen} onOpenChange={setIsAddToProfileDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Server to Profile</DialogTitle>
            <DialogDescription>
              Select a profile to add the server to, or create a new profile.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Select onValueChange={confirmAddToProfile}>
                <SelectTrigger className="w-full col
