
import { useState } from "react";

interface ConfigDialogState {
  isOpen: boolean;
  hostId: string | null;
  configPath: string;
  configContent: string;
}

export function useConfigDialog(mockJsonConfig: any) {
  const [configDialog, setConfigDialog] = useState<ConfigDialogState>({
    isOpen: false,
    hostId: null,
    configPath: "",
    configContent: "",
  });
  
  const openConfigDialog = (hostId: string, configPath: string) => {
    setConfigDialog({
      isOpen: true,
      hostId,
      configPath,
      configContent: JSON.stringify(mockJsonConfig, null, 2),
    });
  };
  
  const closeConfigDialog = () => {
    setConfigDialog(prev => ({ ...prev, isOpen: false }));
  };
  
  const setDialogOpen = (isOpen: boolean) => {
    setConfigDialog(prev => ({ ...prev, isOpen }));
  };
  
  return {
    configDialog,
    openConfigDialog,
    closeConfigDialog,
    setDialogOpen
  };
}
