
import { useState } from "react";

interface ConfigDialogState {
  isOpen: boolean;
  hostId: string | null;
  configPath: string;
  configContent: string;
  profileEndpoint?: string;
  needsUpdate?: boolean;
  allowPathEdit?: boolean; // Added property for path editing
}

export function useConfigDialog(mockJsonConfig: any) {
  const [configDialog, setConfigDialog] = useState<ConfigDialogState>({
    isOpen: false,
    hostId: null,
    configPath: "",
    configContent: "",
    allowPathEdit: false
  });
  
  const openConfigDialog = (
    hostId: string, 
    configPath: string, 
    profileEndpoint?: string, 
    needsUpdate?: boolean,
    allowPathEdit?: boolean
  ) => {
    setConfigDialog({
      isOpen: true,
      hostId,
      configPath,
      configContent: JSON.stringify(mockJsonConfig, null, 2),
      profileEndpoint,
      needsUpdate,
      allowPathEdit
    });
  };
  
  const closeConfigDialog = () => {
    setConfigDialog(prev => ({ ...prev, isOpen: false }));
  };
  
  const setDialogOpen = (isOpen: boolean) => {
    setConfigDialog(prev => ({ ...prev, isOpen }));
  };
  
  const updateConfigPath = (newPath: string) => {
    setConfigDialog(prev => ({ ...prev, configPath: newPath }));
  };
  
  const resetConfigDialog = () => {
    setConfigDialog({
      isOpen: false,
      hostId: null,
      configPath: "",
      configContent: "",
      allowPathEdit: false
    });
  };
  
  return {
    configDialog,
    openConfigDialog,
    closeConfigDialog,
    setDialogOpen,
    updateConfigPath,
    resetConfigDialog
  };
}
