
import { useState } from "react";
import { 
  CircleCheck, 
  CircleX, 
  Edit, 
  Link2, 
  Link2Off, 
  Loader2, 
  PlusCircle, 
  TerminalSquare, 
  Trash2, 
  Globe 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { StatusIndicator } from "@/components/status/StatusIndicator";
import { EndpointLabel } from "@/components/status/EndpointLabel";
import { Profile, profiles, serverInstances } from "@/data/mockData";

const Profiles = () => {
  const [localProfiles, setLocalProfiles] = useState<Profile[]>(profiles);

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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profiles</h1>
          <p className="text-muted-foreground">
            Create and manage MCP profiles to aggregate server instances.
          </p>
        </div>
        <Button>
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
                    <div className="space-y-2">
                      {instances.length > 0 ? (
                        instances.map(instance => instance && (
                          <div key={instance.id} className="flex items-center justify-between p-2 bg-secondary rounded-md">
                            <div className="flex items-center gap-2">
                              <StatusIndicator 
                                status={
                                  instance.status === 'running' ? 'active' : 
                                  instance.status === 'error' ? 'error' : 'inactive'
                                }
                              />
                              <span className="text-sm font-medium">{instance.name}</span>
                            </div>
                            {instance.enabled ? (
                              <CircleCheck className="h-4 w-4 text-green-500" />
                            ) : (
                              <CircleX className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-center p-2 text-muted-foreground text-sm">
                          No server instances added
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-0">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="outline" size="sm">
                  Manage Instances
                </Button>
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
            <Button className="mt-4">
              Create Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profiles;
