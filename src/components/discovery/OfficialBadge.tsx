
import React from "react";
import { CheckCircle } from "lucide-react";

export const OfficialBadge = () => {
  return (
    <span className="flex items-center rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 text-sm font-medium py-1 px-3">
      <CheckCircle className="h-4 w-4 mr-2" />
      Official
    </span>
  );
};
