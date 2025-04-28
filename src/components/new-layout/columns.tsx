
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Wrench, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ServerInstance, Profile } from "@/data/mockData";
import { EndpointLabel } from "@/components/status/EndpointLabel";

export const columns = (
  onAction: (action: string, server: ServerInstance) => void,
  profiles: Profile[],
  onAddToProfiles: (serverId: string, profileIds: string[]) => void,
  serverProfiles: Record<string, string[]>
): ColumnDef<ServerInstance>[] => [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.name}</div>
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
        <Select
          defaultValue=""
          onValueChange={(value) => {
            const selectedIds = value.split(",").filter(id => id);
            onAddToProfiles(serverId, selectedIds);
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue>
              {currentProfileIds.length > 0 ? (
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
              ) : (
                <span className="text-muted-foreground">Select profiles...</span>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {profiles.map(profile => (
              <SelectItem 
                key={profile.id} 
                value={profile.id}
                className="flex items-center space-x-2"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={currentProfileIds.includes(profile.id)}
                    className="form-checkbox h-4 w-4"
                    onChange={() => {
                      const newProfileIds = currentProfileIds.includes(profile.id)
                        ? currentProfileIds.filter(id => id !== profile.id)
                        : [...currentProfileIds, profile.id];
                      onAddToProfiles(serverId, newProfileIds);
                    }}
                  />
                  <span>{profile.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const server = row.original;

      return (
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="text-purple-600 hover:text-purple-700 hover:border-purple-600"
            onClick={() => onAction('debug', server)}
          >
            <Wrench className="h-3.5 w-3.5 mr-1.5" />
            Debug
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-blue-600 hover:text-blue-700 hover:border-blue-600"
            onClick={() => onAction('history', server)}
          >
            <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
            History
          </Button>
        </div>
      );
    },
  },
];
