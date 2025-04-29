
import { useState, useEffect, useCallback, useMemo } from "react";
import { hosts, profiles, type Profile, type Host } from "@/data/mockData";

export function useHostProfiles() {
  const [hostProfiles, setHostProfiles] = useState(
    hosts.reduce((acc, host) => {
      acc[host.id] = host.profileId || "";
      return acc;
    }, {} as Record<string, string>)
  );
  
  const [profileCache, setProfileCache] = useState<Record<string, Profile | null>>({});
  const [allProfiles, setAllProfiles] = useState<Profile[]>([]);
  
  // Initialize profile cache only once
  useEffect(() => {
    const initialCache = profiles.reduce((acc, profile) => {
      acc[profile.id] = profile;
      return acc;
    }, {} as Record<string, Profile>);
    
    setProfileCache(initialCache);
    setAllProfiles(profiles);
  }, []);
  
  // Memoize profile lookup with useMemo for better performance
  const getProfileById = useCallback((profileId: string): Profile | null => {
    return profileCache[profileId] || null;
  }, [profileCache]);
  
  // Optimize profile change handler
  const handleProfileChange = useCallback((hostId: string, profileId: string) => {
    setHostProfiles(prev => ({
      ...prev,
      [hostId]: profileId
    }));
  }, []);

  // Optimize instance addition with proper memoization
  const addInstanceToProfile = useCallback((profileId: string, instanceId: string) => {
    const profile = profileCache[profileId];
    if (profile) {
      console.log(`Added instance ${instanceId} to profile ${profileId}`);
      return profile;
    }
    return null;
  }, [profileCache]);
  
  // Memoize host list with useMemo to prevent re-renders
  const getAvailableHosts = useMemo((): Host[] => {
    return hosts.map(host => ({
      id: host.id,
      name: host.name,
      connectionStatus: host.connectionStatus || "disconnected",
      configStatus: (host.configStatus || "unconfigured") as "configured" | "misconfigured" | "unknown",
      icon: host.icon,
      profileId: host.profileId
    }));
  }, []);
  
  return {
    hostProfiles,
    allProfiles,
    handleProfileChange,
    getProfileById,
    addInstanceToProfile,
    getAvailableHosts
  };
}
