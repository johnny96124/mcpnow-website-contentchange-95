
import { useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Monitor, Database, Server, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { GettingStartedDialog } from "@/components/onboarding/GettingStartedDialog";

const NewUserDashboard = () => {
  const [showOnboarding, setShowOnboarding] = useState(true);

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
          {/* Host Status */}
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-lg font-medium">Connected Hosts</CardTitle>
                <CardDescription>0 of 0 hosts connected</CardDescription>
              </div>
              <Monitor className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-4 flex-1 flex items-center justify-center min-h-[140px]">
              <div className="text-center">
                <div className="rounded-full bg-muted/50 p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Monitor className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">No Hosts Connected</h3>
                <p className="text-sm text-muted-foreground">Add hosts to manage your infrastructure</p>
              </div>
            </CardContent>
            <CardFooter className="pt-2 mt-auto border-t">
              <Button asChild className="w-full">
                <Link to="/hosts">Add Host</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Profile Status */}
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-lg font-medium">Active Profiles</CardTitle>
                <CardDescription>0 of 0 profiles enabled</CardDescription>
              </div>
              <Database className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-4 flex-1 flex items-center justify-center min-h-[140px]">
              <div className="text-center">
                <div className="rounded-full bg-muted/50 p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Database className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">No Profiles Created</h3>
                <p className="text-sm text-muted-foreground">Create profiles to manage your API connections</p>
              </div>
            </CardContent>
            <CardFooter className="pt-2 mt-auto border-t">
              <Button asChild className="w-full">
                <Link to="/profiles">Create Profile</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Server Status */}
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-lg font-medium">Server Instances</CardTitle>
                <CardDescription>0 of 0 instances running</CardDescription>
              </div>
              <Settings2 className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-4 flex-1 flex items-center justify-center min-h-[140px]">
              <div className="text-center">
                <div className="rounded-full bg-muted/50 p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Server className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">No Server Instances</h3>
                <p className="text-sm text-muted-foreground">Add server instances to expand functionality</p>
              </div>
            </CardContent>
            <CardFooter className="pt-2 mt-auto border-t">
              <Button asChild className="w-full">
                <Link to="/servers">Add Server Instance</Link>
              </Button>
            </CardFooter>
          </Card>
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
