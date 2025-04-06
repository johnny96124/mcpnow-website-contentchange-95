
import { createContext, useContext, useState, ReactNode } from "react";
import { ServerDefinition } from "@/data/mockData";

interface ServerContextType {
  showAddInstanceDialog: boolean;
  selectedServer: ServerDefinition | null;
  openAddInstanceDialog: (server: ServerDefinition) => void;
  closeAddInstanceDialog: () => void;
}

const ServerContext = createContext<ServerContextType | undefined>(undefined);

export function ServerProvider({ children }: { children: ReactNode }) {
  const [showAddInstanceDialog, setShowAddInstanceDialog] = useState(false);
  const [selectedServer, setSelectedServer] = useState<ServerDefinition | null>(null);

  const openAddInstanceDialog = (server: ServerDefinition) => {
    setSelectedServer(server);
    setShowAddInstanceDialog(true);
  };

  const closeAddInstanceDialog = () => {
    setShowAddInstanceDialog(false);
  };

  return (
    <ServerContext.Provider
      value={{
        showAddInstanceDialog,
        selectedServer,
        openAddInstanceDialog,
        closeAddInstanceDialog
      }}
    >
      {children}
    </ServerContext.Provider>
  );
}

export function useServerContext() {
  const context = useContext(ServerContext);
  if (context === undefined) {
    throw new Error("useServerContext must be used within a ServerProvider");
  }
  return context;
}
