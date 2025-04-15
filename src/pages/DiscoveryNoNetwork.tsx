
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { NoNetworkState } from "@/components/discovery/NoNetworkState";
import { Button } from "@/components/ui/button";

const DiscoveryNoNetwork = () => {
  const [isRetrying, setIsRetrying] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRetry = () => {
    setIsRetrying(true);
    
    // Simulate retry attempt
    setTimeout(() => {
      setIsRetrying(false);
      
      toast({
        title: "Connection failed",
        description: "Unable to establish connection. Please try again later.",
      });
    }, 2000);
  };

  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 text-white relative overflow-hidden">
        <div className="flex justify-between items-start relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold mb-2">All Server Definitions</h1>
            <p className="text-blue-100 mb-6">
              Discover server definitions created by the community. Find what's popular,
              trending, and recently updated to enhance your development workflow.
            </p>
          </div>
          <Button 
            variant="outline" 
            className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            onClick={() => navigate("/servers")}
          >
            My Servers
          </Button>
        </div>
        
        <div className="absolute right-8 top-1/2 transform -translate-y-1/2 opacity-10">
          <div className="w-64 h-64 rounded-full border-4 border-white absolute -right-16 -top-16"></div>
          <div className="w-32 h-32 rounded-full border-4 border-white absolute right-24 top-8"></div>
          <div className="w-48 h-48 rounded-full border-4 border-white absolute -right-8 top-16"></div>
        </div>
      </div>
      
      <div className="mt-8">
        <NoNetworkState onRetry={handleRetry} isRetrying={isRetrying} />
      </div>
    </div>
  );
};

export default DiscoveryNoNetwork;
