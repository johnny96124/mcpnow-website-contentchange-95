
import { useState } from "react";
import { hosts } from "@/data/mockData";

export function useHostProfiles() {
  const [hostProfiles, setHostProfiles] = useState(
    hosts.reduce((acc, host) => {
      acc[host.id] = host.profileId || "";
      return acc;
    }, {} as Record<string, string>)
  );
  
  const handleProfileChange = (hostId: string, profileId: string) => {
    setHostProfiles(prev => ({
      ...prev,
      [hostId]: profileId
    }));
  };
  
  return {
    hostProfiles,
    handleProfileChange
  };
}
