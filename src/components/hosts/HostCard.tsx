
import { useState, useEffect } from "react";
import { CircleCheck, CircleX, CircleMinus, FilePlus, Settings2, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusIndicator } from "@/components/status/StatusIndicator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { profiles } from "@/data/mockData";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface HostCardProps {
  host: {
    id: string;
    name: string;
    icon?: string;
    connectionStatus: 'connected' | 'disconnected' | 'misconfigured' | 'unknown';
    configStatus: 'configured' | 'misconfigured' | 'unknown';
    configPath?: string;
    profileId?: string;
    needsUpdate?: boolean;
  };
  profileId: string;
  onProfileChange: (hostId: string, profileId: string) => void;
  onOpenConfigDialog: (hostId: string) => void;
  onCreateConfig: (hostId: string, profileId: string) => void;
}

export function HostCard({ 
  host, 
  profileId, 
  onProfileChange, 
  onOpenConfigDialog,
  onCreateConfig
}: HostCardProps) {
  const [previousProfileId, setPreviousProfileId] = useState(profileId);
  const [needsUpdate, setNeedsUpdate] = useState(host.needsUpdate || false);
  const { toast } = useToast();
  
  // Track profile changes to detect when config needs update
  useEffect(() => {
    if (previousProfileId && profileId !== previousProfileId && host.configPath) {
      setNeedsUpdate(true);
    }
    setPreviousProfileId(profileId);
  }, [profileId, previousProfileId, host.configPath]);
  
  const getProfileEndpoint = (profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    return profile ? profile.endpoint : "No profile selected";
  };
  
  const getProfileEndpointType = (profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    return profile ? profile.endpointType : null;
  };

  const getProfileStatus = (profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    return profile ? profile.status : null;
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

  const handleProfileChange = (newProfileId: string) => {
    if (host.configPath && profileId !== newProfileId) {
      setNeedsUpdate(true);
    }
    onProfileChange(host.id, newProfileId);
  };

  const handleCreateConfig = () => {
    if (profileId) {
      onCreateConfig(host.id, profileId);
      setNeedsUpdate(false);
    } else {
      toast({
        title: "Profile required",
        description: "Please select a profile before creating a configuration file",
        variant: "destructive",
      });
    }
  };

  const endpoint = getProfileEndpoint(profileId);
  const endpointType = getProfileEndpointType(profileId);
  const profileStatus = getProfileStatus(profileId);
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/50 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {host.icon && <span className="text-xl">{host.icon}</span>}
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
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Associated Profile</label>
            {profileId && profileStatus && (
              <Badge variant={
                profileStatus === 'active' ? 'success' : 
                profileStatus === 'inactive' ? 'default' :
                profileStatus === 'error' ? 'destructive' : 'outline'
              }>
                {profileStatus}
              </Badge>
            )}
          </div>
          <Select
            value={profileId}
            onValueChange={handleProfileChange}
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

              {needsUpdate && host.configPath && (
                <Alert variant="destructive" className="mt-2 py-2 px-3">
                  <div className="flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
                    <AlertDescription className="text-xs">
                      Profile changed. Configuration file needs update.
                    </AlertDescription>
                  </div>
                </Alert>
              )}
              
              <div className="flex gap-2 mt-2">
                {!host.configPath ? (
                  <Button size="sm" className="flex-1" onClick={handleCreateConfig}>
                    <Settings2 className="h-4 w-4 mr-2" />
                    Create Config
                  </Button>
                ) : (
                  <>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => onOpenConfigDialog(host.id)}
                      disabled={!host.configPath}
                    >
                      <FilePlus className="h-4 w-4 mr-2" />
                      View Config File
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1"
                      variant={needsUpdate ? "destructive" : "default"}
                      onClick={handleCreateConfig}
                    >
                      <Settings2 className="h-4 w-4 mr-2" />
                      {needsUpdate ? "Update Config" : "Configure Host"}
                    </Button>
                  </>
                )}
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
}
