
import React, { useState, useEffect } from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/new-layout/columns";
import { profiles as mockProfiles, serverInstances as mockServers, ServerInstance } from "@/data/mockData";
import { ServerDetails } from "@/components/new-layout/ServerDetails";
import { DebugDialog } from "@/components/new-layout/DebugDialog";
import { HistoryDialog } from "@/components/new-layout/HistoryDialog";

const NewLayout = () => {
  const [profiles, setProfiles] = useState(mockProfiles);
  const [servers, setServers] = useState(mockServers);
  const [selectedServer, setSelectedServer] = useState<ServerInstance | null>(null);
  const [showServerDetails, setShowServerDetails] = useState(false);
  const [showDebugDialog, setShowDebugDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching data from an API
    setTimeout(() => {
      setProfiles(mockProfiles);
      setServers(mockServers);
    }, 500);
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
      default:
        break;
    }
  };

  const handleNameClick = (server: ServerInstance) => {
    setSelectedServer(server);
    setShowServerDetails(true);
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
        columns={columns(handleServerAction, handleNameClick)} 
        data={servers} 
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
