
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Server, Settings, AlertTriangle, ChevronDown } from "lucide-react";
import { StatusIndicator } from "@/components/status/StatusIndicator";
import { ServerLogo } from "@/components/servers/ServerLogo";
import { EndpointLabel } from "@/components/status/EndpointLabel";
import { UnifiedHostDialog } from "@/components/hosts/UnifiedHostDialog";
import { ConfigHighlightDialog } from "@/components/hosts/ConfigHighlightDialog";
import { ServerListEmpty } from "@/components/hosts/ServerListEmpty";
import { ProfileSelector } from "@/components/hosts/new-layout/ProfileSelector";
import { ServerSelectionDialog } from "@/components/hosts/new-layout/ServerSelectionDialog";
import { ServerDebugDialog } from "@/components/new-layout/ServerDebugDialog";
import { ServerHistoryDialog } from "@/components/new-layout/ServerHistoryDialog";
import { ServerErrorDialog } from "@/components/hosts/new-layout/ServerErrorDialog";
import { ServerDetailsDialog } from "@/components/hosts/new-layout/ServerDetailsDialog";
import { useHostProfiles } from "@/hooks/useHostProfiles";

export default function HostNewLayout() {
  const [hosts, setHosts] = useState<any[]>([]);
  const [selectedHost, setSelectedHost] = useState<any | null>(null);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<any | null>(null);
  const [servers, setServers] = useState<any[]>([]);
  const [isAddHostDialogOpen, setIsAddHostDialogOpen] = useState(false);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [configPath, setConfigPath] = useState("");
  const [isServerSelectionOpen, setIsServerSelectionOpen] = useState(false);
  const [isServerDebugOpen, setIsServerDebugOpen] = useState(false);
  const [isServerHistoryOpen, setIsServerHistoryOpen] = useState(false);
  const [isServerErrorOpen, setIsServerErrorOpen] = useState(false);
  const [isServerDetailsOpen, setIsServerDetailsOpen] = useState(false);
  const [selectedServer, setSelectedServer] = useState<any | null>(null);
  const [errorDetails, setErrorDetails] = useState<string>("");
  const { toast } = useToast();
  const { hostProfiles, allProfiles, getProfileById, handleProfileChange, addInstanceToProfile } = useHostProfiles();

  // Mock hosts data for demo
  useEffect(() => {
    const mockHosts = [
      {
        id: "host-1",
        name: "Local Development Host",
        icon: "💻",
        configPath: "/Users/dev/.mcp/hosts/local-dev.json",
        configStatus: "configured",
        connectionStatus: "connected"
      }
    ];
    
    if (mockHosts.length > 0) {
      setHosts(mockHosts);
      setSelectedHost(mockHosts[0]);
      
      // Auto-create a profile for the selected host if none exists
      const defaultProfile = {
        id: `profile-${mockHosts[0].id}`,
        name: `${mockHosts[0].name} Profile`,
        endpointType: "HTTP_SSE",
        enabled: true,
        endpoint: "http://localhost:8008",
        instances: [],
        description: `Default profile for ${mockHosts[0].name}`
      };
      
      setProfiles([defaultProfile]);
      setSelectedProfile(defaultProfile);
    }
  }, []);

  const handleAddHosts = (newHosts: any[]) => {
    // Create new profiles for each host automatically
    const updatedHosts = [...hosts, ...newHosts];
    setHosts(updatedHosts);
    
    // If this is the first host, select it
    if (updatedHosts.length === 1) {
      setSelectedHost(updatedHosts[0]);
      
      // Create a default profile for the host
      const defaultProfile = {
        id: `profile-${updatedHosts[0].id}`,
        name: `${updatedHosts[0].name} Profile`,
        endpointType: "HTTP_SSE",
        enabled: true,
        endpoint: "http://localhost:8008",
        instances: [],
        description: `Default profile for ${updatedHosts[0].name}`
      };
      
      setProfiles([defaultProfile]);
      setSelectedProfile(defaultProfile);
    }
    
    toast({
      title: "Host Added",
      description: `Successfully added ${newHosts.length} host${newHosts.length > 1 ? 's' : ''}`
    });
  };

  const handleServerToggle = (serverId: string, enabled: boolean) => {
    setServers(current => 
      current.map(server => 
        server.id === serverId 
          ? { 
              ...server, 
              enabled,
              status: enabled ? "connecting" : "stopped" 
            } 
          : server
      )
    );
    
    // Simulate server connection/disconnection
    if (enabled) {
      toast({
        title: "Connecting to server...",
        description: "Attempting to establish connection"
      });
      
      setTimeout(() => {
        const success = Math.random() > 0.3; // 70% success rate
        
        setServers(current => 
          current.map(server => 
            server.id === serverId 
              ? { 
                  ...server, 
                  status: success ? "running" : "error" 
                } 
              : server
          )
        );
        
        if (!success) {
          setErrorDetails("Could not connect to server: Connection refused");
          toast({
            title: "Connection Failed",
            description: "Failed to connect to server. Click on error for details.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Connection Established",
            description: "Successfully connected to server"
          });
        }
      }, 2000);
    } else {
      toast({
        title: "Server Stopped",
        description: "Server connection has been terminated"
      });
    }
  };

  const handleViewConfig = (path: string) => {
    setConfigPath(path);
    setIsConfigDialogOpen(true);
  };

  const handleShowServerDebug = (server: any) => {
    setSelectedServer(server);
    setIsServerDebugOpen(true);
  };

  const handleShowServerHistory = (server: any) => {
    setSelectedServer(server);
    setIsServerHistoryOpen(true);
  };

  const handleShowServerError = (server: any) => {
    setSelectedServer(server);
    setIsServerErrorOpen(true);
  };

  const handleShowServerDetails = (server: any) => {
    setSelectedServer(server);
    setIsServerDetailsOpen(true);
  };

  const handleAddServer = (instancesData: any[]) => {
    if (!selectedProfile) return;
    
    const newServers = instancesData.map(instance => ({
      ...instance,
      status: selectedHost?.connectionStatus === "connected" ? "connecting" : "stopped",
      enabled: selectedHost?.connectionStatus === "connected"
    }));
    
    setServers([...servers, ...newServers]);
    
    // Simulate connecting servers if host is connected
    if (selectedHost?.connectionStatus === "connected") {
      newServers.forEach(server => {
        setTimeout(() => {
          const success = Math.random() > 0.3; // 70% success rate
          
          setServers(current => 
            current.map(s => 
              s.id === server.id 
                ? { ...s, status: success ? "running" : "error" } 
                : s
            )
          );
          
          if (!success) {
            toast({
              title: "Server Connection Failed",
              description: `Failed to connect to ${server.name}`,
              variant: "destructive"
            });
          }
        }, 2000);
      });
    }
    
    toast({
      title: "Server Added",
      description: `Added ${newServers.length} server${newServers.length > 1 ? 's' : ''} to profile`
    });
  };

  const handleRemoveServer = (serverId: string) => {
    setServers(current => current.filter(server => server.id !== serverId));
    
    toast({
      title: "Server Removed",
      description: "Server has been removed from the profile"
    });
  };

  const handleProfileSelect = (profile: any) => {
    setSelectedProfile(profile);
    // In a real app, we would fetch servers for this profile
    // For demo purposes, we'll clear the servers list
    setServers([]);
  };

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case "running":
        return <StatusIndicator status="active" label="Connected" />;
      case "connecting":
        return <StatusIndicator status="warning" label="Connecting" />;
      case "error":
        return <StatusIndicator status="error" label="Error" />;
      case "stopped":
      default:
        return <StatusIndicator status="inactive" label="Disconnected" />;
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Hosts</h1>
        <Button onClick={() => setIsAddHostDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Host
        </Button>
      </div>

      {selectedHost ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <div className="flex items-center space-x-4">
              <div className="text-2xl">{selectedHost.icon}</div>
              <div>
                <CardTitle>{selectedHost.name}</CardTitle>
                <div className="flex items-center space-x-2 mt-1">
                  <StatusIndicator 
                    status={selectedHost.connectionStatus === "connected" ? "active" : "inactive"} 
                    label={selectedHost.connectionStatus === "connected" ? "Connected" : "Disconnected"} 
                    size="sm"
                  />
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-sm text-muted-foreground"
                    onClick={() => handleViewConfig(selectedHost.configPath)}
                  >
                    View Config
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6 pt-0">
            <div className="flex items-center justify-between border-b pb-4">
              <h2 className="text-lg font-medium flex items-center">
                Connected Servers
                {selectedProfile && (
                  <ProfileSelector 
                    profiles={profiles} 
                    selectedProfile={selectedProfile}
                    onSelect={handleProfileSelect}
                    className="ml-2"
                  />
                )}
              </h2>
              <Button onClick={() => setIsServerSelectionOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Server
              </Button>
            </div>

            {servers.length === 0 ? (
              <ServerListEmpty onAddServers={() => setIsServerSelectionOpen(true)} />
            ) : (
              <div className="grid gap-4">
                {servers.map((server) => (
                  <div 
                    key={server.id}
                    className="p-4 border rounded-lg bg-card flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      <ServerLogo name={server.name} />
                      <div>
                        <h3 className="font-medium">{server.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <EndpointLabel type={server.type || "HTTP_SSE"} />
                          {getStatusIndicator(server.status)}
                          {server.status === "error" && (
                            <Button
                              variant="ghost" 
                              size="sm"
                              className="h-6 px-2 text-xs text-destructive"
                              onClick={() => handleShowServerError(server)}
                            >
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              View Error
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`toggle-${server.id}`}
                          checked={server.enabled}
                          onChange={(e) => handleServerToggle(server.id, e.target.checked)}
                          disabled={selectedHost.connectionStatus !== "connected"}
                          className="sr-only peer"
                        />
                        <label
                          htmlFor={`toggle-${server.id}`}
                          className="relative inline-flex h-5 w-9 cursor-pointer rounded-full bg-muted peer-checked:bg-primary transition-colors peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
                        >
                          <span className="inline-block h-4 w-4 translate-x-0.5 translate-y-0.5 rounded-full bg-white transition-transform peer-checked:translate-x-4 shadow-sm" />
                        </label>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleShowServerDebug(server)}
                      >
                        Debug
                      </Button>
                      
                      <div className="relative">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveServer(server.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="text-center p-8">
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="bg-muted/30 p-3 rounded-full">
              <Server className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No Host Connected</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Add a host to get started. Once connected, you can add servers and manage your profiles.
            </p>
            <Button onClick={() => setIsAddHostDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Host
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Dialogs */}
      <UnifiedHostDialog 
        open={isAddHostDialogOpen} 
        onOpenChange={setIsAddHostDialogOpen}
        onAddHosts={handleAddHosts}
      />
      
      <ConfigHighlightDialog 
        open={isConfigDialogOpen}
        onOpenChange={setIsConfigDialogOpen}
        configPath={configPath}
      />
      
      <ServerSelectionDialog
        open={isServerSelectionOpen}
        onOpenChange={setIsServerSelectionOpen}
        onAddServers={handleAddServer}
      />
      
      <ServerDebugDialog
        open={isServerDebugOpen}
        onOpenChange={setIsServerDebugOpen}
        server={selectedServer}
      />
      
      <ServerHistoryDialog
        open={isServerHistoryOpen}
        onOpenChange={setIsServerHistoryOpen}
        server={selectedServer}
      />
      
      <ServerErrorDialog
        open={isServerErrorOpen}
        onOpenChange={setIsServerErrorOpen}
        server={selectedServer}
        errorDetails={errorDetails}
      />
      
      <ServerDetailsDialog
        open={isServerDetailsOpen}
        onOpenChange={setIsServerDetailsOpen}
        server={selectedServer}
      />
    </div>
  );
}
