
import { useState, useEffect, useCallback, useMemo } from "react";
import { hosts, profiles, type Profile } from "@/data/mockData";

export function useHostProfiles() {
  // Use memoization for the initial state to avoid unnecessary recalculations
  const initialHostProfiles = useMemo(() => {
    return hosts.reduce((acc, host) => {
      acc[host.id] = host.profileId || "";
      return acc;
    }, {} as Record<string, string>);
  }, []);
  
  const [hostProfiles, setHostProfiles] = useState(initialHostProfiles);
  
  // Use memoization for the profile cache to avoid unnecessary recalculations
  const initialProfileCache = useMemo(() => {
    return profiles.reduce((acc, profile) => {
      acc[profile.id] = profile;
      return acc;
    }, {} as Record<string, Profile>);
  }, []);
  
  const [profileCache, setProfileCache] = useState<Record<string, Profile | null>>(initialProfileCache);
  
  // Use memoized callback for better performance
  const getProfileById = useCallback((profileId: string): Profile | null => {
    return profileCache[profileId] || null;
  }, [profileCache]);
  
  // Use memoized callback for better performance
  const handleProfileChange = useCallback((hostId: string, profileId: string) => {
    setHostProfiles(prev => ({
      ...prev,
      [hostId]: profileId
    }));
  }, []);
  
  return {
    hostProfiles,
    handleProfileChange,
    getProfileById
  };
}
