
import { useState, useEffect } from "react";
import { 
  Edit, 
  Trash2, 
  Globe,
  TerminalSquare,
  PlusCircle,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { EndpointLabel } from "@/components/status/EndpointLabel";
import { Profile, profiles, serverInstances, EndpointType } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { CreateProfileDialog } from "@/components/profiles/CreateProfileDialog";
import { EditProfileDialog } from "@/components/profiles/EditProfileDialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DeleteProfileDialog } from "@/components/profiles/DeleteProfileDialog";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

const Profiles = () => {
  const [localProfiles, setLocalProfiles] = useState<Profile[]>(profiles);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [isCreateProfileOpen, setIsCreateProfileOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<Profile | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

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
    instances 
  }: { 
    name: string; 
    instances: string[];
  }) => {
    const newProfile: Profile = {
      id: `profile-${Date.now()}`,
      name,
      endpointType: "HTTP_SSE",
      endpoint: "http://localhost:8008/mcp",
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

  // Helper function to get server definition name
  const getDefinitionName = (definitionId: string) => {
    const instance = serverInstances.find(inst => inst.definitionId === definitionId);
    return instance ? instance.name.split(' ')[0] : 'Unknown';
  };

  // Filter profiles based on search query
  const filteredProfiles = localProfiles.filter(profile => 
    profile.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search profiles..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProfiles.map((profile) => {
          const instances = getServerInstances(profile);
          
          return (
            <Card key={profile.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl">{profile.name}</CardTitle>
                  <EndpointLabel type="HTTP_SSE" />
                </div>
              </CardHeader>
              <CardContent>
                <div>
                  <label className="text-sm font-medium block mb-1">Server Instances ({instances.length})</label>
                  {instances.length > 0 ? (
                    <ScrollArea className="h-[200px] rounded-md border">
                      <div className="space-y-1 p-1">
                        {instances.map(instance => instance && (
                          <div key={instance.id} className="flex items-center p-2 bg-secondary rounded-md">
                            <span className="text-sm">
                              <span className="font-medium">{getDefinitionName(instance.definitionId)}</span>
                              {' - '}
                              <span className="text-muted-foreground">{instance.name}</span>
                            </span>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="text-center p-2 text-muted-foreground text-sm border rounded-md">
                      No server instances added
                    </div>
                  )}
                </div>
              </CardContent>
              <Separator />
              <CardFooter className="flex justify-between pt-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-destructive"
                  onClick={() => handleDeleteClick(profile)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleEditProfile(profile)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
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
