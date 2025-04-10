
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

const multipleServicesConfig = `{
  "mcpServers": {
    "mcpnow": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/mcpnow",
        "http://localhost:8008/mcp"
      ]
    },
    "mcppy": {
      "command": "python",
      "args": [
        "-m",
        "mcp.cli",
        "--port",
        "8009"
      ]
    },
    "mcpjava": {
      "command": "java",
      "args": [
        "-jar",
        "mcp-server.jar",
        "--config",
        "config.json"
      ]
    }
  }
}`;

export function useConfigDialog() {
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
      configContent: multipleServicesConfig,
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
