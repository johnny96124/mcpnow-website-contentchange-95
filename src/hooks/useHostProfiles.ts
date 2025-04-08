
import { useState, useEffect } from "react";
import { hosts, profiles, type Profile } from "@/data/mockData";

export function useHostProfiles() {
  const [hostProfiles, setHostProfiles] = useState(
    hosts.reduce((acc, host) => {
      acc[host.id] = host.profileId || "";
      return acc;
    }, {} as Record<string, string>)
  );
  
  const [profileCache, setProfileCache] = useState<Record<string, Profile | null>>({});
  
  useEffect(() => {
    const initialCache = profiles.reduce((acc, profile) => {
      acc[profile.id] = profile;
      return acc;
    }, {} as Record<string, Profile>);
    
    setProfileCache(initialCache);
  }, []);
  
  const getProfileById = (profileId: string): Profile | null => {
    return profileCache[profileId] || null;
  };
  
  const handleProfileChange = (hostId: string, profileId: string) => {
    setHostProfiles(prev => ({
      ...prev,
      [hostId]: profileId
    }));
  };
  
  return {
    hostProfiles,
    handleProfileChange,
    getProfileById
  };
}
