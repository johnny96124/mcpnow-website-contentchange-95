import { useState, useEffect } from "react";
import { 
  CircleCheck, 
  Edit, 
  Trash2, 
  Globe,
  TerminalSquare,
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { StatusIndicator } from "@/components/status/StatusIndicator";
import { EndpointLabel } from "@/components/status/EndpointLabel";
import { Profile, profiles, serverInstances, EndpointType } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { CreateProfileDialog } from "@/components/profiles/CreateProfileDialog";
import { EditProfileDialog } from "@/components/profiles/EditProfileDialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DeleteProfileDialog } from "@/components/profiles/DeleteProfileDialog";

const Profiles = () => {
  const [localProfiles, setLocalProfiles] = useState<Profile[]>(profiles);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [isCreateProfileOpen, setIsCreateProfileOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<Profile | null>(null);
  const { toast } = useToast();

  const toggleProfile = (id: string) => {
    setLocalProfiles(prev => 
      prev.map(profile => 
        profile.id === id ? { ...profile, enabled: !profile.enabled } : profile
      )
    );
  };

  const getServerInstances = (profile: Profile) => {
    return profile.instances.map(
      instanceId => serverInstances.find(s => s.id === instanceId)
    ).filter(Boolean);
  };

  const handleEditProfile = (profile: Profile) => {
    setSelectedProfile(profile);
    setIsEditProfileOpen(true);
  };

  const handleDeleteClick = (profile: Profile) => {
    setProfileToDelete(profile);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (profileToDelete) {
      setLocalProfiles(prev => prev.filter(p => p.id !== profileToDelete.id));
      
      toast({
        title: "Profile deleted",
        description: "The profile has been permanently removed",
      });

      setIsDeleteDialogOpen(false);
      setProfileToDelete(null);
    }
  };

  const handleSaveProfileEdit = (
    editedProfile: Profile, 
    newName: string, 
    selectedInstanceIds: string[],
    newEndpoint: string,
    newEndpointType: EndpointType
  ) => {
    if (selectedInstanceIds.length === 0) {
      toast({
        title: "Cannot save profile",
        description: "A profile must have at least one instance",
        variant: "destructive",
      });
      return;
    }

    setLocalProfiles(prev => 
      prev.map(p => 
        p.id === editedProfile.id 
          ? { 
              ...p, 
              name: newName, 
              instances: selectedInstanceIds,
              endpoint: newEndpoint,
              endpointType: newEndpointType
            } 
          : p
      )
    );
    
    toast({
      title: "Profile updated",
      description: `Updated ${editedProfile.name} profile`,
    });
  };

  const handleCreateProfile = ({ 
    name, 
    endpointType, 
    endpoint, 
    instances 
  }: { 
    name: string; 
    endpointType: EndpointType; 
    endpoint: string;
    instances: string[];
  }) => {
    const newProfile: Profile = {
      id: `profile-${Date.now()}`,
      name,
      endpointType,
      endpoint,
      enabled: true,
      instances,
    };
    
    setLocalProfiles(prev => [...prev, newProfile]);
    
    toast({
      title: "Profile created successfully",
      description: `The profile "${name}" has been created with ${instances.length} server instance(s).`,
    });
  };

  const ensureFirstProfileHasFiveInstances = () => {
    if (serverInstances.length >= 5) {
      setLocalProfiles(prev => {
        const updatedProfiles = [...prev];
        
        if (updatedProfiles.length > 0) {
          const fiveInstanceIds = serverInstances.slice(0, 5).map(instance => instance.id);
          
          updatedProfiles[0] = {
            ...updatedProfiles[0],
            instances: fiveInstanceIds
          };
          
          console.log("Updated first profile with 5 instances:", updatedProfiles[0]);
        }
        
        return updatedProfiles;
      });
    }
  };

  useEffect(() => {
    ensureFirstProfileHasFiveInstances();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profiles</h1>
          <p className="text-muted-foreground">
            Create and manage MCP profiles to aggregate server instances.
          </p>
        </div>
        <Button onClick={() => {
          if (serverInstances.length === 0) {
            toast({
              title: "No instances available",
              description: "Please create at least one server instance first.",
              variant: "destructive",
            });
            return;
          }
          setIsCreateProfileOpen(true);
        }}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Profile
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {localProfiles.map((profile, index) => {
          const instances = getServerInstances(profile);
          const runningInstancesCount = instances.filter(i => i?.status === 'running').length;
          const errorInstancesCount = instances.filter(i => i?.status === 'error').length;
          
          return (
            <Card key={profile.id} className={profile.enabled ? "" : "opacity-75"}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <StatusIndicator 
                      status={
                        profile.enabled ? 
                          (errorInstancesCount > 0 ? "error" :
                          runningInstancesCount > 0 ? "active" : "inactive") 
                        : "inactive"
                      } 
                    />
                    <CardTitle className="text-xl">{profile.name}</CardTitle>
                  </div>
                  <Switch 
                    checked={profile.enabled}
                    onCheckedChange={() => toggleProfile(profile.id)}
                  />
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <EndpointLabel type={profile.endpointType} />
                  {profile.enabled ? (
                    <StatusIndicator 
                      status={
                        errorInstancesCount > 0 ? "error" :
                        runningInstancesCount > 0 ? "active" : "inactive"
                      } 
                    />
                  ) : (
                    <StatusIndicator status="inactive" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium block mb-1">Connection Endpoint</label>
                    <div className="flex items-center gap-2 bg-muted p-2 rounded-md">
                      {profile.endpointType === 'HTTP_SSE' ? (
                        <Globe className="h-4 w-4 text-blue-500 flex-shrink-0" />
                      ) : (
                        <TerminalSquare className="h-4 w-4 text-purple-500 flex-shrink-0" />
                      )}
                      <code className="text-xs break-all">{profile.endpoint}</code>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium block mb-1">Server Instances ({instances.length})</label>
                    {instances.length > 0 ? (
                      instances.length > 2 ? (
                        <ScrollArea className="h-32 rounded-md border">
                          <div className="space-y-2 p-2">
                            {instances.map(instance => instance && (
                              <div key={instance.id} className="flex items-center p-2 bg-secondary rounded-md">
                                <div className="flex items-center gap-2">
                                  <StatusIndicator 
                                    status={
                                      instance.status === 'running' ? 'active' : 
                                      instance.status === 'error' ? 'error' : 'inactive'
                                    }
                                  />
                                  <span className="text-sm font-medium">{instance.name}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      ) : (
                        <div className="space-y-2">
                          {instances.map(instance => instance && (
                            <div key={instance.id} className="flex items-center p-2 bg-secondary rounded-md">
                              <div className="flex items-center gap-2">
                                <StatusIndicator 
                                  status={
                                    instance.status === 'running' ? 'active' : 
                                    instance.status === 'error' ? 'error' : 'inactive'
                                  }
                                />
                                <span className="text-sm font-medium">{instance.name}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )
                    ) : (
                      <div className="text-center p-2 text-muted-foreground text-sm">
                        No server instances added
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-0">
                <div className="flex gap-2">
                  {/* Buttons can go here if needed */}
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-destructive border-destructive hover:bg-destructive/10"
                    onClick={() => handleDeleteClick(profile)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEditProfile(profile)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          );
        })}
        
        <Card className="border-dashed border-2 flex flex-col items-center justify-center h-[400px]">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <PlusCircle className="h-8 w-8 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              Create a new profile to group server instances together
            </p>
            <Button 
              className="mt-4" 
              onClick={() => {
                if (serverInstances.length === 0) {
                  toast({
                    title: "No instances available",
                    description: "Please create at least one server instance first.",
                    variant: "destructive",
                  });
                  return;
                }
                setIsCreateProfileOpen(true);
              }}
            >
              Create Profile
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <CreateProfileDialog
        open={isCreateProfileOpen}
        onOpenChange={setIsCreateProfileOpen}
        onCreateProfile={handleCreateProfile}
        instances={serverInstances}
      />
      
      {selectedProfile && (
        <EditProfileDialog
          open={isEditProfileOpen}
          onOpenChange={setIsEditProfileOpen}
          profile={selectedProfile}
          allInstances={serverInstances}
          onSave={handleSaveProfileEdit}
        />
      )}

      {profileToDelete && (
        <DeleteProfileDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          profileName={profileToDelete.name}
          onConfirmDelete={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default Profiles;
