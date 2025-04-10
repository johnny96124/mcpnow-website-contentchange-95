
import { useState } from "react";

interface ConfigDialogState {
  isOpen: boolean;
  hostId: string | null;
  configPath: string;
  configContent: string;
  profileEndpoint?: string;
  needsUpdate?: boolean;
  allowPathEdit?: boolean;
  isViewOnly?: boolean;
  isFixMode?: boolean;
  isUpdateMode?: boolean;
}

export function useConfigDialog(mockJsonConfig: any) {
  const [configDialog, setConfigDialog] = useState<ConfigDialogState>({
    isOpen: false,
    hostId: null,
    configPath: "",
    configContent: "",
    allowPathEdit: false,
    isViewOnly: false,
    isFixMode: false,
    isUpdateMode: false
  });
  
  const openConfigDialog = (
    hostId: string, 
    configPath: string, 
    profileEndpoint?: string, 
    needsUpdate?: boolean,
    allowPathEdit?: boolean,
    isViewOnly?: boolean,
    isFixMode?: boolean,
    isUpdateMode?: boolean
  ) => {
    setConfigDialog({
      isOpen: true,
      hostId,
      configPath,
      configContent: JSON.stringify(mockJsonConfig, null, 2),
      profileEndpoint,
      needsUpdate,
      allowPathEdit,
      isViewOnly,
      isFixMode,
      isUpdateMode
    });
  };
  
  const closeConfigDialog = () => {
    setConfigDialog(prev => ({ ...prev, isOpen: false }));
  };
  
  const setDialogOpen = (isOpen: boolean) => {
    setConfigDialog(prev => ({ ...prev, isOpen }));
  };
  
  const resetConfigDialog = () => {
    setConfigDialog({
      isOpen: false,
      hostId: null,
      configPath: "",
      configContent: "",
      allowPathEdit: false,
      isViewOnly: false,
      isFixMode: false,
      isUpdateMode: false
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
