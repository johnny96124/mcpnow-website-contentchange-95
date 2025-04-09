
import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Clock, RefreshCw } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RuntimeInstance } from "./RuntimeInstancesList";

interface LogEntry {
  id: string;
  timestamp: Date;
  level: "info" | "warn" | "error" | "debug";
  message: string;
}

interface RuntimeLogsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  runtimeInstance: RuntimeInstance | null;
}

export function RuntimeLogsDialog({
  open,
  onOpenChange,
  runtimeInstance
}: RuntimeLogsDialogProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Generate mock logs for the demo
  useEffect(() => {
    if (open && runtimeInstance) {
      fetchLogs();
      
      let interval: NodeJS.Timeout;
      if (autoRefresh) {
        interval = setInterval(appendNewLog, 3000);
      }
      
      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [open, runtimeInstance, autoRefresh]);

  const fetchLogs = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      if (!runtimeInstance) return;
      
      const mockLogs: LogEntry[] = [];
      const now = new Date();
      
      // Generate mock log entries that look like real server logs
      const logMessages = [
        { level: "info", msg: `Server instance '${runtimeInstance.instanceName}' started` },
        { level: "info", msg: "Loading configuration..." },
        { level: "debug", msg: `Using profile: ${runtimeInstance.profileName}` },
        { level: "info", msg: "Initialization complete" },
        { level: "info", msg: `Listening on ${runtimeInstance.connectionDetails}` },
        { level: "debug", msg: "Connected to host" },
        { level: "info", msg: "Ready to process requests" },
        { level: "debug", msg: "Checking configuration..." },
        { level: "debug", msg: "Configuration valid" },
        { level: "info", msg: "First client connected" },
        { level: "info", msg: "Processed request: GET /status" },
        { level: "debug", msg: "Memory usage: 24.5MB" },
        { level: "warn", msg: "Slow response detected (324ms)" },
        { level: "info", msg: "Processed request: POST /data" },
        { level: "debug", msg: "Memory usage: 26.8MB" }
      ];
      
      for (let i = 0; i < logMessages.length; i++) {
        const pastTime = new Date(now.getTime() - (logMessages.length - i) * 5000);
        mockLogs.push({
          id: `log-${i}`,
          timestamp: pastTime,
          level: logMessages[i].level as "info" | "warn" | "error" | "debug",
          message: logMessages[i].msg
        });
      }
      
      setLogs(mockLogs);
      setIsLoading(false);
    }, 800);
  };

  const appendNewLog = () => {
    if (!runtimeInstance || !open) return;
    
    const logTypes = [
      { level: "info", msgs: [
        "Processed request: GET /status", 
        `Client request from ${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        "Cache hit for request"
      ]},
      { level: "debug", msgs: [
        `Memory usage: ${(24 + Math.random() * 10).toFixed(1)}MB`,
        "Garbage collection completed",
        "Configuration reloaded"
      ]},
      { level: "warn", msgs: [
        `Slow response detected (${Math.floor(300 + Math.random() * 500)}ms)`,
        "High CPU usage",
        "Connection pool nearly full"
      ]},
      { level: "error", msgs: [
        "Failed to process request: timeout",
        "Database connection error",
        "Invalid request format"
      ]}
    ];
    
    // Weighted selection to make info and debug more common
    const weights = [0.5, 0.3, 0.15, 0.05];
    const rand = Math.random();
    let cumulativeWeight = 0;
    let selectedType = 0;
    
    for (let i = 0; i < weights.length; i++) {
      cumulativeWeight += weights[i];
      if (rand <= cumulativeWeight) {
        selectedType = i;
        break;
      }
    }
    
    const logType = logTypes[selectedType];
    const randomMessage = logType.msgs[Math.floor(Math.random() * logType.msgs.length)];
    
    const newLog: LogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date(),
      level: logType.level as "info" | "warn" | "error" | "debug",
      message: randomMessage
    };
    
    setLogs(prevLogs => [...prevLogs, newLog]);
  };

  const handleRefresh = () => {
    fetchLogs();
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  const formatTime = (date: Date) => {
    return date.toTimeString().substring(0, 8);
  };

  const getLevelBadge = (level: "info" | "warn" | "error" | "debug") => {
    switch (level) {
      case "info":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">INFO</Badge>;
      case "warn":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">WARN</Badge>;
      case "error":
        return <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">ERROR</Badge>;
      case "debug":
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">DEBUG</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Instance Logs</DialogTitle>
          <DialogDescription className="flex flex-col gap-1">
            {runtimeInstance && (
              <>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{runtimeInstance.instanceName}</span>
                  <span className="text-muted-foreground">•</span>
                  <span>{runtimeInstance.definitionName}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Connected via <span className="font-medium">{runtimeInstance.hostName}</span> on profile <span className="font-medium">{runtimeInstance.profileName}</span>
                </div>
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="auto-refresh"
                checked={autoRefresh}
                onCheckedChange={setAutoRefresh}
              />
              <Label htmlFor="auto-refresh">Auto refresh</Label>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleClearLogs}
          >
            Clear logs
          </Button>
        </div>

        <div className="border rounded-md h-[400px] bg-muted/20">
          <ScrollArea className="h-full p-0">
            {logs.length > 0 ? (
              <div className="font-mono text-sm p-1">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-start gap-2 p-1 hover:bg-muted/30 rounded">
                    <div className="text-muted-foreground flex items-center shrink-0">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{formatTime(log.timestamp)}</span>
                    </div>
                    <div className="shrink-0">
                      {getLevelBadge(log.level)}
                    </div>
                    <div className="flex-1 break-all">{log.message}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                {isLoading ? "Loading logs..." : "No logs available"}
              </div>
            )}
          </ScrollArea>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
