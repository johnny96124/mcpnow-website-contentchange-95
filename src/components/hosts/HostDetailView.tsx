
import React, { useState, useEffect } from "react";
import { 
  FileText, Edit, Plus, Save, Server, Trash2, AlertTriangle, 
  CheckCircle, RefreshCw, ArrowRight, Info, X, ChevronDown, 
  Settings, ExternalLink, Terminal, MessageSquare, MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { StatusIndicator } from "@/components/status/StatusIndicator";
import { EndpointLabel } from "@/components/status/EndpointLabel";
import { toast } from "@/hooks/use-toast";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Host, Profile, ServerInstance, ConnectionStatus, serverDefinitions, EndpointType } from "@/data/mockData";

interface ConfigFileDetailsProps {
  configPath: string;
  onViewConfig: () => void;
}

const ConfigFileDetails: React.FC<ConfigFileDetailsProps> = ({ configPath, onViewConfig }) => {
  return (
    <div className="bg-muted/10 p-3 rounded-md text-sm flex items-center justify-between my-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        <FileText className="h-4 w-4" />
        <span className="truncate max-w-[200px]">{configPath}</span>
      </div>
      <Button variant="ghost" size="sm" onClick={onViewConfig} className="h-7 px-2">
        View
      </Button>
    </div>
  );
};

interface ProfileDropdownProps {
  profiles: Profile[];
  selectedProfileId: string;
  onSelectProfile: (profileId: string) => void;
  onCreateProfile: () => void;
  onDeleteProfile: (profileId: string) => void;
  hostName: string;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  profiles,
  selectedProfileId,
  onSelectProfile,
  onCreateProfile,
  onDeleteProfile,
  hostName
}) => {
  const selectedProfile = profiles.find(p => p.id === selectedProfileId);
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          {selectedProfile ? selectedProfile.name : `${hostName} Default Profile`}
          <ChevronDown className="h-3.5 w-3.5 opacity-70" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0">
        <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground border-b">
          Select Profile
        </div>
        <div className="py-1 max-h-[200px] overflow-y-auto">
          {profiles.map(profile => (
            <div 
              key={profile.id} 
              className={`px-2 py-1.5 text-sm flex items-center justify-between cursor-pointer hover:bg-muted/50 ${selectedProfileId === profile.id ? 'bg-muted' : ''}`}
              onClick={() => onSelectProfile(profile.id)}
            >
              <span className="truncate">{profile.name}</span>
              {selectedProfileId !== profile.id && profile.id !== 'default' && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 opacity-70 hover:opacity-100" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteProfile(profile.id);
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          ))}
        </div>
        <div className="border-t p-1">
          <Button variant="ghost" size="sm" className="w-full justify-start" onClick={onCreateProfile}>
            <Plus className="h-3.5 w-3.5 mr-2" />
            New Profile
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

interface HostDetailViewProps {
  host: Host;
  profiles: Profile[];
  serverInstances: ServerInstance[];
  selectedProfileId: string;
  onCreateConfig: (hostId: string) => void;
  onProfileChange: (profileId: string) => void;
  onAddServersToHost: (host: Host) => void;
  onDeleteHost: (hostId: string) => void;
  onServerStatusChange: (serverId: string, status: 'running' | 'stopped' | 'error' | 'connecting') => void;
  onSaveProfileChanges: () => void;
  onViewConfig: (configPath: string) => void;
  onCreateProfile: (hostId: string) => void;
  onDeleteProfile: (profileId: string) => void;
  onOpenServerDebugDialog: (serverId: string) => void;
  onOpenServerHistoryDialog: (serverId: string) => void;
  onShowServerDetail: (serverId: string) => void;
  onRemoveServerFromProfile: (serverId: string, profileId: string) => void;
}

export const HostDetailView: React.FC<HostDetailViewProps> = ({
  host,
  profiles,
  serverInstances,
  selectedProfileId,
  onCreateConfig,
  onProfileChange,
  onAddServersToHost,
  onDeleteHost,
  onServerStatusChange,
  onSaveProfileChanges,
  onViewConfig,
  onCreateProfile,
  onDeleteProfile,
  onOpenServerDebugDialog,
  onOpenServerHistoryDialog,
  onShowServerDetail,
  onRemoveServerFromProfile
}) => {
  const [isUnsavedChanges, setIsUnsavedChanges] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("servers");
  const [searchQuery, setSearchQuery] = useState("");

  const selectedProfile = profiles.find(p => p.id === selectedProfileId);
  
  const profileServers = serverInstances.filter(
    server => selectedProfile?.instances.includes(server.id)
  );

  const filteredServers = profileServers.filter(server => 
    server.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInstanceChange = (serverId: string, enabled: boolean) => {
    if (host.connectionStatus !== "connected") return;
    
    setIsUnsavedChanges(true);
    onServerStatusChange(serverId, enabled ? 'connecting' : 'stopped');
    
    if (enabled) {
      // Simulate connection attempt
      setTimeout(() => {
        const success = Math.random() > 0.3; // 70% chance of success
        onServerStatusChange(serverId, success ? 'running' : 'error');
        
        toast({
          title: success ? "Server connected" : "Connection failed",
          description: success 
            ? "Server is now running" 
            : "Failed to connect to server. Check configuration.",
          variant: success ? "default" : "destructive"
        });
      }, 1500);
    } else {
      toast({
        title: "Server stopped",
        description: "Server has been stopped"
      });
    }
  };

  const getServerLoad = (serverId: string) => {
    return Math.floor(Math.random() * 90) + 10;
  };

  const getDefinitionType = (definitionId: string): EndpointType | "Custom" | "WS" => {
    const definition = serverDefinitions.find(def => def.id === definitionId);
    return definition?.type as (EndpointType | "Custom" | "WS") || "HTTP_SSE";
  };

  const handleSaveChanges = () => {
    onSaveProfileChanges();
    setIsUnsavedChanges(false);
    toast({
      title: "Profile saved",
      description: `Changes to profile ${selectedProfile?.name} have been saved`
    });
  };

  const handleDeleteHost = () => {
    if (window.confirm(`Are you sure you want to delete host ${host.name}?`)) {
      onDeleteHost(host.id);
    }
  };

  const handleSelectProfile = (profileId: string) => {
    if (isUnsavedChanges) {
      if (confirm("You have unsaved changes. Save changes before switching profiles?")) {
        onSaveProfileChanges();
        onProfileChange(profileId);
      }
    } else {
      onProfileChange(profileId);
    }
  };

  const handleCreateNewProfile = () => {
    onCreateProfile(host.id);
  };

  const handleDeleteProfile = (profileId: string) => {
    if (confirm(`Are you sure you want to delete profile "${profiles.find(p => p.id === profileId)?.name}"?`)) {
      onDeleteProfile(profileId);
    }
  };

  if (host.configStatus === "unknown") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-muted/30 p-3 rounded-full">
              <span className="text-2xl">{host.icon || '🖥️'}</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold">{host.name}</h2>
              <div className="flex items-center gap-2">
                <StatusIndicator 
                  status="inactive" 
                  label="Needs Configuration" 
                />
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" className="text-destructive hover:text-destructive" onClick={handleDeleteHost}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Host
            </Button>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4 py-6">
              <div className="mx-auto w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-500" />
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Configuration Required</h3>
                <p className="text-muted-foreground text-sm">
                  This host needs to be configured before you can connect servers to it
                </p>
              </div>
              <Button onClick={() => onCreateConfig(host.id)} className="bg-blue-500 hover:bg-blue-600">
                Configure Host
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-muted/30 p-3 rounded-full">
            <span className="text-2xl">{host.icon || '🖥️'}</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold">{host.name}</h2>
            <div className="flex items-center gap-2">
              <StatusIndicator 
                status={
                  host.connectionStatus === "connected" 
                    ? "active" 
                    : host.connectionStatus === "misconfigured" 
                      ? "error" 
                      : "inactive"
                } 
                label={
                  host.connectionStatus === "connected" 
                    ? "Connected" 
                    : host.connectionStatus === "misconfigured" 
                      ? "Misconfigured" 
                      : "Disconnected"
                } 
              />
              
              {host.configPath && (
                <ConfigFileDetails 
                  configPath={host.configPath} 
                  onViewConfig={() => onViewConfig(host.configPath)}
                />
              )}
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          {isUnsavedChanges && (
            <Button onClick={handleSaveChanges} variant="default" className="bg-green-500 hover:bg-green-600">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          )}
          <Button variant="outline" className="text-destructive hover:text-destructive" onClick={handleDeleteHost}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Host
          </Button>
        </div>
      </div>

      {isUnsavedChanges && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800">Unsaved Changes</AlertTitle>
          <AlertDescription className="text-yellow-700">
            You have unsaved changes to this profile. Please save your changes before switching profiles.
          </AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-lg">
              Connected Servers
            </CardTitle>
            <ProfileDropdown 
              profiles={profiles}
              selectedProfileId={selectedProfileId}
              onSelectProfile={handleSelectProfile}
              onCreateProfile={handleCreateNewProfile}
              onDeleteProfile={handleDeleteProfile}
              hostName={host.name}
            />
          </div>
          
          {profileServers.length > 0 ? (
            <div className="relative w-[240px]">
              <Input
                placeholder="Search servers..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-8"
              />
              <div className="absolute left-2.5 top-2.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </svg>
              </div>
              {searchQuery && (
                <button 
                  className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ) : (
            <Button onClick={() => onAddServersToHost(host)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Server
            </Button>
          )}
        </CardHeader>
        
        <CardContent>
          {filteredServers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Server</TableHead>
                  <TableHead className="w-[120px]">Type</TableHead>
                  <TableHead className="w-[120px]">Status</TableHead>
                  <TableHead className="w-[120px]">Load</TableHead>
                  <TableHead className="text-center w-[80px]">Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServers.map(server => {
                  const serverLoad = getServerLoad(server.id);
                  const hasError = server.status === 'error';
                  const isDisabled = host.connectionStatus !== "connected";
                  
                  return (
                    <TableRow key={server.id} className={hasError ? "bg-red-50/30" : ""}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="bg-muted rounded-md p-1 flex-shrink-0">
                            <Server className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <span>{server.name}</span>
                        </div>
                        {hasError && (
                          <div className="text-xs text-red-500 mt-1 flex items-center gap-1.5">
                            <AlertTriangle className="h-3 w-3" />
                            Error: Failed to connect to server
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <EndpointLabel type={getDefinitionType(server.definitionId)} />
                      </TableCell>
                      <TableCell>
                        <StatusIndicator 
                          status={
                            server.status === "running" 
                              ? "active" 
                              : server.status === "error" 
                                ? "error" 
                                : server.status === "connecting" 
                                  ? "warning" 
                                  : "inactive"
                          } 
                          label={server.status} 
                        />
                      </TableCell>
                      <TableCell>
                        {server.status === "running" ? (
                          <>
                            <Progress value={serverLoad} className="h-2" />
                            <span className="text-xs text-muted-foreground mt-0.5 inline-block">{serverLoad}%</span>
                          </>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Switch
                          checked={server.status === 'running' || server.status === 'connecting'}
                          onCheckedChange={(enabled) => handleInstanceChange(server.id, enabled)}
                          disabled={isDisabled || server.status === 'connecting'}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => onOpenServerDebugDialog(server.id)} title="Debug Tools">
                            <Terminal className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                            onClick={() => onOpenServerHistoryDialog(server.id)} title="Message History">
                            <MessageSquare className="h-3.5 w-3.5" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-muted-foreground">
                                <MoreHorizontal className="h-3.5 w-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem onClick={() => onShowServerDetail(server.id)}>
                                <Info className="h-4 w-4 mr-2" />
                                Server Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onShowServerDetail(server.id)}>
                                <Settings className="h-4 w-4 mr-2" />
                                View Parameters
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-600 focus:text-red-600" 
                                onClick={() => onRemoveServerFromProfile(server.id, selectedProfileId)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remove from Profile
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : searchQuery ? (
            <div className="text-center py-12 space-y-2">
              <div className="text-3xl mb-2">🔍</div>
              <h3 className="text-lg font-medium">No results found</h3>
              <p className="text-muted-foreground">
                No servers matching "{searchQuery}" were found
              </p>
              <Button variant="outline" onClick={() => setSearchQuery("")}>Clear search</Button>
            </div>
          ) : (
            <div className="text-center py-12 space-y-4">
              <div className="flex flex-col items-center gap-2">
                <div className="bg-muted/30 p-3 rounded-full">
                  <Server className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No servers in this profile</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Add servers to this profile to get started.
                </p>
              </div>
              <Button onClick={() => onAddServersToHost(host)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Servers
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
