import { useState, useEffect } from "react";
import { 
  CirclePlus, 
  PlusCircle, 
  Trash2, 
  Terminal,
  Info,
  Search,
  Edit
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
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
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
  ServerInstance,
  profiles,
  RuntimeStatus,
  RuntimeInstance
} from "@/data/mockData";
import { AddInstanceDialog, InstanceFormValues } from "@/components/servers/AddInstanceDialog";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { AddServerDialog } from "@/components/servers/AddServerDialog";
import { EditServerDialog, EditServerFormValues } from "@/components/servers/EditServerDialog";
import { RuntimeInstancesList } from "@/components/servers/RuntimeInstancesList";

// Mock hosts data
const mockHosts = [
  { id: 'host-1', name: 'Cursor', icon: '⌨️' },
  { id: 'host-2', name: 'Claude Desktop', icon: '🧠' },
  { id: 'host-3', name: 'Windsurf', icon: '🏄' },
];

// Mock runtime instances for demonstration
const generateMockRuntimeInstances = (): RuntimeInstance[] => {
  const now = new Date();
  const runtimes: RuntimeInstance[] = [
    {
      id: 'runtime-1',
      instanceId: 'postgres-dev',
      profileId: 'general-dev',
      hostId: 'host-1',
      status: 'connected' as RuntimeStatus,
      startedAt: new Date(now.getTime() - 1000 * 60 * 30), // Started 30 minutes ago
      requestCount: 42,
      lastActivityAt: new Date(now.getTime() - 1000 * 60 * 5) // Activity 5 minutes ago
    },
    {
      id: 'runtime-2',
      instanceId: 'github-copilot',
      profileId: 'database-ops',
      hostId: 'host-3',
      status: 'connecting' as RuntimeStatus,
      startedAt: new Date(now.getTime() - 1000 * 20), // Started 20 seconds ago
      requestCount: 0,
      lastActivityAt: undefined
    },
    {
      id: 'runtime-3',
      instanceId: 'docker-tools-dev',
      profileId: 'project-x',
      hostId: 'host-2',
      status: 'failed' as RuntimeStatus,
      errorMessage: 'Permission denied when accessing /var/run/docker.sock',
      startedAt: new Date(now.getTime() - 1000 * 60 * 10), // Started 10 minutes ago
      requestCount: 3,
      lastActivityAt: new Date(now.getTime() - 1000 * 60 * 9) // Activity 9 minutes ago
    }
  ];
  return runtimes;
};

const Servers = () => {
  const [definitions, setDefinitions] = useState<ServerDefinition[]>(serverDefinitions);
  const [instances, setInstances] = useState<ServerInstance[]>(serverInstances);
  const [filteredInstances, setFilteredInstances] = useState<ServerInstance[]>(serverInstances);
  const [filteredDefinitions, setFilteredDefinitions] = useState<ServerDefinition[]>(serverDefinitions);
  const [activeTab, setActiveTab] = useState<"definitions" | "instances">("definitions");
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
  
  // New state for runtime instances
  const [runtimeInstances, setRuntimeInstances] = useState(generateMockRuntimeInstances());
  
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

  const realProfileAssociations = profiles.reduce((acc, profile) => {
    profile.instances.forEach(instanceId => {
      if (!acc[instanceId]) {
        acc[instanceId] = [];
      }
      acc[instanceId].push(profile);
    });
    return acc;
  }, {} as Record<string, typeof profiles>);

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

  const renderProfileBadges = (instanceId: string, isTableView = false) => {
    const associatedProfiles = realProfileAssociations[instanceId] || [];
    
    if (associatedProfiles.length === 0) {
      return <span className="text-muted-foreground text-xs">Not in use</span>;
    }
    
    const firstProfile = associatedProfiles[0];
    const remainingCount = associatedProfiles.length - 1;
    
    // Use different truncation length based on whether it's in table view
    const maxLength = isTableView ? 20 : 16;
    
    return (
      <div className="flex items-center gap-1">
        <Badge 
          variant={firstProfile.enabled ? "default" : "outline"} 
          className="text-xs"
        >
          {truncateText(firstProfile.name, maxLength)}
        </Badge>
        
        {remainingCount > 0 && (
          <HoverCard>
            <HoverCardTrigger asChild>
              <Badge 
                variant="secondary" 
                className="text-xs cursor-pointer"
              >
                +{remainingCount}
              </Badge>
            </HoverCardTrigger>
            <HoverCardContent className="p-3 w-auto min-w-[220px] max-w-[300px]">
              <div className="text-sm font-medium mb-2">All associated profiles</div>
              <div className="flex flex-col gap-1.5">
                {associatedProfiles.map((profile, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${profile.enabled ? 'bg-primary' : 'bg-muted-foreground'}`}></div>
                    <span className="text-sm">{profile.name}</span>
                  </div>
                ))}
              </div>
            </HoverCardContent>
          </HoverCard>
        )}
      </div>
    );
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
      // For new instances, use the server definition's pre-configured values
      const connectionDetails = selectedDefinition.type === 'HTTP_SSE' 
        ? (data.url || selectedDefinition.url || `http://localhost:${3000 + instances.length}`) 
        : `localhost:${3000 + instances.length}`;
      
      const newInstance: ServerInstance = {
        id: `instance-${Date.now()}`,
        name: data.name,
        definitionId: selectedDefinition.id,
        status: 'stopped',
        enabled: true,
        connectionDetails: connectionDetails,
        requestCount: 0,
        environment: data.env || {},
        arguments: data.args ? data.args.split(' ') : (selectedDefinition.commandArgs ? selectedDefinition.commandArgs.split(' ') : [])
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
    
    // Remove any associated runtime instances
    setRuntimeInstances(runtimeInstances.filter(
      runtime => runtime.instanceId !== instanceId
    ));
    
    toast({
      title: "Instance Deleted",
      description: "The instance has been deleted successfully.",
    });
  };

  const handleDeleteDefinition = (definitionId: string) => {
    const definitionInstances = instancesByDefinition[definitionId] || [];
    if (definitionInstances.length > 0) {
      const instanceIds = definitionInstances.map(i => i.id);
      
      // Remove instances
      setInstances(instances.filter(instance => instance.definitionId !== definitionId));
      
      // Remove any associated runtime instances
      setRuntimeInstances(runtimeInstances.filter(
        runtime => !instanceIds.includes(runtime.instanceId)
      ));
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
      description: `${serverData.name} has been created successfully.`,
    });
    
    setAddServerDialogOpen(false);
  };
  
  const handleUpdateServer = (data: EditServerFormValues) => {
    if (!selectedDefinition) return;
    
    const updatedDefinition: ServerDefinition = {
      ...selectedDefinition,
      url: selectedDefinition.type === 'HTTP_SSE' ? data.url : undefined,
      commandArgs: selectedDefinition.type === 'STDIO' ? data.commandArgs : undefined,
      environment: selectedDefinition.type === 'STDIO' ? data.environment : {},
      headers: selectedDefinition.type === 'HTTP_SSE' ? data.headers : {}
    };
    
    setDefinitions(prev => 
      prev.map(def => def.id === selectedDefinition.id ? updatedDefinition : def)
    );
    
    setFilteredDefinitions(prev =>
      prev.map(def => def.id === selectedDefinition.id ? updatedDefinition : def)
    );
    
    setEditServerOpen(false);
    
    toast({
      title: "Server Updated",
      description: `${selectedDefinition.name} has been updated successfully.`,
    });
  };

  const handleNavigateToDiscovery = () => {
    navigate('/discovery');
  };

  // Handler for connecting instances was already here, but we'll modify it
  // to create an actual runtime instance
  const handleConnect = (instanceId: string) => {
    setInstanceStatuses(prev => ({ ...prev, [instanceId]: 'connecting' }));
    
    // Check if instance already has a runtime
    const existingRuntime = runtimeInstances.find(r => r.instanceId === instanceId);
    if (existingRuntime) {
      toast({
        title: "Already Running",
        description: "This instance is already running in a runtime.",
      });
      setInstanceStatuses(prev => ({ ...prev, [instanceId]: 'success' }));
      return;
    }
    
    // Find a random profile that uses this instance
    const instance = instances.find(i => i.id === instanceId);
    if (!instance) return;
    
    const associatedProfiles = realProfileAssociations[instanceId] || [];
    if (associatedProfiles.length === 0) {
      toast({
        title: "No Profile Found",
        description: "This instance is not used by any profile.",
        variant: "destructive",
      });
      setInstanceStatuses(prev => ({ ...prev, [instanceId]: 'failed' }));
      return;
    }
    
    // Pick a random enabled profile
    const enabledProfiles = associatedProfiles.filter(p => p.enabled);
    if (enabledProfiles.length === 0) {
      toast({
        title: "No Enabled Profile",
        description: "No enabled profile is using this instance.",
        variant: "destructive",
      });
      setInstanceStatuses(prev => ({ ...prev, [instanceId]: 'failed' }));
      return;
    }
    
    const profile = enabledProfiles[Math.floor(Math.random() * enabledProfiles.length)];
    const host = mockHosts[Math.floor(Math.random() * mockHosts.length)];
    
    // Simulate connection delay
    setTimeout(() => {
      const isSuccessful = Math.random() > 0.3;
      setInstanceStatuses(prev => ({
        ...prev,
        [instanceId]: isSuccessful ? 'success' : 'failed'
      }));
      
      // Create a new runtime instance
      if (isSuccessful) {
        const now = new Date();
        const newRuntime = {
          id: `runtime-${Date.now()}`,
          instanceId,
          profileId: profile.id,
          hostId: host.id,
          status: 'connected' as RuntimeStatus,
          startedAt: now,
          requestCount: 0,
          lastActivityAt: now
        };
        
        setRuntimeInstances(prev => [...prev, newRuntime]);
        
        toast({
          title: "Connection Successful",
          description: `The server instance is running on ${host.name} via ${profile.name} profile.`,
        });
      } else {
        // Add a failed runtime instance
        const now = new Date();
        const newRuntime = {
          id: `runtime-${Date.now()}`,
          instanceId,
          profileId: profile.id,
          hostId: host.id,
          status: 'failed' as RuntimeStatus,
          errorMessage: "Connection refused. The server might be unavailable or blocked by a firewall.",
          startedAt: now,
          requestCount: 0
        };
        
        setRuntimeInstances(prev => [...prev, newRuntime]);
        
        toast({
          title: "Connection Failed",
          description: "Could not connect to the server instance. Check logs for details.",
          variant: "destructive",
        });
      }
    }, 2000);
  };
  
  // New handlers for Runtime operations
  const handleRuntimeDisconnect = (runtimeId: string) => {
    const runtime = runtimeInstances.find(r => r.id === runtimeId);
    if (!runtime) return;
    
    // If connecting, just remove it
    if (runtime.status === 'connecting') {
      setRuntimeInstances(prev => prev.filter(r => r.id !== runtimeId));
      
      toast({
        title: "Connection Cancelled",
        description: "The connection attempt was cancelled.",
      });
      return;
    }
    
    // Set to disconnected for animation
    setRuntimeInstances(prev => 
      prev.map(r => r.id === runtimeId ? { ...r, status: 'disconnected' as RuntimeStatus } : r)
    );
    
    // After a short delay, remove the runtime
    setTimeout(() => {
      setRuntimeInstances(prev => prev.filter(r => r.id !== runtimeId));
      
      toast({
        title: "Disconnected",
        description: "The server instance has been disconnected.",
      });
    }, 1000);
  };
  
  const handleRuntimeReconnect = (runtimeId: string) => {
    const runtime = runtimeInstances.find(r => r.id === runtimeId);
    if (!runtime) return;
    
    // Set to connecting
    setRuntimeInstances(prev => 
      prev.map(r => r.id === runtimeId ? { ...r, status: 'connecting' as RuntimeStatus } : r)
    );
    
    // Simulate reconnection attempt
    setTimeout(() => {
      const isSuccessful = Math.random() > 0.2;
      
      if (isSuccessful) {
        setRuntimeInstances(prev => 
          prev.map(r => r.id === runtimeId 
            ? { 
                ...r, 
                status: 'connected' as RuntimeStatus, 
                errorMessage: undefined,
                lastActivityAt: new Date()
              } 
            : r
          )
        );
        
        toast({
          title: "Reconnection Successful",
          description: "The server instance has been reconnected successfully.",
        });
      } else {
        setRuntimeInstances(prev => 
          prev.map(r => r.id === runtimeId 
            ? { 
                ...r, 
                status: 'failed' as RuntimeStatus, 
                errorMessage: "Reconnection failed. The server might be unavailable.",
                lastActivityAt: r.lastActivityAt
              } 
            : r
          )
        );
        
        toast({
          title: "Reconnection Failed",
          description: "Could not reconnect to the server instance.",
          variant: "destructive",
        });
      }
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
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
      
      {/* Runtime Instances Section */}
      <RuntimeInstancesList 
        runtimeInstances={runtimeInstances}
        serverInstances={instances}
        serverDefinitions={definitions}
        profiles={profiles}
        hosts={mockHosts}
        onReconnect={handleRuntimeReconnect}
        onDisconnect={handleRuntimeDisconnect}
      />
      
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
                            <TableHead className="w-[40%] pr-2">Profile</TableHead>
                            <TableHead className="text-left">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredDefInstances.map(instance => (
                            <TableRow key={instance.id}>
                              <TableCell className="font-medium">
                                {truncateText(instance.name)}
                              </TableCell>
                              <TableCell className="pr-2">
                                {renderProfileBadges(instance.id)}
                              </TableCell>
                              <TableCell className="space-x-1 flex">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="text-green-600 hover:text-green-700 hover:border-green-600 transition-colors"
                                  onClick={() => handleConnect(instance.id)}
                                  disabled={instanceStatuses[instance.id] === 'connecting' || 
                                           runtimeInstances.some(r => r.instanceId === instance.id && 
                                                                    (r.status === 'connected' || r.status === 'connecting'))}
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
                                            disabled={runtimeInstances.some(r => r.instanceId === instance.id)}
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
                  <div className="flex space-x-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive hover:bg-destructive/10"
                          disabled={definitionInstances.some(instance => 
                            runtimeInstances.some(r => r.instanceId === instance.id)
                          )}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
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
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditServer(definition)}
                      className="text-blue-600 hover:bg-blue-600/10"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>

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
                  <th className="h-10 px-4 text-left align-middle font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInstances.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-muted-foreground">
                      No instances found. Try changing your search query.
                    </td>
                  </tr>
                ) : (
                  filteredInstances.map(instance => {
                    const definition = definitions.find(d => d.id === instance.definitionId);
                    if (!definition) return null;
                    
                    return (
                      <tr key={instance.id} className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle font-medium">{instance.name}</td>
                        <td className="p-4 align-middle">{definition.name}</td>
                        <td className="p-4 align-middle">
                          <EndpointLabel type={definition.type} compact />
                        </td>
                        <td className="p-4 align-middle">
                          {renderProfileBadges(instance.id, true)}
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex items-center space-x-1">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-green-600 hover:text-green-700 hover:border-green-600 transition-colors h-8"
                              onClick={() => handleConnect(instance.id)}
                              disabled={instanceStatuses[instance.id] === 'connecting' || 
                                       runtimeInstances.some(r => r.instanceId === instance.id && 
                                                                (r.status === 'connected' || r.status === 'connecting'))}
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
                                    className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:border-blue-500 transition-colors"
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
                                        className="h-8 w-8 text-destructive hover:text-destructive hover:border-destructive transition-colors"
                                        disabled={runtimeInstances.some(r => r.instanceId === instance.id)}
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
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      <AddInstanceDialog 
        open={addInstanceOpen} 
        onOpenChange={setAddInstanceOpen}
        serverDefinition={selectedDefinition}
        selectedInstance={selectedInstance}
        onCreateInstance={handleCreateInstance}
      />
      
      <AddServerDialog
        open={addServerDialogOpen}
        onOpenChange={setAddServerDialogOpen}
        onCreateServer={handleCreateServer}
        onNavigateToDiscovery={handleNavigateToDiscovery}
      />
      
      <EditServerDialog
        open={editServerOpen}
        onOpenChange={setEditServerOpen}
        serverDefinition={selectedDefinition}
        onUpdateServer={handleUpdateServer}
      />
    </div>
  );
};

export default Servers;
