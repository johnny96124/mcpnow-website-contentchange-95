
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface ServerEvent {
  id: string;
  timestamp: string;
  type: 'request' | 'response' | 'error' | 'notification';
  content: any;
  isError?: boolean;
  profileName?: string;
  hostName?: string;
  method?: string;
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
  
  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
  };
  
  const formatJSON = (data: any): string => {
    try {
      return JSON.stringify(data, null, 2);
    } catch (e) {
      return String(data);
    }
  };
  
  const getMethodDetails = (event: ServerEvent): { title: string; details?: string } => {
    if (event.method?.toLowerCase().includes('tools/call')) {
      const toolName = event.params?.name || '';
      const toolArgs = event.params?.arguments || {};
      return {
        title: 'Tools/call',
        details: `${toolName} ${Object.values(toolArgs).join(' ')}`
      };
    }
    return { title: event.method || 'Event' };
  };

  if (events.length === 0) {
    return (
      <div className="py-8 text-center">
        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">No events recorded</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Events will appear here when communication occurs.
        </p>
      </div>
    );
  }
  
  return (
    <ScrollArea className="h-[500px] pr-4">
      <div className="space-y-2">
        {events.map((event) => {
          const { date, time } = formatDateTime(event.timestamp);
          const methodInfo = getMethodDetails(event);
          
          return (
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
                  "flex flex-col px-3 py-2 text-xs font-mono cursor-pointer",
                  event.isError 
                    ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                    : "bg-gray-50 dark:bg-gray-800/50"
                )}
                onClick={() => toggleEventExpansion(event.id)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">{date}</span>
                  {expandedEvents[event.id] ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">{time}</span>
                  <Badge 
                    variant="outline" 
                    className="text-[10px] py-0 h-5 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200"
                  >
                    {event.type === 'request' ? 'Tools' : event.type}
                  </Badge>
                  
                  <div className="flex-1 flex items-center space-x-2">
                    <span className="text-gray-700 dark:text-gray-300">{methodInfo.title}</span>
                    {methodInfo.details && (
                      <span className="text-gray-500 dark:text-gray-400 truncate">
                        ({methodInfo.details.length > 30 ? methodInfo.details.substring(0, 30) + '...' : methodInfo.details})
                      </span>
                    )}
                  </div>
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
          );
        })}
      </div>
    </ScrollArea>
  );
}
