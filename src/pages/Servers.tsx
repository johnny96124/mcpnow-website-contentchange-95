import { useState } from "react";
import { 
  CirclePlus, 
  Edit, 
  ExternalLink, 
  MoreHorizontal, 
  PlayCircle, 
  PlusCircle, 
  StopCircle, 
  Trash2, 
  Globe,
  Terminal,
  AlertCircle,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EndpointLabel } from "@/components/status/EndpointLabel";
import { StatusIndicator } from "@/components/status/StatusIndicator";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
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
  serverDefinitions, 
  serverInstances,
  ServerDefinition,
  ServerInstance
} from "@/data/mockData";
import { AddInstanceDialog, InstanceFormValues } from "@/components/servers/AddInstanceDialog";
import { useToast } from "@/hooks/use-toast";

const Servers = () => {
  const [definitions] = useState<ServerDefinition[]>(serverDefinitions);
  const [instances, setInstances] = useState<ServerInstance[]>(serverInstances);
  const [activeTab, setActiveTab] = useState("integrated");
  const [addInstanceOpen, setAddInstanceOpen] = useState(false);
  const [selectedDefinition, setSelectedDefinition] = useState<ServerDefinition | null>(null);
  const { toast } = useToast();
  
  const toggleInstanceStatus = (instanceId: string) => {
    setInstances(prevInstances => 
      prevInstances.map(instance => {
        if (instance.id === instanceId) {
          const newStatus = instance.status === 'running' ? 'stopped' : 'connecting';
          return { ...instance, status: newStatus };
        }
        return instance;
      })
    );
    
    const instance = instances.find(i => i.id === instanceId);
    if (instance && instance.status !== 'running') {
      setTimeout(() => {
        setInstances(prevInstances => 
          prevInstances.map(instance => {
            if (instance.id === instanceId && instance.status === 'connecting') {
              const newStatus = Math.random() > 0.2 ? 'running' : 'error';
              return { ...instance, status: newStatus };
            }
            return instance;
          })
        );
      }, 1500);
    }
  };
  
  const instancesByDefinition = instances.reduce((acc, instance) => {
    const { definitionId } = instance;
    if (!acc[definitionId]) {
      acc[definitionId] = [];
    }
    acc[definitionId].push(instance);
    return acc;
  }, {} as Record<string, ServerInstance[]>);
  
  const getRequestCount = (definitionId: string): number => {
    const definitionInstances = instancesByDefinition[definitionId] || [];
    return definitionInstances.reduce((total, instance) => total + (instance.requestCount || 0), 0);
  };

  const truncateDescription = (description: string, maxLength = 100): string => {
    if (description.length <= maxLength) return description;
    return `${description.substring(0, maxLength)}...`;
  };
  
  const handleOpenAddInstance = (definition: ServerDefinition) => {
    setSelectedDefinition(definition);
    setAddInstanceOpen(true);
  };

  const handleCreateInstance = (data: InstanceFormValues) => {
    if (!selectedDefinition) return;
    
    const newInstance: ServerInstance = {
      id: `instance-${Date.now()}`,
      name: data.name,
      definitionId: selectedDefinition.id,
      status: 'stopped',
      connectionDetails: `localhost:${3000 + instances.length}`,
      requestCount: 0,
      environment: data.env,
      arguments: [data.args] // Convert the string to an array with a single element
    };
    
    setInstances([...instances, newInstance]);
    setAddInstanceOpen(false);
    
    toast({
      title: "Instance Created",
      description: `${data.name} has been created successfully.`,
    });
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
          <Button variant="outline">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Instance
          </Button>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Define New Server
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="integrated" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="integrated">Integrated View</TabsTrigger>
          <TabsTrigger value="definitions">Server Definitions</TabsTrigger>
          <TabsTrigger value="instances">Server Instances</TabsTrigger>
        </TabsList>
        
        <TabsContent value="integrated" className="mt-4">
          <div className="grid gap-6 grid-cols-1">
            {definitions.map(definition => {
              const definitionInstances = instancesByDefinition[definition.id] || [];
              
              return (
                <Card key={definition.id} className="overflow-hidden">
                  <CardHeader className="pb-2 bg-secondary/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center mb-4">
                          {definition.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-3">
                          <EndpointLabel type={definition.type} />
                          <CardDescription className="text-xs">
                            v{definition.version}
                          </CardDescription>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="hover:bg-secondary/50 transition-all duration-300 hover:scale-105 hover:shadow-md"
                        onClick={() => handleOpenAddInstance(definition)}
                      >
                        <CirclePlus className="h-4 w-4 mr-1" />
                        Add Instance
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {truncateDescription(definition.description)}
                    </p>
                    
                    {definitionInstances.length > 0 && (
                      <div className="border rounded-md overflow-hidden mt-6">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Instance Name</TableHead>
                              <TableHead>Connection</TableHead>
                              <TableHead>Requests</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {definitionInstances.map(instance => (
                              <TableRow key={instance.id}>
                                <TableCell className="font-medium">
                                  <div className="flex items-center gap-2">
                                    <StatusIndicator 
                                      status={
                                        instance.status === 'running' ? 'active' : 
                                        instance.status === 'connecting' ? 'warning' :
                                        instance.status === 'error' ? 'error' : 'inactive'
                                      } 
                                      label={instance.name}
                                    />
                                  </div>
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
                                            {instance.connectionDetails}
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
                                  {instance.requestCount || 0}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    {instance.status === 'running' ? (
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => toggleInstanceStatus(instance.id)}
                                        className="text-amber-500 hover:text-red-500 hover:border-red-500 transition-colors"
                                      >
                                        <StopCircle className="h-4 w-4 mr-1" />
                                        Stop
                                      </Button>
                                    ) : instance.status === 'connecting' ? (
                                      <Button variant="outline" size="sm" disabled>
                                        <span className="animate-pulse">Connecting...</span>
                                      </Button>
                                    ) : (
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => toggleInstanceStatus(instance.id)}
                                        className="text-emerald-500 hover:text-emerald-600 hover:border-emerald-500 transition-colors"
                                      >
                                        <PlayCircle className="h-4 w-4 mr-1" />
                                        Start
                                      </Button>
                                    )}
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                          <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent>
                                        <DropdownMenuItem>
                                          <ExternalLink className="h-4 w-4 mr-2" />
                                          View Details
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive">
                                          <Trash2 className="h-4 w-4 mr-2" />
                                          Delete
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                    
                    {definitionInstances.length === 0 && (
                      <div className="text-center p-8 border rounded-md bg-secondary/10 flex flex-col items-center">
                        <AlertCircle className="h-10 w-10 text-muted-foreground/50 mb-2" />
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
                  
                  <CardFooter className="flex justify-end pt-4 pb-4 border-t mt-2 bg-secondary/10">
                    {definitionInstances.length > 0 ? (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete Server
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the server definition "{definition.name}" and all its {definitionInstances.length} instances. 
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    ) : (
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete Server
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
            
            <Card className="border-dashed border-2 flex flex-col items-center justify-center h-[300px]">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <PlusCircle className="h-8 w-8 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">
                  Define a new server template
                </p>
                <Button className="mt-4 hover:scale-105 transition-all duration-300">
                  Define New Server
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="definitions" className="mt-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {definitions.map(definition => {
              const definitionInstances = instancesByDefinition[definition.id] || [];
              const runningCount = definitionInstances.filter(i => i.status === 'running').length;
              
              return (
                <Card key={definition.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle>{definition.name}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <EndpointLabel type={definition.type} />
                      <CardDescription className="text-xs">
                        v{definition.version}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {truncateDescription(definition.description)}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm">
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <div className="cursor-help">
                            <p className="font-medium">Instances</p>
                            <p className="text-muted-foreground">{definitionInstances.length} total</p>
                          </div>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold">Instances</h4>
                            {definitionInstances.length > 0 ? (
                              <ul className="text-xs space-y-1">
                                {definitionInstances.map(instance => (
                                  <li key={instance.id} className="flex items-center justify-between">
                                    <span>{instance.name}</span>
                                    <StatusIndicator 
                                      status={
                                        instance.status === 'running' ? 'active' : 
                                        instance.status === 'error' ? 'error' : 'inactive'
                                      } 
                                      label={
                                        instance.status === 'running' ? 'Running' : 
                                        instance.status === 'error' ? 'Error' : 'Stopped'
                                      }
                                    />
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-xs text-muted-foreground">No instances available</p>
                            )}
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                      
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <div className="cursor-help text-center">
                            <p className="font-medium">Requests</p>
                            <p className="text-muted-foreground">{getRequestCount(definition.id)} total</p>
                          </div>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold">Instance Requests</h4>
                            {definitionInstances.length > 0 ? (
                              <ul className="text-xs space-y-1">
                                {definitionInstances.map(instance => (
                                  <li key={instance.id} className="flex items-center justify-between">
                                    <span>{instance.name}</span>
                                    <span className="font-medium">{instance.requestCount || 0} requests</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-xs text-muted-foreground">No instances available</p>
                            )}
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-0">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => handleOpenAddInstance(definition)}
                    >
                      <CirclePlus className="h-4 w-4 mr-1" />
                      Create Instance
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
            
            <Card className="border-dashed border-2 flex flex-col items-center justify-center h-[300px]">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <PlusCircle className="h-8 w-8 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">
                  Define a new server template
                </p>
                <Button className="mt-4">
                  Define New Server
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="instances" className="mt-4">
          <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-10 px-4 text-left align-middle font-medium">Name</th>
                    <th className="h-10 px-4 text-left align-middle font-medium">Status</th>
                    <th className="h-10 px-4 text-left align-middle font-medium">Definition</th>
                    <th className="h-10 px-4 text-left align-middle font-medium">Connection Details</th>
                    <th className="h-10 px-4 text-left align-middle font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {instances.map(instance => {
                    const definition = definitions.find(d => d.id === instance.definitionId);
                    return (
                      <tr key={instance.id} className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle">{instance.name}</td>
                        <td className="p-4 align-middle">
                          <div className="flex items-center gap-2">
                            <StatusIndicator 
                              status={
                                instance.status === 'running' ? 'active' : 
                                instance.status === 'error' ? 'error' : 'inactive'
                              } 
                              label={
                                instance.status === 'running' ? 'Running' : 
                                instance.status === 'error' ? 'Error' : 'Stopped'
                              }
                            />
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex items-center gap-2">
                            {definition?.icon && <span>{definition.icon}</span>}
                            <span>{definition?.name || 'Unknown'}</span>
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex items-center gap-2">
                            {definition?.type === 'HTTP_SSE' ? (
                              <Globe className="h-4 w-4 text-blue-500" />
                            ) : (
                              <Terminal className="h-4 w-4 text-purple-500" />
                            )}
                            <code className="text-xs bg-muted px-2 py-1 rounded">
                              {instance.connectionDetails.length > 25 
                                ? `${instance.connectionDetails.substring(0, 25)}...` 
                                : instance.connectionDetails}
                            </code>
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex items-center gap-2">
                            {instance.status === 'running' ? (
                              <Button variant="outline" size="sm">
                                <StopCircle className="h-4 w-4 mr-1" />
                                Stop
                              </Button>
                            ) : (
                              <Button variant="outline" size="sm">
                                <PlayCircle className="h-4 w-4 mr-1" />
                                Start
                              </Button>
                            )}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <AddInstanceDialog
        open={addInstanceOpen}
        onOpenChange={setAddInstanceOpen}
        serverDefinition={selectedDefinition}
        onCreateInstance={handleCreateInstance}
      />
    </div>
  );
};

export default Servers;
