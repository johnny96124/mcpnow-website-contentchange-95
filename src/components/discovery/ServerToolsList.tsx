import { Tool, ToolParameter } from "@/data/mockData";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  Code, 
  Play, 
  Wrench, 
  SendHorizonal, 
  CheckCircle2, 
  XCircle, 
  Terminal,
  History
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ServerEventsList } from "./ServerEventsList";
import { ServerEvent } from "@/types/events";

interface ServerToolsListProps {
  tools?: Tool[];
  debugMode?: boolean;
  serverName?: string;
  instanceId?: string;
  /** Set to true when used in Discovery page to hide tabs */
  isDiscoveryView?: boolean;
}

export function ServerToolsList({ 
  tools, 
  debugMode = false, 
  serverName, 
  instanceId,
  isDiscoveryView = false
}: ServerToolsListProps) {
  const { toast } = useToast();
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [toolInputs, setToolInputs] = useState<Record<string, Record<string, any>>>({});
  const [isExecuting, setIsExecuting] = useState<Record<string, boolean>>({});
  const [toolResults, setToolResults] = useState<Record<string, { success: boolean; data?: any; error?: string }>>({});
  const [activeTab, setActiveTab] = useState<string>("tools");
  const [events, setEvents] = useState<ServerEvent[]>(generateMockEvents());
  
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
      {
        id: "3",
        timestamp: "2024-04-18T04:58:32.000Z",
        type: "request",
        category: "Tools",
        method: "tools/call",
        params: {
          name: "search_web",
          meta: { progressToken: 2 },
          arguments: { query: "latest AI research papers" }
        },
        jsonrpc: "2.0",
        profileName: "General Development",
        hostName: "Default Host",
        content: {
          method: "tools/call",
          params: {
            name: "search_web",
            arguments: { query: "latest AI research papers" }
          },
          jsonrpc: "2.0"
        }
      },
      {
        id: "4",
        timestamp: "2024-04-18T04:58:34.000Z",
        type: "response",
        category: "Tools",
        method: "search_web",
        content: {
          id: 2,
          result: {
            content: [
              {
                text: "Found 5 results for 'latest AI research papers'",
                type: "text"
              }
            ]
          },
          jsonrpc: "2.0"
        },
        profileName: "General Development",
        hostName: "Default Host"
      }
    ];
  }
  
  if (!tools || tools.length === 0) {
    return (
      <div className="py-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-800">
            <Wrench className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </div>
        </div>
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">No tools available</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          This server does not have any tools defined.
        </p>
      </div>
    );
  }

  const handleInputChange = (toolId: string, paramName: string, value: any) => {
    setToolInputs(prev => ({
      ...prev,
      [toolId]: {
        ...(prev[toolId] || {}),
        [paramName]: value
      }
    }));
  };

  const executeTool = (tool: Tool) => {
    setIsExecuting(prev => ({ ...prev, [tool.id]: true }));
    // Clear previous results
    setToolResults(prev => ({ ...prev, [tool.id]: undefined }));
    
    // Mock execution with a delay
    setTimeout(() => {
      setIsExecuting(prev => ({ ...prev, [tool.id]: false }));
      
      // Simulate a 20% chance of failure
      const isSuccess = Math.random() > 0.2;
      
      if (isSuccess) {
        const mockResponse = {
          success: true,
          data: {
            message: `Successfully executed ${tool.name}`,
            timestamp: new Date().toISOString(),
            result: {
              status: "completed",
              details: `Operation completed on ${serverName || 'Unknown server'}`
            }
          }
        };
        
        setToolResults(prev => ({
          ...prev,
          [tool.id]: mockResponse
        }));
        
        // Create request event first
        const requestEvent: ServerEvent = {
          id: `event-req-${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: "request",
          category: "Tools",
          content: {
            method: tool.name,
            params: toolInputs[tool.id] || {}
          },
          profileName: "Current Profile",
          hostName: "Active Host",
          method: tool.name,
          params: toolInputs[tool.id] || {}
        };
        
        // Then add response event
        const responseEvent: ServerEvent = {
          id: `event-res-${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: "response",
          category: "Tools",
          content: mockResponse.data,
          profileName: "Current Profile",
          hostName: "Active Host",
          method: tool.name
        };
        
        // Add both events to the list
        setEvents(prev => [responseEvent, requestEvent, ...prev]);
        
        toast({
          title: `Tool Executed: ${tool.name}`,
          description: `Successfully executed tool on server instance ${serverName || 'Unknown'}.`,
          type: "success"
        });
      } else {
        // Mock error response
        const mockError = {
          success: false,
          error: `Failed to execute ${tool.name}: Connection timeout or invalid parameters`
        };
        
        setToolResults(prev => ({
          ...prev,
          [tool.id]: mockError
        }));
        
        // Create request event first
        const requestEvent: ServerEvent = {
          id: `event-req-${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: "request",
          category: "Tools",
          content: {
            method: tool.name,
            params: toolInputs[tool.id] || {}
          },
          profileName: "Current Profile",
          hostName: "Active Host",
          method: tool.name,
          params: toolInputs[tool.id] || {}
        };
        
        // Then add error event
        const errorEvent: ServerEvent = {
          id: `event-err-${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: "error",
          category: "Tools",
          content: {
            error: mockError.error,
            tool: tool.name
          },
          method: tool.name,
          params: toolInputs[tool.id] || {},
          isError: true,
          profileName: "Current Profile",
          hostName: "Active Host"
        };
        
        // Add both events to the list
        setEvents(prev => [errorEvent, requestEvent, ...prev]);
        
        toast({
          title: `Tool Execution Failed: ${tool.name}`,
          description: `Failed to execute tool on server instance ${serverName || 'Unknown'}.`,
          type: "error"
        });
      }
    }, 1500);
  };

  const validateToolInputs = (tool: Tool): boolean => {
    if (!tool.parameters) return true;
    
    const toolParams = toolInputs[tool.id] || {};
    
    for (const param of tool.parameters) {
      if (param.required && (toolParams[param.name] === undefined || toolParams[param.name] === "")) {
        toast({
          title: "Validation Error",
          description: `Parameter "${param.name}" is required.`,
          variant: "destructive"
        });
        return false;
      }
    }
    
    return true;
  };

  if (isDiscoveryView) {
    return (
      <div className="flex flex-col h-full">
        <ScrollArea className="h-[500px] overflow-auto flex-1">
          <Accordion 
            type="single" 
            collapsible 
            className="w-full"
            value={activeToolId || undefined}
            onValueChange={setActiveToolId}
          >
            {tools.map((tool) => (
              <AccordionItem key={tool.id} value={tool.id} className="border border-gray-200 dark:border-gray-800 rounded-lg mb-3 overflow-hidden">
                <div className="bg-gray-50 dark:bg-gray-800/50">
                  <AccordionTrigger className="px-4 py-3 hover:no-underline font-medium">
                    <div className="flex items-center text-left">
                      <Code className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                      <span className="text-blue-600 dark:text-blue-400 font-mono text-sm">
                        {tool.name}
                      </span>
                    </div>
                  </AccordionTrigger>
                </div>
                <AccordionContent className="pb-0">
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                      {tool.description}
                    </p>
                    
                    {tool.parameters && tool.parameters.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold mb-3">
                          Parameters
                        </h4>
                        <div className="space-y-4">
                          {tool.parameters.map((param) => (
                            <ParameterItem 
                              key={param.name} 
                              parameter={param} 
                              debugMode={debugMode}
                              value={toolInputs[tool.id]?.[param.name] || ""}
                              onChange={(value) => handleInputChange(tool.id, param.name, value)}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {toolResults[tool.id] && (
                      <div className="mt-4">
                        <h4 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold mb-2">
                          Execution Result
                        </h4>
                        
                        {toolResults[tool.id].success ? (
                          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-3">
                            <div className="flex items-center mb-2">
                              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
                              <h5 className="font-medium text-green-800 dark:text-green-300">Success</h5>
                            </div>
                            <pre className="text-xs bg-white dark:bg-gray-800 p-3 rounded border border-green-100 dark:border-green-800 overflow-auto max-h-[200px]">
                              {JSON.stringify(toolResults[tool.id].data, null, 2)}
                            </pre>
                          </div>
                        ) : (
                          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                            <div className="flex items-center mb-2">
                              <XCircle className="h-4 w-4 text-red-600 dark:text-red-400 mr-2" />
                              <h5 className="font-medium text-red-800 dark:text-red-300">Error</h5>
                            </div>
                            <p className="text-red-700 dark:text-red-300 text-sm mb-2">
                              {toolResults[tool.id].error}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {debugMode && (
                      <div className="mt-6 flex justify-end">
                        <Button 
                          onClick={() => {
                            if (validateToolInputs(tool)) {
                              executeTool(tool);
                            }
                          }}
                          disabled={isExecuting[tool.id]}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          {isExecuting[tool.id] ? (
                            <>
                              <span className="mr-1 h-4 w-4 animate-spin border-2 border-current border-t-transparent rounded-full inline-block" />
                              Executing...
                            </>
                          ) : (
                            <>
                              <Terminal className="h-3.5 w-3.5 mr-1.5" />
                              Execute Tool
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Tabs 
        defaultValue="tools" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full h-full flex flex-col"
      >
        <div className="border-b border-border">
          <TabsList className="bg-transparent w-full justify-start h-10 pb-0 pt-0">
            <TabsTrigger 
              value="tools" 
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4"
            >
              <Wrench className="w-4 h-4 mr-2" />
              Tools
            </TabsTrigger>
            <TabsTrigger 
              value="events" 
              className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4"
            >
              <History className="w-4 h-4 mr-2" />
              Message History
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="tools" className="h-[500px] overflow-auto flex-1 mt-0 pt-4">
          <ScrollArea className="h-full pr-4">
            <Accordion 
              type="single" 
              collapsible 
              className="w-full"
              value={activeToolId || undefined}
              onValueChange={setActiveToolId}
            >
              {tools.map((tool) => (
                <AccordionItem key={tool.id} value={tool.id} className="border border-gray-200 dark:border-gray-800 rounded-lg mb-3 overflow-hidden">
                  <div className="bg-gray-50 dark:bg-gray-800/50">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline font-medium">
                      <div className="flex items-center text-left">
                        <Code className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                        <span className="text-blue-600 dark:text-blue-400 font-mono text-sm">
                          {tool.name}
                        </span>
                      </div>
                    </AccordionTrigger>
                  </div>
                  <AccordionContent className="pb-0">
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                        {tool.description}
                      </p>
                      
                      {tool.parameters && tool.parameters.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold mb-3">
                            Parameters
                          </h4>
                          <div className="space-y-4">
                            {tool.parameters.map((param) => (
                              <div key={param.name} className="bg-gray-50 dark:bg-gray-800 rounded-md p-3">
                                <div className="flex items-center mb-2">
                                  <span className="font-mono text-xs text-blue-600 dark:text-blue-400 mr-2">
                                    {param.name}
                                  </span>
                                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                                    {param.type}
                                  </Badge>
                                  {param.required && (
                                    <Badge className="ml-1 text-[10px] px-1.5 py-0 h-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800">
                                      required
                                    </Badge>
                                  )}
                                </div>
                                
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                                  {param.description}
                                </p>

                                {param.default !== undefined && (
                                  <div className="mb-2 text-xs">
                                    <span className="text-gray-500 dark:text-gray-500">Default: </span>
                                    <code className="font-mono text-gray-800 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-1 rounded">
                                      {typeof param.default === 'object' 
                                        ? JSON.stringify(param.default) 
                                        : String(param.default)
                                      }
                                    </code>
                                  </div>
                                )}
                                
                                <div className="mt-2">
                                  {param.type === 'string' && (
                                    <Textarea
                                      placeholder={`Enter ${param.name}...`}
                                      className="h-20 text-sm"
                                      value={toolInputs[tool.id]?.[param.name] || ''}
                                      onChange={(e) => handleInputChange(tool.id, param.name, e.target.value)}
                                    />
                                  )}
                                  {param.type === 'number' && (
                                    <Input
                                      type="number"
                                      placeholder={`Enter ${param.name}...`}
                                      className="text-sm"
                                      value={toolInputs[tool.id]?.[param.name] || ''}
                                      onChange={(e) => handleInputChange(tool.id, param.name, parseFloat(e.target.value) || 0)}
                                    />
                                  )}
                                  {param.type === 'boolean' && (
                                    <select
                                      className="w-full p-2 text-sm border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800"
                                      value={toolInputs[tool.id]?.[param.name]?.toString() || "false"}
                                      onChange={(e) => handleInputChange(tool.id, param.name, e.target.value === "true")}
                                    >
                                      <option value="true">True</option>
                                      <option value="false">False</option>
                                    </select>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {toolResults[tool.id] && (
                        <div className="mt-4">
                          <h4 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold mb-2">
                            Execution Result
                          </h4>
                          
                          {toolResults[tool.id].success ? (
                            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-3">
                              <div className="flex items-center mb-2">
                                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
                                <h5 className="font-medium text-green-800 dark:text-green-300">Success</h5>
                              </div>
                              <pre className="text-xs bg-white dark:bg-gray-800 p-3 rounded border border-green-100 dark:border-green-800 overflow-auto max-h-[200px]">
                                {JSON.stringify(toolResults[tool.id].data, null, 2)}
                              </pre>
                            </div>
                          ) : (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                              <div className="flex items-center mb-2">
                                <XCircle className="h-4 w-4 text-red-600 dark:text-red-400 mr-2" />
                                <h5 className="font-medium text-red-800 dark:text-red-300">Error</h5>
                              </div>
                              <p className="text-red-700 dark:text-red-300 text-sm mb-2">
                                {toolResults[tool.id].error}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {debugMode && (
                        <div className="mt-6 flex justify-end">
                          <Button 
                            onClick={() => {
                              if (validateToolInputs(tool)) {
                                executeTool(tool);
                              }
                            }}
                            disabled={isExecuting[tool.id]}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            {isExecuting[tool.id] ? (
                              <>
                                <span className="mr-1 h-4 w-4 animate-spin border-2 border-current border-t-transparent rounded-full inline-block" />
                                Executing...
                              </>
                            ) : (
                              <>
                                <Terminal className="h-3.5 w-3.5 mr-1.5" />
                                Execute Tool
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="events" className="h-[500px] overflow-auto flex-1 mt-0 pt-4">
          <ServerEventsList events={events} instanceName={serverName} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface ParameterItemProps {
  parameter: ToolParameter;
  debugMode?: boolean;
  value?: any;
  onChange?: (value: any) => void;
}

function ParameterItem({ parameter, debugMode = false, value, onChange }: ParameterItemProps) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-3">
      <div className="flex items-center mb-2">
        <span className="font-mono text-xs text-blue-600 dark:text-blue-400 mr-2">
          {parameter.name}
        </span>
        <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
          {parameter.type}
        </Badge>
        {parameter.required && (
          <Badge className="ml-1 text-[10px] px-1.5 py-0 h-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800">
            required
          </Badge>
        )}
      </div>
      
      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
        {parameter.description}
      </p>

      {parameter.default !== undefined && (
        <div className="mb-2 text-xs">
          <span className="text-gray-500 dark:text-gray-500">Default: </span>
          <code className="font-mono text-gray-800 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-1 rounded">
            {typeof parameter.default === 'object' 
              ? JSON.stringify(parameter.default) 
              : String(parameter.default)
            }
          </code>
        </div>
      )}
      
      {debugMode && (
        <div className="mt-2">
          {parameter.type === 'string' && (
            <Textarea
              placeholder={`Enter ${parameter.name} value...`}
              className="h-20 text-sm"
              value={value || ''}
              onChange={(e) => onChange && onChange(e.target.value)}
            />
          )}
          {parameter.type === 'number' && (
            <Input
              type="number"
              placeholder={`Enter ${parameter.name} value...`}
              className="text-sm"
              value={value || ''}
              onChange={(e) => onChange && onChange(parseFloat(e.target.value) || 0)}
            />
          )}
          {parameter.type === 'boolean' && (
            <select
              className="w-full p-2 text-sm border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800"
              value={value?.toString() || "false"}
              onChange={(e) => onChange && onChange(e.target.value === "true")}
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          )}
        </div>
      )}
    </div>
  );
}
