import { useState, useEffect } from "react";
import { CirclePlus, PlusCircle, Trash2, Terminal, Info, Search, Edit, Wrench, X, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { EndpointLabel } from "@/components/status/EndpointLabel";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { serverDefinitions, serverInstances, ServerDefinition, ServerInstance, profiles, Tool } from "@/data/mockData";
import { AddInstanceDialog, InstanceFormValues } from "@/components/servers/AddInstanceDialog";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { AddServerDialog } from "@/components/servers/AddServerDialog";
import { EditServerDialog, EditServerFormValues } from "@/components/servers/EditServerDialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ServerToolsList } from "@/components/discovery/ServerToolsList";
import { NoSearchResults } from "@/components/servers/NoSearchResults";

const Servers = () => {
  const [definitions, setDefinitions] = useState<ServerDefinition[]>(serverDefinitions);
  const [instances, setInstances] = useState<ServerInstance[]>(serverInstances);
  const [filteredInstances, setFilteredInstances] = useState<ServerInstance[]>(serverInstances);
  const [filteredDefinitions, setFilteredDefinitions] = useState<ServerDefinition[]>(serverDefinitions);
  const [addInstanceOpen, setAddInstanceOpen] = useState(false);
  const [editInstanceOpen, setEditInstanceOpen] = useState(false);
  const [editServerOpen, setEditServerOpen] = useState(false);
  const [selectedDefinition, setSelectedDefinition] = useState<ServerDefinition | null>(null);
  const [selectedInstance, setSelectedInstance] = useState<ServerInstance | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [addServerDialogOpen, setAddServerDialogOpen] = useState(false);
  const [instanceStatuses, setInstanceStatuses] = useState<Record<string, 'success' | 'failed' | 'connecting'>>({});
  const [toolsDialogOpen, setToolsDialogOpen] = useState(false);
  const [selectedServerTools, setSelectedServerTools] = useState<{
    tools?: Tool[];
    serverName?: string;
    instanceId?: string;
    definitionId?: string;
  }>({});
  const {
    toast
  } = useToast();
  const navigate = useNavigate();

  const instancesByDefinition = instances.reduce((acc, instance) => {
    const {
      definitionId
    } = instance;
    if (!acc[definitionId]) {
      acc[definitionId] = [];
    }
    acc[definitionId].push(instance);
    return acc;
  }, {} as Record<string, ServerInstance[]>);

  const realProfileAssociations = profiles.reduce((acc, profile) => {
    profile.instances.forEach(instanceId => {
      if (!acc[instanceId]) {
        acc[instanceId] = [];
      }
      acc[instanceId].push(profile);
    });
    return acc;
  }, {} as Record<string, typeof profiles>);

  const clearSearch = () => {
    setSearchQuery("");
  };

  useEffect(() => {
    let filtered = [...instances];
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(instance => instance.name.toLowerCase().includes(searchLower));
    }
    if (sortConfig) {
      filtered.sort((a, b) => {
        let aValue, bValue;
        if (sortConfig.key === "name") {
          aValue = a.name;
          bValue = b.name;
        } else if (sortConfig.key === "type") {
          const aDefinition = definitions.find(d => d.id === a.definitionId);
          const bDefinition = definitions.find(d => d.id === b.definitionId);
          aValue = aDefinition?.type || "";
          bValue = bDefinition?.type || "";
        } else if (sortConfig.key === "definition") {
          const aDefinition = definitions.find(d => d.id === a.definitionId);
          const bDefinition = definitions.find(d => d.id === b.definitionId);
          aValue = aDefinition?.name || "";
          bValue = bDefinition?.name || "";
        } else {
          aValue = a[sortConfig.key as keyof ServerInstance] || "";
          bValue = b[sortConfig.key as keyof ServerInstance] || "";
        }
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    setFilteredInstances(filtered);
    let filteredDefs = [...definitions];
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filteredDefs = filteredDefs.filter(def => def.name.toLowerCase().includes(searchLower) || instances.some(instance => instance.definitionId === def.id && instance.name.toLowerCase().includes(searchLower)));
    }
    setFilteredDefinitions(filteredDefs);
  }, [instances, searchQuery, sortConfig, definitions]);

  const truncateText = (text: string, maxLength = 24): string => {
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  };

  const renderProfileBadges = (instanceId: string) => {
    const associatedProfiles = realProfileAssociations[instanceId] || [];
    if (associatedProfiles.length === 0) {
      return <span className="text-muted-foreground text-xs">Not in use</span>;
    }
    return <HoverCard>
        <HoverCardTrigger asChild>
          <div className="px-2 py-1 rounded bg-transparent text-muted-foreground border border-transparent hover:bg-muted/30 transition-colors cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
            {associatedProfiles.length > 1 ? `${truncateText(associatedProfiles[0].name, 16)} +${associatedProfiles.length - 1}` : truncateText(associatedProfiles[0].name, 24)}
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="p-3 w-auto min-w-[220px] max-w-[300px]">
          <div className="text-sm font-medium mb-2">Associated profiles</div>
          <div className="flex flex-col gap-1.5">
            {associatedProfiles.map((profile, idx) => <div key={idx} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${profile.enabled ? 'bg-primary' : 'bg-muted-foreground'}`}></div>
                <span className="text-sm">{profile.name}</span>
              </div>)}
          </div>
        </HoverCardContent>
      </HoverCard>;
  };

  const handleOpenAddInstance = (definition: ServerDefinition) => {
    setSelectedDefinition(definition);
    setAddInstanceOpen(true);
  };

  const handleViewDetails = (instance: ServerInstance) => {
    const definition = definitions.find(d => d.id === instance.definitionId);
    if (!definition) return;
    setSelectedDefinition(definition);
    setSelectedInstance(instance);
    setEditInstanceOpen(true);
  };

  const handleEditServer = (definition: ServerDefinition) => {
    setSelectedDefinition(definition);
    setEditServerOpen(true);
  };

  const handleConfigureServer = (definition: ServerDefinition) => {
    setSelectedDefinition(definition);
    setEditServerOpen(true);
  };

  const handleCreateInstance = (data: InstanceFormValues) => {
    if (!selectedDefinition) return;
    if (data.instanceId) {
      setInstances(prev => prev.map(instance => instance.id === data.instanceId ? {
        ...instance,
        name: data.name,
        environment: data.env,
        arguments: data.args ? data.args.split(' ') : [],
        connectionDetails: selectedDefinition.type === 'HTTP_SSE' ? data.url || instance.connectionDetails : instance.connectionDetails
      } : instance));
      setEditInstanceOpen(false);
      toast({
        title: "Instance Updated",
        description: `${data.name} has been updated successfully.`
      });
    } else {
      const connectionDetails = selectedDefinition.type === 'HTTP_SSE' ? data.url || selectedDefinition.url || `http://localhost:${3000 + instances.length}` : `localhost:${3000 + instances.length}`;
      const newInstance: ServerInstance = {
        id: `instance-${Date.now()}`,
        name: data.name,
        definitionId: selectedDefinition.id,
        status: 'stopped',
        enabled: true,
        connectionDetails: connectionDetails,
        requestCount: 0,
        environment: data.env || {},
        arguments: data.args ? data.args.split(' ') : selectedDefinition.commandArgs ? selectedDefinition.commandArgs.split(' ') : []
      };
      setInstances([...instances, newInstance]);
      setAddInstanceOpen(false);
      toast({
        title: "Instance Created",
        description: `${data.name} has been created successfully.`
      });
    }
  };

  const handleDeleteInstance = (instanceId: string) => {
    setInstances(instances.filter(instance => instance.id !== instanceId));
    toast({
      title: "Instance Deleted",
      description: "The instance has been deleted successfully."
    });
  };

  const handleDeleteDefinition = (definitionId: string) => {
    const definitionInstances = instancesByDefinition[definitionId] || [];
    if (definitionInstances.length > 0) {
      setInstances(instances.filter(instance => instance.definitionId !== definitionId));
    }
    setDefinitions(definitions.filter(def => def.id !== definitionId));
    setFilteredDefinitions(filteredDefinitions.filter(def => def.id !== definitionId));
    toast({
      title: "Server Deleted",
      description: "The server and its instances have been deleted successfully."
    });
  };

  const handleAddNewServer = () => {
    setAddServerDialogOpen(true);
  };

  const handleCreateServer = (serverData: {
    name: string;
    type: 'HTTP_SSE' | 'STDIO';
    description?: string;
    url?: string;
    commandArgs?: string;
  }) => {
    const newDefinition: ServerDefinition = {
      id: `def-${Date.now()}`,
      name: serverData.name,
      type: serverData.type,
      version: "1.0.0",
      description: serverData.description || "Custom server",
      downloads: 0,
      isOfficial: false,
      url: serverData.type === 'HTTP_SSE' ? serverData.url : undefined,
      commandArgs: serverData.type === 'STDIO' ? serverData.commandArgs : undefined,
      environment: {},
      headers: {}
    };
    const updatedDefinitions = [...definitions, newDefinition];
    setDefinitions(updatedDefinitions);
    setFilteredDefinitions(updatedDefinitions);
    toast({
      title: "Server Created",
      description: `${serverData.name} has been created successfully.`
    });
    setAddServerDialogOpen(false);
  };

  const handleUpdateServer = (data: EditServerFormValues) => {
    if (!selectedDefinition) return;
    const updatedDefinition: ServerDefinition = {
      ...selectedDefinition,
      name: data.name || selectedDefinition.name,
      description: data.description || selectedDefinition.description,
      url: selectedDefinition.type === 'HTTP_SSE' ? data.url : undefined,
      commandArgs: selectedDefinition.type === 'STDIO' ? data.commandArgs : undefined,
      environment: selectedDefinition.type === 'STDIO' ? data.environment : {},
      headers: selectedDefinition.type === 'HTTP_SSE' ? data.headers : {}
    };
    setDefinitions(prev => prev.map(def => def.id === selectedDefinition.id ? updatedDefinition : def));
    setFilteredDefinitions(prev => prev.map(def => def.id === selectedDefinition.id ? updatedDefinition : def));
    setEditServerOpen(false);
    toast({
      title: "Server Updated",
      description: `${updatedDefinition.name} has been updated successfully.`
    });
  };

  const handleNavigateToDiscovery = () => {
    navigate('/discovery');
  };

  const handleConnect = (instanceId: string) => {
    setInstanceStatuses(prev => ({
      ...prev,
      [instanceId]: 'connecting'
    }));
    
    setTimeout(() => {
      const isSuccessful = Math.random() > 0.3;
      setInstanceStatuses(prev => ({
        ...prev,
        [instanceId]: isSuccessful ? 'success' : 'failed'
      }));
      
      if (isSuccessful) {
        toast({
          title: "Connection Successful",
          description: "The server instance is running properly.",
          type: "success"
        });
      } else {
        toast({
          title: "Connection Failed",
          description: "Could not connect to the server instance. Please check your configuration.",
          type: "error"
        });
      }
    }, 2000);
  };

  const handleOpenToolsDialog = (instanceId: string, definitionId: string) => {
    const instance = instances.find(i => i.id === instanceId);
    const definition = definitions.find(d => d.id === definitionId);
    if (instance && definition) {
      setSelectedServerTools({
        tools: definition.tools || [],
        serverName: instance.name,
        instanceId: instance.id,
        definitionId: definition.id
      });
      setToolsDialogOpen(true);
    }
  };

  const hasSearchResults = filteredDefinitions.length > 0;

  return <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Servers</h1>
          <p className="text-muted-foreground">
            Manage server definitions and their instances
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleAddNewServer}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Server
          </Button>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input type="search" placeholder="Search servers..." className="pl-8 w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
      </div>
      
      {hasSearchResults ? <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {filteredDefinitions.map(definition => {
        const definitionInstances = instancesByDefinition[definition.id] || [];
        const filteredDefInstances = definitionInstances.filter(instance => filteredInstances.some(fi => fi.id === instance.id));
        const isCustom = !definition.isOfficial;
        return <Card key={definition.id} className="overflow-hidden flex flex-col">
                <CardHeader className="pb-2 bg-secondary/30">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="flex items-center gap-2">
                        <span>{truncateText(definition.name)}</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                onClick={() => handleConfigureServer(definition)}
                              >
                                <Settings className="h-3.5 w-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Configure Server</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <div className="flex items-center gap-1">
                          <EndpointLabel type={definition.type} />
                          {isCustom && <Badge variant="outline" className="text-gray-600 border-gray-300 rounded-md">
                              Custom
                            </Badge>}
                        </div>
                      </CardTitle>
                      <CardDescription>
                        {truncateText(definition.description, 60)}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-4 flex-grow">                  
                  {filteredDefInstances.length > 0 && <div className="border rounded-md overflow-hidden mt-2">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Instance Name</TableHead>
                            <TableHead className="w-[40%] pr-2">Profile</TableHead>
                            <TableHead className="text-left">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredDefInstances.map(instance => <TableRow key={instance.id}>
                              <TableCell className="font-medium">
                                {truncateText(instance.name)}
                              </TableCell>
                              <TableCell className="pr-2">
                                {renderProfileBadges(instance.id)}
                              </TableCell>
                              <TableCell className="space-x-1 flex">
                                <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700 hover:border-green-600 transition-colors" onClick={() => handleConnect(instance.id)} disabled={instanceStatuses[instance.id] === 'connecting'}>
                                  {instanceStatuses[instance.id] === 'connecting' ? <span className="h-4 w-4 mr-1 animate-spin border-2 border-current border-t-transparent rounded-full inline-block" /> : <Terminal className="h-4 w-4 mr-1" />}
                                  Connect
                                </Button>
                                
                                {definition.tools && definition.tools.length > 0 && <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button variant="outline" size="icon" className="text-purple-500 hover:text-purple-600 hover:border-purple-500 transition-colors h-9 w-9" onClick={() => handleOpenToolsDialog(instance.id, definition.id)}>
                                          <Wrench className="h-4 w-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Debug Tools</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>}
                                
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant="outline" size="icon" className="text-blue-500 hover:text-blue-600 hover:border-blue-500 transition-colors h-9 w-9" onClick={() => handleViewDetails(instance)}>
                                        <Info className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>View details</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                
                                <AlertDialog>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <AlertDialogTrigger asChild>
                                          <Button variant="outline" size="icon" className="text-destructive hover:text-destructive hover:border-destructive transition-colors h-9 w-9">
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </AlertDialogTrigger>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Delete instance</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This will permanently delete the instance "{instance.name}". 
                                        This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => handleDeleteInstance(instance.id)}>
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </TableCell>
                            </TableRow>)}
                        </TableBody>
                      </Table>
                    </div>}
                  
                  {filteredDefInstances.length === 0 && <div className="text-center p-6 border rounded-md bg-secondary/10 flex flex-col items-center">
                      <div className="h-8 w-8 text-muted-foreground/50 mb-2" />
                      <p className="text-muted-foreground mb-4">No instances created for this server definition</p>
                      <Button variant="outline" size="sm" className="hover:bg-secondary/50 transition-all duration-300 hover:scale-105" onClick={() => handleOpenAddInstance(definition)}>
                        <CirclePlus className="h-4 w-4 mr-1" />
                        Create First Instance
                      </Button>
                    </div>}
                </CardContent>
                
                <CardFooter className="flex justify-between pt-4 pb-4 border-t mt-2 bg-secondary/10">
                  <div className="flex space-x-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Server</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the server definition "{definition.name}" 
                            {definitionInstances.length > 0 && ` and all its ${definitionInstances.length} instances`}. 
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => handleDeleteDefinition(definition.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <Button variant="ghost" size="sm" onClick={() => handleEditServer(definition)} className="text-blue-600 hover:bg-blue-600/10">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>

                  <Button variant="default" size="sm" onClick={() => handleOpenAddInstance(definition)}>
                    <CirclePlus className="h-4 w-4 mr-1" />
                    Add Instance
                  </Button>
                </CardFooter>
              </Card>;
      })}
          
          <Card className="border-dashed border-2 flex flex-col items-center justify-center h-[300px]">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <PlusCircle className="h-8 w-8 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center">
                Add a new server definition
              </p>
              <Button className="mt-4 hover:scale-105 transition-all duration-300" onClick={handleAddNewServer}>
                Add
              </Button>
            </CardContent>
          </Card>
        </div> : searchQuery && <NoSearchResults query={searchQuery} onClear={clearSearch} entityName="servers" />}
      
      <AddInstanceDialog open={addInstanceOpen} onOpenChange={setAddInstanceOpen} serverDefinition={selectedDefinition} onCreateInstance={handleCreateInstance} />

      <AddInstanceDialog open={editInstanceOpen} onOpenChange={setEditInstanceOpen} serverDefinition={selectedDefinition} onCreateInstance={handleCreateInstance} editMode={true} initialValues={selectedInstance ? {
      name: selectedInstance.name,
      args: Array.isArray(selectedInstance.arguments) ? selectedInstance.arguments.join(' ') : selectedInstance.arguments as string || "",
      url: selectedInstance.connectionDetails,
      env: selectedInstance.environment || {},
      headers: {}
    } : undefined} instanceId={selectedInstance?.id} />
      
      <AddServerDialog open={addServerDialogOpen} onOpenChange={setAddServerDialogOpen} onCreateServer={handleCreateServer} onNavigateToDiscovery={handleNavigateToDiscovery} />
      
      <EditServerDialog open={editServerOpen} onOpenChange={setEditServerOpen} serverDefinition={selectedDefinition} onUpdateServer={handleUpdateServer} />
      
      <Dialog open={toolsDialogOpen} onOpenChange={setToolsDialogOpen}>
        <DialogContent className="max-w-4xl h-[600px] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-purple-500" />
              <span>Server Tools - {selectedServerTools.serverName}</span>
            </DialogTitle>
            <DialogDescription>Debug, execute tools, and view message history for this server instance</DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden py-4">
            <ServerToolsList tools={selectedServerTools.tools} debugMode={true} serverName={selectedServerTools.serverName} instanceId={selectedServerTools.instanceId} />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setToolsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>;
};

export default Servers;
