
import { useState, useEffect } from "react";
import { 
  Host, 
  Profile, 
  ServerDefinition, 
  ServerInstance, 
  serverInstances as allServerInstances
} from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, Plus, Trash2, Save, Edit, AlertTriangle, Server } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { StatusIndicator } from "@/components/status/StatusIndicator";
import { EndpointLabel } from "@/components/status/EndpointLabel";
import { AddServerToHostDialog } from "./AddServerToHostDialog";
import { ProfileSelector } from "./ProfileSelector";
import { ProfileChangesDialog } from "./ProfileChangesDialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface HostDetailViewProps {
  host: Host;
  profiles: Profile[];
  serverInstances: ServerInstance[];
  serverDefinitions: ServerDefinition[];
  currentProfileId: string | null;
  onProfileChange: (hostId: string, profileId: string) => void;
  onConfigureHost: (hostId: string) => void;
  onDeleteHost: (hostId: string) => void;
  onServerStatusChange: (serverId: string, status: string) => void;
  onSaveProfile: (profile: Profile, newName?: string) => void;
  onCreateProfile: (name: string, initialInstances?: string[]) => Profile;
}

export function HostDetailView({
  host,
  profiles,
  serverInstances,
  serverDefinitions,
  currentProfileId,
  onProfileChange,
  onConfigureHost,
  onDeleteHost,
  onServerStatusChange,
  onSaveProfile,
  onCreateProfile
}: HostDetailViewProps) {
  const [addServerDialogOpen, setAddServerDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [profileChangesDialogOpen, setProfileChangesDialogOpen] = useState(false);
  const [targetProfileId, setTargetProfileId] = useState<string | null>(null);
  const [profileSelectionMode, setProfileSelectionMode] = useState(false);
  
  // Track original and modified instances for the current profile
  const [originalInstances, setOriginalInstances] = useState<string[]>([]);
  const [currentInstances, setCurrentInstances] = useState<string[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Get the current profile
  const currentProfile = currentProfileId 
    ? profiles.find(p => p.id === currentProfileId) || null 
    : null;

  // Initialize or update state when profile changes
  useEffect(() => {
    if (currentProfile) {
      setOriginalInstances([...currentProfile.instances]);
      setCurrentInstances([...currentProfile.instances]);
      setHasUnsavedChanges(false);
    } else {
      setOriginalInstances([]);
      setCurrentInstances([]);
      setHasUnsavedChanges(false);
    }
  }, [currentProfile]);

  // Calculate added/removed instances for diff display
  const getChangedInstances = () => {
    const added = currentInstances
      .filter(id => !originalInstances.includes(id))
      .map(id => serverInstances.find(si => si.id === id))
      .filter(Boolean) as ServerInstance[];
      
    const removed = originalInstances
      .filter(id => !currentInstances.includes(id))
      .map(id => serverInstances.find(si => si.id === id))
      .filter(Boolean) as ServerInstance[];
      
    return { added, removed };
  };

  // Handle profile selection
  const handleSelectProfile = (profileId: string) => {
    if (!currentProfileId) {
      // First time setting up a profile
      onProfileChange(host.id, profileId);
      setProfileSelectionMode(false);
    } else if (currentProfileId !== profileId) {
      // Switching profiles
      if (hasUnsavedChanges) {
        setTargetProfileId(profileId);
        setProfileChangesDialogOpen(true);
      } else {
        // No changes, switch directly
        onProfileChange(host.id, profileId);
        setProfileSelectionMode(false);
      }
    } else {
      // Selected the same profile
      setProfileSelectionMode(false);
    }
  };

  // Handle adding servers from dialog
  const handleAddServers = (servers: ServerDefinition[]) => {
    // Mock adding instances for these server definitions
    const newInstanceIds = servers.map(server => {
      // Find or create an instance for this server definition
      const existingInstance = serverInstances.find(si => si.definitionId === server.id);
      return existingInstance ? existingInstance.id : `mock-instance-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    });
    
    // Add to current instances
    setCurrentInstances(prev => [...prev, ...newInstanceIds]);
    setHasUnsavedChanges(true);
  };

  // Handle removing a server from the profile
  const handleRemoveServer = (instanceId: string) => {
    setCurrentInstances(prev => prev.filter(id => id !== instanceId));
    setHasUnsavedChanges(true);
  };

  // Handle saving profile changes
  const handleSaveProfileChanges = () => {
    if (currentProfile) {
      const updatedProfile = {
        ...currentProfile,
        instances: currentInstances
      };
      
      onSaveProfile(updatedProfile);
      setOriginalInstances([...currentInstances]);
      setHasUnsavedChanges(false);
    }
  };

  // Handle profile changes dialog action
  const handleProfileChangesAction = (
    saveType: "current" | "new" | "none", 
    newProfileName?: string
  ) => {
    if (!targetProfileId) return;
    
    if (saveType === "current" && currentProfile) {
      // Save changes to current profile
      const updatedProfile = {
        ...currentProfile,
        instances: currentInstances
      };
      onSaveProfile(updatedProfile);
      onProfileChange(host.id, targetProfileId);
    } else if (saveType === "new" && newProfileName) {
      // Create new profile with current instances
      const newProfile = onCreateProfile(newProfileName, currentInstances);
      onProfileChange(host.id, newProfile.id);
    } else {
      // Switch without saving
      onProfileChange(host.id, targetProfileId);
    }
    
    setProfileChangesDialogOpen(false);
    setTargetProfileId(null);
    setProfileSelectionMode(false);
  };

  // Handle switch without saving
  const handleSwitchWithoutSaving = () => {
    if (targetProfileId) {
      onProfileChange(host.id, targetProfileId);
      setProfileChangesDialogOpen(false);
      setTargetProfileId(null);
      setProfileSelectionMode(false);
    }
  };

  // Handle creating a new profile
  const handleCreateProfile = (name: string) => {
    const newProfile = onCreateProfile(name);
    onProfileChange(host.id, newProfile.id);
    setProfileSelectionMode(false);
  };

  // Format status label
  const formatStatusLabel = (status: string): string => {
    if (typeof status !== 'string') {
      return 'Unknown';
    }
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Get definition name for an instance
  const getDefinitionName = (definitionId: string): string => {
    const definition = serverDefinitions.find(def => def.id === definitionId);
    return definition ? definition.name : "Unknown";
  };

  // Get definition type for an instance
  const getDefinitionType = (definitionId: string): string => {
    const definition = serverDefinitions.find(def => def.id === definitionId);
    return definition ? definition.type : "Unknown";
  };

  // Get current instances as full objects
  const currentInstanceObjects = currentInstances
    .map(id => serverInstances.find(si => si.id === id))
    .filter(Boolean) as ServerInstance[];

  // If in profile selection mode, show the profile selector
  if (profileSelectionMode) {
    return (
      <ProfileSelector
        profiles={profiles}
        onSelectProfile={handleSelectProfile}
        onCreateProfile={handleCreateProfile}
      />
    );
  }
  
  // If the host is not configured, show configuration prompt
  if (host.configStatus === "unknown") {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-4 py-6">
            <div className="mx-auto w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
              <FileText className="h-6 w-6 text-blue-500" />
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Configuration Required</h3>
              <p className="text-muted-foreground text-sm">
                Configure this host to connect servers to it
              </p>
            </div>
            <Button onClick={() => onConfigureHost(host.id)} className="bg-blue-500 hover:bg-blue-600">
              Create Configuration
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {!currentProfile ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4 py-6">
              <div className="mx-auto w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                <Server className="h-6 w-6 text-blue-500" />
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Select a Profile</h3>
                <p className="text-muted-foreground text-sm">
                  Choose a profile to use with this host
                </p>
              </div>
              <Button onClick={() => setProfileSelectionMode(true)}>
                Select Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {hasUnsavedChanges && (
            <Alert className="bg-amber-50 border-amber-200 mb-4">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <AlertDescription className="text-amber-700 flex items-center justify-between w-full">
                <span>You have unsaved changes to this profile</span>
                <Button size="sm" onClick={handleSaveProfileChanges} className="bg-amber-500 hover:bg-amber-600 text-white">
                  <Save className="h-3.5 w-3.5 mr-1.5" />
                  Save Changes
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <div className="bg-muted/10 p-4 rounded-md flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Current Profile</div>
              <div className="flex items-center gap-2 mt-0.5">
                <h2 className="text-xl font-semibold">{currentProfile.name}</h2>
                <Badge variant="outline" className="font-normal">
                  {currentInstanceObjects.length} service{currentInstanceObjects.length !== 1 ? 's' : ''}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                onClick={() => setProfileSelectionMode(true)}
              >
                Change Profile
              </Button>
            </div>
          </div>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg">Connected Servers</CardTitle>
                <CardDescription>
                  Servers running on this host
                </CardDescription>
              </div>
              <Button onClick={() => setAddServerDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-1.5" />
                Add Server
              </Button>
            </CardHeader>
            <CardContent>
              {currentInstanceObjects.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Load</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentInstanceObjects.map(instance => {
                      const status = instance.status || 'stopped';
                      const load = Math.floor(Math.random() * 90) + 10; // Simulate random load

                      return (
                        <TableRow key={instance.id}>
                          <TableCell className="font-medium">
                            {instance.name}
                          </TableCell>
                          <TableCell>
                            <StatusIndicator 
                              status={
                                status === "running" 
                                  ? "active" 
                                  : status === "error" 
                                    ? "error" 
                                    : status === "connecting" 
                                      ? "warning" 
                                      : "inactive"
                              } 
                              label={formatStatusLabel(status)} 
                            />
                          </TableCell>
                          <TableCell>
                            <EndpointLabel type={getDefinitionType(instance.definitionId) as any} />
                          </TableCell>
                          <TableCell>
                            <Progress value={load} className="h-2" />
                            <span className="text-xs text-muted-foreground mt-0.5 inline-block">{load}%</span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => onServerStatusChange(
                                  instance.id, 
                                  status === "running" ? "stopped" : "running"
                                )}
                              >
                                {status === "running" ? "Stop" : "Start"}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleRemoveServer(instance.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No servers connected to this host. 
                  <Button variant="link" onClick={() => setAddServerDialogOpen(true)} className="ml-1 p-0 h-auto">
                    Add a server
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      <div className="flex justify-end">
        <Button 
          variant="outline" 
          className="text-destructive hover:text-destructive"
          onClick={() => setDeleteConfirmOpen(true)}
        >
          <Trash2 className="h-4 w-4 mr-1.5" />
          Delete Host
        </Button>
      </div>
      
      <AddServerToHostDialog
        open={addServerDialogOpen}
        onOpenChange={setAddServerDialogOpen}
        onAddServers={handleAddServers}
      />

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Host</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this host? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                onDeleteHost(host.id);
                setDeleteConfirmOpen(false);
              }}
            >
              Delete Host
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ProfileChangesDialog
        open={profileChangesDialogOpen}
        onOpenChange={setProfileChangesDialogOpen}
        currentProfile={currentProfile}
        availableProfiles={profiles}
        changedInstances={getChangedInstances()}
        onSaveChanges={handleProfileChangesAction}
        onSwitchWithoutSaving={handleSwitchWithoutSaving}
      />
    </div>
  );
}
