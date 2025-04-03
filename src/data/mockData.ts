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
