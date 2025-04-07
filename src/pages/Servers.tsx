
import { useState } from "react";
import { 
  CirclePlus, 
  ExternalLink,
  PlusCircle, 
  Trash2, 
  Globe,
  Terminal,
  AlertCircle,
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
  const [activeTab, setActiveTab] = useState("integrated");
  const [addInstanceOpen, setAddInstanceOpen] = useState(false);
  const [selectedDefinition, setSelectedDefinition] = useState<ServerDefinition | null>(null);
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

  const truncateText = (text: string, maxLength = 24): string => {
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
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
      enabled: true,
      connectionDetails: `localhost:${3000 + instances.length}`,
      requestCount: 0,
      environment: data.env,
      arguments: [data.args]
    };
    
    setInstances([...instances, newInstance]);
    setAddInstanceOpen(false);
    
    toast({
      title: "Instance Created",
      description: `${data.name} has been created successfully.`,
    });
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

  const handleAddLocalServer = () => {
    toast({
      title: "Add Local Server",
      description: "This feature is coming soon!",
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
          <Button onClick={handleNavigateToDiscovery}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Server
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="integrated" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="integrated">Integrated View</TabsTrigger>
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
                          {truncateText(definition.name)}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-3">
                          <EndpointLabel type={definition.type} />
                          <CardDescription className="text-xs">
                            v{definition.version}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {definition.description}
                    </p>
                    
                    {definitionInstances.length > 0 && (
                      <div className="border rounded-md overflow-hidden mt-6">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Instance Name</TableHead>
                              <TableHead>Connection</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {definitionInstances.map(instance => (
                              <TableRow key={instance.id}>
                                <TableCell className="font-medium">
                                  <div className="flex items-center gap-2">
                                    {truncateText(instance.name)}
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
                                      variant="outline" 
                                      size="sm" 
                                      className="text-blue-500 hover:text-blue-600 hover:border-blue-500 transition-colors"
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
                  onClick={handleNavigateToDiscovery}
                >
                  Add
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
                        <td className="p-4 align-middle">{truncateText(instance.name)}</td>
                        <td className="p-4 align-middle">
                          <div className="flex items-center gap-2">
                            {definition?.icon && <span>{definition.icon}</span>}
                            <span>{truncateText(definition?.name || 'Unknown')}</span>
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
                              {truncateText(instance.connectionDetails, 20)}
                            </code>
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-blue-500 hover:text-blue-600 hover:border-blue-500 transition-colors"
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
