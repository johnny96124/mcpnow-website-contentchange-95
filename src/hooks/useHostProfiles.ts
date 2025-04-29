
import { useState, useEffect, useCallback } from "react";
import { hosts, profiles, type Profile, type Host, type ConnectionStatus } from "@/data/mockData";

export function useHostProfiles() {
  const [hostProfiles, setHostProfiles] = useState(
    hosts.reduce((acc, host) => {
      acc[host.id] = host.profileId || "";
      return acc;
    }, {} as Record<string, string>)
  );
  
  const [profileCache, setProfileCache] = useState<Record<string, Profile | null>>({});
  const [allProfiles, setAllProfiles] = useState<Profile[]>([]);
  
  useEffect(() => {
    const initialCache = profiles.reduce((acc, profile) => {
      acc[profile.id] = profile;
      return acc;
    }, {} as Record<string, Profile>);
    
    setProfileCache(initialCache);
    setAllProfiles(profiles);
  }, []);
  
  const getProfileById = useCallback((profileId: string): Profile | null => {
    return profileCache[profileId] || null;
  }, [profileCache]);
  
  const handleProfileChange = useCallback((hostId: string, profileId: string) => {
    setHostProfiles(prev => ({
      ...prev,
      [hostId]: profileId
    }));
  }, []);

  const addInstanceToProfile = useCallback((profileId: string, instanceId: string) => {
    // Find the profile and add the instance to it
    const profile = getProfileById(profileId);
    if (profile) {
      // In a real app, this would make an API call to update the profile
      // For this demo, we'll just update the local cache
      console.log(`Added instance ${instanceId} to profile ${profileId}`);
      return profile;
    }
    return null;
  }, [getProfileById]);
  
  const getAvailableHosts = useCallback((): Host[] => {
    // Map hosts to include all required properties with proper typing
    return hosts.map(host => ({
      id: host.id,
      name: host.name,
      connectionStatus: host.connectionStatus || "disconnected",
      configStatus: (host.configStatus || "unconfigured") as "configured" | "misconfigured" | "unknown",
      icon: host.icon,
      profileId: host.profileId,
      status: host.status || "disconnected" // Adding the missing status property
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
