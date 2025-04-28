import React, { useState, useEffect } from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { DataTable } from "@/components/ui/data-table"
import { columns } from "@/components/new-layout/columns"
import { profiles as mockProfiles, serverInstances as mockServers, ServerInstance, Profile } from "@/data/mockData";
import { ServerDetails } from "@/components/new-layout/ServerDetails";
import { DebugDialog } from "@/components/new-layout/DebugDialog";
import { HistoryDialog } from "@/components/new-layout/HistoryDialog";
import { AddServerToHostDialog } from "@/components/new-layout/AddServerToHostDialog";

const NewLayout = () => {
  const [profiles, setProfiles] = useState<Profile[]>(mockProfiles);
  const [servers, setServers] = useState<ServerInstance[]>(mockServers);
  const [selectedServer, setSelectedServer] = useState<ServerInstance | null>(null);
  const [showServerDetails, setShowServerDetails] = useState(false);
  const [showDebugDialog, setShowDebugDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [showAddToProfilesDialog, setShowAddToProfilesDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching data from an API
    setTimeout(() => {
      setProfiles(mockProfiles);
      setServers(mockServers);
    }, 500);
  }, []);

  const handleServerAction = (action: string, server: ServerInstance) => {
    switch (action) {
      case 'profiles':
        setSelectedServer(server);
        setShowAddToProfilesDialog(true);
        break;
      case 'details':
        setSelectedServer(server);
        setShowServerDetails(true);
        break;
      case 'debug':
        setSelectedServer(server);
        setShowDebugDialog(true);
        break;
      case 'history':
        setSelectedServer(server);
        setShowHistoryDialog(true);
        break;
      default:
        break;
    }
  };

  const handleStatusChange = (serverId: string, status: 'running' | 'stopped' | 'error' | 'connecting') => {
    setServers(prevServers =>
      prevServers.map(server =>
        server.id === serverId ? { ...server, status } : server
      )
    );
  };

  const handleDeleteServer = (id: string) => {
    setServers(servers.filter((server) => server.id !== id));
    toast({
      title: "Server deleted",
      description: "Server has been deleted successfully",
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
        columns={columns(handleServerAction)} 
        data={servers} 
      />

      <AddServerToHostDialog
        open={showAddToProfilesDialog}
        onOpenChange={setShowAddToProfilesDialog}
        profiles={profiles}
        onAddToProfiles={(profileIds) => {
          // Handle adding server to multiple profiles
          profileIds.forEach(profileId => {
            const profile = profiles.find(p => p.id === profileId);
            if (profile && selectedServer) {
              // Add server to each selected profile
              profile.instances = [...profile.instances, selectedServer.id];
            }
          });
          setShowAddToProfilesDialog(false);
          toast({
            title: "Server added to profiles",
            description: `Server has been added to ${profileIds.length} profile${profileIds.length > 1 ? 's' : ''}`,
          });
        }}
      />

      <ServerDetails
        open={showServerDetails}
        onOpenChange={setShowServerDetails}
        server={selectedServer}
        onDelete={handleDeleteServer}
        onStatusChange={handleStatusChange}
      />

      <DebugDialog
        open={showDebugDialog}
        onOpenChange={setShowDebugDialog}
        server={selectedServer}
      />

      <HistoryDialog
        open={showHistoryDialog}
        onOpenChange={setShowHistoryDialog}
        server={selectedServer}
      />
    </div>
  );
};

export default NewLayout;
