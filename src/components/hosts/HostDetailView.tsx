import React, { useState, useEffect } from "react";
import { 
  FileText, Edit, Plus, Save, Server, Trash2, AlertTriangle, 
  CheckCircle, RefreshCw, ArrowRight, Info, X
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
import { Host, Profile, ServerInstance, ConnectionStatus, serverDefinitions, EndpointType } from "@/data/mockData";
import { ProfileDropdown } from "@/components/hosts/ProfileDropdown";

interface HostDetailViewProps {
  host: Host;
  profiles: Profile[];
  serverInstances: ServerInstance[];
  selectedProfileId: string;
  onCreateConfig: (hostId: string) => void;
  onProfileChange: (host: Host) => void;
  onAddServersToHost: (host: Host) => void;
  onImportByProfile: (host: Host) => void;
  onDeleteHost: (hostId: string) => void;
  onServerStatusChange: (serverId: string, status: 'running' | 'stopped' | 'error' | 'connecting') => void;
  onSaveProfileChanges: () => void;
}

export const HostDetailView: React.FC<HostDetailViewProps> = ({
  host,
  profiles,
  serverInstances,
  selectedProfileId,
  onCreateConfig,
  onProfileChange,
  onAddServersToHost,
  onImportByProfile,
  onDeleteHost,
  onServerStatusChange,
  onSaveProfileChanges
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
    setIsUnsavedChanges(true);
    onServerStatusChange(serverId, enabled ? 'running' : 'stopped');
    
    toast({
      title: `Server ${enabled ? "enabled" : "disabled"}`,
      description: "Profile has unsaved changes"
    });
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
      
      {/* Config File Details */}
      <div className="text-sm text-muted-foreground bg-muted/5 p-4 rounded-md border border-muted">
        <p className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Configuration File: {host.configPath}
        </p>
        <Button 
          variant="link" 
          className="text-xs p-0 h-auto mt-1" 
          onClick={() => onCreateConfig(host.id)}
        >
          View Configuration
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              Connected Servers
              <ProfileDropdown
                profiles={profiles}
                currentProfileId={selectedProfileId}
                onSelectProfile={onImportByProfile}
                onCreateProfile={() => onAddServersToHost(host)}
                onDeleteProfile={(profileId) => {
                  // Handle profile deletion
                  if (window.confirm('Are you sure you want to delete this profile?')) {
                    // TODO: Implement profile deletion logic
                  }
                }}
              />
            </CardTitle>
          </div>
          <CardDescription>
            {filteredServers.length > 0 
              ? `${filteredServers.length} servers on this host` 
              : "Add your first server to get started"}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {selectedProfile ? (
            filteredServers.length > 0 ? (
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
                    
                    return (
                      <TableRow key={server.id} className={hasError ? "bg-red-50/30" : ""}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Server className="h-4 w-4 text-muted-foreground" />
                            <span>{server.name}</span>
                          </div>
                          {hasError && (
                            <div className="text-xs text-red-500 mt-1">
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
                          <Progress value={serverLoad} className="h-2" />
                          <span className="text-xs text-muted-foreground mt-0.5 inline-block">{serverLoad}%</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <Switch
                            checked={server.status === 'running'}
                            onCheckedChange={(enabled) => handleInstanceChange(server.id, enabled)}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                              <Info className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-amber-600 hover:text-amber-700 hover:bg-amber-50">
                              <AlertTriangle className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12 space-y-4">
                <div className="flex flex-col items-center gap-2">
                  <div className="bg-muted/30 p-3 rounded-full">
                    <Plus className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">Add Your First Server</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Get started by adding a server to this host. You can add multiple servers and manage them all in one place.
                  </p>
                </div>
                <Button onClick={() => onAddServersToHost(host)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Server
                </Button>
              </div>
            )
          ) : (
            <div className="text-center py-12 space-y-4">
              <div className="flex flex-col items-center gap-2">
                <div className="bg-muted/30 p-3 rounded-full">
                  <ArrowRight className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No profile selected</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Select an existing profile or create a new one to connect servers to this host.
                </p>
              </div>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" onClick={() => onImportByProfile(host)}>
                  Select Existing Profile
                </Button>
                <Button onClick={() => onAddServersToHost(host)}>
                  Create New Profile
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
