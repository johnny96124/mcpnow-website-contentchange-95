import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/new-layout/columns";
import { profiles as mockProfiles, serverInstances as mockServers } from "@/data/mockData";
import { ServerDetails } from "@/components/new-layout/ServerDetails";
import { ServerDebugDialog } from "@/components/new-layout/ServerDebugDialog";
import { ServerHistoryDialog } from "@/components/new-layout/ServerHistoryDialog";
import { AddServerDialog } from "@/components/new-layout/AddServerDialog";
import { ServerInstance, Profile } from "@/data/mockData";
import { ProfileFilter } from "@/components/new-layout/ProfileFilter";
import { Plus } from "lucide-react";

const NewLayout = () => {
  const [profiles, setProfiles] = useState(mockProfiles);
  const [servers, setServers] = useState(mockServers);
  const [selectedServer, setSelectedServer] = useState<ServerInstance | null>(null);
  const [showServerDetails, setShowServerDetails] = useState(false);
  const [showDebugDialog, setShowDebugDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [showAddServerDialog, setShowAddServerDialog] = useState(false);
  const [serverProfiles, setServerProfiles] = useState<Record<string, string[]>>({});
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [showAddProfileDialog, setShowAddProfileDialog] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
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
      case 'addProfile':
        setShowAddProfileDialog(true);
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
      description: "Server profiles have been updated successfully"
    });
  };

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

  const handleAddServer = (newServer: ServerInstance) => {
    setServers(prev => [...prev, newServer]);
    setServerProfiles(prev => ({
      ...prev,
      [newServer.id]: []
    }));
    toast({
      title: "Server added",
      description: "New server has been added successfully"
    });
  };

  const filteredServers = selectedProfile
    ? servers.filter(server => serverProfiles[server.id]?.includes(selectedProfile))
    : servers;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Servers</h1>
          <p className="text-muted-foreground">Manage your servers and instances</p>
        </div>
        <div className="flex items-center gap-4">
          <ProfileFilter
            profiles={profiles}
            selectedProfile={selectedProfile}
            onSelectProfile={setSelectedProfile}
          />
          <Button onClick={() => setShowAddServerDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Server
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns(
          handleServerAction,
          profiles,
          handleAddToProfiles,
          serverProfiles,
          handleDeleteServer
        )}
        data={filteredServers}
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

      <AddServerDialog 
        open={showAddServerDialog}
        onOpenChange={setShowAddServerDialog}
        onAddServer={handleAddServer}
      />
    </div>
  );
};

export default NewLayout;
