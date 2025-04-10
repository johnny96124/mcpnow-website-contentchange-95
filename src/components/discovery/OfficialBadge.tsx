
import React from "react";
import { CheckCircle } from "lucide-react";

export const OfficialBadge = () => {
  return (
    <span className="px-2 py-0.5 text-xs font-medium bg-green-50 text-green-700 border border-green-200 rounded-md flex items-center">
      <CheckCircle className="h-3 w-3 mr-1" />
      Official
    </span>
  );
};
