
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, ChevronUp, AlertTriangle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface ServerEvent {
  id: string;
  timestamp: string;
  type: 'request' | 'response' | 'error' | 'notification';
  direction: 'incoming' | 'outgoing';
  content: any;
  method?: string;
  toolDetails?: string;
  isError?: boolean;
  profileName?: string;
  hostName?: string;
  params?: any;
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
  
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  const formatJSON = (data: any): string => {
    try {
      return JSON.stringify(data, null, 2);
    } catch (e) {
      return String(data);
    }
  };
  
  const getEventSummary = (event: ServerEvent): string => {
    if (event.method && event.toolDetails) {
      const summary = `${event.toolDetails}`;
      return summary.length > 60 ? summary.substring(0, 60) + '...' : summary;
    }
    return 'Event';
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
  
  return (
    <ScrollArea className="h-[500px] pr-4">
      <div className="space-y-2">
        {events.map((event) => (
          <div 
            key={event.id} 
            className={cn(
              "border rounded-md overflow-hidden transition-all",
              event.isError 
                ? "border-red-400 dark:border-red-800 bg-red-50 dark:bg-red-900/20" 
                : "border-gray-200 dark:border-gray-800"
            )}
          >
            <div 
              className={cn(
                "flex items-center justify-between px-3 py-2 text-xs font-mono cursor-pointer",
                event.isError 
                  ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                  : "bg-gray-50 dark:bg-gray-800/50"
              )}
              onClick={() => toggleEventExpansion(event.id)}
            >
              <div className="flex items-center space-x-2">
                <span className="font-semibold">{formatTimestamp(event.timestamp)}</span>
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-[10px] py-0 h-5",
                    event.direction === 'incoming'
                      ? "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200"
                      : "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300"
                  )}
                >
                  {event.direction}
                </Badge>
                {event.isError && (
                  <AlertTriangle className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                )}
                {event.method && (
                  <span className="text-gray-600 dark:text-gray-400 font-semibold">
                    {event.method}
                  </span>
                )}
                {event.toolDetails && (
                  <span className="text-gray-500 dark:text-gray-500 max-w-[300px] truncate">
                    {event.toolDetails}
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
    </ScrollArea>
  );
}
