
import { Button } from "@/components/ui/button";
import { WifiOff, RefreshCw, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DiscoveryNoNetwork = () => {
  const navigate = useNavigate();

  const handleRetry = () => {
    // In a real app, this would attempt to reconnect
    console.log("Attempting to reconnect...");
    // For demo purposes, we'll just navigate back to the discovery page
    navigate("/discovery");
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
          
          <div className="flex gap-4">
            <Button 
              variant="default"
              className="bg-white text-blue-700 hover:bg-blue-50"
              onClick={() => navigate("/servers")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Servers
            </Button>
          </div>
        </div>
        
        <div className="absolute right-8 top-1/2 transform -translate-y-1/2 opacity-10">
          <div className="w-64 h-64 rounded-full border-4 border-white absolute -right-16 -top-16"></div>
          <div className="w-32 h-32 rounded-full border-4 border-white absolute right-24 top-8"></div>
          <div className="w-48 h-48 rounded-full border-4 border-white absolute -right-8 top-16"></div>
        </div>
      </div>

      <div className="flex justify-center items-center h-[calc(100vh-380px)]">
        <div className="text-center p-8 max-w-md">
          <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
              <WifiOff className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">
              Network Connection Lost
            </h2>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We couldn't load server definitions. Please check your internet connection and try again.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="default"
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleRetry}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry Connection
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoveryNoNetwork;
