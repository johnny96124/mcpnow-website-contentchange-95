
import React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

export const OfficialBadge = () => {
  return (
    <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-0">
      <CheckCircle className="h-3.5 w-3.5 mr-1" />
      Official
    </Badge>
  );
};
