
import { useState, useEffect } from "react";
import { PlusCircle, Search, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { hosts, Host } from "@/data/mockData";
import { ConfigFileDialog } from "@/components/hosts/ConfigFileDialog";
import { useToast } from "@/hooks/use-toast";
import { HostCard } from "@/components/hosts/HostCard";
import { HostSearch } from "@/components/hosts/HostSearch";
import { NoSearchResults } from "@/components/hosts/NoSearchResults";
import { useConfigDialog } from "@/hooks/useConfigDialog";
import { markHostsOnboardingAsSeen } from "@/utils/localStorage";
import { AddServerToHostDialog } from "@/components/hosts/AddServerToHostDialog";

const mockJsonConfig = {
  "mcpServers": {
    "mcpnow": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/mcpnow", "http://localhost:8008/mcp"]
    }
  }
};

const Hosts = () => {
  useEffect(() => {
    markHostsOnboardingAsSeen();
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [hostsList, setHostsList] = useState<Host[]>(hosts);
  const [isScanning, setIsScanning] = useState(false);
  const [showHostRefreshHint, setShowHostRefreshHint] = useState(false);
  const [selectedHost, setSelectedHost] = useState<string | null>(null);
  const [addServerDialogOpen, setAddServerDialogOpen] = useState(false);

  const {
    configDialog,
    openConfigDialog,
    setDialogOpen,
    resetConfigDialog
  } = useConfigDialog(mockJsonConfig);

  const { toast } = useToast();

  const filteredHosts = hostsList.filter(host => 
    host.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddServersToHost = (serverIds: string[]) => {
    if (!selectedHost) return;

    setHostsList(prev => prev.map(host => {
      if (host.id === selectedHost) {
        // Create a servers property if it doesn't exist
        const currentServers = host.servers || [];
        return {
          ...host,
          servers: [...currentServers, ...serverIds]
        };
      }
      return host;
    }));

    toast({
      title: "Servers added",
      description: `${serverIds.length} server${serverIds.length > 1 ? 's' : ''} added to host successfully`
    });
  };

  const handleOpenServerDialog = (hostId: string) => {
    setSelectedHost(hostId);
    setAddServerDialogOpen(true);
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

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hosts</h1>
          <p className="text-muted-foreground">
            Manage host connections and server assignments
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleScanForHosts} disabled={isScanning}>
            {isScanning ? <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Scanning...
            </> : <>
              <Search className="h-4 w-4 mr-2" />
              Scan for Hosts
            </>}
          </Button>
        </div>
      </div>
      
      <HostSearch searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      {filteredHosts.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredHosts.map(host => (
            <HostCard 
              key={host.id} 
              host={host}
              profileId={host.profileId || ""}
              onAddServer={() => handleOpenServerDialog(host.id)}
              showHostRefreshHint={showHostRefreshHint}
              onProfileChange={(hostId, profileId) => {
                setHostsList(prev => prev.map(h => 
                  h.id === hostId ? { ...h, profileId } : h
                ));
              }}
              onOpenConfigDialog={(hostId) => {
                // Adjust the call to openConfigDialog to only pass the required argument
                openConfigDialog(
                  hostId, 
                  hostsList.find(h => h.id === hostId)?.configPath || "",
                  undefined, // profileEndpoint
                  false, // needsUpdate
                  false, // allowPathEdit
                  true, // isViewOnly
                  false, // isFixMode
                  false, // isUpdateMode
                  false // isCreateMode
                );
              }}
              onCreateConfig={(hostId, profileId) => {
                // Simulation of creating config
                setHostsList(prev => prev.map(h => 
                  h.id === hostId ? { 
                    ...h, 
                    configStatus: 'configured',
                    configPath: `/path/to/${h.name.toLowerCase()}/config.json` 
                  } : h
                ));
                toast({
                  title: "Configuration created",
                  description: "New configuration file has been created"
                });
              }}
              onFixConfig={(hostId) => {
                // Simulation of fixing config
                setHostsList(prev => prev.map(h => 
                  h.id === hostId ? { 
                    ...h, 
                    configStatus: 'configured',
                    connectionStatus: 'connected'
                  } : h
                ));
                toast({
                  title: "Configuration fixed",
                  description: "Host configuration has been fixed"
                });
              }}
            />
          ))}
        </div>
      ) : (
        searchQuery && <NoSearchResults query={searchQuery} onClear={() => setSearchQuery("")} />
      )}
      
      <ConfigFileDialog 
        open={configDialog.isOpen} 
        onOpenChange={setDialogOpen}
        configPath={configDialog.configPath}
        initialConfig={configDialog.configContent}
        onSave={handleUpdateConfig}
        profileEndpoint={configDialog.profileEndpoint}
        needsUpdate={configDialog.needsUpdate}
        allowPathEdit={configDialog.allowPathEdit}
        isViewOnly={configDialog.isViewOnly}
        isFixMode={configDialog.isFixMode}
        isUpdateMode={configDialog.isUpdateMode}
        isCreateMode={configDialog.isCreateMode}
      />
      
      <AddServerToHostDialog
        open={addServerDialogOpen}
        onOpenChange={setAddServerDialogOpen}
        onAddServers={handleAddServersToHost}
      />
    </div>
  );
};

export default Hosts;
