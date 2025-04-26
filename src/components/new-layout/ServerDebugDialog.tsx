
import { useState, useEffect } from "react";
import { ServerInstance, serverDefinitions, Tool, ToolParameter } from "@/data/mockData";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader, X, AlertTriangle, Check } from "lucide-react";
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
  const [isLoading, setIsLoading] = useState(true);
  const [isConfigValid, setIsConfigValid] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState("tools");
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
  
  // Simulate environment validation when dialog opens
  useEffect(() => {
    if (open) {
      setIsLoading(true);
      setIsConfigValid(null);
      setToolsResults({});
      
      const timer = setTimeout(() => {
        const isValid = Math.random() > 0.3; // Simulate 70% success rate
        setIsConfigValid(isValid);
        setIsLoading(false);
        
        if (!isValid) {
          toast({
            title: "环境配置错误",
            description: "请检查必要的环境变量是否已正确配置",
            variant: "destructive"
          });
        }
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [open, toast]);
  
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
    // Set loading state for this tool
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
  
  // Reset state when dialog closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setIsConfigValid(null);
      setIsLoading(true);
      setToolsResults({});
    }
    onOpenChange(open);
  };
  
  if (!server || !definition) {
    return null;
  }
  
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Server Tools - {server.name}
          </DialogTitle>
          <DialogDescription>
            Debug, execute tools, and view message history for this server instance
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-center text-lg font-medium">正在验证环境配置...</p>
            <p className="text-sm text-muted-foreground mt-2">
              检查服务器连接和环境变量
            </p>
          </div>
        ) : isConfigValid === false ? (
          <Alert variant="destructive" className="mt-6 px-6 py-6">
            <AlertTriangle className="h-5 w-5" />
            <AlertDescription className="mt-2">
              <h3 className="text-base font-semibold mb-2">环境配置验证失败</h3>
              <p className="mb-4">请确保所有必要的环境变量都已正确配置后重试。</p>
              <div className="bg-background/30 p-3 rounded-md text-sm mb-4">
                <code className="font-mono">
                  {server.environment 
                    ? Object.entries(server.environment).map(([key]) => 
                        `${key}=*****`
                      ).join('\n') 
                    : 'No environment variables configured'}
                </code>
              </div>
              <Button onClick={handleOpenChange.bind(null, false)}>
                关闭
              </Button>
            </AlertDescription>
          </Alert>
        ) : (
          <Tabs
            defaultValue="tools"
            value={activeTab}
            onValueChange={setActiveTab}
            className="mt-4"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="tools">Tools</TabsTrigger>
              <TabsTrigger value="history">Message History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tools" className="mt-4">
              <ScrollArea className="h-[500px] rounded-md border p-4">
                <div className="space-y-6">
                  {definition.tools?.map((tool) => (
                    <div key={tool.id} className="rounded-lg border p-4 space-y-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-lg">{tool.name}</h3>
                        <Badge variant="outline">Tool</Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4">
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
                        <Alert variant={toolsResults[tool.id].success ? "default" : "destructive"} className="mt-3 mb-3">
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
                        {toolsResults[tool.id]?.isLoading ? (
                          <Button disabled>
                            <Loader className="h-4 w-4 mr-2 animate-spin" />
                            Executing...
                          </Button>
                        ) : (
                          <Button 
                            onClick={() => handleExecuteTool(tool)}
                            size="sm"
                          >
                            Execute
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="history">
              <div className="border rounded-md p-6 text-center">
                <div className="text-muted-foreground mb-4">
                  <p>Message history will be implemented here</p>
                </div>
                <Button variant="outline" size="sm">
                  Clear History
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
