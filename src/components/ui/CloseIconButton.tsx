
import React from "react";
import { X } from "lucide-react";

interface CloseIconButtonProps {
  onClick: () => void;
  className?: string;
}

export function CloseIconButton({ onClick, className = "" }: CloseIconButtonProps) {
  return (
    <button
      aria-label="Close"
      onClick={onClick}
      className={`absolute right-3 top-3 z-10 flex items-center justify-center
        w-8 h-8 rounded-full border border-transparent
        hover:bg-gray-100 hover:dark:bg-[#232334]
        hover:border-gray-300 dark:hover:border-[#30304a]
        bg-white/80 dark:bg-[#181825d9]
        text-gray-700 dark:text-gray-200
        shadow transition
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        ${className}`}
      type="button"
    >
      <X size={19} strokeWidth={2} />
    </button>
  );
}
