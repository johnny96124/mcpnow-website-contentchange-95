
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ChevronDown, 
  ChevronUp, 
  AlertTriangle, 
  Clock, 
  ArrowRight, 
  ArrowLeft,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Loader2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface ServerEvent {
  id: string;
  timestamp: string;
  type: 'server' | 'client';
  content: any;
  isError?: boolean;
  profileName?: string;
  hostName?: string;
  method?: string;
  params?: any;
  jsonrpc?: string;
  messageType?: 'request' | 'result' | 'error' | 'notification';
  progress?: 'ongoing' | 'completed' | 'failed';
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
    return timestamp.split(' ')[0];
  };
  
  const formatJSON = (data: any): string => {
    try {
      return JSON.stringify(data, null, 2);
    } catch (e) {
      return String(data);
    }
  };
  
  const getMessageTypeIcon = (event: ServerEvent) => {
    if (event.type === 'client') {
      return <ArrowRight className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />;
    }
    if (event.isError) {
      return <XCircle className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />;
    }
    if (event.messageType === 'result' && event.progress === 'completed') {
      return <CheckCircle2 className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />;
    }
    if (event.messageType === 'result' && event.progress === 'ongoing') {
      return <Loader2 className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 animate-spin" />;
    }
    if (event.messageType === 'notification') {
      return <MessageSquare className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />;
    }
    return <ArrowLeft className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />;
  };
  
  const getEventSummary = (event: ServerEvent): string => {
    if (event.method) {
      return `${event.method}`;
    } else if (typeof event.content === 'object' && event.content) {
      if (event.content.text) return event.content.text.substring(0, 60) + (event.content.text.length > 60 ? '...' : '');
      return 'Event data';
    }
    return 'Event';
  };

  const getMessageTypeBadge = (event: ServerEvent) => {
    let variant: "outline" | "default" = "outline";
    let className = "text-[10px] py-0 h-5";
    
    if (event.messageType === 'request') {
      className += " bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-200";
    } else if (event.messageType === 'result') {
      className += " bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200";
    } else if (event.messageType === 'notification') {
      className += " bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 border-purple-200";
    } else if (event.isError) {
      className += " bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200";
    }

    return (
      <Badge variant={variant} className={className}>
        {event.messageType || (event.isError ? 'error' : 'event')}
      </Badge>
    );
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
                <span className="font-semibold">{formatTime(event.timestamp)}</span>
                {getMessageTypeBadge(event)}
                {getMessageTypeIcon(event)}
                <span className="max-w-[300px] truncate">{getEventSummary(event)}</span>
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
