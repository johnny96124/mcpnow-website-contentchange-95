
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
import { ChevronDown, ChevronUp, Code, Play, Wrench, SendHorizonal } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

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
    
    // Mock execution with a delay
    setTimeout(() => {
      setIsExecuting(prev => ({ ...prev, [tool.id]: false }));
      
      toast({
        title: `Tool Executed: ${tool.name}`,
        description: `Successfully executed tool on server instance ${serverName || 'Unknown'}.`,
      });
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
    <ScrollArea className="h-[380px] pr-4">
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
                    <h4 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold mb-2">
                      Parameters
                    </h4>
                    <div className="space-y-3">
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
                          <Play className="h-3.5 w-3.5 mr-1.5" />
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
  );
}

interface ParameterItemProps {
  parameter: ToolParameter;
  debugMode?: boolean;
  value?: any;
  onChange?: (value: any) => void;
}

function ParameterItem({ parameter, debugMode = false, value, onChange }: ParameterItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-2">
      <div className="flex items-start justify-between">
        <div className="flex items-center">
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
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      </div>
      
      {isExpanded && (
        <div className="mt-2 pl-2 border-l-2 border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {parameter.description}
          </p>
          {parameter.default !== undefined && (
            <div className="mt-1 text-xs">
              <span className="text-gray-500 dark:text-gray-500">Default: </span>
              <code className="font-mono text-gray-800 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-1 rounded">
                {typeof parameter.default === 'object' 
                  ? JSON.stringify(parameter.default) 
                  : String(parameter.default)
                }
              </code>
            </div>
          )}
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
            <input
              type="number"
              placeholder={`Enter ${parameter.name} value...`}
              className="w-full p-2 text-sm border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800"
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
