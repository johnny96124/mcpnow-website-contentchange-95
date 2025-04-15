
import { useEffect, useState } from "react";
import { 
  Search, 
  FolderOpen, 
  Tag,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NoNetworkState } from "@/components/discovery/NoNetworkState";
import { CategoryList } from "@/components/discovery/CategoryList";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const mockCategories = [
  "API Testing", 
  "Developer Tools", 
  "Database", 
  "DevOps", 
  "Monitoring", 
  "Cloud", 
  "Security", 
  "Analytics", 
  "Productivity",
  "Automation"
];

const DiscoveryNoNetwork = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRetryConnection = () => {
    setIsLoading(true);
    
    // Simulate a retry attempt
    setTimeout(() => {
      setIsLoading(false);
      toast.error("Connection failed. Please check your network settings.", {
        position: "top-right",
        duration: 5000,
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
          
          <div className="flex gap-4">
            <Button 
              variant="default"
              className="bg-white text-blue-700 hover:bg-blue-50"
              onClick={() => navigate("/servers")}
            >
              <FolderOpen className="mr-2 h-4 w-4" />
              My Servers
            </Button>
            <Button 
              variant="outline"
              className="bg-transparent text-white border-white/40 hover:bg-white/10"
              onClick={() => navigate("/discovery")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Discovery
            </Button>
          </div>
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={true}
              />
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {mockCategories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              className={`
                rounded-full text-xs px-3 h-7
                ${selectedCategory === category ? 'bg-blue-600 text-white' : 'bg-transparent'}
              `}
              disabled={true}
            >
              <Tag className="h-3 w-3 mr-1" />
              {category}
            </Button>
          ))}
        </div>
      </div>
      
      <ScrollArea className="h-[calc(100vh-380px)]">
        <NoNetworkState onRetry={handleRetryConnection} />
      </ScrollArea>
    </div>
  );
};

export default DiscoveryNoNetwork;
