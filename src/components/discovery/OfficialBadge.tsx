
import React from "react";
import { CheckCircle } from "lucide-react";

export const OfficialBadge = () => {
  return (
    <span className="endpoint-tag endpoint-official flex items-center py-0.5 rounded-md">
      <CheckCircle className="h-3 w-3 mr-1" />
      Official
    </span>
  );
};

// Add global styles for the highlighted server animation
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse-border {
      0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
      70% { box-shadow: 0 0 0 6px rgba(59, 130, 246, 0); }
      100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
    }
    
    .highlighted-server {
      animation: pulse-border 2s infinite;
      border-color: #3b82f6 !important;
      border-width: 2px !important;
      box-shadow: 0 0 15px rgba(59, 130, 246, 0.3);
      z-index: 10;
      transform: scale(1.02);
    }
  `;
  document.head.appendChild(style);
}
