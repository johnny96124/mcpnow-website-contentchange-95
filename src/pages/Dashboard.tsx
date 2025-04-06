
import { Link } from "react-router-dom";
import { 
  ActivityIcon, 
  Database,
  ExternalLink,
  Info,
  Server, 
  Star,
  TrendingUp,
  UsersRound 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { profiles, hosts, serverInstances, serverDefinitions } from "@/data/mockData";
import { useState } from "react";
import { EndpointLabel } from "@/components/status/EndpointLabel";
import { OfficialBadge } from "@/components/discovery/OfficialBadge";
import { CategoryList } from "@/components/discovery/CategoryList";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const Dashboard = () => {
  // State for time dimension selection
  const [timeMetric, setTimeMetric] = useState<"hour" | "day" | "month" | "all">("hour");
  
  // Calculate summary stats
  const activeProfiles = profiles.filter(p => p.enabled).length;
  const runningInstances = serverInstances.filter(s => s.status === 'running').length;
  const connectedHosts = hosts.filter(h => h.connectionStatus === 'connected').length;
  
  // Calculate requests based on selected time metric (mock data)
  const requestsData = {
    hour: { value: 285, change: "+12%" },
    day: { value: 2840, change: "+8%" },
    month: { value: 85600, change: "+15%" },
    all: { value: 347890, change: "—" }
  };
  
  // Mock trending server data
  const trendingServers = [
    { 
      id: "trend1", 
      name: "FastGPT Server", 
      icon: "🚀", 
      type: "HTTP_SSE" as EndpointType, 
      stars: 4.9, 
      downloads: 2342, 
      description: "High-performance GPT model server with streaming responses",
      author: "AI Systems Inc",
      version: "1.3.0",
      categories: ["AI", "LLM", "NLP"],
      isOfficial: true
    },
    { 
      id: "trend2", 
      name: "CodeAssistant", 
      icon: "💻", 
      type: "STDIO" as EndpointType, 
      stars: 4.8, 
      downloads: 1856, 
      description: "Code completion and analysis server with multiple language support",
      author: "DevTools Ltd",
      version: "2.1.1",
      categories: ["Development", "AI", "Code"],
      isOfficial: true
    },
    { 
      id: "trend3", 
      name: "PromptWizard", 
      icon: "✨", 
      type: "HTTP_SSE" as EndpointType, 
      stars: 4.7, 
      downloads: 1543, 
      description: "Advanced prompt engineering and testing server",
      author: "PromptLabs",
      version: "1.0.4",
      categories: ["AI", "Prompting", "Testing"],
      isOfficial: false
    },
    { 
      id: "trend4", 
      name: "SemanticSearch", 
      icon: "🔍", 
      type: "HTTP_SSE" as EndpointType, 
      stars: 4.6, 
      downloads: 1278, 
      description: "Vector database integration for semantic search capabilities",
      author: "SearchTech",
      version: "0.9.2",
      categories: ["Search", "Embeddings", "Vector DB"],
      isOfficial: false
    }
  ];
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your MCP profiles, servers, and host connections.
          </p>
        </div>
      </div>
      
      {/* Combined Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Hosts Combined Card */}
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-lg font-medium">
                Connected Hosts
              </CardTitle>
              <CardDescription>
                {connectedHosts} of {hosts.length} hosts connected
              </CardDescription>
            </div>
            <UsersRound className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {hosts.slice(0, 3).map(host => (
                <div 
                  key={host.id} 
                  className="flex items-center justify-between p-2 bg-muted/50 rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{host.icon}</span>
                    <span className="font-medium">{host.name}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    host.connectionStatus === 'connected' ? 
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 
                    host.connectionStatus === 'disconnected' ? 
                    'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' :
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                  }`}>
                    {host.connectionStatus === 'connected' ? 'Connected' : 
                     host.connectionStatus === 'disconnected' ? 'Disconnected' : 
                     'Unknown'}
                  </span>
                </div>
              ))}
              {hosts.length > 3 && (
                <p className="text-xs text-muted-foreground text-center">
                  +{hosts.length - 3} more hosts
                </p>
              )}
            </div>
            <div className="flex">
              <Button asChild className="flex-1">
                <Link to="/hosts">
                  View All
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Profiles Combined Card */}
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-lg font-medium">
                Active Profiles
              </CardTitle>
              <CardDescription>
                {activeProfiles} of {profiles.length} profiles enabled
              </CardDescription>
            </div>
            <Database className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {profiles.slice(0, 3).map(profile => (
                <div 
                  key={profile.id} 
                  className="flex items-center justify-between p-2 bg-muted/50 rounded-md"
                >
                  <span className="font-medium">{profile.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    profile.enabled ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 
                    'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                  }`}>
                    {profile.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              ))}
              {profiles.length > 3 && (
                <p className="text-xs text-muted-foreground text-center">
                  +{profiles.length - 3} more profiles
                </p>
              )}
            </div>
            <div className="flex">
              <Button asChild className="flex-1">
                <Link to="/profiles">
                  View All
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Servers Combined Card */}
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-lg font-medium">
                Server Instances
              </CardTitle>
              <CardDescription>
                {runningInstances} of {serverInstances.length} instances running
              </CardDescription>
            </div>
            <Server className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {serverDefinitions.slice(0, 3).map(definition => (
                <div 
                  key={definition.id} 
                  className="flex items-center justify-between p-2 bg-muted/50 rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{definition.icon}</span>
                    <span className="font-medium">{definition.name}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    definition.type === 'HTTP_SSE' ? 
                    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : 
                    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                  }`}>
                    {definition.type === 'HTTP_SSE' ? 'HTTP' : 'STDIO'}
                  </span>
                </div>
              ))}
              {serverDefinitions.length > 3 && (
                <p className="text-xs text-muted-foreground text-center">
                  +{serverDefinitions.length - 3} more servers
                </p>
              )}
            </div>
            <div className="flex">
              <Button asChild className="flex-1">
                <Link to="/servers">
                  View All
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Requests Card with Time Dimension Selection */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">
            Requests
          </CardTitle>
          <ActivityIcon className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="hour" className="w-full" onValueChange={(value) => setTimeMetric(value as "hour" | "day" | "month" | "all")}>
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger value="hour">Last Hour</TabsTrigger>
              <TabsTrigger value="day">Last Day</TabsTrigger>
              <TabsTrigger value="month">Last Month</TabsTrigger>
              <TabsTrigger value="all">All Time</TabsTrigger>
            </TabsList>
            <TabsContent value="hour">
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold">{requestsData.hour.value}</div>
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                  {requestsData.hour.change} from previous hour
                </p>
              </div>
            </TabsContent>
            <TabsContent value="day">
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold">{requestsData.day.value}</div>
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                  {requestsData.day.change} from previous day
                </p>
              </div>
            </TabsContent>
            <TabsContent value="month">
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold">{requestsData.month.value}</div>
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                  {requestsData.month.change} from previous month
                </p>
              </div>
            </TabsContent>
            <TabsContent value="all">
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold">{requestsData.all.value}</div>
                <p className="text-sm text-muted-foreground font-medium">
                  {requestsData.all.change}
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Trending MCP Servers */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Trending MCP Servers</h2>
          <Button variant="outline" size="sm" asChild>
            <Link to="/discovery">
              View All
              <ExternalLink className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <ScrollArea className="w-full">
          <div className="flex space-x-4 pb-4">
            {trendingServers.map(server => (
              <Card key={server.id} className="min-w-[300px] max-w-[300px] flex flex-col overflow-hidden hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex flex-col">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{server.name}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <EndpointLabel type={server.type} />
                      {server.isOfficial && <OfficialBadge />}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {server.description}
                  </p>
                  
                  <div className="mb-4">
                    <CategoryList categories={server.categories || []} maxVisible={3} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Author</p>
                      <p className="text-sm font-medium">{server.author}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Version</p>
                      <p className="text-sm font-medium">{server.version}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t bg-muted/50 p-3">
                  <Button variant="outline" size="sm">
                    <Info className="h-4 w-4 mr-1" />
                    Details
                  </Button>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-medium">{server.stars}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <TrendingUp className="h-4 w-4" />
                      <span>{server.downloads}</span>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Dashboard;
