
import { useState, useEffect } from "react";
import { useHostProfiles } from "@/hooks/useHostProfiles";
import { ConfigFileDialog } from "@/components/hosts/ConfigFileDialog";
import { UnifiedHostDialog } from "@/components/hosts/UnifiedHostDialog";
import { Button } from "@/components/ui/button";
import { HostCard } from "@/components/hosts/HostCard";
import { HostSearch } from "@/components/hosts/HostSearch";
import { Plus, RefreshCw } from "lucide-react";
import { hosts } from "@/data/mockData";
import { ServerSelectionDialog } from "@/components/hosts/newlayout/ServerSelectionDialog";
import { ProfileSelectorDropdown } from "@/components/hosts/newlayout/ProfileSelectorDropdown";
import { ConnectedServersList } from "@/components/hosts/newlayout/ConnectedServersList";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function HostsNewLayout() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showHostDialog, setShowHostDialog] = useState<boolean>(false);
  const [showConfigFileDialog, setShowConfigFileDialog] = useState<boolean>(false);
  const [selectedHost, setSelectedHost] = useState<any>(null);
  const [configFilePath, setConfigFilePath] = useState<string>("");
  const [hostList, setHostList] = useState(hosts);
  const [showServerSelectionDialog, setShowServerSelectionDialog] = useState<boolean>(false);
  const [selectedProfile, setSelectedProfile] = useState<string>("");
  const [configContent, setConfigContent] = useState<string>("");
  const navigate = useNavigate();
  
  const { 
    hostProfiles, 
    allProfiles, 
    handleProfileChange,
    getProfileById
  } = useHostProfiles();

  useEffect(() => {
    if (selectedHost && selectedHost.id) {
      const profileId = hostProfiles[selectedHost.id] || "";
      setSelectedProfile(profileId);
    }
  }, [selectedHost, hostProfiles]);

  const filteredHosts = hostList.filter(host => 
    host.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddHosts = (newHosts: any[]) => {
    const updatedHosts = [...hostList, ...newHosts];
    setHostList(updatedHosts);
    
    // Auto-select the first host that was added
    if (newHosts.length > 0) {
      setSelectedHost(newHosts[0]);
      setConfigFilePath(newHosts[0].configPath || "");
      
      // Create a default profile for the new host
      const randomId = `profile-${Date.now()}`;
      const newProfile = {
        id: randomId,
        name: `${newHosts[0].name} Profile`,
        endpointType: "HTTP_SSE",
        enabled: true,
        endpoint: "",
        instances: []
      };
      
      // In a real app this would call an API to create the profile
      console.log("Auto-created profile:", newProfile);
      
      toast.success(`Host "${newHosts[0].name}" added successfully`);
      toast.success(`Profile for "${newHosts[0].name}" created automatically`);
    }
  };

  const handleHostSelect = (host: any) => {
    setSelectedHost(host);
    setConfigFilePath(host.configPath || "");
  };

  const handleShowConfigFile = (host: any) => {
    setSelectedHost(host);
    setConfigFilePath(host.configPath || "");
    
    // Generate a sample config content for demonstration
    const sampleConfig = JSON.stringify({
      "mcpServers": {
        "mcpnow": {
          "command": "npx",
          "args": ["-y", "@modelcontextprotocol/mcpnow", "http://localhost:8008/mcp"]
        }
      }
    }, null, 2);
    
    setConfigContent(sampleConfig);
    setShowConfigFileDialog(true);
  };

  const handleAddServer = () => {
    if (!selectedHost) {
      toast.error("Please select a host first");
      return;
    }
    
    setShowServerSelectionDialog(true);
  };
  
  const handleSaveConfig = (config: string, path: string) => {
    console.log("Saving config:", config, "to path:", path);
    toast.success("Configuration saved successfully");
    setShowConfigFileDialog(false);
  };
  
  // Get the current profile based on selected host
  const currentProfile = selectedHost && hostProfiles[selectedHost.id] 
    ? getProfileById(hostProfiles[selectedHost.id])
    : null;

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Hosts</h1>
      
      <div className="grid grid-cols-12 gap-6">
        {/* Left sidebar - Host management */}
        <div className="col-span-12 md:col-span-4 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Host List</h2>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setHostList([...hosts])}
                className="flex items-center gap-1"
              >
                <RefreshCw className="h-4 w-4" />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={() => setShowHostDialog(true)} 
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Host</span>
              </Button>
            </div>
          </div>
          
          <HostSearch 
            value={searchTerm} 
            onChange={setSearchTerm} 
          />
          
          <div className="space-y-3 max-h-[500px] overflow-auto pr-2">
            {filteredHosts.length === 0 ? (
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <p className="text-muted-foreground">No hosts found</p>
              </div>
            ) : (
              filteredHosts.map((host) => (
                <HostCard 
                  key={host.id} 
                  host={host} 
                  selected={selectedHost?.id === host.id}
                  onSelect={() => handleHostSelect(host)}
                  onConfigView={() => handleShowConfigFile(host)}
                />
              ))
            )}
          </div>
        </div>
        
        {/* Right side - Server management */}
        <div className="col-span-12 md:col-span-8 space-y-6">
          {selectedHost ? (
            <>
              <div className="bg-muted/20 p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{selectedHost.icon || '🖥️'}</span>
                    <h2 className="text-lg font-medium">{selectedHost.name}</h2>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowConfigFileDialog(true)}
                  >
                    View Config
                  </Button>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <div>Config Path: <span className="font-mono text-foreground/90">{selectedHost.configPath || "Not set"}</span></div>
                  <div>Status: <span className={selectedHost.connectionStatus === "connected" ? "text-green-600" : "text-amber-600"}>
                    {(selectedHost.connectionStatus || "unknown").charAt(0).toUpperCase() + (selectedHost.connectionStatus || "unknown").slice(1)}
                  </span></div>
                </div>
              </div>
            
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold">Connected Servers</h2>
                    <ProfileSelectorDropdown 
                      hostId={selectedHost.id}
                      profileId={selectedProfile}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <Button 
                    onClick={handleAddServer}
                    disabled={!selectedHost}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Server
                  </Button>
                </div>
                
                <ConnectedServersList 
                  profile={currentProfile} 
                  hostStatus={selectedHost.connectionStatus || "disconnected"}
                />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center bg-muted/20 border rounded-lg p-12 h-[400px]">
              <div className="text-6xl mb-4">🖥️</div>
              <h3 className="text-xl font-medium mb-2">Select a Host</h3>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                Select a host from the list or add a new one to manage connected servers
              </p>
              <Button onClick={() => setShowHostDialog(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add New Host
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Dialogs */}
      <UnifiedHostDialog 
        open={showHostDialog} 
        onOpenChange={setShowHostDialog} 
        onAddHosts={handleAddHosts}
      />
      
      {selectedHost && (
        <ConfigFileDialog
          open={showConfigFileDialog}
          onOpenChange={setShowConfigFileDialog}
          configPath={configFilePath}
          initialConfig={configContent}
          onSave={handleSaveConfig}
        />
      )}
      
      <ServerSelectionDialog
        open={showServerSelectionDialog}
        onOpenChange={setShowServerSelectionDialog}
        hostId={selectedHost?.id}
        profileId={selectedProfile}
      />
    </div>
  );
}
