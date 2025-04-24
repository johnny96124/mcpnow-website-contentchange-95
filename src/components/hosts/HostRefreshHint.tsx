
import { Info } from "lucide-react";

interface HostRefreshHintProps {
  className?: string;
}

export function HostRefreshHint({ className }: HostRefreshHintProps) {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded border border-blue-100 bg-blue-50 text-blue-700 text-xs ${className || ""}`}
    >
      <Info className="w-4 h-4 text-blue-400 shrink-0" aria-hidden />
      Please refresh in host to activate the change.
    </div>
  );
}
