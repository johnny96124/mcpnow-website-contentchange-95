
import { Info } from "lucide-react";

interface ProfileChangeHintProps {
  className?: string;
}

export function ProfileChangeHint({ className }: ProfileChangeHintProps) {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded border border-blue-100 bg-blue-50 text-blue-700 text-xs ${className || ""}`}
    >
      <Info className="w-4 h-4 text-blue-400 shrink-0" aria-hidden />
      更改 Profile 后，请前往对应 Host 的实际应用页面手动刷新以使更改生效。
    </div>
  );
}
