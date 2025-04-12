
import React, { useState } from "react";
import { 
  Check, 
  CheckCircle, 
  ChevronLeft, 
  Clock, 
  Download, 
  Eye, 
  FolderOpen,
  Loader2, 
  UserRound, 
  Star, 
  Tag, 
  Wrench, 
  X,
  Link2,
  ExternalLink
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { EndpointLabel } from "@/components/status/EndpointLabel";
import { OfficialBadge } from "@/components/discovery/OfficialBadge";
import { ServerTools } from "@/components/discovery/ServerTools";
import { EnhancedServerDefinition } from "@/data/mockData";
import { useNavigate } from "react-router-dom";

interface ServerDetailDialogProps {
  server: EnhancedServerDefinition | null;
  isOpen: boolean;
  onClose: () => void;
  isInstalling: boolean;
  isInstalled: boolean;
  installButtonHover: boolean;
  onInstall: (id: string) => void;
  onMouseEnterInstallButton: () => void;
  onMouseLeaveInstallButton: () => void;
}

export const ServerDetailDialog: React.FC<ServerDetailDialogProps> = ({
  server,
  isOpen,
  onClose,
  isInstalling,
  isInstalled,
  installButtonHover,
  onInstall,
  onMouseEnterInstallButton,
  onMouseLeaveInstallButton,
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  const handleNavigateToServers = () => {
    navigate("/servers");
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  if (!server) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden bg-white dark:bg-gray-900">
        <div className="flex flex-col h-full">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <DialogTitle className="text-xl font-bold leading-tight text-white">
                  {server.name}
                </DialogTitle>
                
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <EndpointLabel type={server.type} />
                  {server.isOfficial && <OfficialBadge />}
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
            className="flex-1 flex flex-col overflow-hidden"
          >
            <div className="border-b px-6">
              <TabsList className="bg-transparent p-0 h-12">
                <TabsTrigger 
                  value="overview" 
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none px-4 h-12"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="tools" 
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none px-4 h-12"
                >
                  <Wrench className="h-4 w-4 mr-1.5" />
                  Tools
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="overview" className="mt-0 flex-1 overflow-auto">
              <div className="p-6 space-y-6 overflow-auto">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-base font-semibold mb-3 text-gray-800 dark:text-gray-200">
                        Description
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {server.description}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-base font-semibold mb-3 text-gray-800 dark:text-gray-200">
                        Author
                      </h3>
                      <div className="flex items-center">
                        <UserRound className="h-4 w-4 mr-2 text-blue-600" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {server.author || `${server.name.split(' ')[0]} Team`}
                        </span>
                      </div>
                    </div>

                    {server.version && (
                      <div>
                        <h3 className="text-base font-semibold mb-3 text-gray-800 dark:text-gray-200">
                          Version
                        </h3>
                        <div className="flex items-center">
                          <Tag className="h-4 w-4 mr-2 text-blue-600" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {server.version}
                          </span>
                        </div>
                      </div>
                    )}

                    {(server.url || server.repository) && (
                      <div>
                        <h3 className="text-base font-semibold mb-3 text-gray-800 dark:text-gray-200">
                          Links
                        </h3>
                        <div className="space-y-2">
                          {server.repository && (
                            <div className="flex items-center">
                              <Link2 className="h-4 w-4 mr-2 text-blue-600" />
                              <a 
                                href={server.repository}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Repository
                                <ExternalLink className="h-3 w-3 inline-block ml-1" />
                              </a>
                            </div>
                          )}
                          {server.url && (
                            <div className="flex items-center">
                              <ExternalLink className="h-4 w-4 mr-2 text-blue-600" />
                              <a 
                                href={server.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Documentation
                                <ExternalLink className="h-3 w-3 inline-block ml-1" />
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <h3 className="text-base font-semibold mb-3 text-gray-800 dark:text-gray-200">
                        Features
                      </h3>
                      <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-600 dark:text-gray-300 pl-1">
                        {server.features?.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-base font-semibold mb-3 text-gray-800 dark:text-gray-200">
                        Categories
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {server.categories?.map(category => (
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
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-base font-semibold mb-3 text-gray-800 dark:text-gray-200">
                        Usage Statistics
                      </h3>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="bg-white dark:bg-gray-900 rounded-md p-3">
                          <div className="text-xl font-bold text-gray-800 dark:text-gray-200">
                            {formatNumber(server.views || 1320)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">Views</div>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-900 rounded-md p-3">
                          <div className="text-xl font-bold text-gray-800 dark:text-gray-200">
                            {formatNumber(server.downloads || 386)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">Installs</div>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-900 rounded-md p-3">
                          <div className="text-xl font-bold text-gray-800 dark:text-gray-200">
                            {formatNumber(server.watches || 215)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">Stars</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="tools" className="mt-0 flex-1 overflow-auto">
              <div className="p-6">
                <ServerTools tools={server.tools || []} />
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end p-5 border-t gap-3 bg-gray-50 dark:bg-gray-800/50">
            <Button
              variant="outline"
              onClick={onClose}
              size="sm"
            >
              Close
            </Button>
            
            {isInstalled ? (
              <Button 
                variant="outline"
                size="sm"
                className={`
                  ${installButtonHover ?
                    "text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100" :
                    "text-green-600 bg-green-50 border-green-200 hover:bg-green-100"
                  }
                `}
                onClick={(e) => {
                  e.stopPropagation();
                  handleNavigateToServers();
                }}
                onMouseEnter={onMouseEnterInstallButton}
                onMouseLeave={onMouseLeaveInstallButton}
              >
                {installButtonHover ? (
                  <>
                    <Check className="h-3.5 w-3.5 mr-2" />
                    Check
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-3.5 w-3.5 mr-2" />
                    Installed
                  </>
                )}
              </Button>
            ) : isInstalling ? (
              <Button 
                disabled
                size="sm"
                className="bg-blue-50 text-blue-600 border-blue-200"
              >
                <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                Installing...
              </Button>
            ) : (
              <Button 
                onClick={(e) => {
                  e.stopPropagation();
                  onInstall(server.id);
                }}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Download className="h-3.5 w-3.5 mr-2" />
                Install Server
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
