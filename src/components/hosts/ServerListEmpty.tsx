
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Server } from "lucide-react";

interface ServerListEmptyProps {
  onAddServers: () => void;
}

export const ServerListEmpty: React.FC<ServerListEmptyProps> = ({ onAddServers }) => {
  return (
    <div className="text-center py-12 space-y-4">
      <div className="flex flex-col items-center gap-2">
        <div className="bg-muted/30 p-3 rounded-full">
          <Server className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium">No servers in this profile</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Add servers to this profile to get started. You can add existing servers or create new ones.
        </p>
      </div>
      <Button onClick={onAddServers}>
        <Plus className="h-4 w-4 mr-2" />
        Add Servers
      </Button>
    </div>
  );
};
