
import { useEffect, useState, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { extendedItems, ServerDefinition, Profile } from "@/data/mockData";
import { DiscoveryHeader } from "@/components/discovery/DiscoveryHeader";
import { FilterBar } from "@/components/discovery/FilterBar";
import { ServerGrid } from "@/components/discovery/ServerGrid";
import { ServerDetailDialog } from "@/components/discovery/ServerDetailDialog";
import { AddInstanceDialog, InstanceFormValues } from "@/components/servers/AddInstanceDialog";
import { AddToProfileDialog } from "@/components/discovery/AddToProfileDialog";
import { HostConfigGuideDialog } from "@/components/discovery/HostConfigGuideDialog";
import { useHostProfiles } from "@/hooks/useHostProfiles";
import { useServerDiscovery } from "@/hooks/useServerDiscovery";

const mockCategories = [
  "API Testing", 
  "Developer Tools", 
  "Database", 
  "DevOps", 
  "Monitoring", 
  "Cloud", 
  "Security", 
  "Analytics", 
  "Productivity",
  "Automation"
];

const Discovery = () => {
  const [allCategories, setAllCategories] = useState<string[]>(mockCategories);
  const [addInstanceOpen, setAddInstanceOpen] = useState(false);
  const [selectedDefinition, setSelectedDefinition] = useState<ServerDefinition | null>(null);
  const [justInstalledServerId, setJustInstalledServerId] = useState<string | null>(null);
  const [addToProfileOpen, setAddToProfileOpen] = useState(false);
  const [hostGuideOpen, setHostGuideOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);

  const { toast } = useToast();
  const navigate = useNavigate();
  const { allProfiles, addInstanceToProfile, getProfileById, getAvailableHosts } = useHostProfiles();
  
  const { 
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    activeTab,
    setActiveTab,
    selectedServer,
    setSelectedServer,
    isDialogOpen,
    setIsDialogOpen,
    isInstalling,
    installedServers,
    visibleItems,
    isLoading,
    sortOption,
    setSortOption,
    installedButtonHover,
    filteredServers,
    visibleServers,
    hasMore,
    isSearching,
    loadMoreItems,
    handleViewDetails,
    handleInstall: baseHandleInstall,
    handleResetFilters,
    handleMouseEnterInstallButton,
    handleMouseLeaveInstallButton,
    loadMoreRef
  } = useServerDiscovery(extendedItems);

  // Enhanced install handler that also triggers the instance creation flow
  const handleInstall = (serverId: string) => {
    const server = extendedItems.find(item => item.id === serverId);
    if (!server) return;
    
    baseHandleInstall(serverId);
    setJustInstalledServerId(serverId);
    
    setTimeout(() => {
      setSelectedDefinition(server);
      
      toast({
        title: "Server installed",
        description: `${server.name} has been successfully installed.`,
      });

      setAddInstanceOpen(true);
    }, 1500);
  };

  const handleCreateInstance = (data: InstanceFormValues) => {
    if (!selectedDefinition) return;
    
    toast({
      title: "Instance Created",
      description: `${data.name} has been created successfully.`,
    });
    
    setAddInstanceOpen(false);
    setAddToProfileOpen(true);
  };

  const handleAddToProfile = (profileId: string) => {
    if (!selectedDefinition) return;
    
    const profile = addInstanceToProfile(profileId, selectedDefinition.id);
    setSelectedProfile(profile);
    
    toast({
      title: "Instance Added",
      description: `Added to profile ${profile?.name}.`,
    });
    
    setAddToProfileOpen(false);
    setHostGuideOpen(true);
  };

  // Set up intersection observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !isLoading) {
          loadMoreItems();
        }
      },
      { rootMargin: "200px" }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [visibleItems, filteredServers.length, isLoading, hasMore, loadMoreItems]);

  return (
    <div className="animate-fade-in">
      <DiscoveryHeader />
      
      <FilterBar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortOption={sortOption}
        onSortChange={setSortOption}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        selectedCategory={selectedCategory}
        onClearFilters={handleResetFilters}
        categories={allCategories}
        onCategorySelect={setSelectedCategory}
      />
      
      <ScrollArea className="h-[calc(100vh-380px)]">
        <ServerGrid 
          servers={filteredServers}
          visibleServers={visibleServers}
          hasMore={hasMore}
          isLoading={isLoading}
          isInstalling={isInstalling}
          installedServers={installedServers}
          installedButtonHover={installedButtonHover}
          searchQuery={searchQuery}
          onLoadMore={loadMoreItems}
          onInstall={handleInstall}
          onViewDetails={handleViewDetails}
          onResetFilters={handleResetFilters}
          onMouseEnterInstallButton={handleMouseEnterInstallButton}
          onMouseLeaveInstallButton={handleMouseLeaveInstallButton}
          sortOption={sortOption}
        />
      </ScrollArea>
      
      <ServerDetailDialog 
        server={selectedServer}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        isInstalling={selectedServer ? isInstalling[selectedServer.id] || false : false}
        isInstalled={selectedServer ? installedServers[selectedServer.id] || false : false}
        installButtonHover={selectedServer ? installedButtonHover[selectedServer.id] || false : false}
        onInstall={handleInstall}
        onMouseEnterInstallButton={() => selectedServer && handleMouseEnterInstallButton(selectedServer.id)}
        onMouseLeaveInstallButton={() => selectedServer && handleMouseLeaveInstallButton(selectedServer.id)}
      />

      <AddInstanceDialog
        open={addInstanceOpen}
        onOpenChange={setAddInstanceOpen}
        serverDefinition={selectedDefinition}
        onCreateInstance={handleCreateInstance}
      />

      <AddToProfileDialog
        open={addToProfileOpen}
        onOpenChange={setAddToProfileOpen}
        onAddToProfile={handleAddToProfile}
        serverDefinition={selectedDefinition}
        profiles={allProfiles}
      />

      <HostConfigGuideDialog
        open={hostGuideOpen}
        onOpenChange={setHostGuideOpen}
        profile={selectedProfile}
        hosts={getAvailableHosts()}
      />
    </div>
  );
};

export default Discovery;
