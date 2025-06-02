
import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, Database, Server, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ProfileDropdown } from './ProfileDropdown';
import { ServerListEmpty } from './ServerListEmpty';
import { ServerItem } from './ServerItem';
import { cn } from '@/lib/utils';
import { Profile, ServerInstance, ConnectionStatus } from '@/data/mockData';

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
  hostConnectionStatus: ConnectionStatus;
  onRequestMoreSpace?: () => void;
  onCollapseChange?: (isCollapsed: boolean) => void;
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
  hostConnectionStatus,
  onRequestMoreSpace,
  onCollapseChange
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [showAllServers, setShowAllServers] = useState(false);
  const [maxVisibleServers, setMaxVisibleServers] = useState(3);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const currentProfile = profiles.find(p => p.id === selectedProfileId);
  const profileServers = serverInstances.filter(
    server => currentProfile?.instances.includes(server.id)
  );

  const visibleServers = showAllServers ? profileServers : profileServers.slice(0, maxVisibleServers);
  const hasMoreServers = profileServers.length > maxVisibleServers && !showAllServers;

  // Notify parent component when collapse state changes
  useEffect(() => {
    if (onCollapseChange) {
      onCollapseChange(!isOpen);
    }
  }, [isOpen, onCollapseChange]);

  // Calculate max visible servers based on available height
  useEffect(() => {
    const calculateMaxServers = () => {
      if (tableContainerRef.current) {
        const containerHeight = tableContainerRef.current.clientHeight;
        const headerHeight = 40; // Table header height
        const serverRowHeight = 60; // Approximate height per server row
        const viewMoreButtonHeight = 40;
        
        const availableHeight = containerHeight - headerHeight - (hasMoreServers ? viewMoreButtonHeight : 0);
        const calculatedMax = Math.floor(availableHeight / serverRowHeight);
        
        setMaxVisibleServers(Math.max(1, calculatedMax));
      }
    };

    calculateMaxServers();
    
    const resizeObserver = new ResizeObserver(calculateMaxServers);
    if (tableContainerRef.current) {
      resizeObserver.observe(tableContainerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [hasMoreServers]);

  const handleViewMore = () => {
    setShowAllServers(true);
    if (onRequestMoreSpace) {
      onRequestMoreSpace();
    }
  };

  const handleViewLess = () => {
    setShowAllServers(false);
  };

  return (
    <Card className="h-full flex flex-col">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors flex-shrink-0">
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
        
        <CollapsibleContent className="flex-1 flex flex-col min-h-0">
          <CardContent className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
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
              <div className="flex-1 flex flex-col min-h-0" ref={tableContainerRef}>
                <div className="rounded-md border flex-1 flex flex-col min-h-0">
                  <table className="w-full">
                    <thead className="flex-shrink-0">
                      <tr className="border-b bg-muted/50">
                        <th className="h-10 px-4 text-left text-sm font-medium text-muted-foreground">Server</th>
                        <th className="h-10 px-4 text-left text-sm font-medium text-muted-foreground">Type</th>
                        <th className="h-10 px-4 text-left text-sm font-medium text-muted-foreground">Status</th>
                        <th className="h-10 px-4 text-center text-sm font-medium text-muted-foreground">Active</th>
                        <th className="h-10 px-4 text-right text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                  </table>
                  
                  <div className="flex-1 overflow-auto">
                    <table className="w-full">
                      <tbody>
                        {visibleServers.map(server => (
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
                  
                  {(hasMoreServers || showAllServers) && (
                    <div className="border-t p-2 flex-shrink-0">
                      {hasMoreServers ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleViewMore}
                          className="w-full text-muted-foreground hover:text-foreground"
                        >
                          <MoreHorizontal className="h-4 w-4 mr-2" />
                          View {profileServers.length - maxVisibleServers} more servers
                        </Button>
                      ) : showAllServers && profileServers.length > maxVisibleServers && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleViewLess}
                          className="w-full text-muted-foreground hover:text-foreground"
                        >
                          <ChevronUp className="h-4 w-4 mr-2" />
                          Show less
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1">
                <ServerListEmpty onAddServers={onAddServers} />
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
