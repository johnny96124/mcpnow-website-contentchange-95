import { Eye, Download, UserRound, Clock } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EndpointLabel } from "@/components/status/EndpointLabel";
import { OfficialBadge } from "@/components/discovery/OfficialBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { EndpointType } from "@/data/mockData";

interface ServerLogoCardProps {
  id: string;
  name: string;
  description: string;
  downloads: number;
  views?: number;
  type?: EndpointType | 'Custom' | 'WS';
  isOfficial?: boolean;
  author?: string;
  updated?: string;
  onViewDetails?: () => void;
  onInstall?: () => void;
  installing?: boolean;
  installed?: boolean;
}

const ServerLogoCard = ({ 
  name, 
  description, 
  views,
  type,
  isOfficial,
  author,
  updated,
  onViewDetails,
  onInstall,
  installing,
  installed
}: ServerLogoCardProps) => {
  const formatViews = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const getTimeAgo = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 30) return `${diffDays} days ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  return (
    <Card className="flex flex-col overflow-hidden hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-800 cursor-pointer group relative">
      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      
      <CardHeader className="pb-2 space-y-0 px-5 pt-5">
        <div className="flex justify-between items-start gap-2 mb-1">
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-blue-600 transition-colors">
              {name}
            </h3>
            <div className="flex items-center gap-1.5 mt-1">
              {type && <EndpointLabel type={type} />}
              {isOfficial && <OfficialBadge />}
            </div>
          </div>
          
          {views !== undefined && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Eye className="h-3.5 w-3.5 mr-1" />
              {formatViews(views)}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="px-5 py-2 flex-1">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {description}
        </p>
      </CardContent>
      
      <CardContent className="px-5 py-4 border-t bg-gray-50 dark:bg-gray-900">
        <div className="flex items-start justify-between w-full">
          <div className="flex flex-col text-xs text-muted-foreground w-3/5">
            <div className="grid grid-cols-1 gap-1">
              {author && (
                <div className="flex items-center">
                  <UserRound className="h-3.5 w-3.5 mr-1.5 text-blue-600 flex-shrink-0" />
                  <span className="font-medium">{author}</span>
                </div>
              )}
              
              {updated && (
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1.5 text-gray-400 flex-shrink-0" />
                  <span>Updated {getTimeAgo(updated)}</span>
                </div>
              )}
            </div>
          </div>
          
          {onInstall && (
            <Button 
              size="sm" 
              variant={installed ? "outline" : "default"}
              onClick={(e) => {
                e.stopPropagation();
                onInstall();
              }}
              className={`h-8 relative z-10 ${
                installed 
                  ? "text-green-600 bg-green-50 border-green-200 hover:bg-green-100" 
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              disabled={installing}
            >
              {installing ? (
                <>
                  <div className="h-3.5 w-3.5 mr-1.5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                  Installing...
                </>
              ) : installed ? (
                <>
                  <div className="h-2 w-2 bg-green-500 rounded-full mr-1.5" />
                  Installed
                </>
              ) : (
                <>
                  <Download className="h-3.5 w-3.5 mr-1.5" />
                  Install
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ServerLogoCard;
