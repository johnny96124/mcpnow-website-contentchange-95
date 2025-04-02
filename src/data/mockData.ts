
export type EndpointType = 'HTTP_SSE' | 'STDIO';
export type Status = 'running' | 'stopped' | 'error';
export type ConnectionStatus = 'connected' | 'disconnected' | 'misconfigured' | 'unknown';

export interface ServerDefinition {
  id: string;
  name: string;
  type: EndpointType;
  description: string;
  author?: string;
  version?: string;
  icon?: string;
}

export interface ServerInstance {
  id: string;
  definitionId: string;
  name: string;
  status: Status;
  enabled: boolean;
  connectionDetails: string;
  environment?: Record<string, string>;
  arguments?: string[];
}

export interface Profile {
  id: string;
  name: string;
  endpointType: EndpointType;
  enabled: boolean;
  endpoint: string;
  instances: string[]; // Array of ServerInstance IDs
}

export interface Host {
  id: string;
  name: string;
  profileId?: string;
  configStatus: 'configured' | 'misconfigured' | 'unknown';
  connectionStatus: ConnectionStatus;
  configPath?: string;
  icon?: string;
}

export const serverDefinitions: ServerDefinition[] = [
  {
    id: 'postgres-tool',
    name: 'PostgreSQL MCP Tool',
    type: 'STDIO',
    description: 'A tool for interacting with PostgreSQL databases via MCP',
    author: 'MCP Team',
    version: '1.0.0',
    icon: '🐘'
  },
  {
    id: 'github-copilot-proxy',
    name: 'GitHub Copilot Proxy',
    type: 'HTTP_SSE',
    description: 'Proxy for GitHub Copilot API',
    author: 'MCP Team',
    version: '1.2.0',
    icon: '🤖'
  },
  {
    id: 'local-file-assistant',
    name: 'Local File Assistant',
    type: 'STDIO',
    description: 'Assists with local file operations',
    author: 'MCP Team',
    version: '0.9.1',
    icon: '📁'
  },
];

export const serverInstances: ServerInstance[] = [
  {
    id: 'postgres-dev',
    definitionId: 'postgres-tool',
    name: 'PostgresTool-DevDB',
    status: 'running',
    enabled: true,
    connectionDetails: '/usr/local/bin/postgres-mcp',
    environment: {
      'DB_URL': 'postgresql://dev:password@localhost:5432/dev'
    }
  },
  {
    id: 'postgres-prod',
    definitionId: 'postgres-tool',
    name: 'PostgresTool-ProdDB',
    status: 'stopped',
    enabled: false,
    connectionDetails: '/usr/local/bin/postgres-mcp',
    environment: {
      'DB_URL': 'postgresql://prod:password@db.example.com:5432/prod'
    }
  },
  {
    id: 'github-copilot',
    definitionId: 'github-copilot-proxy',
    name: 'GitHub Copilot',
    status: 'running',
    enabled: true,
    connectionDetails: 'https://api.github.com/copilot/v1',
    environment: {
      'GITHUB_TOKEN': 'github_pat_xxxxxxxxxxxx'
    }
  },
  {
    id: 'local-files',
    definitionId: 'local-file-assistant',
    name: 'Local File Assistant',
    status: 'error',
    enabled: true,
    connectionDetails: '/usr/local/bin/file-assistant',
    arguments: ['--watch', '/home/user/projects']
  },
];

export const profiles: Profile[] = [
  {
    id: 'general-dev',
    name: 'General Development',
    endpointType: 'HTTP_SSE',
    enabled: true,
    endpoint: 'http://localhost:8008/mcp',
    instances: ['github-copilot', 'local-files']
  },
  {
    id: 'database-ops',
    name: 'Database Operations',
    endpointType: 'HTTP_SSE',
    enabled: true,
    endpoint: 'http://localhost:8009/mcp',
    instances: ['postgres-dev']
  },
  {
    id: 'project-x',
    name: 'Project X',
    endpointType: 'STDIO',
    enabled: false,
    endpoint: '/usr/local/bin/mcp-stdio',
    instances: ['github-copilot', 'postgres-prod']
  },
];

export const hosts: Host[] = [
  {
    id: 'cursor',
    name: 'Cursor',
    profileId: 'general-dev',
    configStatus: 'configured',
    connectionStatus: 'connected',
    configPath: '/Users/user/Library/Application Support/Cursor/settings.json',
    icon: '⌨️'
  },
  {
    id: 'claude-desktop',
    name: 'Claude Desktop',
    profileId: 'project-x',
    configStatus: 'misconfigured',
    connectionStatus: 'disconnected',
    configPath: '/Users/user/Library/Application Support/Claude/config.json',
    icon: '🧠'
  },
  {
    id: 'windsurf',
    name: 'Windsurf',
    profileId: 'database-ops',
    configStatus: 'unknown',
    connectionStatus: 'unknown',
    configPath: '/Users/user/.windsurf/config',
    icon: '🏄'
  },
];

export const discoveryItems: ServerDefinition[] = [
  {
    id: 'aws-toolkit',
    name: 'AWS Toolkit',
    type: 'STDIO',
    description: 'Tools for working with AWS services',
    author: 'AWS Community',
    version: '2.1.0',
    icon: '☁️'
  },
  {
    id: 'docker-assistant',
    name: 'Docker Assistant',
    type: 'HTTP_SSE',
    description: 'Helps manage Docker containers and images',
    author: 'Docker Community',
    version: '1.5.0',
    icon: '🐳'
  },
  {
    id: 'kubernetes-helper',
    name: 'Kubernetes Helper',
    type: 'STDIO',
    description: 'Tools for working with Kubernetes clusters',
    author: 'K8s Community',
    version: '0.9.5',
    icon: '⎈'
  },
  {
    id: 'frontend-dev-tools',
    name: 'Frontend Dev Tools',
    type: 'HTTP_SSE',
    description: 'Utilities for frontend development',
    author: 'Web Dev Team',
    version: '3.2.1',
    icon: '🖥️'
  },
];
