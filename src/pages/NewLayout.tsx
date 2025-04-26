
import { useState } from "react";
import { PlusCircle, Search, RefreshCw, FileText, Info, ScanLine, ServerCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { hosts } from "@/data/mockData";
import { ConfigFileDialog } from "@/components/hosts/ConfigFileDialog";
import { useToast } from "@/hooks/use-toast";
import { HostCard } from "@/components/hosts/HostCard";
import { HostSearch } from "@/components/hosts/HostSearch";
import { NoSearchResults } from "@/components/hosts/NoSearchResults";
import { useConfigDialog } from "@/hooks/useConfigDialog";
import { useHostProfiles } from "@/hooks/useHostProfiles";
import { AddHostDialog } from "@/components/hosts/AddHostDialog";
import { ConnectionStatus, Host, profiles } from "@/data/mockData";
import { Skeleton } from "@/components/ui/skeleton";
import { markHostsOnboardingAsSeen } from "@/utils/localStorage";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

const NewLayout = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [hostsList, setHostsList] = useState<Host[]>(hosts);
  const [addHostDialogOpen, setAddHostDialogOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [showHostRefreshHint, setShowHostRefreshHint] = useState(false);
  const [hostToDelete, setHostToDelete] = useState<Host | null>(null);

  const {
    hostProfiles,
    handleProfileChange
  } = useHostProfiles();

  const {
    configDialog,
    openConfigDialog,
    setDialogOpen,
    resetConfigDialog
  } = useConfigDialog({
    "mcpServers": {
      "mcpnow": {
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/mcpnow", "http://localhost:8008/mcp"]
      }
    }
  });

  const {
    toast
  } = useToast();

  const filteredHosts = hostsList.filter(host => host.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const clearSearch = () => setSearchQuery("");

  const getProfileEndpoint = (profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    return profile ? profile.endpoint : null;
  };

  const handleOpenConfigDialog = (hostId: string) => {
    const host = hostsList.find(h => h.id === hostId);
    if (host && host.configPath) {
      const profileId = hostProfiles[host.id] || '';
      const profileEndpoint = getProfileEndpoint(profileId);
      openConfigDialog(hostId, host.configPath, profileEndpoint, false, false, true);
    } else {
      toast({
        title: "No config file",
        description: "This host doesn't have a configuration file yet. Please create a configuration first.",
        variant: "destructive"
      });
    }
  };

  const handleCreateConfigDialog = (hostId: string, profileId?: string) => {
    const host = hostsList.find(h => h.id === hostId);
    if (host) {
      const selectedProfileId = profileId || hostProfiles[host.id] || '';
      const profileEndpoint = getProfileEndpoint(selectedProfileId);
      const defaultConfigPath = `/Users/user/.mcp/hosts/${host.name.toLowerCase().replace(/\s+/g, '-')}.json`;
      openConfigDialog(hostId, defaultConfigPath, profileEndpoint, true, true, false, false, true, true);
    }
  };

  const handleUpdateConfigDialog = (hostId: string) => {
    const host = hostsList.find(h => h.id === hostId);
    if (host) {
      const profileId = hostProfiles[host.id] || '';
      const profileEndpoint = getProfileEndpoint(profileId);
      if (host.configPath) {
        openConfigDialog(hostId, host.configPath, profileEndpoint, true, false, false, false, true);
      } else {
        const defaultConfigPath = `/Users/user/.mcp/hosts/${host.name.toLowerCase().replace(/\s+/g, '-')}.json`;
        openConfigDialog(hostId, defaultConfigPath, profileEndpoint, true, true, false, false, true, false);
      }
    }
  };

  const handleScanForHosts = () => {
    setIsScanning(true);
    setTimeout(() => {
      const foundHost = Math.random() > 0.5;
      if (foundHost) {
        const newId = `host-${Date.now()}`;
        const newHost: Host = {
          id: newId,
          name: "Local Host",
          icon: "💻",
          connectionStatus: "disconnected",
          configStatus: "unknown"
        };
        setHostsList(prevHosts => [...prevHosts, newHost]);
        toast({
          title: "Host discovered",
          description: "A new local host has been found and added to your hosts list."
        });
        setTimeout(() => {
          toast({
            title: "Configure new host",
            description: "Configure this host to connect it with your profiles."
          });
        }, 500);
      } else {
        toast({
          title: "No hosts found",
          description: "No new hosts were discovered on your network.",
          variant: "destructive"
        });
      }
      setIsScanning(false);
    }, 2500);
  };

  const handleAddHost = (newHost: {
    name: string;
    configPath?: string;
    icon?: string;
    configStatus: "configured" | "misconfigured" | "unknown";
    connectionStatus: ConnectionStatus;
  }) => {
    const id = `host-${Date.now()}`;
    const host: Host = {
      id,
      ...newHost,
      connectionStatus: "disconnected"
    };
    setHostsList([...hostsList, host]);
    toast({
      title: "Host Added",
      description: `${newHost.name} has been added successfully`
    });
    setTimeout(() => {
      toast({
        title: "Configure new host",
        description: "Configure this host to connect it with your profiles."
      });
    }, 500);
  };

  const handleUpdateConfig = (config: string, configPath: string) => {
    if (configDialog.hostId) {
      setHostsList(prev => prev.map(host => host.id === configDialog.hostId ? {
        ...host,
        configPath,
        configStatus: 'configured',
        connectionStatus: 'connected'
      } : host));
      toast({
        title: "Configuration complete",
        description: "Now you can select a profile for this host to connect to."
      });
    }
    resetConfigDialog();
  };

  const handleDeleteHost = (host: Host) => {
    setHostToDelete(host);
  };

  const confirmDeleteHost = () => {
    if (hostToDelete) {
      setHostsList(prev => prev.filter(h => h.id !== hostToDelete.id));
      toast({
        title: "Host Deleted",
        description: `${hostToDelete.name} has been removed successfully`
      });
      setHostToDelete(null);
    }
  };

  return (
    <div>
      <div className="whitespace-nowrap flex items-center gap-1.5 relative">
        <button 
          className="whitespace-nowrap flex items-center gap-1.5 relative"
        >
          Button Content
        </button>
        <button 
          onClick={() => handleDeleteHost({id: '123', name: 'test', connectionStatus: 'disconnected', configStatus: 'unknown'})}
          className="absolute top-0 right-0 bg-destructive/10 hover:bg-destructive/20 rounded-full p-1 z-10"
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </button>
      </div>

      <AlertDialog open={!!hostToDelete} onOpenChange={() => setHostToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Host</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {hostToDelete?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteHost} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

// Add default export
export default NewLayout;
