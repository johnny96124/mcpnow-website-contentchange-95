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
import { ServerEventsList, ServerEvent } from "./ServerEventsList";

interface ServerToolsListProps {
  tools?: Tool[];
  debugMode?: boolean;
  serverName?: string;
  instanceId?: string;
}

export function ServerToolsList({ tools, debugMode = false, serverName, instanceId }: ServerToolsListProps) {
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
        timestamp: "04:59:47 server",
        type: "server",
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
        isError: true,
        profileName: "General Development",
        hostName: "Default Host"
      },
      {
        id: "2",
        timestamp: "04:59:47 client",
        type: "client",
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
        timestamp: "04:59:46 server",
        type: "server",
        content: {
          method: "sse/connection",
          params: { message: "SSE Connection established" },
          jsonrpc: "2.0"
        },
        profileName: "General Development",
        hostName: "Default Host"
      },
      {
        id: "4",
        timestamp: "04:58:04 server",
        type: "server",
        content: {
          id: 2,
          result: {
            content: [
              {
                text: "We want to have them as many as we can to make honey. At Secret Garden Bees, a honey farm in Linden, North Carolina. Farmer Jim Hartman has one eye on his bees and the other on his bank account. Ideally, he will get 100 pounds of honey per hive per year. How do you feel about paying more for things? Well, you know, if you find someone who says, I'm happy about paying more for something, you point them out to me. People who already couldn't afford fresh vegetables, who couldn't already afford to put good food on their on their plate, they're the ones who are really going to be hurt by this. Did you ever think, when you voted for President Trump, that things were going to cost you more? And you're going to lose money? I never thought I was going to lose this much money this fast. Jim is a Republican who voted for Donald Trump three times. How do you feel about your vote for Donald Trump now? Well, I feel like perhaps I should have considered some other options. Among other things, Jim imports packaging supplies for his honey. So he's paying real close attention to the tariffs Trump just put in place. We just bought our year supply of bottles from Taiwan and our year supply of quarks from Portugal about three weeks ago. So that would have been, you know, another 5 or 6000 out of my pocket, which is partly why he's repairing instead of replacing this 40 year old forklift. The cost of equipment has just gone through the roof to buy anything like that, because it just would be cost prohibitive. He's also holding off on improvements around the farm. Well, we're not going to hire any more people. That's for sure. It's more than just the tariffs. For the past two years, Jim has been selling honey to the federal government, which then provides it to food pantries and food banks. But after Donald Trump took office, the USDA cut those programs suddenly, as part of the federal government's effort to streamline spending. For a lot of other local farmers around here, it was a major source of reliable revenue for me. And it's going to cost me around 150,000 a year, 150,000. Yeah, yeah, roughly 50% of my revenue. That's a huge hit as a massive hit. Not far from Jim's farm, we found other Trump supporters who give the president high marks on tariffs. How do you feel about the tariffs? Well, I feel like for years we've been get getting ripped off. And, why not make it fair. You know zero zero. And I think Trump was up front and told him we're going to tariff some of the countries have they're already starting to come around. It's going to be good. I really think it's going to be fine.",
                type: "text"
              }
            ]
          },
          jsonrpc: "2.0"
        },
        profileName: "Development",
        hostName: "Local Host"
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
        
        // Also add this to events
        const newEvent: ServerEvent = {
          id: `event-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString() + " server",
          type: "server",
          content: mockResponse.data,
          profileName: "Current Profile",
          hostName: "Active Host",
          method: tool.name
        };
        
        setEvents(prev => [newEvent, ...prev]);
        
        toast({
          title: `Tool Executed: ${tool.name}`,
          description: `Successfully executed tool on server instance ${serverName || 'Unknown'}.`,
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
        
        // Also add this to events as an error
        const newErrorEvent: ServerEvent = {
          id: `event-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString() + " server",
          type: "server",
          content: {
            error: mockError.error,
            tool: tool.name
          },
          isError: true,
          profileName: "Current Profile",
          hostName: "Active Host",
          method: tool.name
        };
        
        setEvents(prev => [newErrorEvent, ...prev]);
        
        toast({
          title: `Tool Execution Failed: ${tool.name}`,
          description: `Failed to execute tool on server instance ${serverName || 'Unknown'}.`,
          variant: "destructive"
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
              Event History
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
                      
                      {/* Tool execution results */}
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
