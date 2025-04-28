
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ServerLogo } from "@/components/servers/ServerLogo";
import { EndpointLabel } from "@/components/status/EndpointLabel";
import { ServerToolsList } from "@/components/discovery/ServerToolsList";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar, Globe, Info, Tag, UserRound, Wrench, X } from "lucide-react";
import { ServerInstance, serverDefinitions } from "@/data/mockData";

interface ServerDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  server: ServerInstance | null;
}

export function ServerDetailsDialog({
  open,
  onOpenChange,
  server
}: ServerDetailsDialogProps) {
  const [activeTab, setActiveTab] = React.useState("overview");

  if (!server) return null;

  const definition = serverDefinitions.find(def => def.id === server.definitionId);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-white dark:bg-gray-900">
        <div className="h-full flex flex-col">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-4">
                <ServerLogo 
                  name={server.name} 
                  className="w-14 h-14 bg-white/10 border-white/20" 
                />
                <div className="space-y-1">
                  <DialogTitle className="text-xl font-bold leading-tight text-white">
                    {server.name}
                  </DialogTitle>
                  
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <EndpointLabel type={definition?.type || "STDIO"} />
                    {definition?.isOfficial && (
                      <Badge variant="outline" className="bg-white/10 text-white border-white/20">
                        Official
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <DialogClose className="rounded-full p-1.5 hover:bg-white/20 transition-colors">
                <X className="h-5 w-5" />
              </DialogClose>
            </div>
          </div>
          
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full flex-1 flex flex-col"
          >
            <div className="border-b border-gray-200 dark:border-gray-800">
              <TabsList className="bg-transparent px-6 pt-2 h-auto">
                <TabsTrigger 
                  value="overview" 
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none px-3 pb-2"
                >
                  <Info className="h-4 w-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="tools"
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none px-3 pb-2"
                >
                  <Wrench className="h-4 w-4 mr-2" />
                  Tools
                  {definition?.tools && definition.tools.length > 0 && (
                    <Badge className="ml-1.5 text-[10px] bg-blue-600/20 text-blue-700 dark:bg-blue-600/30 dark:text-blue-300 border-none">
                      {definition.tools.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="overview" className="mt-0 pt-0 h-[500px] overflow-auto">
                <div className="p-6 space-y-6">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-base font-semibold mb-3 text-gray-800 dark:text-gray-200">
                          Description
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {definition?.description || "No description available"}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-base font-semibold mb-3 text-gray-800 dark:text-gray-200">
                          Author
                        </h3>
                        <div className="flex items-center">
                          <UserRound className="h-4 w-4 mr-2 text-blue-600" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {definition?.author || server.name.split(' ')[0]}
                          </span>
                        </div>
                      </div>
                      
                      {definition?.features && (
                        <div>
                          <h3 className="text-base font-semibold mb-3 text-gray-800 dark:text-gray-200">
                            Features
                          </h3>
                          <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-600 dark:text-gray-300 pl-1">
                            {definition.features.map((feature, index) => (
                              <li key={index}>{feature}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {definition?.categories && (
                        <div>
                          <h3 className="text-base font-semibold mb-3 text-gray-800 dark:text-gray-200">
                            Categories
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {definition.categories.map(category => (
                              <Badge 
                                key={category} 
                                variant="outline" 
                                className="bg-blue-50 border-blue-100 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300 text-xs px-3 py-0.5 rounded-full"
                              >
                                <Tag className="h-3 w-3 mr-1.5" />
                                {category}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-6">
                      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-md p-5 space-y-4">
                        <div>
                          <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Version</h3>
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                            {definition?.version || "1.0.0"}
                          </p>
                        </div>
                        
                        <div>
                          <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Connection Details</h3>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                            <span className="text-sm text-gray-800 dark:text-gray-200">
                              {server.connectionDetails || "Not specified"}
                            </span>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Repository</h3>
                          {definition?.repository ? (
                            <a 
                              href={definition.repository}
                              className="text-sm text-blue-600 flex items-center hover:underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Globe className="h-4 w-4 mr-2" />
                              <span className="truncate">
                                {definition.repository}
                              </span>
                            </a>
                          ) : (
                            <span className="text-sm text-gray-500">Not available</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="tools" className="mt-0 pt-0 h-[500px] overflow-auto">
                <div className="p-6">
                  {definition?.tools && definition.tools.length > 0 ? (
                    <ServerToolsList 
                      tools={definition.tools} 
                      isDiscoveryView={false}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-4 mb-4">
                        <Wrench className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">No tools available</h3>
                      <p className="text-muted-foreground max-w-md">
                        This server definition does not include any custom tools or utilities.
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
