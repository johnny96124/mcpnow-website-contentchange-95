
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
  const mockJsonConfig = {
    "mcpServers": {
      "mcpnow": {
        "command": "npx",
        "args": [
          "-y",
          "@modelcontextprotocol/mcpnow",
          "http://localhost:8008/mcp"
        ]
      },
      "mcpOpenAI": {
        "command": "npx",
        "args": [
          "@openai/api",
          "--api-key",
          "${OPENAI_API_KEY}",
          "--model",
          "gpt-4"
        ]
      },
      "mcpLocalLLM": {
        "command": "python",
        "args": [
          "-m",
          "llm_server",
          "--model",
          "mixtral-8x7b",
          "--port",
          "8010"
        ],
        "env": {
          "CUDA_VISIBLE_DEVICES": "0"
        }
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
