
import { useState } from "react";
import { 
  CirclePlus, 
  Code2, 
  Edit, 
  ExternalLink, 
  MonitorPlay, 
  MoreHorizontal, 
  PlayCircle, 
  PlusCircle, 
  Power, 
  ServerCrash, 
  StopCircle, 
  Trash2, 
  Globe,
  Terminal
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
  serverDefinitions, 
  serverInstances,
  ServerDefinition,
  ServerInstance
} from "@/data/mockData";

const Servers = () => {
  const [definitions] = useState<ServerDefinition[]>(serverDefinitions);
  const [instances] = useState<ServerInstance[]>(serverInstances);
  
  // Group instances by definition ID
  const instancesByDefinition = instances.reduce((acc, instance) => {
    const { definitionId } = instance;
    if (!acc[definitionId]) {
      acc[definitionId] = [];
    }
    acc[definitionId].push(instance);
    return acc;
  }, {} as Record<string, ServerInstance[]>);
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Servers</h1>
          <p className="text-muted-foreground">
            Manage server definitions and instances
          </p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Define New Server
        </Button>
      </div>
      
      <Tabs defaultValue="definitions">
        <TabsList>
          <TabsTrigger value="definitions">Server Definitions</TabsTrigger>
          <TabsTrigger value="instances">Server Instances</TabsTrigger>
        </TabsList>
        
        <TabsContent value="definitions" className="mt-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {definitions.map(definition => {
              const definitionInstances = instancesByDefinition[definition.id] || [];
              const runningCount = definitionInstances.filter(i => i.status === 'running').length;
              
              return (
                <Card key={definition.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{definition.icon}</span>
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
                    <p className="text-sm text-muted-foreground mb-4">
                      {definition.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <p className="font-medium">Instances</p>
                        <p className="text-muted-foreground">{definitionInstances.length} total</p>
                      </div>
                      <div>
                        <p className="font-medium">Running</p>
                        <p className="text-muted-foreground">{runningCount} active</p>
                      </div>
                      <div>
                        <p className="font-medium">Author</p>
                        <p className="text-muted-foreground">{definition.author}</p>
                      </div>
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
                    <Button variant="default" size="sm">
                      <CirclePlus className="h-4 w-4 mr-1" />
                      Create Instance
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
            
            {/* Create new definition card */}
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
    </div>
  );
};

export default Servers;
