
import { useState, useEffect } from "react";
import { ServerInstance, serverDefinitions, Tool } from "@/data/mockData";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ChevronDown, ChevronUp, AlertTriangle, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

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
  const [expandedTools, setExpandedTools] = useState<Record<string, boolean>>({});
  const [toolsResults, setToolsResults] = useState<Record<string, { success: boolean; message: string; isLoading: boolean }>>({});
  const [paramValues, setParamValues] = useState<Record<string, ToolParameterValue>>({});
  const { toast } = useToast();
  
  const definition = server ? serverDefinitions.find(def => def.id === server.definitionId) : null;
  
  // Initialize parameter values for each tool
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
  
  // Handle parameter value changes
  const handleParamChange = (toolId: string, paramName: string, value: string) => {
    setParamValues(prev => ({
      ...prev,
      [toolId]: {
        ...prev[toolId],
        [paramName]: value
      }
    }));
  };
  
  // Execute a tool with its parameters
  const handleExecuteTool = (tool: Tool) => {
    setToolsResults(prev => ({
      ...prev,
      [tool.id]: { success: false, message: "", isLoading: true }
    }));
    
    toast({
      title: "工具执行中",
      description: `正在执行 ${tool.name}...`,
    });
    
    // Simulate API call
    setTimeout(() => {
      const success = Math.random() > 0.3;
      const resultMessage = success 
        ? `Tool executed successfully with parameters: ${JSON.stringify(paramValues[tool.id])}` 
        : "执行失败: 无法连接到服务器或参数无效";
      
      setToolsResults(prev => ({
        ...prev,
        [tool.id]: { 
          success: success, 
          message: resultMessage,
          isLoading: false
        }
      }));
      
      toast({
        title: success ? "执行成功" : "执行失败",
        description: success 
          ? `${tool.name} 已成功执行，请检查结果` 
          : `${tool.name} 执行过程中遇到错误，请重试`,
        variant: success ? "default" : "destructive"
      });
    }, 2000);
  };
  
  // Toggle tool expansion
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Debug Tools - {server.name}
          </DialogTitle>
          <DialogDescription>
            Execute and test server tools
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[500px] rounded-md border p-4">
          <div className="space-y-6">
            {definition.tools?.map((tool) => (
              <div key={tool.id} className="rounded-lg border p-4">
                <div 
                  className="flex items-center justify-between mb-2 cursor-pointer"
                  onClick={() => toggleTool(tool.id)}
                >
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-lg">{tool.name}</h3>
                    <Badge variant="outline">Tool</Badge>
                  </div>
                  {expandedTools[tool.id] ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </div>
                
                {expandedTools[tool.id] && (
                  <div className="space-y-4 mt-4">
                    <p className="text-sm text-muted-foreground">
                      {tool.description}
                    </p>
                    
                    {tool.parameters && tool.parameters.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="text-sm font-medium">Parameters:</h4>
                        <div className="space-y-3">
                          {tool.parameters.map((param) => (
                            <div
                              key={param.name}
                              className="space-y-1"
                            >
                              <Label htmlFor={`${tool.id}-${param.name}`} className="font-mono text-xs">
                                {param.name} <span className="text-muted-foreground">({param.type})</span>
                              </Label>
                              <Input 
                                id={`${tool.id}-${param.name}`}
                                value={paramValues[tool.id]?.[param.name] || ''}
                                onChange={(e) => handleParamChange(tool.id, param.name, e.target.value)}
                                placeholder={`Enter ${param.name} value`}
                              />
                              {param.description && (
                                <p className="text-[11px] text-muted-foreground px-1">
                                  {param.description}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {toolsResults[tool.id] && !toolsResults[tool.id].isLoading && (
                      <Alert variant={toolsResults[tool.id].success ? "default" : "destructive"} className="mt-3">
                        {toolsResults[tool.id].success ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <AlertTriangle className="h-4 w-4" />
                        )}
                        <AlertDescription>
                          {toolsResults[tool.id].message}
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="mt-4 flex justify-end">
                      <Button 
                        onClick={() => handleExecuteTool(tool)}
                        size="sm"
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
      </DialogContent>
    </Dialog>
  );
}

