
import { useState } from "react";
import { 
  CircleCheck, 
  CircleX, 
  Edit, 
  PlusCircle, 
  Trash2, 
  Globe,
  TerminalSquare,
  ChevronLeft,
  ChevronRight
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
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";

const Profiles = () => {
  const [localProfiles, setLocalProfiles] = useState<Profile[]>(profiles);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [isCreateProfileOpen, setIsCreateProfileOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

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

  const handleConfirmDeleteProfile = () => {
    if (profileToDelete) {
      setLocalProfiles(prev => prev.filter(p => p.id !== profileToDelete));
      
      toast({
        title: "Profile deleted",
        description: "The profile has been permanently removed",
      });
      
      setProfileToDelete(null);
    }
  };

  const handleDeleteProfile = (profileId: string) => {
    setProfileToDelete(profileId);
  };

  const handleSaveProfileEdit = (editedProfile: Profile, newName: string, selectedInstanceIds: string[], newEndpoint: string, newEndpointType: EndpointType) => {
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

  const handleCreateProfile = ({ name, endpointType, endpoint }: { name: string; endpointType: EndpointType; endpoint: string }) => {
    const newProfile: Profile = {
      id: `profile-${Date.now()}`,
      name,
      endpointType,
      endpoint,
      enabled: true,
      instances: [],
    };
    
    setLocalProfiles(prev => [...prev, newProfile]);
    
    toast({
      title: "Profile created successfully",
      description: `The profile "${name}" has been created with ${endpointType} endpoint.`,
    });
  };

  const handleCreateProfileClick = () => {
    // Check if there are any server instances available
    if (serverInstances.length === 0) {
      toast({
        title: "No server instances available",
        description: "Please create at least one server instance first",
        variant: "destructive",
      });
      navigate("/servers");
      return;
    }
    
    setIsCreateProfileOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profiles</h1>
          <p className="text-muted-foreground">
            Create and manage MCP profiles to aggregate server instances.
          </p>
        </div>
        <Button onClick={handleCreateProfileClick}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Profile
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {localProfiles.map(profile => {
          const instances = getServerInstances(profile);
          const runningInstancesCount = instances.filter(i => i?.status === 'running').length;
          const errorInstancesCount = instances.filter(i => i?.status === 'error').length;
          
          return (
            <Card key={profile.id} className={profile.enabled ? "" : "opacity-75"}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl">{profile.name}</CardTitle>
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
                      <Carousel className="w-full">
                        <CarouselContent>
                          {instances.map(instance => instance && (
                            <CarouselItem key={instance.id} className="basis-full md:basis-1/2">
                              <div className="flex items-center justify-between p-2 bg-secondary rounded-md">
                                <div className="flex items-center gap-2">
                                  <StatusIndicator 
                                    status={
                                      instance.status === 'running' ? 'active' : 
                                      instance.status === 'error' ? 'error' : 'inactive'
                                    }
                                  />
                                  <span className="text-sm font-medium truncate max-w-[150px]">{instance.name}</span>
                                </div>
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <div className="flex justify-center mt-2">
                          <CarouselPrevious className="relative inset-0 translate-y-0 translate-x-0 h-7 w-7 ml-1" />
                          <CarouselNext className="relative inset-0 translate-y-0 translate-x-0 h-7 w-7 ml-1" />
                        </div>
                      </Carousel>
                    ) : (
                      <div className="text-center p-2 text-muted-foreground text-sm">
                        No server instances added
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end pt-0">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => handleDeleteProfile(profile.id)}>
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
        
        {/* Create new profile card */}
        <Card className="border-dashed border-2 flex flex-col items-center justify-center h-[400px]">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <PlusCircle className="h-8 w-8 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              Create a new profile to group server instances together
            </p>
            <Button className="mt-4" onClick={handleCreateProfileClick}>
              Create Profile
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Create profile dialog */}
      <CreateProfileDialog
        open={isCreateProfileOpen}
        onOpenChange={setIsCreateProfileOpen}
        onCreateProfile={handleCreateProfile}
        allInstances={serverInstances}
      />
      
      {/* Edit profile dialog */}
      {selectedProfile && (
        <EditProfileDialog
          open={isEditProfileOpen}
          onOpenChange={setIsEditProfileOpen}
          profile={selectedProfile}
          allInstances={serverInstances}
          onSave={handleSaveProfileEdit}
        />
      )}

      {/* Delete profile confirmation dialog */}
      <AlertDialog open={profileToDelete !== null} onOpenChange={(open) => !open && setProfileToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this profile?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the profile
              and remove its data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleConfirmDeleteProfile}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Profiles;
