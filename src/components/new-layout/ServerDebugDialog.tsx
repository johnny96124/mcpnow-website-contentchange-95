import { useState, useEffect } from "react";
import { ServerInstance, serverDefinitions, Tool } from "@/data/mockData";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ChevronDown, ChevronUp, AlertTriangle, Check, Wrench, History } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ServerEventsList } from "@/components/discovery/ServerEventsList";
import type { ServerEvent } from "@/types/events";

interface ServerDebugDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  server: ServerInstance | null;
}

interface ToolParameterValue {
  [key: string]: string;
}

export function ServerDebugDialog({
  open,
  onOpenChange,
  server
}: ServerDebugDialogProps) {
  const [activeTab, setActiveTab] = useState<string>("tools");
  const [expandedTools, setExpandedTools] = useState<Record<string, boolean>>({});
  const [toolsResults, setToolsResults] = useState<Record<string, { success: boolean; message: string; isLoading: boolean }>>({});
  const [paramValues, setParamValues] = useState<Record<string, ToolParameterValue>>({});
  const [events, setEvents] = useState<ServerEvent[]>(generateMockEvents());
  const { toast } = useToast();
  
  const definition = server ? serverDefinitions.find(def => def.id === server.definitionId) : null;
  
  useEffect(() => {
    if (definition?.tools) {
      const initialValues: Record<string, ToolParameterValue> = {};
      
      definition.tools.forEach(tool => {
        initialValues[tool.id] = {};
        if (tool.parameters) {
          tool.parameters.forEach(param => {
            initialValues[tool.id][param.name] = '';
          });
        }
      });
      
      setParamValues(initialValues);
    }
  }, [definition]);
  
  function generateMockEvents(): ServerEvent[] {
    return [
      {
        id: "1",
        timestamp: "2024-04-18T04:59:47.000Z",
        type: "error",
        category: "Tools",
        content: {
          id: 3,
          result: {
            content: [
              {
                text: "Error executing tool get_transcript: couldn't find a video ID from the provided URL: abc.",
                type: "text"
              }
            ],
            isError: true
          },
          jsonrpc: "2.0"
        },
        method: "tools/call",
        params: {
          name: "get_transcript",
          meta: { progressToken: 1 },
          arguments: { url: "abc", lang: "en" }
        },
        isError: true,
        profileName: "General Development",
        hostName: "Default Host"
      },
      {
        id: "2",
        timestamp: "2024-04-18T04:59:47.000Z",
        type: "request",
        category: "Tools",
        method: "tools/call",
        params: {
          name: "get_transcript",
          meta: { progressToken: 1 },
          arguments: { url: "abc", lang: "en" }
        },
        jsonrpc: "2.0",
        profileName: "General Development",
        hostName: "Default Host",
        content: {
          method: "tools/call",
          params: {
            name: "get_transcript",
            meta: { progressToken: 1 },
            arguments: { url: "abc", lang: "en" }
          },
          jsonrpc: "2.0"
        }
      },
      // ... keep existing code (additional event objects)
    ];
  }

  const handleParamChange = (toolId: string, paramName: string, value: string) => {
    setParamValues(prev => ({
      ...prev,
      [toolId]: {
        ...prev[toolId],
        [paramName]: value
      }
    }));
  };
  
  const handleExecuteTool = (tool: Tool) => {
    setToolsResults(prev => ({
      ...prev,
      [tool.id]: { success: false, message: "", isLoading: true }
    }));
    
    toast({
      title: "Executing Tool",
      description: `Executing ${tool.name}...`,
    });
    
    setTimeout(() => {
      const success = Math.random() > 0.3;
      const resultMessage = success 
        ? `Tool executed successfully with parameters: ${JSON.stringify(paramValues[tool.id])}` 
        : "Execution failed: Cannot connect to server or invalid parameters";
      
      setToolsResults(prev => ({
        ...prev,
        [tool.id]: { 
          success: success, 
          message: resultMessage,
          isLoading: false
        }
      }));
      
      toast({
        title: success ? "Execution Successful" : "Execution Failed",
        description: success 
          ? `${tool.name} was executed successfully, please check the result` 
          : `${tool.name} encountered an error during execution, please try again`,
        variant: success ? "default" : "destructive"
      });
    }, 2000);
  };
  
  const toggleTool = (toolId: string) => {
    setExpandedTools(prev => ({
      ...prev,
      [toolId]: !prev[toolId]
    }));
  };

  if (!server || !definition) {
    return null;
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] p-0 gap-0" hideClose>
        <DialogHeader className="p-6 pb-2">
          <div className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-purple-500" />
            <DialogTitle className="text-xl">
              Server Tools - {server?.name}
            </DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground">
            Debug, execute tools, and view message history for this server instance
          </DialogDescription>
        </DialogHeader>

        <div className="px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="tools" className="flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                Tools
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                Message History
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="tools">
              <ScrollArea className="h-[400px] pr-4">
                {definition.tools && definition.tools.length > 0 ? (
                  <div className="space-y-4">
                    {definition.tools.map((tool) => (
                      <div 
                        key={tool.id} 
                        className="group rounded-lg border shadow-sm"
                      >
                        <div 
                          className="flex items-center justify-between p-4 cursor-pointer"
                          onClick={() => toggleTool(tool.id)}
                        >
                          <div className="flex items-center">
                            <code className="text-blue-600 font-mono text-sm">
                              {tool.name}
                            </code>
                          </div>
                          {expandedTools[tool.id] ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground transition-transform" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform" />
                          )}
                        </div>
                        
                        {expandedTools[tool.id] && (
                          <div className="border-t p-4 space-y-4">
                            {tool.description && (
                              <p className="text-sm text-muted-foreground italic">
                                {tool.description}
                              </p>
                            )}
                            
                            {tool.parameters && tool.parameters.length > 0 && (
                              <div className="space-y-4">
                                <h4 className="text-sm font-medium">
                                  Parameters
                                </h4>
                                <div className="space-y-4">
                                  {tool.parameters.map((param) => (
                                    <div
                                      key={param.name}
                                      className="bg-muted/20 rounded-lg p-3 border"
                                    >
                                      <div className="flex items-center gap-2 mb-2">
                                        <Label htmlFor={`${tool.id}-${param.name}`} className="font-mono text-xs bg-primary/5 px-2 py-1 rounded text-primary/90">
                                          {param.name}
                                        </Label>
                                        <Badge variant="outline" className="text-[10px]">
                                          {param.type}
                                        </Badge>
                                        {param.required && (
                                          <Badge variant="destructive" className="text-[10px]">
                                            required
                                          </Badge>
                                        )}
                                      </div>
                                      {param.description && (
                                        <p className="text-sm text-muted-foreground mb-3">
                                          {param.description}
                                        </p>
                                      )}
                                      <div className="mt-2">
                                        <Input
                                          id={`${tool.id}-${param.name}`}
                                          value={paramValues[tool.id]?.[param.name] || ''}
                                          onChange={(e) => handleParamChange(tool.id, param.name, e.target.value)}
                                          placeholder={`Enter ${param.name}...`}
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {toolsResults[tool.id] && !toolsResults[tool.id].isLoading && (
                              <Alert variant={toolsResults[tool.id].success ? "default" : "destructive"} 
                                    className={toolsResults[tool.id].success ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' : ''}>
                                {toolsResults[tool.id].success ? (
                                  <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                ) : (
                                  <AlertTriangle className="h-4 w-4" />
                                )}
                                <AlertDescription className="ml-2">
                                  {toolsResults[tool.id].message}
                                </AlertDescription>
                              </Alert>
                            )}
                            
                            <div className="flex justify-end gap-2 pt-2">
                              <Button 
                                onClick={() => handleExecuteTool(tool)}
                                disabled={toolsResults[tool.id]?.isLoading}
                              >
                                {toolsResults[tool.id]?.isLoading ? (
                                  <>
                                    <span className="mr-1 h-4 w-4 animate-spin border-2 border-current border-t-transparent rounded-full inline-block" />
                                    Executing...
                                  </>
                                ) : (
                                  "Execute"
                                )}
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p>No tools available for this server.</p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="history">
              <ServerEventsList events={events} instanceName={server.name} />
            </TabsContent>
          </Tabs>
        </div>
        
        <DialogFooter className="p-6 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
