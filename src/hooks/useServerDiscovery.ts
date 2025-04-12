
import { useState, useEffect, useRef } from "react";
import { EnhancedServerDefinition } from "@/data/mockData";

const ITEMS_PER_PAGE = 9;

export const useServerDiscovery = (allServers: EnhancedServerDefinition[]) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedServer, setSelectedServer] = useState<EnhancedServerDefinition | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isInstalling, setIsInstalling] = useState<Record<string, boolean>>({});
  const [installedServers, setInstalledServers] = useState<Record<string, boolean>>({});
  const [visibleItems, setVisibleItems] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);
  const [sortOption, setSortOption] = useState("popular");
  const [installedButtonHover, setInstalledButtonHover] = useState<Record<string, boolean>>({});

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisibleItems(ITEMS_PER_PAGE);
  }, [searchQuery, selectedCategory, activeTab]);

  const getFilteredServers = () => {
    let filtered = allServers.filter(server => 
      (searchQuery === "" || 
        server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        server.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (server.author && server.author.toLowerCase().includes(searchQuery.toLowerCase()))
      ) && 
      (selectedCategory === null || 
        server.categories?.includes(selectedCategory)
      )
    );

    if (activeTab === "official") {
      filtered = filtered.filter(server => server.isOfficial);
    } else if (activeTab === "community") {
      filtered = filtered.filter(server => !server.isOfficial);
    }

    if (sortOption === "popular") {
      filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (sortOption === "recent") {
      filtered.sort((a, b) => {
        const dateA = a.updated ? new Date(a.updated).getTime() : 0;
        const dateB = b.updated ? new Date(b.updated).getTime() : 0;
        return dateB - dateA;
      });
    } else if (sortOption === "installed") {
      filtered.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
    } else if (sortOption === "stars") {
      filtered.sort((a, b) => (b.watches || 0) - (a.watches || 0));
    }

    return filtered;
  };

  const filteredServers = getFilteredServers();
  const visibleServers = filteredServers.slice(0, visibleItems);
  const hasMore = visibleServers.length < filteredServers.length;
  const isSearching = searchQuery.trim().length > 0;

  const loadMoreItems = () => {
    if (!hasMore) return;
    
    setIsLoading(true);
    
    setTimeout(() => {
      setVisibleItems(prev => prev + ITEMS_PER_PAGE);
      setIsLoading(false);
    }, 800);
  };

  const handleViewDetails = (server: EnhancedServerDefinition) => {
    setSelectedServer(server);
    setIsDialogOpen(true);
  };

  const handleInstall = (serverId: string) => {
    setIsInstalling(prev => ({ ...prev, [serverId]: true }));
    
    setTimeout(() => {
      setIsInstalling(prev => ({ ...prev, [serverId]: false }));
      setInstalledServers(prev => ({ ...prev, [serverId]: true }));
    }, 1500);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
  };

  const handleMouseEnterInstallButton = (serverId: string) => {
    setInstalledButtonHover(prev => ({ ...prev, [serverId]: true }));
  };

  const handleMouseLeaveInstallButton = (serverId: string) => {
    setInstalledButtonHover(prev => ({ ...prev, [serverId]: false }));
  };

  return {
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
    handleInstall,
    handleResetFilters,
    handleMouseEnterInstallButton,
    handleMouseLeaveInstallButton,
    loadMoreRef
  };
};
