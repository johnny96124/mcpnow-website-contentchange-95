
import { useState } from "react";
import { PlusCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { hosts } from "@/data/mockData";
import { ConfigFileDialog } from "@/components/hosts/ConfigFileDialog";
import { useToast } from "@/hooks/use-toast";
import { HostCard } from "@/components/hosts/HostCard";
import { HostSearch } from "@/components/hosts/HostSearch";
import { useConfigDialog } from "@/hooks/useConfigDialog";
import { useHostProfiles } from "@/hooks/useHostProfiles";

// Mock JSON config data
const mockJsonConfig = {
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": [
        "-y",
        "@smithery/cli@latest",
        "run",
        "@smithery-ai/postgres",
        "--config",
        "\"{\\\"postgresConnectionString\\\":\\\"postgresql://postgres:postgres@localhost:5432/cobo_dev?gssencmode=disable\\\"}\""
      ]
    },
    "sequential thinking": {
      "command": "npx",
      "args": [
        "-y",
        "@smithery/cli@latest",
        "run",
        "@smithery-ai/server-sequential-thinking",
        "--config",
        "\"{}\""
      ]
    },
    "weather": {
      "command": "node",
      "args": [
        "/Users/changhaojiang/tmp/mcp-node-server/build/index.js"
      ], 
      "env": {
        "NODE_EXTRA_CA_CERTS": "/Users/changhaojiang/Downloads/Cloudflare_CA.pem"
      }
    },
    "browser-tools": {
      "command": "npx",
      "args": [
        "@agentdeskai/browser-tools-mcp@1.2.0"
      ],
      "env": {
        "NODE_EXTRA_CA_CERTS": "/Users/changhaojiang/Downloads/Cloudflare_CA.pem"
      }
    }
  }
};

const Hosts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { hostProfiles, handleProfileChange } = useHostProfiles();
  const { configDialog, openConfigDialog, setDialogOpen } = useConfigDialog(mockJsonConfig);
  const { toast } = useToast();
  
  const filteredHosts = hosts.filter(host => 
    host.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenConfigDialog = (hostId: string) => {
    const host = hosts.find(h => h.id === hostId);
    if (host && host.configPath) {
      openConfigDialog(hostId, host.configPath);
    }
  };
  
  const handleSaveConfig = (config: string) => {
    if (configDialog.hostId) {
      console.log(`Saving config for host ${configDialog.hostId}:`, config);
      
      toast({
        title: "Configuration saved",
        description: `Config file saved to ${configDialog.configPath}`,
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hosts</h1>
          <p className="text-muted-foreground">
            Manage host connections and profile associations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Search className="h-4 w-4 mr-2" />
            Scan for Hosts
          </Button>
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Host Manually
          </Button>
        </div>
      </div>
      
      <HostSearch 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery} 
      />
      
      <div className="grid gap-6 md:grid-cols-2">
        {filteredHosts.map(host => (
          <HostCard
            key={host.id}
            host={host}
            profileId={hostProfiles[host.id] || ''}
            onProfileChange={handleProfileChange}
            onOpenConfigDialog={handleOpenConfigDialog}
          />
        ))}
      </div>
      
      <ConfigFileDialog
        open={configDialog.isOpen}
        onOpenChange={setDialogOpen}
        configPath={configDialog.configPath}
        initialConfig={configDialog.configContent}
        onSave={handleSaveConfig}
      />
    </div>
  );
};

export default Hosts;
