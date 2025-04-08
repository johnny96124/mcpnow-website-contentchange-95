
import { useState, useEffect } from "react";
import { 
  CirclePlus, 
  ExternalLink,
  PlusCircle, 
  Trash2, 
  Globe,
  Terminal,
  AlertCircle,
  Search,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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

const Servers = () => {
  const [definitions] = useState<ServerDefinition[]>(serverDefinitions);
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
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [addServerDialogOpen, setAddServerDialogOpen] = useState(false);
  const [instanceStatuses, setInstanceStatuses] = useState<Record<string, 'success' | 'failed' | 'connecting'>>({});
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Group instances by definition for easier access
  const instancesByDefinition = instances.reduce((acc, instance) => {
    const { definitionId } = instance;
    if (!acc[definitionId]) {
      acc[definitionId] = [];
    }
    acc[definitionId].push(instance);
    return acc;
  }, {} as Record<string, ServerInstance[]>);

  // Maps each instance to the profiles that reference it (mocked for now)
  const instanceProfiles: Record<string, string[]> = {
    "instance-1": ["General Development", "Research"],
    "instance-2": ["Testing"],
    "instance-3": [],
    "instance-4": ["Production", "Research"],
    "instance-5": [],
  };

  useEffect(() => {
    // Filter instances based on search and filter type
    let filtered = [...instances];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(instance => 
        instance.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply type filter
    if (filterType !== "all") {
      filtered = filtered.filter(instance => {
        const definition = definitions.find(d => d.id === instance.definitionId);
        return definition?.type === filterType;
      });
    }
    
    // Apply sorting
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
    
    // Filter definitions based on instances
    const filteredDefs = definitions.filter(def => 
      filterType === "all" || def.type === filterType
    );
    
    setFilteredDefinitions(filteredDefs);
  }, [instances, searchQuery, filterType, sortConfig, definitions]);

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
      // Edit mode
      setInstances(prev => prev.map(instance => 
        instance.id === data.instanceId 
          ? { 
              ...instance, 
              name: data.name, 
              environment: data.env,
              arguments: data.args ? data.args.split(' ') : [] // Convert string to array
            }
          : instance
      ));
      
      setEditInstanceOpen(false);
      toast({
        title: "Instance Updated",
        description: `${data.name} has been updated successfully.`,
      });
    } else {
      // Create mode
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
        arguments: data.args ? data.args.split(' ') : [] // Convert string to array
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
    // Create new server definition
    const newDefinition: ServerDefinition = {
      id: `def-${Date.now()}`,
      name: serverData.name,
      type: serverData.type,
      version: "1.0.0",
      description: serverData.description || "Custom server",
      downloads: 0,
      isOfficial: false
    };
    
    // Add to definitions
    const updatedDefinitions = [...definitions, newDefinition];
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

  const handleDebugInstance = (instanceId: string) => {
    // Set the instance status to connecting
    setInstanceStatuses(prev => ({ ...prev, [instanceId]: 'connecting' }));
    
    // Simulate the connection process
    setTimeout(() => {
      // Randomly determine if connection was successful
      const isSuccessful = Math.random() > 0.3;
      setInstanceStatuses(prev => ({
        ...prev,
        [instanceId]: isSuccessful ? 'success' : 'failed'
      }));
      
      // Show toast message
      toast({
        title: isSuccessful ? "Connection Successful" : "Connection Failed",
        description: isSuccessful 
          ? "The server instance is running properly." 
          : "Could not connect to the server instance. Please check your configuration.",
        variant: isSuccessful ? "default" : "destructive"
      });
    }, 2000);
  };

  const getStatusBadge = (status: 'success' | 'failed' | 'connecting' | undefined) => {
    if (!status) return null;
    
    if (status === 'connecting') {
      return (
        <Badge variant="outline" className="flex items-center gap-1 bg-yellow-50 text-yellow-700 border-yellow-200">
          <Clock className="w-3 h-3" />
          Connecting
        </Badge>
      );
    }
    
    if (status === 'success') {
      return (
        <Badge variant="outline" className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="w-3 h-3" />
          Success
        </Badge>
      );
    }
    
    return (
      <Badge variant="outline" className="flex items-center gap-1 bg-red-50 text-red-700 border-red-200">
        <XCircle className="w-3 h-3" />
        Failed
      </Badge>
    );
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
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
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search servers..."
              className="pl-8 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-10">
                Filter
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56">
              <div className="space-y-4">
                <h4 className="font-medium">Filter by</h4>
                <div className="space-y-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Type</label>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="HTTP_SSE">HTTP SSE</SelectItem>
                        <SelectItem value="STDIO">STDIO</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
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
            // Only show definition instances that match the current filters
            const filteredDefInstances = definitionInstances.filter(
              instance => filteredInstances.some(fi => fi.id === instance.id)
            );
            
            return (
              <Card key={definition.id} className="overflow-hidden">
                <CardHeader className="pb-2 bg-secondary/30">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        {truncateText(definition.name)}
                        <div className="flex items-center gap-1">
                          <EndpointLabel type={definition.type} />
                          {definition.isOfficial ? (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              Official
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
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
                
                <CardContent className="pt-4">                  
                  {filteredDefInstances.length > 0 && (
                    <div className="border rounded-md overflow-hidden mt-2">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Instance Name</TableHead>
                            <TableHead>Profile</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredDefInstances.map(instance => {
                            const profiles = instanceProfiles[instance.id] || [];
                            
                            return (
                              <TableRow key={instance.id}>
                                <TableCell className="font-medium">
                                  <div className="flex items-center gap-2">
                                    {truncateText(instance.name)}
                                    {getStatusBadge(instanceStatuses[instance.id])}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {profiles.length > 0 ? (
                                    <div className="flex flex-wrap gap-1">
                                      {profiles.map((profile, idx) => (
                                        <Badge key={idx} variant="outline" className="text-xs">
                                          {profile}
                                        </Badge>
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="text-muted-foreground text-xs">Not in use</span>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="text-blue-500 hover:text-blue-600 hover:border-blue-500 transition-colors"
                                      onClick={() => handleViewDetails(instance)}
                                    >
                                      <ExternalLink className="h-4 w-4 mr-1" />
                                      Details
                                    </Button>
                                    
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-green-600 hover:text-green-700 hover:border-green-600 transition-colors"
                                      onClick={() => handleDebugInstance(instance.id)}
                                      disabled={instanceStatuses[instance.id] === 'connecting'}
                                    >
                                      {instanceStatuses[instance.id] === 'connecting' ? (
                                        <Clock className="h-4 w-4 mr-1 animate-spin" />
                                      ) : (
                                        <Terminal className="h-4 w-4 mr-1" />
                                      )}
                                      Debug
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
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                  
                  {filteredDefInstances.length === 0 && (
                    <div className="text-center p-6 border rounded-md bg-secondary/10 flex flex-col items-center">
                      <AlertCircle className="h-8 w-8 text-muted-foreground/50 mb-2" />
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
                        <Trash2 className="h-4 w-4" />
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
                  <th className="h-10 px-4 text-left align-middle font-medium">Profiles</th>
                  <th className="h-10 px-4 text-left align-middle font-medium">Status</th>
                  <th className="h-10 px-4 text-left align-middle font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {filteredInstances.map(instance => {
                  const definition = definitions.find(d => d.id === instance.definitionId);
                  const profiles = instanceProfiles[instance.id] || [];
                  
                  return (
                    <tr key={instance.id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4 align-middle">{truncateText(instance.name)}</td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-2">
                          {definition?.icon && <span>{definition.icon}</span>}
                          <span>{truncateText(definition?.name || 'Unknown')}</span>
                          {definition?.isOfficial ? (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                              Official
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs">
                              Custom
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <EndpointLabel type={definition?.type || 'STDIO'} />
                      </td>
                      <td className="p-4 align-middle">
                        {profiles.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {profiles.map((profile, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {profile}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs">Not in use</span>
                        )}
                      </td>
                      <td className="p-4 align-middle">
                        {getStatusBadge(instanceStatuses[instance.id])}
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-blue-500 hover:text-blue-600 hover:border-blue-500 transition-colors"
                            onClick={() => handleViewDetails(instance)}
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Details
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600 hover:text-green-700 hover:border-green-600 transition-colors"
                            onClick={() => handleDebugInstance(instance.id)}
                            disabled={instanceStatuses[instance.id] === 'connecting'}
                          >
                            {instanceStatuses[instance.id] === 'connecting' ? (
                              <Clock className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                              <Terminal className="h-4 w-4 mr-1" />
                            )}
                            Debug
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
      />

      <AddInstanceDialog
        open={editInstanceOpen}
        onOpenChange={setEditInstanceOpen}
        serverDefinition={selectedDefinition}
        onCreateInstance={handleCreateInstance}
        editMode={true}
        initialValues={selectedInstance ? {
          name: selectedInstance.name,
          args: selectedInstance.arguments || "",
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
