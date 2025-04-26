
import { useState } from "react";
import { ServerInstance } from "@/data/mockData";
import { EditServerDialog } from "@/components/servers/EditServerDialog";
import { ServerLogo } from "@/components/servers/ServerLogo";

interface ServerListItemProps {
  server: ServerInstance;
  onUpdateServer: (updatedServer: ServerInstance) => void;
}

export function ServerListItem({ server, onUpdateServer }: ServerListItemProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);

  return (
    <>
      <div 
        className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
        onClick={() => setShowEditDialog(true)}
      >
        <ServerLogo name={server.name} />
        <div className="flex-1">
          <h3 className="font-medium">{server.name}</h3>
          <p className="text-sm text-muted-foreground">
            {server.definitionId ? "HTTP Server" : "STDIO Server"}
          </p>
        </div>
      </div>

      <EditServerDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onUpdateServer={(data) => {
          onUpdateServer({
            ...server,
            ...data,
          });
          setShowEditDialog(false);
        }}
        serverDefinition={{
          id: server.definitionId || "",
          name: server.name,
          type: "HTTP_SSE", // Default to HTTP_SSE since we don't have type in ServerInstance
          version: "1.0.0",
          description: "",
          downloads: 0
        }}
      />
    </>
  );
}
