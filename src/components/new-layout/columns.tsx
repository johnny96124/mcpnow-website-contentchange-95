
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ServerInstance, Profile } from "@/data/mockData";
import { EndpointLabel } from "@/components/status/EndpointLabel";
import { ServerActionsDropdown } from "./ServerActionsDropdown";
import { Badge } from "@/components/ui/badge";

export const columns = (
  onAction: (action: string, server: ServerInstance) => void,
  profiles: Profile[],
  onAddToProfiles: (serverId: string, profileIds: string[]) => void,
  serverProfiles: Record<string, string[]>,
  onDeleteServer: (serverId: string) => void
): ColumnDef<ServerInstance>[] => [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <button 
        className="text-left font-medium hover:underline"
        onClick={() => onAction('details', row.original)}
      >
        {row.original.name}
      </button>
    ),
  },
  {
    accessorKey: "definitionId",
    header: "Type",
    cell: ({ row }) => <EndpointLabel type="HTTP_SSE" />,
  },
  {
    accessorKey: "connectionDetails",
    header: "Connection",
    cell: ({ row }) => (
      <span className="text-sm font-mono truncate block max-w-[200px]">
        {row.original.connectionDetails}
      </span>
    ),
  },
  {
    accessorKey: "profiles",
    header: "Profiles",
    cell: ({ row }) => {
      const serverId = row.original.id;
      const currentProfileIds = serverProfiles[serverId] || [];
      
      return (
        <div className="flex flex-wrap gap-1">
          {currentProfileIds.map(profileId => {
            const profile = profiles.find(p => p.id === profileId);
            return profile ? (
              <Badge key={profile.id} variant="secondary">
                {profile.name}
              </Badge>
            ) : null;
          })}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const server = row.original;
      const serverId = server.id;
      const currentProfileIds = serverProfiles[serverId] || [];

      return (
        <ServerActionsDropdown 
          server={server}
          profiles={profiles}
          currentProfileIds={currentProfileIds}
          onAction={onAction}
          onAddToProfiles={onAddToProfiles}
          onDeleteServer={onDeleteServer}
        />
      );
    },
  },
];
