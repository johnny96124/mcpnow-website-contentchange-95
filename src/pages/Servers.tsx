
import { useState, useEffect } from "react";
import { 
  CirclePlus, 
  ExternalLink,
  PlusCircle, 
  Trash2, 
  Globe,
  Terminal,
  Info,
  Search,
  LayoutGrid,
  List,
  Filter,
  ArrowDown,
  ArrowUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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
import { 
  serverDefinitions, 
  serverInstances,
  ServerDefinition,
  ServerInstance
} from "@/data/mockData";
import { AddInstanceDialog, InstanceFormValues } from "@/components/servers/AddInstanceDialog";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";

const Servers = () => {
  const [definitions] = useState<ServerDefinition[]>(serverDefinitions);
  const [instances, setInstances] = useState<ServerInstance[]>(serverInstances);
  const [filteredInstances, setFilteredInstances] = useState<ServerInstance[]>(serverInstances);
  const [filteredDefinitions, setFilteredDefinitions] = useState<ServerDefinition[]>(serverDefinitions);
  const [viewMode, setViewMode] = useState<"cards" | "list">("cards");
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
    const definitionIds = new Set(filtered.map(instance => instance.definitionId));
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
              arguments: data.args
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
        connectionDetails: `localhost:${3000 + instances.length}`,
        requestCount: 0,
        environment: data.env,
        arguments: data.args
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

  const handleNavigateToDiscovery = () => {
    navigate('/discovery');
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key, direction });
  };
  
  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="h-4 w-4 ml-1" /> 
      : <ArrowDown className="h-4 w-4 ml-1" />;
  };

  // Function to determine if a card should display "Official" badge
  const isOfficialServer = (definition: ServerDefinition) => {
    // For this example, we'll assume that servers with IDs ending with 0, 1 or 2 are official
    return definition.id.endsWith('0') || definition.id.endsWith('1') || definition.id.endsWith('2');
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
        <Button onClick={handleNavigateToDiscovery}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Server
        </Button>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search servers..."
            className="pl-8 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 w-[400px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 items-center">
          <ToggleGroup type="single" value={viewMode} onValueChange={(val) => val && setViewMode(val as "cards" | "list")}>
            <ToggleGroupItem value="cards" aria-label="Card View">
              <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="List View">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
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
                        <SelectItem value="HTTP_SSE">HTTP</SelectItem>
                        <SelectItem value="STDIO">STDIO</SelectItem>
                        <SelectItem value="CLI_PROCESS">CLI</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      {viewMode === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDefinitions.map(definition => {
            const definitionInstances = instancesByDefinition[definition.id] || [];
            // Only show definition instances that match the current filters
            const filteredDefInstances = definitionInstances.filter(
              instance => filteredInstances.some(fi => fi.id === instance.id)
            );
            
            return (
              <Card key={definition.id} className="overflow-hidden border rounded-lg">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-semibold">
                        {definition.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <EndpointLabel type={definition.type} />
                        {isOfficialServer(definition) && (
                          <span className="endpoint-tag endpoint-official">
                            Official
                          </span>
                        )}
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {}} // This would open details in the future
                      className="gap-1"
                    >
                      <Info className="h-4 w-4" /> Details
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-2 pb-0">
                  <p className="text-sm text-muted-foreground mb-4">
                    {definition.description}
                  </p>
                  
                  {filteredDefInstances.length > 0 && (
                    <div className="border rounded-md overflow-hidden mt-3">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Instance Name</TableHead>
                            <TableHead>Connection</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredDefInstances.map(instance => (
                            <TableRow key={instance.id}>
                              <TableCell className="font-medium">
                                {truncateText(instance.name)}
                              </TableCell>
                              <TableCell>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="flex items-center gap-2">
                                        {definition.type === 'HTTP_SSE' ? (
                                          <Globe className="h-4 w-4 text-blue-500" />
                                        ) : (
                                          <Terminal className="h-4 w-4 text-purple-500" />
                                        )}
                                        <code className="text-xs bg-muted px-2 py-1 rounded">
                                          {truncateText(instance.connectionDetails, 20)}
                                        </code>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-md">
                                      <code className="text-xs">{instance.connectionDetails}</code>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-8 w-8 p-0"
                                    onClick={() => handleViewDetails(instance)}
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                  </Button>
                                  
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                      >
                                        <Trash2 className="h-4 w-4" />
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
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                  
                  {filteredDefInstances.length === 0 && (
                    <div className="text-center p-4 border rounded-md bg-secondary/10 flex flex-col items-center">
                      <p className="text-muted-foreground mb-2">No instances created</p>
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="flex justify-between pt-4 pb-4 border-t mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-destructive border-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Delete Server
                  </Button>

                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => handleOpenAddInstance(definition)}
                  >
                    <CirclePlus className="h-4 w-4 mr-2" />
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
                className="mt-4"
                onClick={handleNavigateToDiscovery}
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
                  <th className="h-10 px-4 text-left align-middle font-medium cursor-pointer" onClick={() => handleSort('name')}>
                    <div className="flex items-center">
                      Name
                      {getSortIcon('name')}
                    </div>
                  </th>
                  <th className="h-10 px-4 text-left align-middle font-medium cursor-pointer" onClick={() => handleSort('definition')}>
                    <div className="flex items-center">
                      Definition
                      {getSortIcon('definition')}
                    </div>
                  </th>
                  <th className="h-10 px-4 text-left align-middle font-medium cursor-pointer" onClick={() => handleSort('type')}>
                    <div className="flex items-center">
                      Type
                      {getSortIcon('type')}
                    </div>
                  </th>
                  <th className="h-10 px-4 text-left align-middle font-medium">Connection Details</th>
                  <th className="h-10 px-4 text-left align-middle font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {filteredInstances.map(instance => {
                  const definition = definitions.find(d => d.id === instance.definitionId);
                  return (
                    <tr key={instance.id} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4 align-middle">{truncateText(instance.name)}</td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-2">
                          {definition?.icon && <span>{definition.icon}</span>}
                          <span>{truncateText(definition?.name || 'Unknown')}</span>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <EndpointLabel type={definition?.type || 'STDIO'} />
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-2">
                          {definition?.type === 'HTTP_SSE' ? (
                            <Globe className="h-4 w-4 text-blue-500" />
                          ) : (
                            <Terminal className="h-4 w-4 text-purple-500" />
                          )}
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {truncateText(instance.connectionDetails, 20)}
                          </code>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleViewDetails(instance)}
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            View Details
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
          args: selectedInstance.arguments,
          env: selectedInstance.environment || {}
        } : undefined}
        instanceId={selectedInstance?.id}
      />
    </div>
  );
};

export default Servers;
