
import React from "react";
import { MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageProps {
  type?: "info" | "success" | "error";
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
}

const typeStyle = {
  info: "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-900",
  success: "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-100 dark:border-green-900",
  error: "bg-[#FFDEE2] dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200 dark:border-red-900",
};

const iconColor = {
  info: "text-blue-400 dark:text-blue-300",
  success: "text-green-400 dark:text-green-300",
  error: "text-red-400 dark:text-red-400",
};

export const Message: React.FC<MessageProps> = ({
  type = "info",
  children,
  className,
  onClose,
}) => (
  <div
    className={cn(
      "flex items-center rounded-lg border px-4 py-2 shadow-sm gap-2 text-sm transition-all mb-2",
      typeStyle[type],
      className
    )}
    role="status"
  >
    <MessageSquare className={cn("h-4 w-4", iconColor[type])} />
    <div className="flex-1">{children}</div>
    {onClose && (
      <button
        aria-label="close"
        className="ml-2 text-xs text-muted-foreground hover:underline"
        onClick={onClose}
      >
        关闭
      </button>
    )}
  </div>
);
