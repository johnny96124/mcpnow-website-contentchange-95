import { useState, useEffect } from "react";
import { Plus, Settings, MoreVertical, Server, AlertTriangle, CheckCircle, XCircle, Clock, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { AddHostDialog } from "@/components/new-layout/AddHostDialog";
import { AddServerDialog } from "@/components/new-layout/AddServerDialog";
import { ServerDetails } from "@/components/new-layout/ServerDetails";
import { ServerHistoryDialog } from "@/components/new-layout/ServerHistoryDialog";
import { ServerDebugDialog } from "@/components/new-layout/ServerDebugDialog";
import { DeleteProfileDialog } from "@/components/new-layout/DeleteProfileDialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  hosts as initialHosts, 
  profiles as initialProfiles, 
  serverInstances as initialServerInstances,
  serverDefinitions,
  type Host,
  type Profile,
  type ServerInstance,
  type ServerDefinition
} from "@/data/mockData";

const NewLayout = () => {
  const { isMobile, isSmallMobile } = useIsMobile();
  const [hostsList, setHostsList] = useState<Host[]>(initialHosts);
  const [profilesList, setProfilesList] = useState<Profile[]>(initialProfiles);
  const [serverInstances, setServerInstances] = useState<ServerInstance[]>(initialServerInstances);
  const [selectedHostId, setSelectedHostId] = useState<string | null>(null);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [selectedServerId, setSelectedServerId] = useState<string | null>(null);
  const [addHostDialogOpen, setAddHostDialogOpen] = useState(false);
  const [addServerDialogOpen, setAddServerDialogOpen] = useState(false);
  const [serverDetailsOpen, setServerDetailsOpen] = useState(false);
  const [serverHistoryOpen, setServerHistoryOpen] = useState(false);
  const [serverDebugOpen, setServerDebugOpen] = useState(false);
  const [deleteProfileOpen, setDeleteProfileOpen] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Profile editing state
  const [editingProfile, setEditingProfile] = useState<string | null>(null);
  const [profileName, setProfileName] = useState("");
  const [profileDescription, setProfileDescription] = useState("");
  const [profileEndpoint, setProfileEndpoint] = useState("");

  const selectedHost = selectedHostId ? hostsList.find(h => h.id === selectedHostId) : null;
  const selectedProfile = selectedProfileId ? profilesList.find(p => p.id === selectedProfileId) : null;
  const selectedServer = selectedServerId ? serverInstances.find(s => s.id === selectedServerId) : null;

  // Get profiles for selected host
  const hostProfiles = selectedHost ? profilesList.filter(p => 
    hostsList.some(h => h.id === selectedHost.id)
  ) : [];

  // Get servers for selected profile
  const profileServers = selectedProfile ? 
    serverInstances.filter(s => selectedProfile.instances.includes(s.id)) : [];

  // Filter servers based on search
  const filteredServers = profileServers.filter(server =>
    server.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (hostsList.length > 0 && !selectedHostId) {
      setSelectedHostId(hostsList[0].id);
    }
  }, [hostsList, selectedHostId]);

  useEffect(() => {
    if (selectedHost && hostProfiles.length > 0 && !selectedProfileId) {
      setSelectedProfileId(hostProfiles[0].id);
    }
  }, [selectedHost, hostProfiles, selectedProfileId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <CheckCircle className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-green-500`} />;
      case 'error':
        return <XCircle className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-red-500`} />;
      case 'connecting':
        return <Clock className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-yellow-500`} />;
      default:
        return <XCircle className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-gray-400`} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'connecting':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleAddHost = () => {
    setAddHostDialogOpen(true);
  };

  const handleAddServer = () => {
    if (!selectedProfile) {
      toast.error("Please select a profile first");
      return;
    }
    setAddServerDialogOpen(true);
  };

  const handleAddHostSuccess = (newHostData: Host) => {
    const completeHost: Host = {
      ...newHostData,
      type: 'external',
      id: `host-${Date.now()}`,
      connectionStatus: 'disconnected',
      configStatus: 'unknown'
    };

    setHostsList(prev => [...prev, completeHost]);
    setSelectedHostId(completeHost.id);
    toast(`${completeHost.name} has been added successfully.`);
  };

  const handleAddServerSuccess = (serverData: any) => {
    if (!selectedProfile) return;

    const newServer: ServerInstance = {
      id: `server-${Date.now()}`,
      name: serverData.name,
      definitionId: serverData.definitionId || 'custom',
      status: 'stopped',
      connectionDetails: serverData.endpoint || 'http://localhost:8000',
      environment: serverData.environment || {},
      arguments: serverData.arguments || [],
      url: serverData.endpoint,
      headers: serverData.headers || {},
      enabled: false
    };

    setServerInstances(prev => [...prev, newServer]);
    
    // Add to current profile
    setProfilesList(prev => prev.map(profile => 
      profile.id === selectedProfile.id 
        ? { ...profile, instances: [...profile.instances, newServer.id] }
        : profile
    ));

    toast(`${newServer.name} has been added to ${selectedProfile.name}.`);
  };

  const handleServerClick = (serverId: string) => {
    setSelectedServerId(serverId);
    setServerDetailsOpen(true);
  };

  const handleServerToggle = (serverId: string, enabled: boolean) => {
    setServerInstances(prev => prev.map(server => 
      server.id === serverId 
        ? { 
            ...server, 
            enabled,
            status: enabled ? 'connecting' : 'stopped'
          }
        : server
    ));

    // Simulate connection after a delay
    if (enabled) {
      setTimeout(() => {
        setServerInstances(prev => prev.map(server => 
          server.id === serverId && server.status === 'connecting'
            ? { ...server, status: Math.random() > 0.3 ? 'running' : 'error' }
            : server
        ));
      }, 2000);
    }

    const server = serverInstances.find(s => s.id === serverId);
    toast(`${server?.name} is ${enabled ? 'starting up' : 'shutting down'}.`);
  };

  const handleCreateProfile = () => {
    if (!selectedHost) return;

    const newProfile: Profile = {
      id: `profile-${Date.now()}`,
      name: `New Profile ${profilesList.length + 1}`,
      endpointType: 'HTTP_SSE',
      enabled: true,
      endpoint: 'http://localhost:8000',
      instances: [],
      description: 'A new profile for MCP servers'
    };

    setProfilesList(prev => [...prev, newProfile]);
    setSelectedProfileId(newProfile.id);
    
    toast(`${newProfile.name} has been created.`);
  };

  const handleEditProfile = (profileId: string) => {
    const profile = profilesList.find(p => p.id === profileId);
    if (profile) {
      setEditingProfile(profileId);
      setProfileName(profile.name);
      setProfileDescription(profile.description || '');
      setProfileEndpoint(profile.endpoint);
    }
  };

  const handleSaveProfile = () => {
    if (!editingProfile) return;

    setProfilesList(prev => prev.map(profile => 
      profile.id === editingProfile 
        ? {
            ...profile,
            name: profileName,
            description: profileDescription,
            endpoint: profileEndpoint
          }
        : profile
    ));

    setEditingProfile(null);
    toast("Profile settings have been saved.");
  };

  const handleDeleteProfile = (profileId: string) => {
    setProfileToDelete(profileId);
    setDeleteProfileOpen(true);
  };

  const confirmDeleteProfile = () => {
    if (!profileToDelete) return;

    setProfilesList(prev => prev.filter(p => p.id !== profileToDelete));
    
    if (selectedProfileId === profileToDelete) {
      const remainingProfiles = profilesList.filter(p => p.id !== profileToDelete);
      setSelectedProfileId(remainingProfiles.length > 0 ? remainingProfiles[0].id : null);
    }

    setDeleteProfileOpen(false);
    setProfileToDelete(null);
    
    toast("The profile has been removed.");
  };

  const handleAddClineHost = () => {
    const clineHost: Host = {
      id: "cline-host",
      name: "Cline",
      type: 'external',
      icon: "🔄",
      connectionStatus: 'disconnected',
      configStatus: 'unknown'
    };

    if (!hostsList.find(h => h.id === clineHost.id)) {
      setHostsList(prev => [...prev, clineHost]);
      setSelectedHostId(clineHost.id);
      
      toast("Cline has been added to your hosts.");
    }
  };

  const handleDeleteServer = (serverId: string) => {
    setServerInstances(prev => prev.filter(s => s.id !== serverId));
    
    // Remove from all profiles
    setProfilesList(prev => prev.map(profile => ({
      ...profile,
      instances: profile.instances.filter(id => id !== serverId)
    })));
    
    toast("Server has been deleted.");
  };

  // Status summary for selected host
  const getHostStatusSummary = () => {
    if (!selectedProfile) return { total: 0, running: 0, errors: 0 };
    
    const servers = profileServers;
    return {
      total: servers.length,
      running: servers.filter(s => s.status === 'running').length,
      errors: servers.filter(s => s.status === 'error').length
    };
  };

  const statusSummary = getHostStatusSummary();

  return (
    <div className={`flex h-screen bg-gray-50 ${isMobile ? 'flex-col' : ''}`}>
      {/* Sidebar */}
      <div className={`${isMobile ? 'w-full border-b' : 'w-80 border-r'} bg-white border-gray-200 flex flex-col ${isMobile ? 'max-h-[40vh]' : ''}`}>
        <div className={`${isMobile ? 'mobile-header-compact' : 'p-6'} border-b border-gray-200`}>
          <div className={`flex items-center justify-between ${isMobile ? 'mb-2' : 'mb-4'}`}>
            <h1 className={`${isMobile ? 'mobile-compact-title' : 'text-xl'} font-semibold text-gray-900`}>MCP Dashboard</h1>
            <Button size={isMobile ? "sm" : "default"} onClick={handleAddHost} className={isMobile ? 'mobile-button-compact' : ''}>
              <Plus className={`${isMobile ? 'h-3 w-3 mr-1' : 'h-4 w-4 mr-2'}`} />
              {!isSmallMobile && 'Add Host'}
            </Button>
          </div>
          
          {/* Host Selection */}
          <div className="space-y-2">
            <div className={`${isMobile ? 'mobile-compact-subtitle' : 'text-sm'} font-medium text-gray-700`}>Select Host</div>
            <Select value={selectedHostId || ""} onValueChange={setSelectedHostId}>
              <SelectTrigger className={isMobile ? 'h-8 text-sm' : ''}>
                <SelectValue placeholder="Choose a host" />
              </SelectTrigger>
              <SelectContent>
                {hostsList.map(host => (
                  <SelectItem key={host.id} value={host.id}>
                    <div className="flex items-center gap-2">
                      <span className={isMobile ? 'text-xs' : ''}>{host.icon || '💻'}</span>
                      <span className={isMobile ? 'text-xs' : ''}>{host.name}</span>
                      <div className={`w-2 h-2 rounded-full ${
                        host.connectionStatus === 'connected' ? 'bg-green-500' : 'bg-gray-400'
                      }`} />
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quick Actions */}
          <div className={`${isMobile ? 'mt-2' : 'mt-4'} flex gap-2`}>
            <Button 
              variant="outline" 
              size={isMobile ? "sm" : "default"}
              onClick={handleAddClineHost}
              className={`flex-1 ${isMobile ? 'mobile-button-compact' : ''}`}
            >
              + Cline
            </Button>
            <Button 
              variant="outline" 
              size={isMobile ? "sm" : "default"}
              onClick={handleCreateProfile}
              className={`flex-1 ${isMobile ? 'mobile-button-compact' : ''}`}
            >
              + Profile
            </Button>
          </div>
        </div>

        {/* Profile Section */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className={`${isMobile ? 'mobile-content-padding' : 'p-4'} border-b border-gray-200`}>
            <div className={`flex items-center justify-between ${isMobile ? 'mb-2' : 'mb-3'}`}>
              <h2 className={`${isMobile ? 'mobile-compact-text' : 'font-medium'} text-gray-900`}>Profiles</h2>
              <Badge variant="secondary" className={isMobile ? 'mobile-badge-compact' : ''}>{hostProfiles.length}</Badge>
            </div>
            
            <ScrollArea className={isMobile ? 'max-h-24' : 'max-h-40'}>
              <div className={`space-y-${isMobile ? '1' : '2'}`}>
                {hostProfiles.map(profile => (
                  <div
                    key={profile.id}
                    className={`${isMobile ? 'mobile-card-compact' : 'p-3'} rounded-lg border cursor-pointer transition-colors ${
                      selectedProfileId === profile.id
                        ? 'border-blue-200 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedProfileId(profile.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`${isMobile ? 'mobile-compact-text' : 'text-sm'} font-medium`}>{profile.name}</span>
                          <Badge variant={profile.enabled ? "default" : "secondary"} className={`text-xs ${isMobile ? 'mobile-badge-compact' : ''}`}>
                            {profile.enabled ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <div className={`${isMobile ? 'mobile-compact-subtitle' : 'text-xs text-gray-500'} mt-1`}>
                          {profile.instances.length} servers
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className={`${isMobile ? 'h-5 w-5 p-0' : 'h-6 w-6 p-0'}`}>
                            <MoreVertical className={`${isMobile ? 'h-2 w-2' : 'h-3 w-3'}`} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditProfile(profile.id)}>
                            Edit Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteProfile(profile.id)}
                            className="text-red-600"
                          >
                            Delete Profile
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Servers Section */}
          <div className={`flex-1 ${isMobile ? 'mobile-content-padding' : 'p-4'}`}>
            <div className={`flex items-center justify-between ${isMobile ? 'mb-2' : 'mb-3'}`}>
              <h2 className={`${isMobile ? 'mobile-compact-text' : 'font-medium'} text-gray-900`}>Servers</h2>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className={isMobile ? 'mobile-badge-compact' : ''}>{statusSummary.total}</Badge>
                <Button size={isMobile ? "sm" : "default"} onClick={handleAddServer} className={isMobile ? 'mobile-button-compact' : ''}>
                  <Plus className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                </Button>
              </div>
            </div>

            {selectedProfile && (
              <div className={isMobile ? 'mb-2' : 'mb-4'}>
                <Input
                  placeholder="Search servers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={isMobile ? 'h-7 text-sm' : 'h-8'}
                />
              </div>
            )}

            <ScrollArea className="flex-1">
              <div className={`space-y-${isMobile ? '1' : '2'}`}>
                {filteredServers.map(server => {
                  const definition = serverDefinitions.find(d => d.id === server.definitionId);
                  return (
                    <div
                      key={server.id}
                      className={`${isMobile ? 'mobile-card-compact' : 'p-3'} border border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer`}
                      onClick={() => handleServerClick(server.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className={`flex items-center gap-2 ${isMobile ? 'mb-0.5' : 'mb-1'}`}>
                            {getStatusIcon(server.status)}
                            <span className={`${isMobile ? 'mobile-compact-text' : 'text-sm'} font-medium mobile-text-truncate`}>{server.name}</span>
                          </div>
                          <div className={`${isMobile ? 'mobile-compact-subtitle' : 'text-xs text-gray-500'}`}>
                            {definition?.name || 'Custom Server'}
                          </div>
                          <Badge className={`text-xs mt-1 ${getStatusColor(server.status)} ${isMobile ? 'mobile-badge-compact' : ''}`}>
                            {server.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={server.enabled}
                            onCheckedChange={(enabled) => handleServerToggle(server.id, enabled)}
                            onClick={(e) => e.stopPropagation()}
                            className={isMobile ? 'scale-75' : ''}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {selectedHost && selectedProfile ? (
          <div className={`h-full ${isMobile ? 'mobile-content-padding' : 'p-6'}`}>
            <div className={isMobile ? 'mb-3' : 'mb-6'}>
              <div className={`flex items-center justify-between ${isMobile ? 'mb-1' : 'mb-2'} ${isMobile ? 'mobile-flex-wrap' : ''}`}>
                <h1 className={`${isMobile ? 'mobile-compact-title' : 'text-2xl'} font-bold text-gray-900 mobile-text-truncate`}>{selectedHost.name}</h1>
                <div className={`flex items-center gap-2 ${isMobile ? 'mobile-flex-wrap' : ''}`}>
                  <Badge className={`${selectedHost.connectionStatus === 'connected' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'} ${isMobile ? 'mobile-badge-compact' : ''}`}>
                    {selectedHost.connectionStatus}
                  </Badge>
                  {selectedHost.configStatus === 'misconfigured' && (
                    <Badge variant="destructive" className={isMobile ? 'mobile-badge-compact' : ''}>Misconfigured</Badge>
                  )}
                </div>
              </div>
              <p className={`${isMobile ? 'mobile-compact-subtitle' : 'text-gray-600'}`}>
                Currently managing <strong>{selectedProfile.name}</strong> with {statusSummary.total} servers
              </p>
            </div>

            {/* Status Cards */}
            <div className={`grid ${isMobile ? 'grid-cols-3 gap-2 mb-3' : 'grid-cols-1 md:grid-cols-3 gap-4 mb-6'}`}>
              <Card>
                <CardContent className={isMobile ? 'mobile-card-compact' : 'p-4'}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`${isMobile ? 'mobile-compact-subtitle' : 'text-sm text-gray-600'}`}>Total Servers</p>
                      <p className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold`}>{statusSummary.total}</p>
                    </div>
                    <Server className={`${isMobile ? 'h-5 w-5' : 'h-8 w-8'} text-blue-500`} />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className={isMobile ? 'mobile-card-compact' : 'p-4'}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`${isMobile ? 'mobile-compact-subtitle' : 'text-sm text-gray-600'}`}>Running</p>
                      <p className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-green-600`}>{statusSummary.running}</p>
                    </div>
                    <CheckCircle className={`${isMobile ? 'h-5 w-5' : 'h-8 w-8'} text-green-500`} />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className={isMobile ? 'mobile-card-compact' : 'p-4'}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`${isMobile ? 'mobile-compact-subtitle' : 'text-sm text-gray-600'}`}>Errors</p>
                      <p className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-red-600`}>{statusSummary.errors}</p>
                    </div>
                    <AlertTriangle className={`${isMobile ? 'h-5 w-5' : 'h-8 w-8'} text-red-500`} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Server List */}
            <Card>
              <CardHeader className={isMobile ? 'mobile-header-compact' : ''}>
                <CardTitle className={isMobile ? 'mobile-compact-title' : ''}>Server Management</CardTitle>
              </CardHeader>
              <CardContent className={isMobile ? 'mobile-content-padding' : ''}>
                {filteredServers.length > 0 ? (
                  <div className={`space-y-${isMobile ? '2' : '3'}`}>
                    {filteredServers.map(server => {
                      const definition = serverDefinitions.find(d => d.id === server.definitionId);
                      return (
                        <div
                          key={server.id}
                          className={`flex items-center justify-between ${isMobile ? 'mobile-card-compact' : 'p-4'} border border-gray-200 rounded-lg hover:border-gray-300 transition-colors ${isMobile ? 'mobile-flex-wrap gap-2' : ''}`}
                        >
                          <div className={`flex items-center ${isMobile ? 'gap-2 flex-1 min-w-0' : 'gap-4'}`}>
                            <Avatar className={`${isMobile ? 'h-8 w-8' : 'h-10 w-10'}`}>
                              <AvatarFallback className={isMobile ? 'text-xs' : ''}>{definition?.icon || server.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <h3 className={`${isMobile ? 'mobile-compact-text' : 'font-medium'} mobile-text-truncate`}>{server.name}</h3>
                              <p className={`${isMobile ? 'mobile-compact-subtitle' : 'text-sm text-gray-500'} mobile-text-truncate`}>{definition?.name || 'Custom Server'}</p>
                              <div className={`flex items-center gap-2 ${isMobile ? 'mt-0.5' : 'mt-1'}`}>
                                {getStatusIcon(server.status)}
                                <Badge className={`text-xs ${getStatusColor(server.status)} ${isMobile ? 'mobile-badge-compact' : ''}`}>
                                  {server.status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className={`flex items-center gap-2 ${isMobile ? 'mobile-actions-compact' : ''}`}>
                            <Switch
                              checked={server.enabled}
                              onCheckedChange={(enabled) => handleServerToggle(server.id, enabled)}
                              className={isMobile ? 'scale-75' : ''}
                            />
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size={isMobile ? "sm" : "default"} className={isMobile ? 'mobile-button-compact' : ''}>
                                  <MoreVertical className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleServerClick(server.id)}>
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                  setSelectedServerId(server.id);
                                  setServerHistoryOpen(true);
                                }}>
                                  View History
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                  setSelectedServerId(server.id);
                                  setServerDebugOpen(true);
                                }}>
                                  Debug
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Server className={`${isMobile ? 'h-8 w-8' : 'h-12 w-12'} text-gray-400 mx-auto mb-4`} />
                    <h3 className={`${isMobile ? 'mobile-compact-title' : 'text-lg'} font-medium text-gray-900 mb-2`}>No servers found</h3>
                    <p className={`${isMobile ? 'mobile-compact-subtitle' : 'text-gray-500'} mb-4`}>
                      {searchQuery ? 'No servers match your search criteria.' : 'Add servers to get started.'}
                    </p>
                    {!searchQuery && (
                      <Button onClick={handleAddServer} size={isMobile ? "sm" : "default"} className={isMobile ? 'mobile-button-compact' : ''}>
                        <Plus className={`${isMobile ? 'h-3 w-3 mr-1' : 'h-4 w-4 mr-2'}`} />
                        Add Server
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Users className={`${isMobile ? 'h-8 w-8' : 'h-12 w-12'} text-gray-400 mx-auto mb-4`} />
              <h3 className={`${isMobile ? 'mobile-compact-title' : 'text-lg'} font-medium text-gray-900 mb-2`}>Select a Host and Profile</h3>
              <p className={`${isMobile ? 'mobile-compact-subtitle' : 'text-gray-500'}`}>Choose a host and profile to manage your MCP servers.</p>
            </div>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <AddHostDialog 
        open={addHostDialogOpen}
        onOpenChange={setAddHostDialogOpen}
        onAddHost={handleAddHostSuccess}
      />

      <AddServerDialog
        open={addServerDialogOpen}
        onOpenChange={setAddServerDialogOpen}
        onAddServer={handleAddServerSuccess}
      />

      {selectedServer && (
        <ServerDetails
          open={serverDetailsOpen}
          onOpenChange={setServerDetailsOpen}
          server={selectedServer}
          onDelete={() => handleDeleteServer(selectedServer.id)}
        />
      )}

      {selectedServer && (
        <ServerHistoryDialog
          open={serverHistoryOpen}
          onOpenChange={setServerHistoryOpen}
          server={selectedServer}
        />
      )}

      {selectedServer && (
        <ServerDebugDialog
          open={serverDebugOpen}
          onOpenChange={setServerDebugOpen}
          server={selectedServer}
        />
      )}

      <DeleteProfileDialog
        open={deleteProfileOpen}
        onOpenChange={setDeleteProfileOpen}
        profileName={profileToDelete ? profilesList.find(p => p.id === profileToDelete)?.name || '' : ''}
        onConfirmDelete={confirmDeleteProfile}
      />

      {/* Profile Edit Dialog */}
      <Dialog open={!!editingProfile} onOpenChange={() => setEditingProfile(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Profile Name</label>
              <Input
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="Enter profile name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={profileDescription}
                onChange={(e) => setProfileDescription(e.target.value)}
                placeholder="Enter profile description"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Endpoint</label>
              <Input
                value={profileEndpoint}
                onChange={(e) => setProfileEndpoint(e.target.value)}
                placeholder="http://localhost:8000"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSaveProfile}>Save Changes</Button>
              <Button variant="outline" onClick={() => setEditingProfile(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewLayout;
