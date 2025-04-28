
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface HostSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function HostSearch({ searchQuery, onSearchChange }: HostSearchProps) {
  return (
    <div className="flex items-center mb-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search hosts..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
}
