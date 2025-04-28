
import { ColumnDef } from "@tanstack/react-table";
import { ServerInstance } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

const getStatusColor = (status: string) => {
  switch (status) {
    case "running":
      return "bg-green-500";
    case "stopped":
      return "bg-gray-500";
    case "error":
      return "bg-red-500";
    case "connecting":
      return "bg-yellow-500";
    default:
      return "bg-gray-500";
  }
};

export const columns = (
  onAction: (action: string, server: ServerInstance) => void,
  onNameClick: (server: ServerInstance) => void
): ColumnDef<ServerInstance>[] => [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <Button 
        variant="link" 
        className="p-0 h-auto font-normal"
        onClick={() => onNameClick(row.original)}
      >
        {row.getValue("name")}
      </Button>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <div className="flex items-center">
          <div className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(status)}`} />
          <span className="capitalize">{status}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "connectionDetails",
    header: "Connection",
    cell: ({ row }) => (
      <div className="truncate max-w-[200px]">{row.getValue("connectionDetails")}</div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const server = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onAction("debug", server)}>
              Debug
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAction("history", server)}>
              History
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
