import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddHostDialog } from "@/components/new-layout/AddHostDialog";
import { ServerListItem } from "@/components/new-layout/ServerListItem";
import { AddServerDialog } from "@/components/servers/AddServerDialog";
import { type ServerInstance } from "@/data/mockData";
import { useNavigate } from "react-router-dom";

export default function NewLayout() {
  const [activeTab, setActiveTab] = useState<"servers" | "hosts">("servers");
  const [showAddServerDialog, setShowAddServerDialog] = useState(false);
  const [showAddHostDialog, setShowAddHostDialog] = useState(false);
  const [servers, setServers] = useState<ServerInstance[]>([]);
  const navigate = useNavigate();

  const handleAddServer = (server: ServerInstance) => {
    setServers((prev) => [...prev, server]);
    setShowAddServerDialog(false);
  };

  const handleUpdateServer = (updatedServer: ServerInstance) => {
    setServers((prev) =>
      prev.map((server) =>
        server.id === updatedServer.id ? updatedServer : server
      )
    );
  };

  const handleNavigateToDiscovery = () => {
    navigate('/discovery');
  };

  return (
    <div className="container py-6 max-w-5xl">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "servers" | "hosts")}>
        <div className="flex items-center justify-between mb-6">
          <TabsList>
            <TabsTrigger value="servers">Servers</TabsTrigger>
            <TabsTrigger value="hosts">Hosts</TabsTrigger>
          </TabsList>
          
          {activeTab === "servers" && (
            <Button onClick={() => setShowAddServerDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Server
            </Button>
          )}
          
          {activeTab === "hosts" && (
            <Button onClick={() => setShowAddHostDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Host
            </Button>
          )}
        </div>
        
        <TabsContent value="servers">
          <div className="space-y-4">
            {servers.map((server) => (
              <ServerListItem
                key={server.id}
                server={server}
                onUpdateServer={handleUpdateServer}
              />
            ))}
            
            {servers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No servers added yet. Click the "Add Server" button to get started.
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="hosts">
          <div className="text-center py-8 text-muted-foreground">
            No hosts added yet. Click the "Add Host" button to get started.
          </div>
        </TabsContent>
      </Tabs>

      <AddServerDialog
        open={showAddServerDialog}
        onOpenChange={setShowAddServerDialog}
        onCreateServer={handleAddServer}
        onNavigateToDiscovery={handleNavigateToDiscovery}
      />
      
      <AddHostDialog
        open={showAddHostDialog}
        onOpenChange={setShowAddHostDialog}
        onAddHost={(host) => {
          setShowAddHostDialog(false);
        }}
      />
    </div>
  );
}
