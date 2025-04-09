
import React from "react";
import { Terminal, XCircle, AlertTriangle, CheckCircle, ExternalLink } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EndpointLabel } from "@/components/status/EndpointLabel";
import { StatusIndicator } from "@/components/status/StatusIndicator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface RuntimeInstance {
  id: string;
  instanceId: string;
  instanceName: string;
  definitionId: string;
  definitionName: string;
  definitionType: 'HTTP_SSE' | 'STDIO';
  profileId: string;
  profileName: string;
  hostId: string;
  hostName: string;
  status: 'connecting' | 'connected' | 'failed';
  errorMessage?: string;
  connectionDetails: string;
  startedAt: Date;
  requestCount: number;
}

interface RuntimeInstancesListProps {
  runtimeInstances: RuntimeInstance[];
  isLoading?: boolean;
  onDisconnect: (runtimeId: string) => void;
  onReconnect: (runtimeId: string) => void;
  onViewLogs: (runtimeId: string) => void;
}

export function RuntimeInstancesList({
  runtimeInstances,
  isLoading = false,
  onDisconnect,
  onReconnect,
  onViewLogs
}: RuntimeInstancesListProps) {
  if (isLoading) {
    return <RuntimeInstancesSkeletonLoader />;
  }

  if (runtimeInstances.length === 0) {
    return <EmptyRuntimeState />;
  }

  const getStatusColor = (status: 'connecting' | 'connected' | 'failed'): 'warning' | 'active' | 'error' => {
    switch (status) {
      case 'connecting':
        return 'warning';
      case 'connected':
        return 'active';
      case 'failed':
        return 'error';
    }
  };

  const getStatusIcon = (status: 'connecting' | 'connected' | 'failed') => {
    switch (status) {
      case 'connecting':
        return <Terminal className="h-4 w-4 animate-pulse" />;
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
    }
  };

  const formatTimeDuration = (startDate: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - startDate.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMin % 60}m`;
    } else if (diffMin > 0) {
      return `${diffMin}m ${diffSec % 60}s`;
    } else {
      return `${diffSec}s`;
    }
  };

  return (
    <Card className="border-2">
      <CardHeader className="bg-muted/30 pb-4">
        <CardTitle className="text-xl flex items-center gap-2">
          Runtime Instances
          <Badge variant="outline" className="ml-2">
            {runtimeInstances.length}
          </Badge>
        </CardTitle>
        <CardDescription>
          Active server instances connected to hosts
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[180px]">Instance</TableHead>
                <TableHead className="w-[140px]">Host</TableHead>
                <TableHead className="w-[140px]">Profile</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[100px]">Uptime</TableHead>
                <TableHead className="w-[80px] text-right">Requests</TableHead>
                <TableHead className="text-right w-[220px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {runtimeInstances.map((runtime) => (
                <TableRow key={runtime.id}>
                  <TableCell>
                    <div className="flex flex-col space-y-1">
                      <div className="font-medium">{runtime.instanceName}</div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <span className="mr-1">{runtime.definitionName}</span>
                        <EndpointLabel type={runtime.definitionType} size="xs" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{runtime.hostName}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal">
                      {runtime.profileName}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <StatusIndicator status={getStatusColor(runtime.status)} />
                      <span className="text-sm capitalize">{runtime.status}</span>
                      
                      {runtime.errorMessage && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="cursor-help">
                                <AlertTriangle className="h-3.5 w-3.5 text-destructive ml-1" />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-[300px] p-3">
                              <p className="font-medium">Error</p>
                              <p className="text-sm">{runtime.errorMessage}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {formatTimeDuration(runtime.startedAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    {runtime.requestCount}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onViewLogs(runtime.id)}
                        className="text-blue-600 hover:text-blue-700 hover:border-blue-600 transition-colors"
                      >
                        <Terminal className="h-4 w-4 mr-1" />
                        Logs
                      </Button>
                      
                      {runtime.status === 'failed' ? (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onReconnect(runtime.id)}
                          className="text-green-600 hover:text-green-700 hover:border-green-600 transition-colors"
                        >
                          <Terminal className="h-4 w-4 mr-1" />
                          Reconnect
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onDisconnect(runtime.id)}
                          className="text-destructive hover:text-destructive hover:border-destructive transition-colors"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Disconnect
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyRuntimeState() {
  return (
    <Card className="border-2 border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-10 px-4 text-center">
        <Terminal className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No Runtime Instances</h3>
        <p className="text-muted-foreground max-w-md mb-4">
          Connect a host and start server instances through profiles to see runtime instances here.
        </p>
        <div className="flex items-center gap-2 p-4 bg-muted/50 rounded-lg max-w-lg">
          <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
          <p className="text-sm text-left">
            Runtime instances are created when a host is connected and a server instance 
            is started through an associated profile.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function RuntimeInstancesSkeletonLoader() {
  return (
    <Card className="border-2">
      <CardHeader className="bg-muted/30 pb-4">
        <Skeleton className="h-6 w-48 mb-1" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[180px]"><Skeleton className="h-4 w-20" /></TableHead>
                <TableHead className="w-[140px]"><Skeleton className="h-4 w-16" /></TableHead>
                <TableHead className="w-[140px]"><Skeleton className="h-4 w-16" /></TableHead>
                <TableHead className="w-[100px]"><Skeleton className="h-4 w-16" /></TableHead>
                <TableHead className="w-[100px]"><Skeleton className="h-4 w-16" /></TableHead>
                <TableHead className="w-[80px] text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableHead>
                <TableHead className="text-right w-[220px]"><Skeleton className="h-4 w-16 ml-auto" /></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3].map((i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex flex-col space-y-1">
                      <Skeleton className="h-5 w-32 mb-1" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-5 w-10 ml-auto" /></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Skeleton className="h-9 w-20" />
                      <Skeleton className="h-9 w-28" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
