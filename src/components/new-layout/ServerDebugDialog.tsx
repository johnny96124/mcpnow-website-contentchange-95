
import { useState } from "react";
import { ServerInstance, serverDefinitions } from "@/data/mockData";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader, X, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface ServerDebugDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  server: ServerInstance | null;
}

export function ServerDebugDialog({
  open,
  onOpenChange,
  server
}: ServerDebugDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isConfigValid, setIsConfigValid] = useState<boolean | null>(null);
  const { toast } = useToast();
  
  const definition = server ? serverDefinitions.find(def => def.id === server.definitionId) : null;
  
  // Simulate environment validation
  const validateEnvironment = () => {
    setIsLoading(true);
    // Simulate API call to validate environment
    setTimeout(() => {
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
    }, 1500);
  };
  
  // Reset state when dialog closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setIsConfigValid(null);
      setIsLoading(false);
    } else {
      validateEnvironment();
    }
    onOpenChange(open);
  };

  const handleExecuteTool = (toolId: string) => {
    toast({
      title: "工具执行中",
      description: "正在处理您的请求...",
    });
    // Simulate tool execution
    setTimeout(() => {
      const success = Math.random() > 0.3;
      toast({
        title: success ? "执行成功" : "执行失败",
        description: success 
          ? "工具已成功执行，请检查结果" 
          : "工具执行过程中遇到错误，请重试",
        variant: success ? "default" : "destructive"
      });
    }, 2000);
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
          <div className="flex items-center justify-center py-8">
            <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">正在验证环境配置...</span>
          </div>
        ) : isConfigValid === false ? (
          <Alert variant="destructive" className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              环境配置验证失败。请确保所有必要的环境变量都已正确配置后重试。
            </AlertDescription>
          </Alert>
        ) : isConfigValid && (
          <Tabs defaultValue="tools" className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="tools">Tools</TabsTrigger>
              <TabsTrigger value="history">Message History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tools" className="mt-4">
              <ScrollArea className="h-[400px] rounded-md border p-4">
                <div className="space-y-4">
                  {definition.tools?.map((tool) => (
                    <div key={tool.id} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{tool.name}</h3>
                        <Badge variant="outline">Tool</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        {tool.description}
                      </p>
                      {tool.parameters && tool.parameters.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Parameters:</h4>
                          <div className="space-y-1">
                            {tool.parameters.map((param) => (
                              <div
                                key={param.name}
                                className="text-sm grid grid-cols-[120px,1fr] gap-2 bg-secondary/20 p-2 rounded-sm"
                              >
                                <span className="font-mono">{param.name}</span>
                                <span className="text-muted-foreground">
                                  {param.type}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="mt-4 flex justify-end">
                        <Button 
                          onClick={() => handleExecuteTool(tool.id)}
                          size="sm"
                        >
                          Execute
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="history">
              <div className="border rounded-md p-4 text-center text-muted-foreground">
                Message history will be implemented here
              </div>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
