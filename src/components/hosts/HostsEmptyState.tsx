import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Monitor, PlusCircle, Workflow, ArrowRight } from "lucide-react";
interface HostsEmptyStateProps {
  onAddHost: () => void;
}
export const HostsEmptyState: React.FC<HostsEmptyStateProps> = ({
  onAddHost
}) => {
  return <div className="max-w-4xl mx-auto py-10">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight mb-2">Dashboard</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Manage your hosts, profiles, and servers to efficiently configure your MCP environment
        </p>
      </div>
      
      <Card className="border-2 border-dashed mb-8">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-muted/50 p-4 rounded-full mb-4">
            <Monitor className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No hosts available</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            You haven't added any hosts yet. Add a host to get started with MCP Now.
          </p>
          <Button onClick={onAddHost} size="lg">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Your First Host
          </Button>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mb-4">
                <Monitor className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-medium mb-2">Connect hosts</h3>
              <p className="text-sm text-muted-foreground">
                Add local or remote MCP hosts to your dashboard
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full mb-4">
                <Workflow className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-medium mb-2">Manage profiles</h3>
              <p className="text-sm text-muted-foreground">
                Create profiles to organize your server configurations
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full mb-4">
                <ArrowRight className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-medium mb-2">Launch servers</h3>
              <p className="text-sm text-muted-foreground">
                Start and manage your MCP servers with ease
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="text-center">
        
      </div>
    </div>;
};