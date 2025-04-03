
export interface ServerDefinition {
  id: string;
  name: string;
  description: string;
  version: string;
  type: 'HTTP_SSE' | 'TCP_SOCKET';
  author: string;
  icon: string;
}

export interface ServerInstance {
  id: string;
  name: string;
  definitionId: string;
  status: 'running' | 'stopped' | 'error';
  connectionDetails: string;
  requestCount?: number;
}

export type ConnectionStatus = 'connected' | 'disconnected' | 'unknown';

export interface Host {
  id: string;
  name: string;
  icon?: string;
  connectionStatus: ConnectionStatus;
  configPath?: string;
  configStatus: 'configured' | 'misconfigured' | 'unknown';
  profileId?: string;
}

export interface Profile {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  instances: string[];
}

export const serverDefinitions: ServerDefinition[] = [
  {
    id: "def1",
    name: "Realtime Data Stream",
    description: "Provides a stream of realtime updates for financial data.",
    version: "1.2",
    type: "HTTP_SSE",
    author: "Acme Corp",
    icon: "📈"
  },
  {
    id: "def2",
    name: "Secure Socket Server",
    description: "Handles secure communication and data transfer via TCP sockets.",
    version: "2.0",
    type: "TCP_SOCKET",
    author: "Beta Solutions",
    icon: "🔒"
  },
  {
    id: "def3",
    name: "Low Latency Feed",
    description: "Offers a low latency data feed for critical system monitoring.",
    version: "0.9",
    type: "TCP_SOCKET",
    author: "Gamma Dynamics",
    icon: "⚡"
  }
];

export const serverInstances: ServerInstance[] = [
  {
    id: "inst1",
    name: "Production API",
    definitionId: "def1",
    status: "running",
    connectionDetails: "https://api.example.com/v1",
    requestCount: 1245
  },
  {
    id: "inst2",
    name: "Staging API",
    definitionId: "def1",
    status: "running",
    connectionDetails: "https://staging-api.example.com/v1",
    requestCount: 367
  },
  {
    id: "inst3",
    name: "Development Server",
    definitionId: "def2",
    status: "stopped",
    connectionDetails: "localhost:3000",
    requestCount: 89
  },
  {
    id: "inst4",
    name: "Testing Environment",
    definitionId: "def3",
    status: "error",
    connectionDetails: "192.168.1.100:8080",
    requestCount: 42
  },
  {
    id: "inst5", 
    name: "EU Region Server",
    definitionId: "def1",
    status: "running",
    connectionDetails: "https://eu-api.example.com/v1",
    requestCount: 732
  }
];

export const hosts: Host[] = [
  {
    id: "host1",
    name: "Local Development Machine",
    icon: "💻",
    connectionStatus: "connected",
    configPath: "/Users/developer/.config/mcp-now/config.json",
    configStatus: "configured",
    profileId: "profile1"
  },
  {
    id: "host2",
    name: "Production Server",
    icon: "🖥️",
    connectionStatus: "connected",
    configPath: "/etc/mcp-now/config.json",
    configStatus: "configured",
    profileId: "profile2"
  },
  {
    id: "host3",
    name: "Testing Environment",
    icon: "🧪",
    connectionStatus: "disconnected",
    configPath: "/var/lib/mcp-now/config.json",
    configStatus: "misconfigured"
  },
  {
    id: "host4",
    name: "Staging Server",
    icon: "🔄",
    connectionStatus: "unknown",
    configStatus: "unknown"
  }
];

export const profiles: Profile[] = [
  {
    id: "profile1",
    name: "Development Profile",
    description: "Configuration for local development environments with debugging enabled.",
    enabled: true,
    instances: ["inst1", "inst3"]
  },
  {
    id: "profile2",
    name: "Production Profile",
    description: "Optimized settings for production environments with high throughput.",
    enabled: true,
    instances: ["inst1", "inst5"]
  },
  {
    id: "profile3",
    name: "Testing Profile",
    description: "Configuration for automated testing with mocked services.",
    enabled: false,
    instances: ["inst2", "inst4"]
  }
];
