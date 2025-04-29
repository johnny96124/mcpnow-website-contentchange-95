
import { useState, useEffect } from "react";
import { ServerInstance, serverDefinitions, Tool } from "@/data/mockData";
import { ServerEvent } from "@/types/events";
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
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ServerEventsList } from "@/components/discovery/ServerEventsList";

interface ServerDebugDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  server: ServerInstance | null;
}

interface ToolParameterValue {
  [key: string]: string;
}

// Sample events data
const SAMPLE_EVENTS: ServerEvent[] = [
  {
    id: "1",
    timestamp: "2025-04-26T16:02:19Z",
    type: "notification",
    category: "Tools",
    method: "notification/system",
    content: {
      message: "System is running normally",
      status: "success"
    },
    isError: false,
    jsonrpc: "2.0"
  },
  {
    id: "2", 
    timestamp: "2024-04-18T12:59:47Z",
    type: "error",
    category: "Tools",
    method: "tools/call",
    content: {
      error: "Failed to execute get_transcript",
      details: "Invalid parameters"
    },
    isError: true,
    params: {
      name: "get_transcript",
      arguments: { abc: true }
    },
    jsonrpc: "2.0"
  },
  {
    id: "3",
    timestamp: "2024-04-18T12:59:47Z", 
    type: "response",
    category: "Tools",
    method: "tools/call",
    content: {
      result: "Transcript generated successfully"
    },
    params: {
      name: "get_transcript",
      arguments: { abc: true }  
    },
    jsonrpc: "2.0"
  }
];

export function ServerDebugDialog({
  open,
  onOpenChange,
  server
}: ServerDebugDialogProps) {
  const [expandedTools, setExpandedTools] = useState<Record<string, boolean>>({});
  const [toolsResults, setToolsResults] = useState<Record<string, { success: boolean; message: string; isLoading: boolean }>>({});
  const [paramValues, setParamValues] = useState<Record<string, ToolParameterValue>>({});
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("tools");
  
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
      title: "Tool execution in progress",
      description: `Executing ${tool.name}...`,
    });
    
    setTimeout(() => {
      const success = Math.random() > 0.3;
      const resultMessage = success 
        ? `Tool executed successfully with parameters: ${JSON.stringify(paramValues[tool.id])}` 
        : "Execution failed: Unable to connect to server or invalid parameters";
      
      setToolsResults(prev => ({
        ...prev,
        [tool.id]: { 
          success: success, 
          message: resultMessage,
          isLoading: false
        }
      }));
      
      toast({
        title: success ? "Execution successful" : "Execution failed",
        description: success 
          ? `${tool.name} was executed successfully` 
          ? `Error executing ${tool.name}, please try again`,
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
      <DialogContent className="sm:max-w-[800px] p-0 gap-0" hideClose>
        <DialogHeader className="p-6 pb-2">
          <div className="flex items-center gap-2">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Wrench className="h-5 w-5 text-purple-600" />
            </div>
            <DialogTitle className="text-xl">
              Server Tools - {server?.name}
            </DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground">
            Debug, execute tools, and view message history for this server instance
          </DialogDescription>
        </DialogHeader>

        <div className="px-6">
          <Tabs defaultValue="tools" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4 w-full max-w-[400px]">
              <TabsTrigger value="tools" className="flex items-center gap-2 flex-1">
                <Wrench className="h-4 w-4" />
                Tools
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2 flex-1">
                <History className="h-4 w-4" />
                Message History
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="tools" className="mt-0">
              <ScrollArea className="h-[500px]">
                <div className="space-y-4">
                  {definition?.tools?.map((tool) => (
                    <div 
                      key={tool.id} 
                      className="group rounded-lg border bg-card transition-all duration-200 hover:shadow-md"
                    >
                      <div 
                        className="flex items-center justify-between p-4 cursor-pointer"
                        onClick={() => toggleTool(tool.id)}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-base tracking-tight">{tool.name}</h3>
                            <Badge variant="secondary" className="font-mono text-xs">
                              Tool
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {tool.description || "No description available"}
                          </p>
                        </div>
                        {expandedTools[tool.id] ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground transition-transform" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform" />
                        )}
                      </div>
                      
                      {expandedTools[tool.id] && (
                        <div className="border-t bg-muted/50 p-4 space-y-4">
                          {tool.parameters && tool.parameters.length > 0 && (
                            <div className="space-y-4">
                              <h4 className="text-sm font-medium text-foreground/80 mb-3">
                                Parameters
                              </h4>
                              <div className="grid gap-4">
                                {tool.parameters.map((param) => (
                                  <div
                                    key={param.name}
                                    className="bg-background rounded-lg p-4 border shadow-sm"
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
                                        className="bg-background"
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {toolsResults[tool.id] && !toolsResults[tool.id].isLoading && (
                            <Alert variant={toolsResults[tool.id].success ? "default" : "destructive"} 
                                  className={`mt-4 ${toolsResults[tool.id].success ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' : ''}`}>
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
                              className="bg-primary hover:bg-primary/90 text-primary-foreground"
                              disabled={toolsResults[tool.id]?.isLoading}
                            >
                              Execute
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="history" className="mt-0">
              <ScrollArea className="h-[500px]">
                <ServerEventsList events={SAMPLE_EVENTS} />
              </ScrollArea>
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
