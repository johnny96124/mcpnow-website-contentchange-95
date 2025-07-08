
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ServerLogo } from "@/components/servers/ServerLogo";
import { EndpointLabel } from "@/components/status/EndpointLabel";
import { Search, Check, ChevronLeft, Plus, Bot } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ServerSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddServers: (instances: any[]) => void;
  onStartAIChat?: (context: any) => void;
}

export function ServerSelectionDialog({
  open,
  onOpenChange,
  onAddServers,
  onStartAIChat
}: ServerSelectionDialogProps) {
  const [showAddedOnly, setShowAddedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [step, setStep] = useState<"selection" | "configure" | "instances">("selection");
  const [allServers, setAllServers] = useState<any[]>([]);
  const [filteredServers, setFilteredServers] = useState<any[]>([]);
  const [selectedServer, setSelectedServer] = useState<any | null>(null);
  const [existingInstances, setExistingInstances] = useState<any[]>([]);
  const [selectedInstances, setSelectedInstances] = useState<any[]>([]);
  const [instanceFields, setInstanceFields] = useState({
    name: "",
    url: "",
    headers: [{ key: "", value: "" }]
  });

  // Mock data
  useEffect(() => {
    const mockServers = [
      {
        id: "server-1",
        name: "PostgreSQL Database",
        type: "HTTP_SSE",
        description: "PostgreSQL database server with extended JSON-RPC API",
        hasInstances: true
      },
      {
        id: "server-2",
        name: "Docker Assistant",
        type: "HTTP_SSE",
        description: "Helps manage Docker containers and images with intuitive interface",
        hasInstances: false
      },
      {
        id: "server-3",
        name: "Redis Cache",
        type: "STDIO",
        description: "In-memory data structure store used as cache, database, and message broker",
        hasInstances: true
      },
      {
        id: "server-4",
        name: "Nginx Web Server",
        type: "WS",
        description: "High-performance HTTP server and reverse proxy",
        hasInstances: false
      }
    ];

    const mockInstances = [
      {
        id: "instance-1",
        serverId: "server-1",
        name: "Development DB",
        type: "HTTP_SSE",
        connectionDetails: "http://localhost:5432"
      },
      {
        id: "instance-2",
        serverId: "server-3",
        name: "Local Redis",
        type: "STDIO",
        connectionDetails: "stdio://redis-cli"
      }
    ];

    setAllServers(mockServers);
    setFilteredServers(mockServers);

    return () => {
      // Reset state when dialog closes
      if (!open) {
        setStep("selection");
        setSelectedServer(null);
        setSelectedInstances([]);
        setSearchQuery("");
        setShowAddedOnly(false);
        setInstanceFields({
          name: "",
          url: "",
          headers: [{ key: "", value: "" }]
        });
      }
    };
  }, [open]);

  useEffect(() => {
    let filtered = [...allServers];
    
    if (showAddedOnly) {
      filtered = filtered.filter(server => server.hasInstances);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        server => 
          server.name.toLowerCase().includes(query) || 
          server.description.toLowerCase().includes(query)
      );
    }
    
    setFilteredServers(filtered);
  }, [allServers, showAddedOnly, searchQuery]);

  const handleServerSelect = (server: any) => {
    setSelectedServer(server);
    
    if (server.hasInstances) {
      // Mock existing instances for this server
      const mockExistingInstances = [
        {
          id: `instance-${server.id}-1`,
          name: `${server.name} Dev`,
          type: server.type,
          connectionDetails: server.type === "HTTP_SSE" ? "http://localhost:8080" : "stdio://local-command"
        },
        {
          id: `instance-${server.id}-2`,
          name: `${server.name} Test`,
          type: server.type,
          connectionDetails: server.type === "HTTP_SSE" ? "http://test-server:8080" : "stdio://test-command"
        }
      ];
      
      setExistingInstances(mockExistingInstances);
      setStep("instances");
    } else {
      // Pre-fill the instance name with server name
      setInstanceFields({
        ...instanceFields,
        name: server.name
      });
      setStep("configure");
    }
  };

  const handleInstanceToggle = (instance: any) => {
    setSelectedInstances(prev => {
      const isSelected = prev.find(i => i.id === instance.id);
      if (isSelected) {
        return prev.filter(i => i.id !== instance.id);
      } else {
        return [...prev, instance];
      }
    });
  };

  const handleAddHeaderField = () => {
    setInstanceFields({
      ...instanceFields,
      headers: [...instanceFields.headers, { key: "", value: "" }]
    });
  };

  const handleHeaderChange = (index: number, field: "key" | "value", value: string) => {
    const updatedHeaders = [...instanceFields.headers];
    updatedHeaders[index][field] = value;
    
    setInstanceFields({
      ...instanceFields,
      headers: updatedHeaders
    });
  };

  const handleRemoveHeaderField = (index: number) => {
    const updatedHeaders = [...instanceFields.headers];
    updatedHeaders.splice(index, 1);
    
    setInstanceFields({
      ...instanceFields,
      headers: updatedHeaders
    });
  };

  const handleCreateInstance = () => {
    if (!selectedServer) return;
    
    const headers: Record<string, string> = {};
    instanceFields.headers.forEach(header => {
      if (header.key && header.value) {
        headers[header.key] = header.value;
      }
    });
    
    const newInstance = {
      id: `new-instance-${Date.now()}`,
      name: instanceFields.name || selectedServer.name,
      type: selectedServer.type,
      connectionDetails: selectedServer.type === "HTTP_SSE" ? instanceFields.url : "",
      headers: selectedServer.type === "HTTP_SSE" ? headers : undefined,
      definitionId: selectedServer.id,
      status: "stopped",
      enabled: false
    };
    
    onAddServers([newInstance]);
    onOpenChange(false);
  };

  const handleAddSelectedInstances = () => {
    onAddServers(selectedInstances);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>
            {step === "selection" && "Select Server"}
            {step === "instances" && "Select Existing Instance"}
            {step === "configure" && "Configure Server Instance"}
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 pt-0 space-y-4">
          {step === "selection" && (
            <>
              <div className="flex items-center gap-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search servers..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="show-added-only"
                    checked={showAddedOnly}
                    onChange={() => setShowAddedOnly(!showAddedOnly)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="show-added-only" className="text-sm">
                    Show Added Only
                  </label>
                </div>
              </div>

              <div className="space-y-2 max-h-[400px] overflow-auto pr-2">
                {filteredServers.length > 0 ? (
                  filteredServers.map((server) => (
                    <div
                      key={server.id}
                      className="p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                      onClick={() => handleServerSelect(server)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-start space-x-3">
                          <ServerLogo name={server.name} className="mt-1" />
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-medium">{server.name}</h3>
                              {server.hasInstances && (
                                <Badge variant="outline" className="text-xs bg-primary/10">Added</Badge>
                              )}
                            </div>
                            <div className="mt-1 flex items-center space-x-2">
                              <EndpointLabel type={server.type} className="text-xs" />
                            </div>
                            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                              {server.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No servers found</p>
                  </div>
                )}
              </div>
            </>
          )}

          {step === "instances" && selectedServer && (
            <>
              <div className="mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="pl-0"
                  onClick={() => setStep("selection")}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back to Servers
                </Button>
              </div>

              <div className="space-y-2 max-h-[400px] overflow-auto pr-2">
                <div className="mb-4">
                  <h3 className="font-medium flex items-center gap-2">
                    {selectedServer.name}
                    <EndpointLabel type={selectedServer.type} className="text-xs" />
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Select existing instances to add
                  </p>
                </div>

                {existingInstances.map((instance) => (
                  <div
                    key={instance.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedInstances.find(i => i.id === instance.id) 
                        ? "border-primary/50 bg-primary/5" 
                        : "hover:bg-accent/50"
                    }`}
                    onClick={() => handleInstanceToggle(instance)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="h-5 w-5 border rounded flex items-center justify-center">
                          {selectedInstances.find(i => i.id === instance.id) && (
                            <Check className="h-3 w-3 text-primary" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">{instance.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {instance.connectionDetails}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      setInstanceFields({
                        name: selectedServer.name,
                        url: "",
                        headers: [{ key: "", value: "" }]
                      });
                      setStep("configure");
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Instance
                  </Button>
                </div>
              </div>
            </>
          )}

          {step === "configure" && selectedServer && (
            <>
              <div className="mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="pl-0"
                  onClick={() => selectedServer.hasInstances ? setStep("instances") : setStep("selection")}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  {selectedServer.hasInstances ? "Back to Instances" : "Back to Servers"}
                </Button>
              </div>

              <div className="space-y-4">
                <div className="mb-4">
                  <h3 className="font-medium flex items-center gap-2">
                    {selectedServer.name}
                    <EndpointLabel type={selectedServer.type} className="text-xs" />
                  </h3>
                   <p className="text-sm text-muted-foreground mt-1">
                     Configure new instance
                   </p>
                 </div>

                 {/* AI Install Option */}
                 {onStartAIChat && (
                   <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20 mb-4">
                     <CardContent className="p-4">
                       <div className="flex items-start justify-between">
                         <div className="flex items-start gap-3">
                           <Bot className="h-5 w-5 text-blue-600 mt-0.5" />
                           <div>
                             <h3 className="font-medium text-blue-900 dark:text-blue-100">AI 辅助安装</h3>
                             <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                               让AI助手引导您完成服务器的自动化安装和配置
                             </p>
                           </div>
                         </div>
                         <Button 
                           variant="outline" 
                           size="sm"
                           onClick={() => {
                             const aiContext = {
                               type: 'server_installation',
                               serverDefinition: selectedServer,
                               currentStep: 'confirm',
                               progress: { step: 'confirm', completed: [], data: {} },
                               messages: [
                                 {
                                   role: 'assistant',
                                   content: `你好！我将协助你安装 ${selectedServer.name} 服务器。让我们开始安装过程。

首先，请确认你要安装 **${selectedServer.name}** 吗？

**服务器信息：**
- 类型：${selectedServer.type}
- 描述：${selectedServer.description}

如果确认，请回复"确认"或"yes"，我将引导你完成接下来的步骤。`
                                 }
                               ]
                             };
                             onStartAIChat(aiContext);
                             onOpenChange(false);
                           }}
                           className="border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-700 dark:text-blue-300"
                         >
                           <Bot className="h-4 w-4 mr-2" />
                           使用AI安装
                         </Button>
                       </div>
                     </CardContent>
                   </Card>
                 )}

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Instance Name <span className="text-destructive">*</span>
                    </label>
                    <Input
                      value={instanceFields.name}
                      onChange={e => setInstanceFields({ ...instanceFields, name: e.target.value })}
                      placeholder="Enter instance name"
                    />
                  </div>

                  {selectedServer.type === "HTTP_SSE" && (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          URL <span className="text-destructive">*</span>
                        </label>
                        <Input
                          value={instanceFields.url}
                          onChange={e => setInstanceFields({ ...instanceFields, url: e.target.value })}
                          placeholder="http://localhost:3000/api"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center justify-between">
                          <span className="text-sm font-medium">HTTP Headers</span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleAddHeaderField}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add Header
                          </Button>
                        </label>
                        
                        <div className="space-y-2">
                          {instanceFields.headers.map((header, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Input
                                placeholder="Key"
                                value={header.key}
                                onChange={(e) => handleHeaderChange(index, "key", e.target.value)}
                                className="flex-1"
                              />
                              <Input
                                placeholder="Value"
                                value={header.value}
                                onChange={(e) => handleHeaderChange(index, "value", e.target.value)}
                                className="flex-1"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveHeaderField(index)}
                                disabled={instanceFields.headers.length === 1}
                                className="px-2"
                              >
                                ✕
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {selectedServer.type === "STDIO" && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Command Arguments</label>
                      <Input
                        placeholder="Enter command arguments"
                        onChange={e => setInstanceFields({ ...instanceFields, url: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground">
                        Additional arguments to pass to the command
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="p-6 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {step === "selection" ? (
            <Button disabled={true}>
              Next
            </Button>
          ) : step === "instances" ? (
            <Button
              onClick={handleAddSelectedInstances}
              disabled={selectedInstances.length === 0}
            >
              Add Selected
            </Button>
          ) : (
            <Button
              onClick={handleCreateInstance}
              disabled={!instanceFields.name || (selectedServer?.type === "HTTP_SSE" && !instanceFields.url)}
            >
              Create Instance
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
