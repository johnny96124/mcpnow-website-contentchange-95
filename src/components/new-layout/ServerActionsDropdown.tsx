
import { ServerInstance, Profile } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Wrench, MessageSquare, Trash2, Tags, Plus } from "lucide-react";
import { useState } from "react";

interface ServerActionsDropdownProps {
  server: ServerInstance;
  profiles: Profile[];
  currentProfileIds: string[];
  onAction: (action: string, server: ServerInstance) => void;
  onAddToProfiles: (serverId: string, profileIds: string[]) => void;
  onDeleteServer: (serverId: string) => void;
}

export function ServerActionsDropdown({
  server,
  profiles,
  currentProfileIds,
  onAction,
  onAddToProfiles,
  onDeleteServer,
}: ServerActionsDropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>Server Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Tags className="mr-2 h-4 w-4" />
              <span>Manage Profiles</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="p-2">
              <div className="max-h-[300px] overflow-y-auto">
                {profiles.map((profile) => (
                  <DropdownMenuCheckboxItem
                    key={profile.id}
                    checked={currentProfileIds.includes(profile.id)}
                    onCheckedChange={(checked) => {
                      const newProfileIds = checked
                        ? [...currentProfileIds, profile.id]
                        : currentProfileIds.filter((id) => id !== profile.id);
                      onAddToProfiles(server.id, newProfileIds);
                    }}
                  >
                    {profile.name}
                  </DropdownMenuCheckboxItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    setOpen(false);
                    onAction('addProfile', server);
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  <span>New Profile</span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuItem onClick={() => onAction('debug', server)}>
            <Wrench className="mr-2 h-4 w-4" />
            <span>Debug Tools</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAction('history', server)}>
            <MessageSquare className="mr-2 h-4 w-4" />
            <span>Message History</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="text-red-600 focus:text-red-600" 
            onClick={() => onDeleteServer(server.id)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete Server</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
