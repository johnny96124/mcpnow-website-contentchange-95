
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronDown, 
  ChevronUp, 
  AlertTriangle, 
  Clock,
  ArrowRight,
  Bell,
  Check,
  Loader2,
  MessageSquare
} from "lucide-react";

export interface ServerEvent {
  id: string;
  timestamp: string;
  type: 'request' | 'result' | 'error' | 'notification';
  content: any;
  requestId?: string; // To link results/errors with their request
  method?: string;
  params?: any;
  isComplete?: boolean; // For results to indicate if it's the final one
  errorCode?: number;
  errorMessage?: string;
  profileName?: string;
  hostName?: string;
}

interface ServerEventsListProps {
  events: ServerEvent[];
  instanceName?: string;
}

export function ServerEventsList({ events, instanceName }: ServerEventsListProps) {
  const [expandedEvents, setExpandedEvents] = useState<Record<string, boolean>>({});
  
  const toggleEventExpansion = (eventId: string) => {
    setExpandedEvents(prev => ({
      ...prev,
      [eventId]: !prev[eventId]
    }));
  };
  
  const formatTime = (timestamp: string) => {
    return timestamp.split(' ')[0]; // Extract just the time portion
  };
  
  const formatJSON = (data: any): string => {
    try {
      return JSON.stringify(data, null, 2);
    } catch (e) {
      return String(data);
    }
  };

  const getEventIcon = (event: ServerEvent) => {
    switch (event.type) {
      case 'request':
        return <ArrowRight className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />;
      case 'result':
        return event.isComplete ? 
          <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400" /> :
          <Loader2 className="h-3.5 w-3.5 text-yellow-600 dark:text-yellow-400 animate-spin" />;
      case 'error':
        return <AlertTriangle className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />;
      case 'notification':
        return <Bell className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />;
      default:
        return <MessageSquare className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getEventColor = (event: ServerEvent): string => {
    switch (event.type) {
      case 'request':
        return 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20';
      case 'result':
        return 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20';
      case 'error':
        return 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20';
      case 'notification':
        return 'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20';
      default:
        return 'border-gray-200 dark:border-gray-800';
    }
  };

  const getEventHeaderColor = (event: ServerEvent): string => {
    switch (event.type) {
      case 'request':
        return 'bg-blue-100 dark:bg-blue-900/30';
      case 'result':
        return 'bg-green-100 dark:bg-green-900/30';
      case 'error':
        return 'bg-red-100 dark:bg-red-900/30';
      case 'notification':
        return 'bg-purple-100 dark:bg-purple-900/30';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const getEventBadgeColor = (event: ServerEvent): string => {
    switch (event.type) {
      case 'request':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200';
      case 'result':
        return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200';
      case 'error':
        return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200';
      case 'notification':
        return 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 border-purple-200';
      default:
        return 'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-300 border-gray-200';
    }
  };

  if (events.length === 0) {
    return (
      <div className="py-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-800">
            <Clock className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </div>
        </div>
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">No events recorded</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Events will appear here when communication occurs with this instance.
        </p>
      </div>
    );
  }

  // Group events by request ID to show relationships
  const groupedEvents = events.reduce((acc: Record<string, ServerEvent[]>, event) => {
    const key = event.requestId || event.id;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(event);
    return acc;
  }, {});
  
  return (
    <ScrollArea className="h-[500px] pr-4">
      <div className="space-y-2">
        {Object.entries(groupedEvents).map(([groupId, groupEvents]) => (
          <div key={groupId} className="space-y-1">
            {groupEvents.map((event, index) => (
              <div 
                key={event.id}
                className={cn(
                  "border rounded-md overflow-hidden transition-all",
                  getEventColor(event),
                  // Indent related events
                  index > 0 && "ml-4"
                )}
              >
                <div 
                  className={cn(
                    "flex items-center justify-between px-3 py-2 text-xs font-mono cursor-pointer",
                    getEventHeaderColor(event)
                  )}
                  onClick={() => toggleEventExpansion(event.id)}
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">{formatTime(event.timestamp)}</span>
                    {getEventIcon(event)}
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-[10px] py-0 h-5",
                        getEventBadgeColor(event)
                      )}
                    >
                      {event.type}
                    </Badge>
                    {event.method && (
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {event.method}
                      </span>
                    )}
                    {event.type === 'error' && (
                      <span className="text-red-600 dark:text-red-400">
                        {event.errorMessage}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {event.profileName && (
                      <Badge variant="outline" className="bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 border-purple-200">
                        {event.profileName}
                      </Badge>
                    )}
                    {event.hostName && (
                      <Badge variant="outline" className="bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 border-amber-200">
                        {event.hostName}
                      </Badge>
                    )}
                    {expandedEvents[event.id] ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </div>
                
                {expandedEvents[event.id] && (
                  <div className="p-3 bg-white dark:bg-gray-900 font-mono text-xs overflow-auto">
                    <pre className="whitespace-pre-wrap break-all">
                      {formatJSON(event.content)}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
