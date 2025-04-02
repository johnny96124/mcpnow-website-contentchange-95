
import { useState } from "react";
import { 
  CircleCheck, 
  CircleMinus, 
  CircleX, 
  Code, 
  Edit, 
  ExternalLink, 
  FilePlus, 
  Loader2, 
  PlusCircle, 
  Refresh, 
  Search, 
  Settings2 
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusIndicator } from "@/components/status/StatusIndicator";
import { hosts, profiles } from "@/data/mockData";

const Hosts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [hostProfiles, setHostProfiles] = useState(
    hosts.reduce((acc, host) => {
      acc[host.id] = host.profileId || "";
      return acc;
    }, {} as Record<string, string>)
  );
  
  // Filter hosts by search query
  const filteredHosts = hosts.filter(host => 
    host.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProfileChange = (hostId: string, profileId: string) => {
    setHostProfiles(prev => ({
      ...prev,
      [hostId]: profileId
    }));
  };
  
  const getProfileEndpoint = (profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    return profile ? profile.endpoint : "No profile selected";
  };
  
  const getProfileEndpointType = (profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    return profile ? profile.endpointType : null;
  };
  
  const getStatusIcon = (status: 'configured' | 'misconfigured' | 'unknown') => {
    switch (status) {
      case 'configured':
        return <CircleCheck className="h-5 w-5 text-status-active" />;
      case 'misconfigured':
        return <CircleX className="h-5 w-5 text-status-error" />;
      case 'unknown':
        return <CircleMinus className="h-5 w-5 text-status-inactive" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hosts</h1>
          <p className="text-muted-foreground">
            Manage host connections and profile associations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Search className="h-4 w-4 mr-2" />
            Scan for Hosts
          </Button>
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Host Manually
          </Button>
        </div>
      </div>
      
      <div className="flex items-center mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search hosts..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {filteredHosts.map(host => {
          const profileId = hostProfiles[host.id] || '';
          const endpoint = getProfileEndpoint(profileId);
          const endpointType = getProfileEndpointType(profileId);
          
          return (
            <Card key={host.id} className="overflow-hidden">
              <CardHeader className="bg-muted/50 pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{host.icon}</span>
                    <h3 className="font-medium text-lg">{host.name}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusIndicator 
                      status={
                        host.connectionStatus === 'connected' ? 'active' : 
                        host.connectionStatus === 'disconnected' ? 'inactive' : 
                        host.connectionStatus === 'misconfigured' ? 'error' : 'warning'
                      } 
                      label={
                        host.connectionStatus === 'connected' ? 'Connected' : 
                        host.connectionStatus === 'disconnected' ? 'Disconnected' : 
                        host.connectionStatus === 'misconfigured' ? 'Misconfigured' : 'Unknown'
                      }
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Associated Profile</label>
                  <Select
                    value={profileId}
                    onValueChange={(value) => handleProfileChange(host.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a profile" />
                    </SelectTrigger>
                    <SelectContent>
                      {profiles.map(profile => (
                        <SelectItem key={profile.id} value={profile.id}>
                          {profile.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {profileId && (
                  <>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium">Connection Endpoint</label>
                      <div className="bg-muted p-2 rounded-md">
                        <code className="text-xs break-all">{endpoint}</code>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {endpointType === 'HTTP_SSE' ? 
                          'HTTP SSE endpoint to be used in host configuration' : 
                          'STDIO command to be executed by the host'
                        }
                      </p>
                    </div>
                    
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium">Configuration Status</label>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(host.configStatus)}
                          <span className="text-sm">
                            {host.configStatus === 'configured' ? 'Configured' : 
                             host.configStatus === 'misconfigured' ? 'Misconfigured' : 'Unknown'}
                          </span>
                        </div>
                      </div>
                      
                      {host.configPath && (
                        <p className="text-xs text-muted-foreground">
                          Config file: {host.configPath}
                        </p>
                      )}
                      
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" className="flex-1">
                          <Settings2 className="h-4 w-4 mr-2" />
                          Configure Host
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <FilePlus className="h-4 w-4 mr-2" />
                          View Config File
                        </Button>
                      </div>
                    </div>
                  </>
                )}
                
                {!profileId && (
                  <div className="flex items-center justify-center p-4 border-2 border-dashed rounded-md">
                    <p className="text-muted-foreground text-center">
                      Select a profile to view connection details
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Hosts;
