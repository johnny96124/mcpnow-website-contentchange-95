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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
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
      title: "工具执行中",
      description: `正在执行 ${tool.name}...`,
    });
    
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
  
  const toggleTool = (toolId: string) => {
    setExpandedTools(prev => ({
      ...prev,
      [toolId]: !prev[toolId]
    }));
  };
  
  const handleDeleteTool = (toolId: string) => {
    setSelectedToolId(toolId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedToolId) {
      toast({
        title: "工具已删除",
        description: "该工具已被成功删除",
      });
      setDeleteDialogOpen(false);
      setSelectedToolId(null);
    }
  };
  
  if (!server || !definition) {
    return null;
  }
  
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px] p-0 gap-0 bg-gradient-to-b from-background to-muted/20" hideClose>
          <DialogHeader className="p-6 pb-4">
            <DialogTitle className="text-xl">
              Debug Tools - {server?.name}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Execute and test server tools
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[600px] px-6">
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
                          variant="destructive"
                          onClick={() => handleDeleteTool(tool.id)}
                        >
                          Delete
                        </Button>
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
          
          <DialogFooter className="p-6 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>删除工具</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除这个工具吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
