
import { useState } from "react";
import { Check, ChevronDown, ExternalLink, MonitorCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { profiles, hosts, serverInstances } from "@/data/mockData";
import { StatusIndicator } from "@/components/status/StatusIndicator";

const TrayPopup = () => {
  const [selectedProfileIds, setSelectedProfileIds] = useState<Record<string, string>>(
    hosts.reduce((acc, host) => {
      if (host.profileId) {
        acc[host.id] = host.profileId;
      }
      return acc;
    }, {} as Record<string, string>)
  );

  const handleProfileChange = (hostId: string, profileId: string) => {
    setSelectedProfileIds(prev => ({
      ...prev,
      [hostId]: profileId
    }));
  };

  const getStatusForProfile = (profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    if (!profile) return "inactive";
    if (!profile.enabled) return "inactive";
    
    // Check if any instances are running
    const profileInstances = serverInstances.filter(
      inst => profile.instances.includes(inst.id)
    );
    
    if (profileInstances.some(inst => inst.status === "error")) return "error";
    if (profileInstances.some(inst => inst.status === "running")) return "active";
    return "inactive";
  };

  const openDashboard = () => {
    window.open("/", "_blank");
  };

  // Filter to only show connected/active hosts
  const activeHosts = hosts.filter(h => 
    h.connectionStatus === 'connected' || h.profileId
  );

  return (
    <div className="w-80 p-2 bg-background rounded-lg shadow-lg animate-fade-in">
      <div className="flex items-center justify-between p-2 mb-2">
        <div className="flex items-center gap-2">
          <MonitorCheck className="h-5 w-5 text-primary" />
          <h2 className="font-medium">MCP Now</h2>
        </div>
        <Button 
          size="sm" 
          variant="ghost"
          className="text-xs flex items-center gap-1"
          onClick={openDashboard}
        >
          <span>Open Dashboard</span>
          <ExternalLink className="h-3 w-3" />
        </Button>
      </div>
      
      {activeHosts.length === 0 ? (
        <div className="p-4 text-center text-muted-foreground">
          <p>No active connections</p>
        </div>
      ) : (
        <div className="space-y-2">
          {activeHosts.map(host => {
            const currentProfileId = selectedProfileIds[host.id] || '';
            const currentProfile = profiles.find(p => p.id === currentProfileId);
            
            return (
              <Card key={host.id} className="overflow-hidden">
                <CardHeader className="p-3 pb-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{host.icon}</span>
                      <h3 className="font-medium">{host.name}</h3>
                    </div>
                    <StatusIndicator 
                      status={host.connectionStatus === 'connected' ? 'active' : 'inactive'} 
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium">Profile:</span>
                    <Select
                      value={currentProfileId}
                      onValueChange={(value) => handleProfileChange(host.id, value)}
                    >
                      <SelectTrigger className="w-48 h-8 text-sm">
                        <SelectValue placeholder="Select profile" />
                      </SelectTrigger>
                      <SelectContent>
                        {profiles.map(profile => (
                          <SelectItem key={profile.id} value={profile.id}>
                            <div className="flex items-center gap-2">
                              <StatusIndicator 
                                status={getStatusForProfile(profile.id)} 
                              />
                              <span>{profile.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {currentProfile && (
                    <div className="mt-2 bg-muted rounded-md p-2">
                      <p className="text-xs text-muted-foreground mb-1">Active server instances:</p>
                      <ul className="text-xs space-y-1">
                        {currentProfile.instances.map(instanceId => {
                          const instance = serverInstances.find(s => s.id === instanceId);
                          if (!instance) return null;
                          
                          return (
                            <li key={instanceId} className="flex items-center gap-1">
                              <StatusIndicator 
                                status={
                                  instance.status === 'running' ? 'active' : 
                                  instance.status === 'error' ? 'error' : 'inactive'
                                } 
                              />
                              <span>{instance.name}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TrayPopup;
