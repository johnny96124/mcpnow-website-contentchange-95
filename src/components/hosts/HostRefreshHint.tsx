
import { Info } from "lucide-react";
import { useEffect, useState } from "react";

interface HostRefreshHintProps {
  show: boolean;
  className?: string;
}

export function HostRefreshHint({ show, className }: HostRefreshHintProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (show) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300); // Small delay for exit animation
      return () => clearTimeout(timer);
    }
  }, [show]);
  
  if (!show && !isVisible) return null;
  
  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded border border-blue-100 bg-blue-50 text-blue-700 text-xs 
        ${show ? "animate-fade-in" : "animate-fade-out"}
        ${className || ""}`}
    >
      <Info className="w-4 h-4 text-blue-400 shrink-0" aria-hidden />
      Please refresh in host to activate the change.
    </div>
  );
}
