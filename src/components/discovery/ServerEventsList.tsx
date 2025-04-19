import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, ChevronUp, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ServerEvent, EventCategory, EventType } from "@/types/events";

const CATEGORY_COLORS: Record<EventCategory, { bg: string; text: string; border: string }> = {
  Tools: { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-200" },
  Resources: { bg: "bg-green-100", text: "text-green-800", border: "border-green-200" },
  Prompts: { bg: "bg-purple-100", text: "text-purple-800", border: "border-purple-200" },
  Ping: { bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-200" },
  Sampling: { bg: "bg-orange-100", text: "text-orange-800", border: "border-orange-200" },
  Roots: { bg: "bg-red-100", text: "text-red-800", border: "border-red-200" }
};

const EVENT_TYPE_COLORS: Record<EventType, { bg: string; text: string; border: string }> = {
  request: { bg: "bg-blue-50", text: "text-blue-800", border: "border-blue-200" },
  response: { bg: "bg-green-50", text: "text-green-800", border: "border-green-200" },
  error: { bg: "bg-red-50", text: "text-red-800", border: "border-red-200" },
  notification: { bg: "bg-yellow-50", text: "text-yellow-800", border: "border-yellow-200" }
};

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
    return {
      date: format(date, "MMM dd, yyyy"),
      time: format(date, "HH:mm:ss")
    };
  };
  
  const formatMethodDetails = (method: string, params: any) => {
    if (!method) return '';
    let details = '';
    if (method === 'tools/call' && params?.name) {
      details = params.name;
      if (params.arguments) {
        details += ` (${Object.values(params.arguments).join(', ')})`;
      }
    }
    return details;
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
        {events.map((event) => {
          const { date, time } = formatTimestamp(event.timestamp);
          const methodDetails = formatMethodDetails(event.method || '', event.params);
          const isSuccess = !event.isError && event.type === 'response';
          
          return (
            <div 
              key={event.id} 
              className={cn(
                "border rounded-md overflow-hidden transition-all border-gray-200 dark:border-gray-800"
              )}
            >
              <div 
                className={cn(
                  "flex items-center justify-between px-3 py-2 text-xs font-mono cursor-pointer bg-white dark:bg-gray-900"
                )}
                onClick={() => toggleEventExpansion(event.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex flex-col items-start text-gray-800 dark:text-gray-200">
                    <span className="text-[10px] text-gray-500 dark:text-gray-400">{date}</span>
                    <span className="font-semibold">{time}</span>
                  </div>

                  {event.category && (
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-[10px] py-0 h-5",
                        CATEGORY_COLORS[event.category].text,
                        CATEGORY_COLORS[event.category].border
                      )}
                    >
                      {event.category}
                    </Badge>
                  )}

                  {event.isError ? (
                    <AlertTriangle className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                  ) : (
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                  )}

                  {event.method && (
                    <div className="flex items-center gap-2 max-w-[300px]">
                      <span className="font-medium">{event.method}</span>
                      {methodDetails && (
                        <span className="text-gray-500 dark:text-gray-400 truncate max-w-[150px]">
                          {methodDetails}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  {event.profileName && (
                    <Badge variant="secondary" className="text-xs">
                      {event.profileName}
                    </Badge>
                  )}
                  {event.hostName && (
                    <Badge variant="secondary" className="text-xs">
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
                <div className="flex flex-col">
                  {/* Show Request section */}
                  <div 
                    className={cn(
                      "p-3 font-mono text-xs overflow-auto bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800"
                    )}
                  >
                    <div className="flex items-center mb-2">
                      <span className="font-bold mr-2 uppercase text-blue-600 dark:text-blue-400">Request</span>
                    </div>
                    <pre className="whitespace-pre-wrap break-all text-black dark:text-white">
                      {JSON.stringify(event.params || event.content, null, 2)}
                    </pre>
                  </div>
                  
                  {/* Show Response or Error section */}
                  <div 
                    className={cn(
                      "p-3 font-mono text-xs overflow-auto bg-white dark:bg-gray-900 border-t",
                      isSuccess
                        ? "border-green-200 dark:border-green-800"
                        : event.isError 
                          ? "border-red-200 dark:border-red-800" 
                          : "border-gray-200 dark:border-gray-800"
                    )}
                  >
                    <div className="flex items-center mb-2">
                      <span className={cn(
                        "font-bold mr-2 uppercase",
                        isSuccess 
                          ? "text-green-600 dark:text-green-400" 
                          : event.isError 
                            ? "text-red-600 dark:text-red-400" 
                            : "text-gray-600 dark:text-gray-400"
                      )}>
                        {event.isError ? 'Error' : 'Response'}
                      </span>
                    </div>
                    <pre className="whitespace-pre-wrap break-all text-black dark:text-white">
                      {JSON.stringify(event.content, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
