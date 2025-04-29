
import React, { useState } from "react";
import { Host, Profile, ServerInstance } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ServerItem } from "@/components/hosts/ServerItem";
import { ProfileDropdown } from "@/components/hosts/ProfileDropdown";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, FileText, Settings, Trash2, PlusCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

interface HostDetailViewProps {
  host: Host;
  profiles: Profile[];
  serverInstances: ServerInstance[];
  selectedProfileId: string;
  onCreateConfig: (hostId: string) => void;
  onProfileChange: (profileId: string) => void;
  onAddServersToHost: () => void;
  onDeleteHost: (hostId: string) => void;
  onServerStatusChange: (serverId: string, status: 'running' | 'stopped' | 'error' | 'connecting') => void;
  onSaveProfileChanges: () => void;
  onCreateProfile: (name: string) => string;
  onDeleteProfile: (profileId: string) => void;
  onAddServersToProfile: (servers: ServerInstance[]) => void;
  onViewServerError?: (server: ServerInstance) => void;
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
  onCreateProfile,
  onDeleteProfile,
  onAddServersToProfile,
  onViewServerError
}) => {
  const [addServerDialogOpen, setAddServerDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const selectedProfile = profiles.find(p => p.id === selectedProfileId);
  const profileServers = selectedProfile 
    ? serverInstances.filter(server => selectedProfile.instances.includes(server.id))
    : [];
  
  const isHostConnected = host.connectionStatus === "connected";
  const isHostConfigured = host.configStatus === "configured";
  
  const handleRefreshHost = () => {
    setRefreshing(true);
    
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
      toast({
        title: "Host refreshed",
        description: "Host connection status has been updated"
      });
    }, 1500);
  };
  
  const handleDeleteHost = () => {
    setDeleteDialogOpen(true);
  };
  
  const confirmDeleteHost = () => {
    onDeleteHost(host.id);
    setDeleteDialogOpen(false);
  };
  
  const handleAddServers = (servers: ServerInstance[]) => {
    onAddServersToProfile(servers);
    setAddServerDialogOpen(false);
  };
  
  const handleRemoveServerFromProfile = (serverId: string) => {
    if (selectedProfile) {
      const updatedProfile = {
        ...selectedProfile,
        instances: selectedProfile.instances.filter(id => id !== serverId)
      };
      
      // Update the profile
      onSaveProfileChanges();
      
      toast({
        title: "Server removed",
        description: `Server has been removed from ${selectedProfile.name}`
      });
    }
  };
  
  const handleServerStatusChange = (serverId: string, enabled: boolean) => {
    const status = enabled ? 'running' : 'stopped';
    onServerStatusChange(serverId, status);
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">{host.name}</h2>
                {!isHostConfigured && (
                  <Badge variant="outline" className="text-amber-500 border-amber-200 bg-amber-50">
                    Needs Configuration
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {isHostConnected ? "Connected" : "Disconnected"} • {host.configPath || "No config file"}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              {host.configPath ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onCreateConfig(host.id)}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  View Config
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onCreateConfig(host.id)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Configure Host
                </Button>
              )}
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefreshHost}
                disabled={refreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:text-destructive"
                onClick={handleDeleteHost}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pb-3">
          {!isHostConfigured && (
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This host needs to be configured before it can be used. 
                <Button 
                  variant="link" 
                  className="h-auto p-0 ml-2" 
                  onClick={() => onCreateConfig(host.id)}
                >
                  Configure now
                </Button>
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium">Profile</h3>
              <ProfileDropdown 
                profiles={profiles}
                currentProfileId={selectedProfileId}
                onProfileChange={onProfileChange}
                onCreateProfile={onCreateProfile}
                onDeleteProfile={onDeleteProfile}
              />
            </div>
            
            <Button 
              size="sm" 
              onClick={() => setAddServerDialogOpen(true)}
              disabled={!selectedProfileId || !isHostConnected}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Servers
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="servers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="servers">Servers</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="servers" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              {profileServers.length > 0 ? (
                <div className="overflow-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 font-medium">Name</th>
                        <th className="text-left p-4 font-medium">Type</th>
                        <th className="text-left p-4 font-medium">Status</th>
                        <th className="text-center p-4 font-medium">Enabled</th>
                        <th className="text-right p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {profileServers.map(server => (
                        <ServerItem 
                          key={server.id}
                          server={server}
                          hostConnectionStatus={host.connectionStatus}
                          load={Math.random() * 100}
                          onStatusChange={handleServerStatusChange}
                          onRemoveFromProfile={handleRemoveServerFromProfile}
                          onViewServerError={onViewServerError}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="bg-muted/50 p-4 rounded-full mb-4">
                    <Settings className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No servers in this profile</h3>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    Add servers to this profile to start managing your MCP environment
                  </p>
                  <Button onClick={() => setAddServerDialogOpen(true)} disabled={!isHostConnected}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Servers
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardContent className="py-6">
              <h3 className="text-lg font-medium mb-4">Host Settings</h3>
              <p className="text-muted-foreground">
                Host settings and advanced configuration options will be available here in a future update.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="logs">
          <Card>
            <CardContent className="py-6">
              <h3 className="text-lg font-medium mb-4">Host Logs</h3>
              <p className="text-muted-foreground">
                Host logs and activity history will be available here in a future update.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Host</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this host? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteHost}>
              Delete Host
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Only export the type, not the component again
export type { HostDetailViewProps };
