
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

export function useConfigDialog() {
  // Sample config with multiple MCP services
  const mockJsonConfig = {
    "mcpServers": {
      "filesystem": {
        "command": "npx",
        "args": [
          "-y",
          "@modelcontextprotocol/server-filesystem",
          "/Users/username/Desktop",
          "/path/to/other/allowed/dir"
        ]
      },
      "database": {
        "command": "npx",
        "args": [
          "-y",
          "@modelcontextprotocol/server-database",
          "--host",
          "localhost",
          "--port",
          "5432",
          "--username",
          "admin",
          "--password",
          "password123"
        ]
      },
      "mcpnow": {
        "command": "npx",
        "args": [
          "-y",
          "@modelcontextprotocol/server-network",
          "--listen",
          "0.0.0.0:8080",
          "--protocol",
          "http",
          "--timeout",
          "30000"
        ]
      }
    }
  };
  
  const [configDialog, setConfigDialog] = useState<ConfigDialogState>({
    isOpen: false,
    hostId: null,
    configPath: "",
    configContent: JSON.stringify(mockJsonConfig, null, 2),
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
      configContent: JSON.stringify(mockJsonConfig, null, 2),
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
