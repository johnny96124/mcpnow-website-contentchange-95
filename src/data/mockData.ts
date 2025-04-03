
export interface ServerDefinition {
  id: string;
  name: string;
  description: string;
  version: string;
  type: 'HTTP_SSE' | 'TCP_SOCKET';
  author: string;
  icon: string;
  isOfficial?: boolean;
  categories?: string[];
  features?: string[];
  repository?: string;
}

export interface ServerInstance {
  id: string;
  name: string;
  definitionId: string;
  status: 'running' | 'stopped' | 'error';
  connectionDetails: string;
  requestCount?: number;
  enabled?: boolean;
}

export type ConnectionStatus = 'connected' | 'disconnected' | 'unknown';
export type EndpointType = 'HTTP_SSE' | 'STDIO';

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
  endpoint?: string;
  endpointType?: EndpointType;
}

export const serverDefinitions: ServerDefinition[] = [
  {
    id: "def1",
    name: "Realtime Data Stream",
    description: "Provides a stream of realtime updates for financial data.",
    version: "1.2",
    type: "HTTP_SSE",
    author: "Acme Corp",
    icon: "📈",
    isOfficial: true,
    categories: ["Finance", "Realtime"],
    features: ["High-frequency updates", "Low latency", "Configurable channels"],
    repository: "github.com/acme/realtime-data-stream"
  },
  {
    id: "def2",
    name: "Secure Socket Server",
    description: "Handles secure communication and data transfer via TCP sockets.",
    version: "2.0",
    type: "TCP_SOCKET",
    author: "Beta Solutions",
    icon: "🔒",
    isOfficial: true,
    categories: ["Security", "Communication"],
    features: ["End-to-end encryption", "Automatic reconnection", "Buffer management"],
    repository: "github.com/beta/secure-socket-server"
  },
  {
    id: "def3",
    name: "Low Latency Feed",
    description: "Offers a low latency data feed for critical system monitoring.",
    version: "0.9",
    type: "TCP_SOCKET",
    author: "Gamma Dynamics",
    icon: "⚡",
    isOfficial: false,
    categories: ["Monitoring", "DevOps"],
    features: ["Microsecond precision", "Custom alerting", "Historical playback"],
    repository: "github.com/gamma/low-latency-feed"
  }
];

export const serverInstances: ServerInstance[] = [
  {
    id: "inst1",
    name: "Production API",
    definitionId: "def1",
    status: "running",
    connectionDetails: "https://api.example.com/v1",
    requestCount: 1245,
    enabled: true
  },
  {
    id: "inst2",
    name: "Staging API",
    definitionId: "def1",
    status: "running",
    connectionDetails: "https://staging-api.example.com/v1",
    requestCount: 367,
    enabled: true
  },
  {
    id: "inst3",
    name: "Development Server",
    definitionId: "def2",
    status: "stopped",
    connectionDetails: "localhost:3000",
    requestCount: 89,
    enabled: false
  },
  {
    id: "inst4",
    name: "Testing Environment",
    definitionId: "def3",
    status: "error",
    connectionDetails: "192.168.1.100:8080",
    requestCount: 42,
    enabled: false
  },
  {
    id: "inst5", 
    name: "EU Region Server",
    definitionId: "def1",
    status: "running",
    connectionDetails: "https://eu-api.example.com/v1",
    requestCount: 732,
    enabled: true
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
    instances: ["inst1", "inst3"],
    endpointType: "HTTP_SSE",
    endpoint: "http://localhost:8008/mcp"
  },
  {
    id: "profile2",
    name: "Production Profile",
    description: "Optimized settings for production environments with high throughput.",
    enabled: true,
    instances: ["inst1", "inst5"],
    endpointType: "STDIO",
    endpoint: "/usr/local/bin/mcp-stdio"
  },
  {
    id: "profile3",
    name: "Testing Profile",
    description: "Configuration for automated testing with mocked services.",
    enabled: false,
    instances: ["inst2", "inst4"],
    endpointType: "HTTP_SSE",
    endpoint: "http://test.example.com/mcp"
  }
];

// Add discoveryItems mock data for the Discovery page
export const discoveryItems: ServerDefinition[] = [
  {
    id: "disc1",
    name: "Data Visualization Server",
    description: "Create interactive data visualizations with real-time updates.",
    version: "1.0.3",
    type: "HTTP_SSE",
    author: "Visualization Inc.",
    icon: "📊",
    isOfficial: true,
    categories: ["Visualization", "Analytics", "Dashboards"],
    features: ["Interactive charts", "Custom theming", "Export options"],
    repository: "github.com/viz-inc/data-viz-server"
  },
  {
    id: "disc2",
    name: "Machine Learning Inference",
    description: "Deploy and serve machine learning models with high throughput and low latency.",
    version: "2.1.0",
    type: "TCP_SOCKET",
    author: "AI Solutions Ltd",
    icon: "🧠",
    isOfficial: true,
    categories: ["AI", "Machine Learning", "Inference"],
    features: ["Model versioning", "Batch processing", "GPU acceleration"],
    repository: "github.com/ai-solutions/ml-inference"
  },
  {
    id: "disc3",
    name: "IoT Device Gateway",
    description: "Connect and manage IoT devices with secure bidirectional communication.",
    version: "0.8.5",
    type: "TCP_SOCKET",
    author: "IoT Connect",
    icon: "🔌",
    isOfficial: false,
    categories: ["IoT", "Gateway", "Devices"],
    features: ["Device management", "Protocol translation", "Data aggregation"],
    repository: "github.com/iot-connect/device-gateway"
  },
  {
    id: "disc4",
    name: "Log Aggregation Service",
    description: "Collect, process, and analyze logs from distributed systems.",
    version: "1.5.2",
    type: "HTTP_SSE",
    author: "LogWorks",
    icon: "📝",
    isOfficial: true,
    categories: ["Logging", "Monitoring", "DevOps"],
    features: ["Full-text search", "Alert rules", "Log retention policies"],
    repository: "github.com/logworks/log-aggregator"
  }
];
