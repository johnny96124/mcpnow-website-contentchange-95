
import React, { useState } from "react";
import { 
  Check, 
  CheckCircle, 
  Download, 
  Eye, 
  Loader2, 
  Star, 
  Tag, 
  UserRound, 
  Clock
} from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EndpointLabel } from "@/components/status/EndpointLabel";
import { OfficialBadge } from "@/components/discovery/OfficialBadge";
import { EnhancedServerDefinition } from "@/data/mockData";
import { useNavigate } from "react-router-dom";

interface ServerCardProps {
  server: EnhancedServerDefinition;
  isInstalling: boolean;
  isInstalled: boolean;
  installButtonHover: boolean;
  onInstall: (id: string) => void;
  onViewDetails: (server: EnhancedServerDefinition) => void;
  onMouseEnterInstallButton: () => void;
  onMouseLeaveInstallButton: () => void;
  sortOption: string;
}

export const ServerCard: React.FC<ServerCardProps> = ({
  server,
  isInstalling,
  isInstalled,
  installButtonHover,
  onInstall,
  onViewDetails,
  onMouseEnterInstallButton,
  onMouseLeaveInstallButton,
  sortOption,
}) => {
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

  const getTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 30) return `${diffDays} days ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const getCardStatIcon = () => {
    if (sortOption === "popular") {
      return (
        <div className="flex items-center text-xs text-muted-foreground">
          <Eye className="h-3.5 w-3.5 mr-1" />
          {formatNumber(server.views || 0)}
        </div>
      );
    } else if (sortOption === "installed") {
      return (
        <div className="flex items-center text-xs text-muted-foreground">
          <Download className="h-3.5 w-3.5 mr-1" />
          {formatNumber(server.downloads || 0)}
        </div>
      );
    } else if (sortOption === "stars") {
      return (
        <div className="flex items-center text-xs text-muted-foreground">
          <Star className="h-3.5 w-3.5 mr-1" />
          {formatNumber(server.watches || 0)}
        </div>
      );
    }
    
    return (
      <div className="flex items-center text-xs text-muted-foreground">
        <Eye className="h-3.5 w-3.5 mr-1" />
        {formatNumber(server.views || 0)}
      </div>
    );
  };

  return (
    <Card 
      className="flex flex-col overflow-hidden hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-800 cursor-pointer group relative"
      onClick={() => onViewDetails(server)}
    >
      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
      <CardHeader className="pb-2 space-y-0 px-5 pt-5">
        <div className="flex justify-between items-start gap-2 mb-1">
          <div className="flex flex-col">
            <CardTitle 
              className="text-lg font-semibold text-foreground group-hover:text-blue-600 transition-colors"
            >
              {server.name}
            </CardTitle>
            <div className="flex items-center gap-1.5 mt-1">
              <EndpointLabel type={server.type} />
              {server.isOfficial && <OfficialBadge />}
            </div>
          </div>
          
          <div className="flex items-center gap-1.5">
            {getCardStatIcon()}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="px-5 py-2 flex-1">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {server.description}
        </p>
      </CardContent>
      
      <CardFooter className="px-5 py-4 border-t flex flex-col gap-2 bg-gray-50 dark:bg-gray-900">
        <div className="flex items-start justify-between w-full">
          <div className="flex flex-col text-xs text-muted-foreground w-3/5">
            <div className="grid grid-cols-1 gap-1">
              {server.author && (
                <div className="flex items-center">
                  <UserRound className="h-3.5 w-3.5 mr-1.5 text-blue-600 flex-shrink-0" />
                  <span className="font-medium">
                    {server.author}
                  </span>
                </div>
              )}
              
              {server.updated && (
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1.5 text-gray-400 flex-shrink-0" />
                  <span>Updated {getTimeAgo(server.updated)}</span>
                </div>
              )}
            </div>
          </div>
          
          {isInstalled ? (
            <Button 
              variant="outline" 
              size="sm" 
              className={`
                h-8
                ${installButtonHover ? 
                  "text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100" : 
                  "text-green-600 bg-green-50 border-green-200 hover:bg-green-100"}
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
                  <Check className="h-3.5 w-3.5 mr-1" />
                  Check
                </>
              ) : (
                <>
                  <CheckCircle className="h-3.5 w-3.5 mr-1" />
                  Installed
                </>
              )}
            </Button>
          ) : isInstalling ? (
            <Button 
              variant="outline" 
              size="sm" 
              disabled 
              className="bg-blue-50 text-blue-600 border-blue-200 h-8"
              onClick={(e) => e.stopPropagation()}
            >
              <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
              Installing...
            </Button>
          ) : (
            <Button 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                onInstall(server.id);
              }}
              className="bg-blue-600 hover:bg-blue-700 h-8 relative z-10"
            >
              <Download className="h-3.5 w-3.5 mr-1" />
              Install
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
