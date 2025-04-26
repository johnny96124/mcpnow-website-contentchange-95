
import React, { useState } from "react";
import { PlusCircle, FileText, ServerCog, ChevronDown, Check, AlertTriangle, Info, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Host, ConnectionStatus, Profile, profiles } from "@/data/mockData";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { HostRefreshHint } from "@/components/hosts/HostRefreshHint";
import { ProfileChangeHint } from "@/components/hosts/ProfileChangeHint";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

export interface HostCardProps {
  host: Host;
  profileId: string;
  onProfileChange: (hostId: string, profileId: string) => void;
  onOpenConfigDialog: (hostId: string) => void;
  onCreateConfig: (hostId: string) => void;
  onFixConfig: (hostId: string) => void;
  showHostRefreshHint?: boolean;
  onAddServer?: () => void;
}

export function HostCard({
  host,
  profileId,
  onProfileChange,
  onOpenConfigDialog,
  onCreateConfig,
  onFixConfig,
  showHostRefreshHint,
  onAddServer
}: HostCardProps) {
  const [isChangingProfile, setIsChangingProfile] = useState(false);

  const getConnectionStatusColor = (status: ConnectionStatus) => {
    switch (status) {
      case "connected":
        return "bg-green-500";
      case "disconnected":
        return "bg-red-500";
      case "misconfigured":
        return "bg-yellow-500";
      case "unknown":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getConfigStatusComponent = () => {
    switch (host.configStatus) {
      case "configured":
        return (
          <div className="flex items-center text-green-600">
            <Check className="h-4 w-4 mr-1" />
            <span className="text-xs">Configured</span>
          </div>
        );
      case "misconfigured":
        return (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-amber-600 hover:text-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/30"
            onClick={() => onFixConfig(host.id)}
          >
            <AlertTriangle className="h-3.5 w-3.5 mr-1" />
            <span className="text-xs">Fix Configuration</span>
          </Button>
        );
      case "unknown":
        return (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30"
            onClick={() => onCreateConfig(host.id)}
          >
            <Info className="h-3.5 w-3.5 mr-1" />
            <span className="text-xs">Configure Host</span>
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="overflow-hidden relative">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <div className="h-9 w-9 rounded bg-primary/10 flex items-center justify-center text-xl">
              {host.icon || '🖥️'}
            </div>
            <div>
              <CardTitle className="text-lg">{host.name}</CardTitle>
              <div className="flex items-center mt-0.5">
                <div className={cn("h-2 w-2 rounded-full mr-1.5", getConnectionStatusColor(host.connectionStatus))}></div>
                <span className="text-xs text-muted-foreground capitalize">{host.connectionStatus}</span>
              </div>
            </div>
          </div>

          {onAddServer && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onAddServer} 
              className="flex items-center"
            >
              <PlusCircle className="h-4 w-4 mr-1" /> Add Server
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="pb-0">
        <div className="mt-4 space-y-4">
          {host.configStatus !== "unknown" && (
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Configuration File</Label>
              <div className="flex items-center justify-between">
                <span className="text-sm truncate max-w-[70%]">{host.configPath || "No config file"}</span>
                {host.configPath && (
                  <Button variant="ghost" size="sm" className="h-6 px-2" onClick={() => onOpenConfigDialog(host.id)}>
                    <FileText className="h-3.5 w-3.5 mr-1" />
                    <span className="text-xs">View Config</span>
                  </Button>
                )}
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-muted-foreground">Host Status</Label>
              {getConfigStatusComponent()}
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-1.5">
            <Label htmlFor="profile-select" className="text-xs font-medium text-muted-foreground">
              Servers
            </Label>
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1.5">
                {host.servers && host.servers.length > 0 ? (
                  host.servers.map((server, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {server.name}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">No servers configured</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-4 pb-4 flex justify-between">
        {showHostRefreshHint && <HostRefreshHint className="absolute bottom-0 right-0" />}
        {isChangingProfile && <ProfileChangeHint className="absolute bottom-0 right-0" />}
        
        <div className="mt-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex">
                  <ServerCog className="h-5 w-5 text-muted-foreground" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Host Configuration Status</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        {onAddServer && (
          <Button variant="outline" size="sm" onClick={onAddServer}>
            <PlusCircle className="h-4 w-4 mr-1.5" />
            Configure Servers
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
