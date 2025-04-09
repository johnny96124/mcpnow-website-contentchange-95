
import React from "react";
import { CheckCircle } from "lucide-react";

export const OfficialBadge = () => {
  return (
    <span className="endpoint-tag endpoint-official flex items-center py-0.5">
      <CheckCircle className="h-3 w-3 mr-1" />
      Official
    </span>
  );
};
