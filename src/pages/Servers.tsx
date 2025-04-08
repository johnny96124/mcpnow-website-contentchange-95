
import { useState, useEffect } from "react";
import { 
  CirclePlus, 
  PlusCircle, 
  Trash2, 
  Terminal,
  Info,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EndpointLabel } from "@/components/status/EndpointLabel";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  serverDefinitions, 
  serverInstances,
  ServerDefinition,
  ServerInstance
} from "@/data/mockData";
import { AddInstanceDialog, InstanceFormValues } from "@/components/servers/AddInstanceDialog";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { AddServerDialog } from "@/components/servers/AddServerDialog";
import { ProfileReference, useHostProfiles } from "@/hooks/useHostProfiles";

const Servers = () => {
  const [definitions, setDefinitions] = useState<ServerDefinition[]>(serverDefinitions);
  const [instances, setInstances] = useState<ServerInstance[]>(serverInstances);
  const [filteredInstances, setFilteredInstances] = useState<ServerInstance[]>(serverInstances);
  const [filteredDefinitions, setFilteredDefinitions] = useState<ServerDefinition[]>(serverDefinitions);
  const [activeTab, setActiveTab] = useState<"definitions" | "instances">("definitions");
  const [addInstanceOpen, setAddInstanceOpen] = useState(false);
  const [editInstanceOpen, setEditInstanceOpen] = useState(false);
  const [selectedDefinition, setSelectedDefinition] = useState<ServerDefinition | null>(null);
  const [selectedInstance, setSelectedInstance] = useState<ServerInstance | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [addServerDialogOpen, setAddServerDialogOpen] = useState(false);
  const [instanceStatuses, setInstanceStatuses] = useState<Record<string, 'success' | 'failed' | 'connecting'>>({});
  const { instanceProfiles } = useHostProfiles();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const instancesByDefinition = instances.reduce((acc, instance) => {
    const { definitionId } = instance;
    if (!acc[definitionId]) {
      acc[definitionId] = [];
    }
    acc[definitionId].push(instance);
    return acc;
  }, {} as Record<string, ServerInstance[]>);

  useEffect(() => {
    let filtered = [...instances];
    
    if (searchQuery) {
      filtered = filtered.filter(instance => 
        instance.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
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
      filteredDefs = filteredDefs.filter(def => 
        def.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredDefinitions(filteredDefs);
  }, [instances, searchQuery, sortConfig, definitions]);

  const truncateText = (text: string, maxLength = 24): string => {
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
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

  const handleCreateInstance = (data: InstanceFormValues) => {
    if (!selectedDefinition) return;
    
    if (data.instanceId) {
      setInstances(prev => prev.map(instance => 
        instance.id === data.instanceId 
          ? { 
              ...instance, 
              name: data.name, 
              environment: data.env,
              arguments: data.args ? data.args.split(' ') : [],
              connectionDetails: selectedDefinition.type === 'HTTP_SSE' 
                ? data.url || instance.connectionDetails
                : instance.connectionDetails
            }
          : instance
      ));
      
      setEditInstanceOpen(false);
      toast({
        title: "Instance Updated",
        description: `${data.name} has been updated successfully.`,
      });
    } else {
      const newInstance: ServerInstance = {
        id: `instance-${Date.now()}`,
        name: data.name,
        definitionId: selectedDefinition.id,
        status: 'stopped',
        enabled: true,
        connectionDetails: selectedDefinition.type === 'HTTP_SSE' 
          ? data.url || `http://localhost:${3000 + instances.length}` 
          : `localhost:${3000 + instances.length}`,
        requestCount: 0,
        environment: data.env,
        arguments: data.args ? data.args.split(' ') : []
      };
      
      setInstances([...instances, newInstance]);
      setAddInstanceOpen(false);
      
      toast({
        title: "Instance Created",
        description: `${data.name} has been created successfully.`,
      });
    }
  };

  const handleDeleteInstance = (instanceId: string) => {
    setInstances(instances.filter(instance => instance.id !== instanceId));
    toast({
      title: "Instance Deleted",
      description: "The instance has been deleted successfully.",
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
      description: "The server and its instances have been deleted successfully.",
    });
  };

  const handleAddNewServer = () => {
    setAddServerDialogOpen(true);
  };

  const handleCreateServer = (serverData: {
    name: string;
    type: 'HTTP_SSE' | 'STDIO';
    description: string;
  }) => {
    const newDefinition: ServerDefinition = {
      id: `def-${Date.now()}`,
      name: serverData.name,
      type: serverData.type,
      version: "1.0.0",
      description: serverData.description || "Custom server",
      downloads: 0,
      isOfficial: false
    };
    
    const updatedDefinitions = [...definitions, newDefinition];
    setDefinitions(updatedDefinitions);
    setFilteredDefinitions(updatedDefinitions);
    
    toast({
      title: "Server Created",
      description: `${serverData.name} has been created successfully.`,
    });
    
    setAddServerDialogOpen(false);
  };

  const handleNavigateToDiscovery = () => {
    navigate('/discovery');
  };

  const handleConnect = (instanceId: string) => {
    setInstanceStatuses(prev => ({ ...prev, [instanceId]: 'connecting' }));
    
    setTimeout(() => {
      const isSuccessful = Math.random() > 0.3;
      setInstanceStatuses(prev => ({
        ...prev,
        [instanceId]: isSuccessful ? 'success' : 'failed'
      }));
      
      toast({
        title: isSuccessful ? "Connection Successful" : "Connection Failed",
        description: isSuccessful 
          ? "The server instance is running properly." 
          : "Could not connect to the server instance. Please check your configuration.",
        variant: isSuccessful ? "default" : "destructive",
      });
    }, 2000);
  };

  // Function to render profile badges with count indicator
  const renderProfileBadges = (instanceId: string) => {
    const profiles = instanceProfiles[instanceId] || [];
    
    if (profiles.length === 0) {
      return (
        <span className="text-muted-foreground text-xs">Not in use</span>
      );
    }
    
    // Show the first profile, and if there are more, show a +n indicator
    const firstProfile = profiles[0];
    const remainingCount = profiles.length - 1;
    
    return (
      <div className="flex flex-wrap gap-1 items-center">
        <Badge variant="outline" className="text-xs">
          {truncateText(firstProfile.name, 16)}
        </Badge>
        
        {remainingCount > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="secondary" className="text-xs cursor-help">
                  +{remainingCount}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <div className="space-y-1">
                  <p className="text-xs font-medium">Other profiles using this instance:</p>
                  <ul className="text-xs space-y-0.5">
                    {profiles.slice(1).map((profile, idx) => (
                      <li key={idx}>{profile.name}</li>
                    ))}
                  </ul>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    );
  };
  
  return (
    <div className="space-y-6 animate-fade-in pb-12">
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
      
      <div className="flex items-center justify-between">
        <div className="relative flex-1 mr-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search servers..."
            className="pl-8 w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as "definitions" | "instances")}>
          <TabsList>
            <TabsTrigger value="definitions">Server Definitions</TabsTrigger>
            <TabsTrigger value="instances">Server Instances</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {activeTab === "definitions" ? (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {filteredDefinitions.map(definition => {
            const definitionInstances = instancesByDefinition[definition.id] || [];
            const filteredDefInstances = definitionInstances.filter(
              instance => filteredInstances.some(fi => fi.id === instance.id)
            );
            const isCustom = !definition.isOfficial;
            
            return (
              <Card key={definition.id} className="overflow-hidden flex flex-col">
                <CardHeader className="pb-2 bg-secondary/30">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        {truncateText(definition.name)}
                        <div className="flex items-center gap-1">
                          <EndpointLabel type={definition.type} />
                          {isCustom && (
                            <Badge variant="outline" className="text-gray-600 border-gray-300 rounded-md">
                              Custom
                            </Badge>
                          )}
                        </div>
                      </CardTitle>
                      <CardDescription>
                        {truncateText(definition.description, 60)}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-4 flex-grow">                  
                  {filteredDefInstances.length > 0 && (
                    <div className="border rounded-md overflow-hidden mt-2">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Instance Name</TableHead>
                            <TableHead className="w-[40%]">Profiles</TableHead>
                            <TableHead className="text-right pr-6">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredDefInstances.map(instance => (
                            <TableRow key={instance.id}>
                              <TableCell className="font-medium">
                                {truncateText(instance.name)}
                              </TableCell>
                              <TableCell>
                                {renderProfileBadges(instance.id)}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="text-green-600 hover:text-green-700 hover:border-green-600 transition-colors"
                                    onClick={() => handleConnect(instance.id)}
                                    disabled={instanceStatuses[instance.id] === 'connecting'}
                                  >
                                    {instanceStatuses[instance.id] === 'connecting' ? (
                                      <span className="h-4 w-4 mr-1 animate-spin border-2 border-current border-t-transparent rounded-full inline-block" />
                                    ) : (
                                      <Terminal className="h-4 w-4 mr-1" />
                                    )}
                                    Connect
                                  </Button>
                                  
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button 
                                          variant="outline" 
                                          size="icon"
                                          className="text-blue-500 hover:text-blue-600 hover:border-blue-500 transition-colors h-9 w-9"
                                          onClick={() => handleViewDetails(instance)}
                                        >
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
                                            <Button 
                                              variant="outline" 
                                              size="icon"
                                              className="text-destructive hover:text-destructive hover:border-destructive transition-colors h-9 w-9"
                                            >
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
                                        <AlertDialogAction 
                                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                          onClick={() => handleDeleteInstance(instance.id)}
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                  
                  {filteredDefInstances.length === 0 && (
                    <div className="text-center p-6 border rounded-md bg-secondary/10 flex flex-col items-center">
                      <div className="h-8 w-8 text-muted-foreground/50 mb-2" />
                      <p className="text-muted-foreground mb-4">No instances created for this server definition</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="hover:bg-secondary/50 transition-all duration-300 hover:scale-105"
                        onClick={() => handleOpenAddInstance(definition)}
                      >
                        <CirclePlus className="h-4 w-4 mr-1" />
                        Create First Instance
                      </Button>
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="flex justify-between pt-4 pb-4 border-t mt-2 bg-secondary/10">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete Server
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete the server definition "{definition.name}" 
                          {definitionInstances.length > 0 && ` and all its ${definitionInstances.length} instances`}. 
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={() => handleDeleteDefinition(definition.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => handleOpenAddInstance(definition)}
                  >
                    <CirclePlus className="h-4 w-4 mr-1" />
                    Add Instance
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
          
          <Card className="border-dashed border-2 flex flex-col items-center justify-center h-[300px]">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <PlusCircle className="h-8 w-8 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center">
                Add a new server definition
              </p>
              <Button 
                className="mt-4 hover:scale-105 transition-all duration-300"
                onClick={handleAddNewServer}
              >
                Add
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="rounded-md border">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-10 px-4 text-left align-middle font-medium">Name</th>
                  <th className="h-10 px-4 text-left align-middle font-medium">Definition</th>
                  <th className="h-10 px-4 text-left align-middle font-medium">Type</th>
                  <th className="h-10 px-4 text-left align-middle font-medium w-[30%]">Profiles</th>
                  <th className="h-10 px-4 text-right align-middle font-medium pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {filteredInstances.map(instance => {
                  const definition = definitions.find(d => d.id === instance.definitionId);
                  const isCustom = !definition?.isOfficial;
                  
                  return (
                    <tr key={instance.id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4 align-middle">{truncateText(instance.name)}</td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-2">
                          {definition?.icon && <span>{definition.icon}</span>}
                          <span>{truncateText(definition?.name || 'Unknown')}</span>
                          {isCustom && (
                            <Badge variant="outline" className="text-gray-600 border-gray-300 rounded-md text-xs">
                              Custom
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <EndpointLabel type={definition?.type || 'STDIO'} />
                      </td>
                      <td className="p-4 align-middle">
                        {renderProfileBadges(instance.id)}
                      </td>
                      <td className="p-4 align-middle text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-green-600 hover:text-green-700 hover:border-green-600 transition-colors"
                            onClick={() => handleConnect(instance.id)}
                            disabled={instanceStatuses[instance.id] === 'connecting'}
                          >
                            {instanceStatuses[instance.id] === 'connecting' ? (
                              <span className="h-4 w-4 mr-1 animate-spin border-2 border-current border-t-transparent rounded-full inline-block" />
                            ) : (
                              <Terminal className="h-4 w-4 mr-1" />
                            )}
                            Connect
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-blue-500 hover:text-blue-600 hover:border-blue-500 transition-colors"
                            onClick={() => handleViewDetails(instance)}
                          >
                            <Info className="h-4 w-4 mr-1" />
                            Details
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-destructive hover:text-destructive hover:border-destructive transition-colors"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </AlertDialogTrigger>
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
                                <AlertDialogAction 
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  onClick={() => handleDeleteInstance(instance.id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      <AddInstanceDialog
        open={addInstanceOpen}
        onOpenChange={setAddInstanceOpen}
        serverDefinition={selectedDefinition}
        onCreateInstance={handleCreateInstance}
        clearFormOnOpen={true}
      />

      <AddInstanceDialog
        open={editInstanceOpen}
        onOpenChange={setEditInstanceOpen}
        serverDefinition={selectedDefinition}
        onCreateInstance={handleCreateInstance}
        editMode={true}
        initialValues={selectedInstance ? {
          name: selectedInstance.name,
          args: Array.isArray(selectedInstance.arguments) ? selectedInstance.arguments.join(' ') : selectedInstance.arguments as string || "",
          url: selectedInstance.connectionDetails,
          env: selectedInstance.environment || {},
          headers: {}
        } : undefined}
        instanceId={selectedInstance?.id}
      />
      
      <AddServerDialog 
        open={addServerDialogOpen}
        onOpenChange={setAddServerDialogOpen}
        onCreateServer={handleCreateServer}
        onNavigateToDiscovery={handleNavigateToDiscovery}
      />
    </div>
  );
};

export default Servers;
