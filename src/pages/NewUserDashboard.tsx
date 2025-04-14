
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GettingStartedDialog } from "@/components/onboarding/GettingStartedDialog";
import { hasSeenOnboarding, markOnboardingAsSeen } from "@/utils/localStorage";

const NewUserDashboard = () => {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user has seen onboarding before
    if (hasSeenOnboarding()) {
      navigate('/');
    }
  }, [navigate]);

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    markOnboardingAsSeen();
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Overview</h1>
        <p className="text-muted-foreground">Welcome to MCP Now. Let's get you started.</p>
      </div>
      
      {/* Trending Servers - Empty State */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold tracking-tight">Trending MCP Servers</h2>
          <Button variant="outline" size="sm" asChild>
            <Link to="/discovery">
              View All
              <ExternalLink className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <Card className="bg-muted/30">
          <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px] text-center">
            <p className="text-muted-foreground">
              Discover trending server types in the Discovery section to get started.
            </p>
            <Button className="mt-4" asChild>
              <Link to="/discovery">Browse Discovery</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Status Overview - Empty State */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Status</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {["Hosts", "Profiles", "Server Instances"].map((item, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-6 flex flex-col items-center justify-center h-[180px] text-center">
                <p className="text-muted-foreground">No {item.toLowerCase()} configured yet</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <GettingStartedDialog 
        open={showOnboarding}
        onOpenChange={setShowOnboarding}
      />
    </div>
  );
};

export default NewUserDashboard;
