
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, ChevronUp, ArrowRight, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export interface ServerEvent {
  id: string;
  timestamp: string;
  type: "request" | "result" | "error" | "notification";
  content: any;
  method?: string;
  params?: any;
  direction: "incoming" | "outgoing";
  progressToken?: number;
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
  
  const formatEventTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return format(date, "yyyy-MM-dd HH:mm:ss");
  };
  
  const formatJSON = (data: any): string => {
    try {
      return JSON.stringify(data, null, 2);
    } catch (e) {
      return String(data);
    }
  };
  
  const getEventSummary = (event: ServerEvent): string => {
    if (event.type === 'request' && event.method) {
      let summary = `${event.method}`;
      if (event.params?.name) {
        summary += `: ${event.params.name}`;
      }
      return summary.length > 60 ? summary.substring(0, 57) + '...' : summary;
    }
    return event.method || 'Event';
  };

  // Group events by progressToken
  const groupEvents = (events: ServerEvent[]) => {
    const groups: Record<string, ServerEvent[]> = {};
    events.forEach(event => {
      const key = event.progressToken?.toString() || event.id;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(event);
    });
    return Object.values(groups);
  };

  const groupedEvents = groupEvents(events);

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
        {groupedEvents.map((group) => {
          const requestEvent = group.find(e => e.type === 'request');
          const groupId = requestEvent?.id || group[0].id;
          
          return (
            <div 
              key={groupId} 
              className="border rounded-md overflow-hidden transition-all border-gray-200 dark:border-gray-800"
            >
              <div 
                className="flex items-center justify-between px-3 py-2 text-xs font-mono cursor-pointer bg-gray-50 dark:bg-gray-800/50"
                onClick={() => toggleEventExpansion(groupId)}
              >
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">
                    {formatEventTimestamp(requestEvent?.timestamp || group[0].timestamp)}
                  </span>
                  <span className="max-w-[400px] truncate">
                    {getEventSummary(requestEvent || group[0])}
                  </span>
                </div>
                <div className="flex items-center">
                  {expandedEvents[groupId] ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </div>
              
              {expandedEvents[groupId] && (
                <div className="p-3 bg-white dark:bg-gray-900 font-mono text-xs overflow-auto">
                  {group.map((event) => (
                    <div key={event.id} className="mb-4 last:mb-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] py-0 h-5",
                            event.direction === 'outgoing' 
                              ? "bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200" 
                              : "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200"
                          )}
                        >
                          {event.direction === 'outgoing' ? (
                            <ArrowRight className="h-3 w-3 mr-1" />
                          ) : (
                            <ArrowLeft className="h-3 w-3 mr-1" />
                          )}
                          {event.type}
                        </Badge>
                      </div>
                      <pre className="whitespace-pre-wrap break-all bg-gray-50 dark:bg-gray-800 p-2 rounded">
                        {formatJSON(event.content)}
                      </pre>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
