
import React, { useRef } from "react";
import { ServerCard } from "./ServerCard";
import { LoadingIndicator } from "./LoadingIndicator";
import { EmptyState } from "./EmptyState";
import { Button } from "@/components/ui/button";
import { EnhancedServerDefinition } from "@/data/mockData";

interface ServerGridProps {
  servers: EnhancedServerDefinition[];
  visibleServers: EnhancedServerDefinition[];
  hasMore: boolean;
  isLoading: boolean;
  isInstalling: Record<string, boolean>;
  installedServers: Record<string, boolean>;
  installedButtonHover: Record<string, boolean>;
  searchQuery: string;
  onLoadMore: () => void;
  onInstall: (serverId: string) => void;
  onViewDetails: (server: EnhancedServerDefinition) => void;
  onResetFilters: () => void;
  onMouseEnterInstallButton: (serverId: string) => void;
  onMouseLeaveInstallButton: (serverId: string) => void;
  sortOption: string;
}

export const ServerGrid: React.FC<ServerGridProps> = ({
  servers,
  visibleServers,
  hasMore,
  isLoading,
  isInstalling,
  installedServers,
  installedButtonHover,
  searchQuery,
  onLoadMore,
  onInstall,
  onViewDetails,
  onResetFilters,
  onMouseEnterInstallButton,
  onMouseLeaveInstallButton,
  sortOption
}) => {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  if (servers.length === 0) {
    return (
      <EmptyState 
        searchQuery={searchQuery} 
        onReset={onResetFilters} 
      />
    );
  }

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-4">
        {visibleServers.map(server => (
          <ServerCard 
            key={server.id}
            server={server}
            isInstalling={isInstalling[server.id] || false}
            isInstalled={installedServers[server.id] || false}
            installButtonHover={installedButtonHover[server.id] || false}
            onInstall={onInstall}
            onViewDetails={onViewDetails}
            onMouseEnterInstallButton={() => onMouseEnterInstallButton(server.id)}
            onMouseLeaveInstallButton={() => onMouseLeaveInstallButton(server.id)}
            sortOption={sortOption}
          />
        ))}
      </div>
      
      {hasMore && (
        <div ref={loadMoreRef} className="py-6 flex justify-center">
          {isLoading ? (
            <LoadingIndicator />
          ) : (
            <Button 
              variant="outline" 
              onClick={onLoadMore}
              className="min-w-[200px]"
            >
              Load More
            </Button>
          )}
        </div>
      )}
    </>
  );
};
