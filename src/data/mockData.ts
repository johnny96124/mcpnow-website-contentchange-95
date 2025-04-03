
export type EndpointType = 'HTTP_SSE' | 'STDIO';
export type Status = 'running' | 'stopped' | 'error' | 'connecting';
export type ConnectionStatus = 'connected' | 'disconnected' | 'misconfigured' | 'unknown';

export interface ServerDefinition {
  id: string;
  name: string;
  type: EndpointType;
  description: string;
  author?: string;
  version?: string;
  icon?: string;
  isOfficial?: boolean;
  categories?: string[];
  features?: string[];
  repository?: string;
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
  requestCount?: number; // Added request count field
}

export interface Profile {
  id: string;
  name: string;
  endpointType: EndpointType;
  enabled: boolean;
  endpoint: string;
  instances: string[]; // Array of ServerInstance IDs
  description?: string; // Added missing description field
}

export interface Host {
  id: string;
  name: string;
  profileId?: string;
  configStatus: 'configured' | 'misconfigured' | 'unknown';
  connectionStatus: ConnectionStatus;
  configPath?: string;
  icon?: string; // This should remain optional
}

export const serverDefinitions: ServerDefinition[] = [
  {
    id: 'postgres-tool',
    name: 'PostgreSQL MCP Tool',
    type: 'STDIO',
    description: 'A tool for interacting with PostgreSQL databases via MCP',
    author: 'MCP Team',
    version: '1.0.0',
    icon: '🐘',
    isOfficial: true,
    categories: ['Database', 'SQL', 'Development'],
    features: [
      'Database connection management',
      'SQL query execution',
      'Schema visualization',
      'Query optimizations'
    ],
    repository: 'https://github.com/mcp/postgres-tool'
  },
  {
    id: 'github-copilot-proxy',
    name: 'GitHub Copilot Proxy',
    type: 'HTTP_SSE',
    description: 'Proxy for GitHub Copilot API',
    author: 'MCP Team',
    version: '1.2.0',
    icon: '🤖',
    isOfficial: true,
    categories: ['AI', 'Development', 'Productivity'],
    features: [
      'Code suggestions',
      'Auto-completion',
      'Comment-to-code generation',
      'API integration'
    ],
    repository: 'https://github.com/mcp/github-copilot-proxy'
  },
  {
    id: 'local-file-assistant',
    name: 'Local File Assistant',
    type: 'STDIO',
    description: 'Assists with local file operations',
    author: 'MCP Team',
    version: '0.9.1',
    icon: '📁',
    isOfficial: false,
    categories: ['Files', 'System', 'Utility'],
    features: [
      'File search and indexing',
      'Content analysis',
      'File monitoring',
      'Batch operations'
    ],
    repository: 'https://github.com/mcp/local-file-assistant'
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
    },
    requestCount: 124 // Added request count
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
    },
    requestCount: 37 // Added request count
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
    },
    requestCount: 892 // Added request count
  },
  {
    id: 'local-files',
    definitionId: 'local-file-assistant',
    name: 'Local File Assistant',
    status: 'error',
    enabled: true,
    connectionDetails: '/usr/local/bin/file-assistant',
    arguments: ['--watch', '/home/user/projects'],
    requestCount: 56 // Added request count
  },
];

export const profiles: Profile[] = [
  {
    id: 'general-dev',
    name: 'General Development',
    endpointType: 'HTTP_SSE',
    enabled: true,
    endpoint: 'http://localhost:8008/mcp',
    instances: ['github-copilot', 'local-files'],
    description: 'General development profile for everyday coding tasks'
  },
  {
    id: 'database-ops',
    name: 'Database Operations',
    endpointType: 'HTTP_SSE',
    enabled: true,
    endpoint: 'http://localhost:8009/mcp',
    instances: ['postgres-dev'],
    description: 'Profile for database operations and management'
  },
  {
    id: 'project-x',
    name: 'Project X',
    endpointType: 'STDIO',
    enabled: false,
    endpoint: '/usr/local/bin/mcp-stdio',
    instances: ['github-copilot', 'postgres-prod'],
    description: 'Specialized profile for Project X development'
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
    description: 'Tools for working with AWS services, including Lambda, EC2, S3, and more. Provides seamless integration with the AWS ecosystem.',
    author: 'AWS Community',
    version: '2.1.0',
    icon: '☁️',
    isOfficial: true,
    categories: ['Cloud', 'DevOps', 'Infrastructure'],
    features: [
      'Supports TypeScript development',
      'Auto-imports and code completion',
      'Real-time error checking',
      'Integrated debugging'
    ],
    repository: 'https://github.com/AWS Community/aws toolkit'
  },
  {
    id: 'docker-assistant',
    name: 'Docker Assistant',
    type: 'HTTP_SSE',
    description: 'Helps manage Docker containers and images. Provides an intuitive interface for container management and monitoring.',
    author: 'Docker Community',
    version: '1.5.0',
    icon: '🐳',
    isOfficial: false,
    categories: ['DevOps', 'Containers', 'Infrastructure'],
    features: [
      'Container lifecycle management',
      'Image building and optimization',
      'Network configuration',
      'Volume management'
    ],
    repository: 'https://github.com/docker/assistant'
  },
  {
    id: 'kubernetes-helper',
    name: 'Kubernetes Helper',
    type: 'STDIO',
    description: 'Tools for working with Kubernetes clusters, including deployment, scaling, and monitoring solutions.',
    author: 'K8s Community',
    version: '0.9.5',
    icon: '⎈',
    isOfficial: false,
    categories: ['DevOps', 'Cloud', 'Infrastructure'],
    features: [
      'Cluster management',
      'Pod visualization',
      'Resource monitoring',
      'Deployment automation'
    ],
    repository: 'https://github.com/k8s/helper'
  },
  {
    id: 'frontend-dev-tools',
    name: 'Frontend Dev Tools',
    type: 'HTTP_SSE',
    description: 'Utilities for frontend development, including code generators, component libraries, and testing tools.',
    author: 'Web Dev Team',
    version: '3.2.1',
    icon: '🖥️',
    isOfficial: true,
    categories: ['Web', 'UI/UX', 'Frontend'],
    features: [
      'Component scaffolding',
      'Style generation',
      'Accessibility testing',
      'Performance optimization'
    ],
    repository: 'https://github.com/webdev/frontend-tools'
  },
];
