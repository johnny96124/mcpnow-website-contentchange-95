
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NoNetworkState } from "@/components/discovery/NoNetworkState";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      <div className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 text-white relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <h1 className="text-3xl font-bold mb-2">All Server Definitions</h1>
          <p className="text-blue-100 mb-6">
            Discover server definitions created by the community. Find what's popular,
            trending, and recently updated to enhance your development workflow.
          </p>
        </div>
        
        <div className="absolute right-8 top-1/2 transform -translate-y-1/2 opacity-10">
          <div className="w-64 h-64 rounded-full border-4 border-white absolute -right-16 -top-16"></div>
          <div className="w-32 h-32 rounded-full border-4 border-white absolute right-24 top-8"></div>
          <div className="w-48 h-48 rounded-full border-4 border-white absolute -right-8 top-16"></div>
        </div>
      </div>
      
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex-1 min-w-[280px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search servers, APIs, collections..."
                className="pl-10 bg-background border-input"
                disabled
              />
            </div>
          </div>
          
          <div className="w-[180px]">
            <Button variant="outline" className="w-full" disabled>
              Most Popular
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <div className="flex justify-between items-center border-b pb-1">
            <TabsList className="bg-transparent p-0 h-9">
              <TabsTrigger 
                value="all" 
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none px-3"
                disabled
              >
                All
              </TabsTrigger>
              <TabsTrigger 
                value="official"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none px-3"
                disabled
              >
                Official
              </TabsTrigger>
              <TabsTrigger 
                value="community"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none px-3"
                disabled
              >
                Community
              </TabsTrigger>
            </TabsList>
          </div>
        </Tabs>
      </div>
      
      <div className="h-[calc(100vh-380px)] flex items-center justify-center">
        <NoNetworkState onRetry={handleRetry} />
      </div>
      
      {/* Add a back button at the bottom for testing */}
      <div className="mt-6 flex justify-center">
        <Button 
          variant="outline"
          onClick={() => navigate('/discovery')}
        >
          Return to Discovery Page
        </Button>
      </div>
    </div>
  );
};

export default DiscoveryNoNetwork;
