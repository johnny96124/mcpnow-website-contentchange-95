
import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

const StickyDownloadButton: React.FC<Props> = ({ className }) => (
  <Button
    size="lg"
    className={cn(
      "gap-2 rounded-full shadow-xl bg-[#9b87f5] hover:bg-[#7E69AB] text-white px-6 py-3",
      className
    )}
    style={{ position: "fixed", top: 20, right: 20, zIndex: 999 }}
    onClick={() => window.location.href = "#download"}
  >
    <Download className="w-5 h-5" />
    Download
  </Button>
);

export default StickyDownloadButton;
