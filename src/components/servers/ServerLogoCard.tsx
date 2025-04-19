
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ServerLogoCardProps {
  id: string;
  name: string;
  description: string;
  downloads: number;
  logo: string;
  onViewDetails?: () => void;
}

const ServerLogoCard = ({ 
  name, 
  description, 
  downloads, 
  logo, 
  onViewDetails 
}: ServerLogoCardProps) => {
  return (
    <Card className="h-full border border-gray-200 dark:border-gray-700 transition-all duration-300">
      <CardHeader className="space-y-0 p-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl group-hover:text-primary transition-colors">
            {name}
          </CardTitle>
          <img 
            src={logo} 
            alt={`${name} logo`}
            className="w-8 h-8 object-contain opacity-60 dark:opacity-40"
          />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 p-4 pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2 h-10">
          {description}
        </p>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            {(downloads / 1000).toFixed(1)}k downloads
          </span>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onViewDetails}
            className="hover:bg-primary hover:text-primary-foreground"
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServerLogoCard;
