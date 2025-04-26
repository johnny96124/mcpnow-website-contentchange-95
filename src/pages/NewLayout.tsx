import { useState, useEffect } from "react";
import { Plus, PlusCircle, ChevronDown, ChevronUp, Search, Filter, Settings2, RefreshCw, ArrowRight, Server, FileText, ScanLine, Edit, Trash2, Wrench, MessageSquare, Circle, CircleDot, Loader, X, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { StatusIndicator } from "@/components/status/StatusIndicator";
import { Progress } from "@/components/ui/progress";
import { EndpointLabel } from "@/components/status/EndpointLabel";
import { serverInstances, serverDefinitions, profiles, hosts, Profile, ServerInstance, Host } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { AddServerDialog } from "@/components/new-layout/AddServerDialog";
import { AddHostDialog } from "@/components/new-layout/AddHostDialog";
import { ServerDetails } from "@/components/new-layout/ServerDetails";
import { ConfigFileDialog } from "@/components/hosts/ConfigFileDialog";
import { useConfigDialog } from "@/hooks/useConfigDialog";
import { useHostProfiles } from "@/hooks/useHostProfiles";
import { ServerDebugDialog } from "@/components/new-layout/ServerDebugDialog";
import { ServerHistoryDialog } from "@/components/new-layout/ServerHistoryDialog";
import { DeleteProfileDialog } from "@/components/new-layout/DeleteProfileDialog";

const mockJsonConfig = {
  "mcpServers": {
    "mcpnow": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/mcpnow", "http://localhost:8008/mcp"]
    }
  }
};

const NewLayout = () => {
  const [isAddServerDialogOpen, setIsAddServerDialogOpen] = useState(false);
  const [isAddHostDialogOpen, setIsAddHostDialogOpen] = useState(false);
  const [selectedServer, setSelectedServer] = useState<ServerInstance | null>(null);
  const [isServerDetailsOpen, setIsServerDetailsOpen] = useState(false);
  const [isServerDebugDialogOpen, setIsServerDebugDialogOpen] = useState(false);
  const [isServerHistoryDialogOpen, setIsServerHistoryDialogOpen] = useState(false);
  const [isDeleteProfileDialogOpen, setIsDeleteProfileDialogOpen] = useState(false);
  const [selectedProfileToDelete, setSelectedProfileToDelete] = useState<Profile | null>(null);
  const { toast } = useToast();
  const { isOpen: isConfigDialogOpen, openConfigDialog, closeConfigDialog, configContent, setConfigContent } = useConfigDialog();
  const { profilesWithHosts, addProfileToHost, removeProfileFromHost } = useHostProfiles();

  const [servers, setServers] = useState(serverInstances);
  const [hostsList, setHosts] = useState(hosts);
  const [profilesList, setProfiles] = useState(profiles);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("servers");
  const [showFilters, setShowFilters] = useState(false);

  const filteredServers = servers.filter(server =>
    server.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredHosts = hostsList.filter(host =>
    host.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProfiles = profilesList.filter(profile =>
    profile.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddServer = (server: ServerInstance) => {
    setServers([...servers, server]);
    toast({
      title: "Server Added",
      description: `${server.name} has been added successfully.`,
    });
    setIsAddServerDialogOpen(false);
  };

  const handleAddHost = (host: Host) => {
    setHosts([...hostsList, host]);
    toast({
      title: "Host Added",
      description: `${host.name} has been added successfully.`,
    });
    setIsAddHostDialogOpen(false);
  };

  const handleEditServer = (server: ServerInstance) => {
    setSelectedServer(server);
    setIsServerDetailsOpen(true);
  };

  const handleDeleteServer = (serverToDelete: ServerInstance) => {
    setServers(servers.filter(server => server.id !== serverToDelete.id));
    toast({
      title: "Server Deleted",
      description: `${serverToDelete.name} has been deleted successfully.`,
    });
  };

  const handleOpenServerDetails = (server: ServerInstance) => {
    setSelectedServer(server);
    setIsServerDetailsOpen(true);
  };

  const handleCloseServerDetails = () => {
    setIsServerDetailsOpen(false);
    setSelectedServer(null);
  };

  const handleOpenServerDebugDialog = (server: ServerInstance) => {
    setSelectedServer(server);
    setIsServerDebugDialogOpen(true);
  };

  const handleCloseServerDebugDialog = () => {
    setIsServerDebugDialogOpen(false);
    setSelectedServer(null);
  };

  const handleOpenServerHistoryDialog = (server: ServerInstance) => {
    setSelectedServer(server);
    setIsServerHistoryDialogOpen(true);
  };

  const handleCloseServerHistoryDialog = () => {
    setIsServerHistoryDialogOpen(false);
    setSelectedServer(null);
  };

  const handleConfigEdit = (config: string) => {
    setConfigContent(config);
    openConfigDialog();
  };

  const handleProfileAddToHost = (hostId: string, profileId: string) => {
    addProfileToHost(hostId, profileId);
    setHosts(prevHosts =>
      prevHosts.map(host =>
        host.id === hostId ? { ...host, profiles: [...(host.profiles || []), profileId] } : host
      )
    );
  };

  const handleProfileRemoveFromHost = (hostId: string, profileId: string) => {
    removeProfileFromHost(hostId, profileId);
    setHosts(prevHosts =>
      prevHosts.map(host => ({
        ...host,
        profiles: host.profiles ? host.profiles.filter(id => id !== profileId) : [],
      }))
    );
  };

  const handleOpenDeleteProfileDialog = (profile: Profile) => {
    setSelectedProfileToDelete(profile);
    setIsDeleteProfileDialogOpen(true);
  };

  const handleCloseDeleteProfileDialog = () => {
    setIsDeleteProfileDialogOpen(false);
    setSelectedProfileToDelete(null);
  };

  const handleDeleteProfile = (profileToDelete: Profile) => {
    setProfiles(profiles.filter(profile => profile.id !== profileToDelete.id));
    setHosts(prevHosts =>
      prevHosts.map(host => ({
        ...host,
        profiles: host.profiles ? host.profiles.filter(id => id !== profileToDelete.id) : [],
      }))
    );
    toast({
      title: "Profile Deleted",
      description: `${profileToDelete.name} has been deleted successfully.`,
    });
    setIsDeleteProfileDialogOpen(false);
    setSelectedProfileToDelete(null);
  };

  // Ensure we return JSX 
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">MCP Servers</h1>
          <p className="text-muted-foreground">
            Manage your Model Context Protocol server instances.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            onClick={() => {}}
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="gap-1"
            onClick={() => setIsAddServerDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add Server
          </Button>
        </div>
      </div>

      <div>
        {/* Return some basic placeholder content if the full component isn't implemented yet */}
        <Card>
          <CardHeader>
            <CardTitle>Server Management</CardTitle>
            <CardDescription>
              View and manage your MCP server instances
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Server management content will be displayed here.</p>
          </CardContent>
        </Card>
      </div>
      <AddServerDialog open={isAddServerDialogOpen} onOpenChange={setIsAddServerDialogOpen} onAddServer={handleAddServer} />
    </div>
  );
};

export default NewLayout;
