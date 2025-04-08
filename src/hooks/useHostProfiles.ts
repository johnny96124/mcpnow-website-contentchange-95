
import { useState } from "react";
import { hosts } from "@/data/mockData";

export interface ProfileReference {
  id: string;
  name: string;
}

export function useHostProfiles() {
  const [hostProfiles, setHostProfiles] = useState(
    hosts.reduce((acc, host) => {
      acc[host.id] = host.profileId || "";
      return acc;
    }, {} as Record<string, string>)
  );
  
  // Map to track which profiles are using which server instances
  const [instanceProfiles, setInstanceProfiles] = useState<Record<string, ProfileReference[]>>({
    "instance-1": [
      { id: "profile-1", name: "General Development" },
      { id: "profile-2", name: "Research" }
    ],
    "instance-2": [
      { id: "profile-3", name: "Testing" }
    ],
    "instance-3": [],
    "instance-4": [
      { id: "profile-4", name: "Production" }, 
      { id: "profile-2", name: "Research" }
    ],
    "instance-5": []
  });
  
  const handleProfileChange = (hostId: string, profileId: string) => {
    setHostProfiles(prev => ({
      ...prev,
      [hostId]: profileId
    }));
  };
  
  const addProfileToInstance = (instanceId: string, profile: ProfileReference) => {
    setInstanceProfiles(prev => {
      const currentProfiles = prev[instanceId] || [];
      // Check if profile is already associated with this instance
      if (!currentProfiles.some(p => p.id === profile.id)) {
        return {
          ...prev,
          [instanceId]: [...currentProfiles, profile]
        };
      }
      return prev;
    });
  };
  
  const removeProfileFromInstance = (instanceId: string, profileId: string) => {
    setInstanceProfiles(prev => {
      const currentProfiles = prev[instanceId] || [];
      return {
        ...prev,
        [instanceId]: currentProfiles.filter(p => p.id !== profileId)
      };
    });
  };
  
  return {
    hostProfiles,
    instanceProfiles,
    handleProfileChange,
    addProfileToInstance,
    removeProfileFromInstance
  };
}
