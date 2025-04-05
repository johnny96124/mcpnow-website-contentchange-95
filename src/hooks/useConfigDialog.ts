
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
    setConfigDialog(prev => ({ ...prev, isOpen: false }));
  };
  
  const setDialogOpen = (isOpen: boolean) => {
    // If dialog is being closed, fully reset the state
    if (!isOpen) {
      setConfigDialog(prev => ({ 
        ...prev, 
        isOpen: false,
        // Don't reset hostId and other properties immediately to allow for transitions
      }));
    } else {
      setConfigDialog(prev => ({ ...prev, isOpen }));
    }
  };
  
  // Add a function to completely reset the dialog state
  const resetConfigDialog = () => {
    setConfigDialog({
      isOpen: false,
      hostId: null,
      configPath: "",
      configContent: "",
      profileEndpoint: undefined,
      needsUpdate: undefined
    });
  };
  
  return {
    configDialog,
    openConfigDialog,
    closeConfigDialog,
    setDialogOpen,
    resetConfigDialog
  };
}
