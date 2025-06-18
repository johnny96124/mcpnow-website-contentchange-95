
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Server, 
  FolderOpen, 
  Monitor, 
  Bot, 
  Settings, 
  Search,
  GitCompare,
  Telescope,
  AlertTriangle,
  Zap,
  Bug,
  TrendingUp,
  Workflow,
  BarChart3
} from 'lucide-react';
import { InputSuggestion, PromptTemplate, ResourceItem } from './types';

interface SuggestionsPanelProps {
  suggestions: InputSuggestion[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  triggerType: 'template' | 'resource';
}

const iconMap = {
  Server,
  FolderOpen,
  Monitor,
  Bot,
  Settings,
  Search,
  GitCompare,
  Telescope,
  AlertTriangle,
  Zap,
  Bug,
  TrendingUp,
  Workflow,
  BarChart3
};

const categoryColors = {
  Management: 'bg-blue-100 text-blue-800',
  Discovery: 'bg-green-100 text-green-800',
  Troubleshooting: 'bg-red-100 text-red-800',
  Optimization: 'bg-purple-100 text-purple-800'
};

const statusColors = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  error: 'bg-red-100 text-red-800'
};

export const SuggestionsPanel: React.FC<SuggestionsPanelProps> = ({
  suggestions,
  selectedIndex,
  onSelect,
  triggerType
}) => {
  const renderTemplateItem = (template: PromptTemplate, index: number, isSelected: boolean) => {
    const IconComponent = iconMap[template.icon as keyof typeof iconMap] || Search;
    
    return (
      <div
        key={template.id}
        className={`p-3 cursor-pointer transition-colors ${
          isSelected ? 'bg-primary/10 border-primary/20' : 'hover:bg-muted/50'
        } border-b last:border-b-0`}
        onClick={() => onSelect(index)}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            <IconComponent className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-sm">{template.title}</span>
              <Badge 
                variant="secondary" 
                className={`text-xs ${categoryColors[template.category]}`}
              >
                {template.category}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {template.description}
            </p>
            {template.variables && template.variables.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {template.variables.slice(0, 3).map(variable => (
                  <Badge key={variable} variant="outline" className="text-xs px-1 py-0">
                    {variable}
                  </Badge>
                ))}
                {template.variables.length > 3 && (
                  <Badge variant="outline" className="text-xs px-1 py-0">
                    +{template.variables.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderResourceItem = (resource: ResourceItem, index: number, isSelected: boolean) => {
    const IconComponent = iconMap[resource.icon as keyof typeof iconMap] || Server;
    
    return (
      <div
        key={resource.id}
        className={`p-3 cursor-pointer transition-colors ${
          isSelected ? 'bg-primary/10 border-primary/20' : 'hover:bg-muted/50'
        } border-b last:border-b-0`}
        onClick={() => onSelect(index)}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            <IconComponent className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-sm">{resource.name}</span>
              <Badge variant="secondary" className="text-xs">
                {resource.type}
              </Badge>
              {resource.status && (
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${statusColors[resource.status]}`}
                >
                  {resource.status}
                </Badge>
              )}
            </div>
            {resource.description && (
              <p className="text-xs text-muted-foreground line-clamp-1">
                {resource.description}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (suggestions.length === 0) {
    return (
      <Card className="absolute bottom-full left-0 right-0 mb-2 p-4 text-center bg-background border shadow-lg z-50">
        <p className="text-sm text-muted-foreground">
          {triggerType === 'template' 
            ? 'No prompt templates found' 
            : 'No resources found'
          }
        </p>
      </Card>
    );
  }

  return (
    <Card className="absolute bottom-full left-0 right-0 mb-2 bg-background border shadow-lg z-50 max-h-80">
      <div className="p-2 border-b bg-muted/20">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            {triggerType === 'template' ? 'Prompt Templates' : 'Resources'}
          </span>
          <Badge variant="outline" className="text-xs">
            {suggestions.length}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Use ↑↓ to navigate, Enter to select, Esc to close
        </p>
      </div>
      <ScrollArea className="max-h-60">
        {suggestions.map((suggestion, index) => {
          const isSelected = index === selectedIndex;
          
          if (suggestion.type === 'template') {
            return renderTemplateItem(suggestion.item as PromptTemplate, index, isSelected);
          } else {
            return renderResourceItem(suggestion.item as ResourceItem, index, isSelected);
          }
        })}
      </ScrollArea>
    </Card>
  );
};
