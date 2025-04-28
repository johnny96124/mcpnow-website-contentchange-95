
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface HostSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function HostSearch({ value, onChange }: HostSearchProps) {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search hosts..."
        className="pl-8"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
