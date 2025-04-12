
import React from "react";
import { Button } from "@/components/ui/button";
import { FolderOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const DiscoveryHeader: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 text-white relative overflow-hidden">
      <div className="max-w-3xl relative z-10">
        <h1 className="text-3xl font-bold mb-2">All Server Definitions</h1>
        <p className="text-blue-100 mb-6">
          Discover server definitions created by the community. Find what's popular,
          trending, and recently updated to enhance your development workflow.
        </p>
        
        <div className="flex gap-4">
          <Button 
            variant="default"
            className="bg-white text-blue-700 hover:bg-blue-50"
            onClick={() => navigate("/servers")}
          >
            <FolderOpen className="mr-2 h-4 w-4" />
            My Servers
          </Button>
        </div>
      </div>
      
      <div className="absolute right-8 top-1/2 transform -translate-y-1/2 opacity-10">
        <div className="w-64 h-64 rounded-full border-4 border-white absolute -right-16 -top-16"></div>
        <div className="w-32 h-32 rounded-full border-4 border-white absolute right-24 top-8"></div>
        <div className="w-48 h-48 rounded-full border-4 border-white absolute -right-8 top-16"></div>
      </div>
    </div>
  );
};
