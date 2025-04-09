import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EndpointLabel } from "@/components/status/EndpointLabel";
import { Terminal, Download, Copy, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RuntimeInstance, ServerInstance, ServerDefinition } from "@/data/mockData";

interface LogEntry {
  timestamp: Date;
  level: 'info' | 'warning' | 'error';
  message: string;
}

interface RuntimeLogsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  runtime: RuntimeInstance | null;
  instance: ServerInstance | null;
  definition: ServerDefinition | null;
}

export function RuntimeLogsDialog({
  open,
  onOpenChange,
  runtime,
  instance,
  definition
}: RuntimeLogsDialogProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'logs' | 'details'>('logs');
  const [autoScroll, setAutoScroll] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    if (open && runtime && instance) {
      const mockLogs: LogEntry[] = [];
      const now = new Date();
      
      mockLogs.push({
        timestamp: new Date(now.getTime() - 120000), // 2 minutes ago
        level: 'info',
        message: `Initializing connection to ${instance.name}`
      });
      
      mockLogs.push({
        timestamp: new Date(now.getTime() - 119000),
        level: 'info',
        message: `Resolving endpoint: ${instance.connectionDetails}`
      });
      
      if (definition?.type === 'HTTP_SSE') {
        mockLogs.push({
          timestamp: new Date(now.getTime() - 118000),
          level: 'info',
          message: `Establishing HTTP connection with headers: ${JSON.stringify(instance.headers || {})}`
        });
        
        if (runtime.status === 'failed') {
          mockLogs.push({
            timestamp: new Date(now.getTime() - 115000),
            level: 'warning',
            message: 'Connection attempt timed out after 3000ms'
          });
          mockLogs.push({
            timestamp: new Date(now.getTime() - 114000),
            level: 'error',
            message: runtime.errorMessage || 'Failed to establish connection'
          });
        } else {
          mockLogs.push({
            timestamp: new Date(now.getTime() - 115000),
            level: 'info',
            message: 'SSE connection established successfully'
          });
          
          for (let i = 0; i < 5; i++) {
            mockLogs.push({
              timestamp: new Date(now.getTime() - (90000 - i * 15000)),
              level: 'info',
              message: `Processed request #${i + 1} successfully`
            });
          }
        }
      } else {
        mockLogs.push({
          timestamp: new Date(now.getTime() - 118000),
          level: 'info',
          message: `Launching process with arguments: ${instance.arguments?.join(' ') || 'none'}`
        });
        
        if (runtime.status === 'failed') {
          mockLogs.push({
            timestamp: new Date(now.getTime() - 117000),
            level: 'warning',
            message: 'Process exited with code 1'
          });
          mockLogs.push({
            timestamp: new Date(now.getTime() - 116000),
            level: 'error',
            message: runtime.errorMessage || 'Failed to start process'
          });
        } else {
          mockLogs.push({
            timestamp: new Date(now.getTime() - 117000),
            level: 'info',
            message: 'Process started successfully with PID 12345'
          });
          
          for (let i = 0; i < 7; i++) {
            mockLogs.push({
              timestamp: new Date(now.getTime() - (100000 - i * 12000)),
              level: Math.random() > 0.8 ? 'warning' : 'info',
              message: Math.random() > 0.8 
                ? `Warning: operation took longer than expected (${Math.floor(Math.random() * 1000)}ms)`
                : `Operation completed in ${Math.floor(Math.random() * 200)}ms`
            });
          }
        }
      }
      
      setLogs(mockLogs.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()));
    }
  }, [open, runtime, instance, definition]);

  const formatLogTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const getLevelClass = (level: 'info' | 'warning' | 'error') => {
    switch (level) {
      case 'info': return 'text-blue-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
    }
  };

  const handleCopyLogs = () => {
    const logText = logs.map(log => 
      `[${formatLogTime(log.timestamp)}] [${log.level.toUpperCase()}] ${log.message}`
    ).join('\n');
    
    navigator.clipboard.writeText(logText).then(() => {
      toast({
        title: "Logs copied",
        description: "The logs have been copied to clipboard.",
      });
    });
  };

  const handleDownloadLogs = () => {
    const logText = logs.map(log => 
      `[${log.timestamp.toISOString()}] [${log.level.toUpperCase()}] ${log.message}`
    ).join('\n');
    
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${instance?.name || 'runtime'}-logs.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!runtime || !instance || !definition) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[700px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5" />
            <span>Runtime Logs: {instance.name}</span>
            <EndpointLabel type={definition.type} className="ml-2" />
          </DialogTitle>
          <DialogDescription>
            Activity logs and details for this runtime instance
          </DialogDescription>
        </DialogHeader>
        
        <Tabs 
          defaultValue="logs"
          className="flex-grow flex flex-col mt-2" 
          value={activeTab} 
          onValueChange={(val) => setActiveTab(val as 'logs' | 'details')}
        >
          <TabsList>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="details">Runtime Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="logs" className="flex-grow flex flex-col border rounded-md mt-2">
            <div className="bg-muted/30 p-2 border-b flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Badge variant={runtime.status === 'connected' ? 'default' : 'destructive'}>
                  {runtime.status}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 inline mr-1" />
                  Started {new Date(runtime.startedAt).toLocaleString()}
                </span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleCopyLogs}>
                  <Copy className="h-3.5 w-3.5 mr-1" />
                  Copy
                </Button>
                <Button size="sm" variant="outline" onClick={handleDownloadLogs}>
                  <Download className="h-3.5 w-3.5 mr-1" />
                  Download
                </Button>
              </div>
            </div>
            
            <ScrollArea className="flex-grow bg-black/95 p-2 font-mono text-sm">
              <div className="p-2 space-y-1">
                {logs.map((log, i) => (
                  <div key={i} className="whitespace-pre-wrap break-all">
                    <span className="text-gray-400">[{formatLogTime(log.timestamp)}]</span>{' '}
                    <span className={getLevelClass(log.level)}>
                      [{log.level.toUpperCase()}]
                    </span>{' '}
                    <span className="text-gray-200">{log.message}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="details" className="border rounded-md p-4 mt-2">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Runtime Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="font-medium">
                        {runtime.status.charAt(0).toUpperCase() + runtime.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Started At:</span>
                      <span>{runtime.startedAt.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Request Count:</span>
                      <span>{runtime.requestCount}</span>
                    </div>
                    {runtime.lastActivityAt && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Activity:</span>
                        <span>{runtime.lastActivityAt.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Instance Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Server:</span>
                      <span className="font-medium">{definition.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <EndpointLabel type={definition.type} />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Connection:</span>
                      <span className="truncate max-w-[200px]" title={instance.connectionDetails}>
                        {instance.connectionDetails}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {definition.type === 'STDIO' && instance.arguments && instance.arguments.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Arguments</h3>
                  <div className="bg-muted/30 p-2 rounded-md text-sm font-mono">
                    {instance.arguments.join(' ')}
                  </div>
                </div>
              )}
              
              {definition.type === 'HTTP_SSE' && instance.headers && Object.keys(instance.headers).length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Headers</h3>
                  <div className="bg-muted/30 p-2 rounded-md text-sm">
                    <pre className="whitespace-pre-wrap">
                      {JSON.stringify(instance.headers, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
              
              {instance.environment && Object.keys(instance.environment).length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Environment Variables</h3>
                  <div className="bg-muted/30 p-2 rounded-md text-sm">
                    <pre className="whitespace-pre-wrap">
                      {JSON.stringify(instance.environment, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
              
              {runtime.errorMessage && (
                <div>
                  <h3 className="font-medium text-red-600 mb-2">Error Details</h3>
                  <div className="bg-red-50 border border-red-200 text-red-600 p-2 rounded-md text-sm">
                    {runtime.errorMessage}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
