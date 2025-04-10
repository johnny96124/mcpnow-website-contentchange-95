
import React from "react";
import { CheckCircle } from "lucide-react";

export const OfficialBadge = () => {
  return (
    <span className="endpoint-tag endpoint-official flex items-center py-0.5 px-1.5 bg-blue-50 border border-blue-200 text-blue-700 text-xs rounded-md">
      <CheckCircle className="h-3 w-3 mr-1" />
      Official
    </span>
  );
};
