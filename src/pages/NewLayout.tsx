
import { useState } from "react";
import { ServerInstance, serverDefinitions } from "@/data/mockData";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Wrench, History } from "lucide-react";
import { ServerDebugDialog } from "@/components/new-layout/ServerDebugDialog";
import { ServerHistoryDialog } from "@/components/new-layout/ServerHistoryDialog";

export default function NewLayout() {
  const [selectedServer, setSelectedServer] = useState<ServerInstance | null>(null);
  const [openDebugDialog, setOpenDebugDialog] = useState(false);
  const [openHistoryDialog, setOpenHistoryDialog] = useState(false);

  // Example server for demonstration
  const mockServer: ServerInstance = {
    id: "server-123",
    name: "Production API",
    definitionId: "server-definition-1",
    status: "running",
    connectionDetails: "https://api.example.com/v1",
    enabled: true,
    environment: {
      API_KEY: "sk-xxxx-xxxx-xxxx",
      DEBUG_MODE: "false"
    }
  };

  const handleDebugClick = (server: ServerInstance) => {
    setSelectedServer(server);
    setOpenDebugDialog(true);
  };

  const handleHistoryClick = (server: ServerInstance) => {
    setSelectedServer(server);
    setOpenHistoryDialog(true);
  };

  return (
    <div className="container mx-auto py-6">
      <PageHeader
        title="New Layout"
        description="Server management interface"
      />
      
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Server Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="p-4 border rounded-lg bg-card flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{mockServer.name}</h3>
                  <p className="text-sm text-muted-foreground">{mockServer.connectionDetails}</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDebugClick(mockServer)}
                    className="text-purple-600"
                  >
                    <Wrench className="h-4 w-4 mr-1" />
                    Debug
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="fixed bottom-8 left-0 right-0 flex justify-center gap-4">
        <Button variant="outline" size="lg" className="shadow-md bg-white">
          <Plus className="mr-2 h-5 w-5" />
          Profile
        </Button>
        <Button variant="outline" size="lg" className="shadow-md bg-white text-purple-600">
          <Wrench className="mr-2 h-5 w-5" />
          Debug
        </Button>
        <Button 
          variant="outline" 
          size="lg" 
          className="shadow-md bg-white text-blue-600"
          onClick={() => handleHistoryClick(mockServer)}
        >
          <History className="mr-2 h-5 w-5" />
          History
        </Button>
      </div>
      
      <ServerDebugDialog 
        open={openDebugDialog} 
        onOpenChange={setOpenDebugDialog} 
        server={selectedServer} 
      />
      
      <ServerHistoryDialog
        open={openHistoryDialog}
        onOpenChange={setOpenHistoryDialog}
        server={selectedServer}
      />
    </div>
  );
}
