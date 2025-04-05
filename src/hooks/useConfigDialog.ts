
import { useState } from "react";

interface ConfigDialogState {
  isOpen: boolean;
  hostId: string | null;
  configPath: string;
  configContent: string;
  profileEndpoint?: string;
  needsUpdate?: boolean;
}

export function useConfigDialog(mockJsonConfig: any) {
  const [configDialog, setConfigDialog] = useState<ConfigDialogState>({
    isOpen: false,
    hostId: null,
    configPath: "",
    configContent: "",
  });
  
  const openConfigDialog = (hostId: string, configPath: string, profileEndpoint?: string, needsUpdate?: boolean) => {
    setConfigDialog({
      isOpen: true,
      hostId,
      configPath,
      configContent: JSON.stringify(mockJsonConfig, null, 2),
      profileEndpoint,
      needsUpdate
    });
  };
  
  const closeConfigDialog = () => {
    setConfigDialog(prev => ({ 
      ...prev, 
      isOpen: false,
      hostId: null 
    }));
  };
  
  const setDialogOpen = (isOpen: boolean) => {
    if (!isOpen) {
      // When closing dialog, reset all state
      closeConfigDialog();
    } else {
      setConfigDialog(prev => ({ ...prev, isOpen }));
    }
  };
  
  return {
    configDialog,
    openConfigDialog,
    closeConfigDialog,
    setDialogOpen
  };
}
