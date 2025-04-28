
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/new-layout/columns";
import { profiles as mockProfiles, serverInstances as mockServers } from "@/data/mockData";
import { ServerDetails } from "@/components/new-layout/ServerDetails";
import { ServerDebugDialog } from "@/components/new-layout/ServerDebugDialog";
import { ServerHistoryDialog } from "@/components/new-layout/ServerHistoryDialog";
import { ServerInstance } from "@/data/mockData.d"; // Import the type

const NewLayout = () => {
  const [profiles, setProfiles] = useState(mockProfiles);
  const [servers, setServers] = useState(mockServers);
  const [selectedServer, setSelectedServer] = useState<ServerInstance | null>(null);
  const [showServerDetails, setShowServerDetails] = useState(false);
  const [showDebugDialog, setShowDebugDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [serverProfiles, setServerProfiles] = useState<Record<string, string[]>>({});

  const { toast } = useToast();

  useEffect(() => {
    // Initialize serverProfiles from mockData
    const initialServerProfiles: Record<string, string[]> = {};
    mockServers.forEach(server => {
      initialServerProfiles[server.id] = [];
    });
    setServerProfiles(initialServerProfiles);
  }, []);

  const handleServerAction = (action: string, server: ServerInstance) => {
    setSelectedServer(server);
    switch (action) {
      case 'debug':
        setShowDebugDialog(true);
        break;
      case 'history':
        setShowHistoryDialog(true);
        break;
      case 'details':
        setShowServerDetails(true);
        break;
    }
  };

  const handleAddToProfiles = (serverId: string, profileIds: string[]) => {
    setServerProfiles(prev => ({
      ...prev,
      [serverId]: profileIds
    }));

    toast({
      title: "Profiles updated",
      description: `Server profiles have been updated successfully`
    });
  };

  // Fix the status type to use the correct union type
  const handleStatusChange = (serverId: string, status: 'running' | 'stopped' | 'connecting' | 'error') => {
    setServers(prevServers =>
      prevServers.map(server =>
        server.id === serverId
          ? { ...server, status }
          : server
      )
    );
  };

  const handleDeleteServer = (id: string) => {
    setServers(servers.filter(server => server.id !== id));
    setServerProfiles(prev => {
      const newProfiles = { ...prev };
      delete newProfiles[id];
      return newProfiles;
    });
    toast({
      title: "Server deleted",
      description: "Server has been deleted successfully"
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Servers</h1>
          <p className="text-muted-foreground">Manage your servers and instances</p>
        </div>
        <Button>Add Server</Button>
      </div>

      <DataTable
        columns={columns(handleServerAction, profiles, handleAddToProfiles, serverProfiles)}
        data={servers}
      />

      <ServerDetails
        open={showServerDetails}
        onOpenChange={setShowServerDetails}
        server={selectedServer}
        onDelete={handleDeleteServer}
        onStatusChange={handleStatusChange}
      />

      <ServerDebugDialog
        open={showDebugDialog}
        onOpenChange={setShowDebugDialog}
        server={selectedServer}
      />

      <ServerHistoryDialog
        open={showHistoryDialog}
        onOpenChange={setShowHistoryDialog}
        server={selectedServer}
      />
    </div>
  );
};

export default NewLayout;
