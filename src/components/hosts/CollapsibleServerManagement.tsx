
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Database, Server } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ProfileDropdown } from './ProfileDropdown';
import { ServerListEmpty } from './ServerListEmpty';
import { ServerItem } from './ServerItem';
import { cn } from '@/lib/utils';
import { Profile, ServerInstance } from '@/data/mockData';

interface CollapsibleServerManagementProps {
  profiles: Profile[];
  serverInstances: ServerInstance[];
  selectedProfileId: string;
  onProfileChange: (profileId: string) => void;
  onCreateProfile: (name: string) => string;
  onDeleteProfile: (profileId: string) => void;
  onServerStatusChange: (serverId: string, enabled: boolean) => void;
  onAddServers: () => void;
  onRemoveFromProfile: (serverId: string) => void;
  getServerLoad: (serverId: string) => number;
  hostConnectionStatus: string;
}

export const CollapsibleServerManagement: React.FC<CollapsibleServerManagementProps> = ({
  profiles,
  serverInstances,
  selectedProfileId,
  onProfileChange,
  onCreateProfile,
  onDeleteProfile,
  onServerStatusChange,
  onAddServers,
  onRemoveFromProfile,
  getServerLoad,
  hostConnectionStatus
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const currentProfile = profiles.find(p => p.id === selectedProfileId);
  const profileServers = serverInstances.filter(
    server => currentProfile?.instances.includes(server.id)
  );

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Server Profile Management
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  ({profileServers.length} servers)
                </span>
              </div>
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <ProfileDropdown 
                  profiles={profiles} 
                  currentProfileId={selectedProfileId} 
                  onProfileChange={onProfileChange}
                  onCreateProfile={onCreateProfile}
                  onDeleteProfile={onDeleteProfile}
                />
              </div>
              {profileServers.length > 0 && (
                <Button 
                  onClick={onAddServers} 
                  className="whitespace-nowrap"
                >
                  <Server className="h-4 w-4 mr-2" />
                  Add Servers
                </Button>
              )}
            </div>
            
            {profileServers.length > 0 ? (
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="h-10 px-4 text-left text-sm font-medium text-muted-foreground">Server</th>
                      <th className="h-10 px-4 text-left text-sm font-medium text-muted-foreground">Type</th>
                      <th className="h-10 px-4 text-left text-sm font-medium text-muted-foreground">Status</th>
                      <th className="h-10 px-4 text-center text-sm font-medium text-muted-foreground">Active</th>
                      <th className="h-10 px-4 text-right text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {profileServers.map(server => (
                      <ServerItem 
                        key={server.id}
                        server={server}
                        hostConnectionStatus={hostConnectionStatus}
                        onStatusChange={onServerStatusChange}
                        load={getServerLoad(server.id)}
                        onRemoveFromProfile={onRemoveFromProfile}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <ServerListEmpty onAddServers={onAddServers} />
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
