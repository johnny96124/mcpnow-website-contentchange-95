
import React from "react";
import { CheckCircle } from "lucide-react";

export const OfficialBadge = () => {
  return (
    <span className="endpoint-tag endpoint-official">
      <CheckCircle className="h-3.5 w-3.5 mr-1" />
      Official
    </span>
  );
};
