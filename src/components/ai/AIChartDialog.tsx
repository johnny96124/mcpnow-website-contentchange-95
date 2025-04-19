
import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Send, CirclePause, Server, ShieldCheck, ShieldAlert, Terminal, Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  services?: string[];
  requiresPermission?: boolean;
  permissionGranted?: boolean;
}

interface ServiceCall {
  id: string;
  name: string;
  status: "pending" | "completed" | "failed";
  result?: any;
  error?: string;
  sensitive?: boolean;
  timestamp: Date;
}

interface InstanceStatus {
  id: string;
  name: string;
  definitionId: string;
  definitionName: string;
  status: 'connected' | 'connecting' | 'error' | 'disconnected';
  enabled: boolean;
  errorMessage?: string;
}

interface AIChartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hostName: string;
  instanceStatuses: InstanceStatus[];
}

export function AIChartDialog({ open, onOpenChange, hostName, instanceStatuses }: AIChartDialogProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "assistant",
      content: `Hello! I'm your MCP Now AI assistant. I can help you configure and manage your MCP services on ${hostName}. What would you like to do today?`,
      timestamp: new Date(),
      services: []
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [serviceCalls, setServiceCalls] = useState<ServiceCall[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [needsPermission, setNeedsPermission] = useState<{messageId: string, services: string[]} | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const availableServices = instanceStatuses.map(status => ({
    id: status.id,
    name: status.definitionName
  }));

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: "user",
      content: inputValue,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);
    
    // Simulate AI processing
    setTimeout(() => {
      // Determine if the message requires permissions
      const requiresPermission = inputValue.toLowerCase().includes("restart") || 
                               inputValue.toLowerCase().includes("shutdown") || 
                               inputValue.toLowerCase().includes("delete") ||
                               inputValue.toLowerCase().includes("modify");
      
      // Determine which services would be called based on the message
      const relevantServices = getRelevantServices(inputValue);
      
      if (requiresPermission && relevantServices.length > 0) {
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          type: "assistant",
          content: "This operation requires additional permissions as it may affect the following services:",
          timestamp: new Date(),
          services: relevantServices,
          requiresPermission: true
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        setNeedsPermission({
          messageId: assistantMessage.id,
          services: relevantServices
        });
      } else {
        processResponse(inputValue, relevantServices);
      }
      
      setIsTyping(false);
    }, 1000);
  };

  const processResponse = (query: string, services: string[]) => {
    // Start service calls
    const newServiceCalls: ServiceCall[] = services.map(service => ({
      id: `call-${Date.now()}-${service}`,
      name: service,
      status: "pending",
      timestamp: new Date(),
      sensitive: service.toLowerCase().includes("auth") || service.toLowerCase().includes("credentials")
    }));
    
    if (newServiceCalls.length > 0) {
      setServiceCalls(prev => [...prev, ...newServiceCalls]);
    }
    
    // Simulate processing
    setTimeout(() => {
      // Update service call statuses
      setServiceCalls(prev => 
        prev.map(call => {
          if (newServiceCalls.some(newCall => newCall.id === call.id)) {
            const success = Math.random() > 0.2;
            return {
              ...call,
              status: success ? "completed" : "failed",
              result: success ? { message: "Operation successful" } : undefined,
              error: !success ? "Connection timeout" : undefined
            };
          }
          return call;
        })
      );

      // Generate AI response
      let responseContent = "";
      
      if (query.toLowerCase().includes("status")) {
        responseContent = generateStatusResponse();
      } else if (query.toLowerCase().includes("config") || query.toLowerCase().includes("configure")) {
        responseContent = generateConfigResponse();
      } else if (query.toLowerCase().includes("help")) {
        responseContent = generateHelpResponse();
      } else {
        responseContent = generateGeneralResponse(query);
      }
      
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        type: "assistant",
        content: responseContent,
        timestamp: new Date(),
        services: services
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    }, 2000);
  };

  const handleGrantPermission = () => {
    if (!needsPermission) return;
    
    // Update the message to show permission was granted
    setMessages(prev => 
      prev.map(msg => 
        msg.id === needsPermission.messageId 
          ? { ...msg, permissionGranted: true }
          : msg
      )
    );
    
    toast({
      title: "Permission granted",
      description: "You've authorized the operation to proceed",
      type: "success"
    });
    
    // Process the response now that permission is granted
    processResponse(
      prev => prev.find(m => m.id === needsPermission.messageId - 1)?.content || "", 
      needsPermission.services
    );
    
    setNeedsPermission(null);
  };

  const handleDenyPermission = () => {
    if (!needsPermission) return;
    
    // Update the message to show permission was denied
    setMessages(prev => 
      prev.map(msg => 
        msg.id === needsPermission.messageId 
          ? { ...msg, permissionGranted: false }
          : msg
      )
    );
    
    // Add a new message indicating the operation was cancelled
    const assistantMessage: Message = {
      id: `assistant-${Date.now()}`,
      type: "assistant",
      content: "Operation cancelled. I'll not proceed with any actions that require elevated permissions. Is there something else I can help you with?",
      timestamp: new Date(),
      services: []
    };
    
    setMessages(prev => [...prev, assistantMessage]);
    setNeedsPermission(null);
  };

  // Helper functions to generate responses based on user queries
  const getRelevantServices = (query: string): string[] => {
    const lcQuery = query.toLowerCase();
    const results: string[] = [];
    
    if (availableServices.length === 0) return [];
    
    if (lcQuery.includes("status") || lcQuery.includes("health")) {
      return availableServices.map(s => s.name).slice(0, 2);
    }
    
    if (lcQuery.includes("config")) {
      return availableServices.filter(s => Math.random() > 0.5).map(s => s.name).slice(0, 3);
    }
    
    // Default: return a random subset of services
    return availableServices
      .filter(() => Math.random() > 0.7)
      .map(s => s.name)
      .slice(0, Math.max(1, Math.floor(Math.random() * 3)));
  };

  const generateStatusResponse = (): string => {
    return `
All MCP services are currently operational. 

Health Status:
- API Gateway: Healthy (100% uptime)
- Data Processor: Healthy (98.7% uptime)
- Authentication Service: Healthy (99.9% uptime)

Response times are within expected parameters. There are no pending alerts.
    `;
  };

  const generateConfigResponse = (): string => {
    return `
I've analyzed your current configuration. Here are my recommendations:

1. Increase the connection pool size for better performance.
2. Update the authentication timeout settings to match your security policy.
3. Configure automatic health checks every 5 minutes.

Would you like me to implement these changes?
    `;
  };

  const generateHelpResponse = (): string => {
    return `
Here are some things I can help you with:

1. Status monitoring - Check the health and status of your MCP services
2. Configuration - Generate or modify configuration files 
3. Troubleshooting - Help diagnose and resolve issues
4. Deployment - Assist with deploying new services
5. Performance optimization - Suggest ways to improve system performance

Just let me know what you need!
    `;
  };

  const generateGeneralResponse = (query: string): string => {
    // Generic fallback responses based on the query context
    const responses = [
      `I've processed your request about "${query.substring(0, 20)}...". The operation completed successfully.`,
      `Based on your inquiry, I can confirm that the system is configured correctly for handling ${query.split(' ').slice(0, 3).join(' ')} operations.`,
      `I've analyzed your request and found that the MCP services are properly set up to handle this use case.`,
      `Your query has been processed. The requested information has been retrieved from the available services.`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] h-[80vh] max-h-[800px] flex flex-col p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="flex items-center">
            <Terminal className="h-5 w-5 mr-2" />
            MCP Now AI Assistant - {hostName}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          {/* Main chat area */}
          <div className="flex-1 flex flex-col h-full">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex flex-col ${message.type === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.type === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      
                      {message.services && message.services.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {message.services.map((service) => (
                            <Badge key={service} variant="outline" className="text-xs">
                              <Server className="h-3 w-3 mr-1" />
                              {service}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      {message.requiresPermission && (
                        <div className="mt-3 bg-amber-50 border border-amber-200 rounded p-2">
                          <div className="flex items-center text-amber-700 mb-2">
                            <ShieldAlert className="h-4 w-4 mr-1" />
                            <span className="text-sm font-medium">Permission Required</span>
                          </div>
                          
                          {message.permissionGranted === undefined && (
                            <div className="flex gap-2 mt-2">
                              <Button 
                                size="sm" 
                                onClick={handleGrantPermission}
                                className="h-8 bg-amber-600 hover:bg-amber-700 text-white"
                              >
                                <ShieldCheck className="h-3 w-3 mr-1" />
                                Grant Permission
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={handleDenyPermission}
                                className="h-8"
                              >
                                <X className="h-3 w-3 mr-1" />
                                Deny
                              </Button>
                            </div>
                          )}
                          
                          {message.permissionGranted === true && (
                            <div className="text-xs text-green-600 flex items-center">
                              <Check className="h-3 w-3 mr-1" />
                              Permission granted
                            </div>
                          )}
                          
                          {message.permissionGranted === false && (
                            <div className="text-xs text-red-600 flex items-center">
                              <X className="h-3 w-3 mr-1" />
                              Permission denied
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground mt-1 px-1">
                      {new Intl.DateTimeFormat('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit'
                      }).format(message.timestamp)}
                    </span>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex items-start">
                    <div className="bg-muted rounded-lg p-4 max-w-[80%]">
                      <div className="flex space-x-2">
                        <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="h-2 w-2 bg-primary rounded-full animate-bounce"></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            <div className="p-4 border-t">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex space-x-2"
              >
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask anything about your MCP services..."
                  className="flex-1"
                  disabled={isTyping || needsPermission !== null}
                />
                <Button 
                  type="submit" 
                  size="icon"
                  disabled={!inputValue.trim() || isTyping || needsPermission !== null}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
          
          {/* Service calls sidebar */}
          <div className="w-[220px] border-l hidden md:block">
            <div className="h-full flex flex-col">
              <div className="p-3 border-b">
                <h3 className="text-sm font-medium flex items-center">
                  <Server className="h-3 w-3 mr-1" />
                  MCP Service Calls
                </h3>
              </div>
              
              <ScrollArea className="flex-1">
                {serviceCalls.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No service calls yet
                  </div>
                ) : (
                  <div className="p-2 space-y-2">
                    {serviceCalls.map((call) => (
                      <div 
                        key={call.id} 
                        className={`text-xs border rounded p-2 ${
                          call.status === 'completed' 
                            ? 'border-green-200 bg-green-50' 
                            : call.status === 'failed'
                            ? 'border-red-200 bg-red-50'
                            : 'border-amber-200 bg-amber-50'
                        }`}
                      >
                        <div className="font-medium mb-1 flex items-center justify-between">
                          <span className="truncate">{call.name}</span>
                          {call.sensitive && (
                            <ShieldAlert className="h-3 w-3 text-amber-500" />
                          )}
                        </div>
                        
                        <div className="flex items-center">
                          {call.status === 'pending' && (
                            <>
                              <CirclePause className="h-3 w-3 text-amber-500 mr-1" />
                              <span className="text-amber-600">Processing...</span>
                            </>
                          )}
                          
                          {call.status === 'completed' && (
                            <>
                              <Check className="h-3 w-3 text-green-500 mr-1" />
                              <span className="text-green-600">Success</span>
                            </>
                          )}
                          
                          {call.status === 'failed' && (
                            <>
                              <AlertCircle className="h-3 w-3 text-red-500 mr-1" />
                              <span className="text-red-600">{call.error || "Failed"}</span>
                            </>
                          )}
                        </div>
                        
                        <div className="text-[10px] text-muted-foreground mt-1">
                          {new Intl.DateTimeFormat('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            second: '2-digit'
                          }).format(call.timestamp)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
