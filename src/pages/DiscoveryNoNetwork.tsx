
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NoNetworkState } from "@/components/discovery/NoNetworkState";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const DiscoveryNoNetwork = () => {
  const [isRetrying, setIsRetrying] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRetry = () => {
    setIsRetrying(true);
    
    // Simulate retry attempt with a network request delay
    setTimeout(() => {
      const success = Math.random() > 0.3;
      
      if (success) {
        toast({
          title: "Connection restored",
          description: "Network connection is now available.",
          type: "success"
        });
        
        // Redirect to the discovery page after successful connection
        setTimeout(() => {
          navigate("/discovery");
        }, 1000);
      } else {
        setIsRetrying(false);
        
        toast({
          title: "Connection failed",
          description: "Unable to establish connection. Please try again later.",
          type: "error"
        });
      }
    }, 2000);
  };

  const handleNavigateToServers = () => {
    navigate("/servers");
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 text-white relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <h1 className="text-3xl font-bold mb-2">All Server Definitions</h1>
          <p className="text-blue-100 mb-6">
            Discover server definitions created by the community. Find what's popular,
            trending, and recently updated to enhance your development workflow.
          </p>
          
          <Button 
            variant="outline" 
            className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white"
            onClick={handleNavigateToServers}
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
      
      {/* No Network State - immediately after the banner */}
      <div className="mt-6">
        <NoNetworkState onRetry={handleRetry} isRetrying={isRetrying} />
      </div>
    </div>
  );
};

export default DiscoveryNoNetwork;
