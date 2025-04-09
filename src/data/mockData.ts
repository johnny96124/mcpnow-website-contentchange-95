export type EndpointType = 'HTTP_SSE' | 'STDIO';
export type Status = 'running' | 'stopped' | 'error' | 'connecting';
export type ConnectionStatus = 'connected' | 'disconnected' | 'misconfigured' | 'unknown';
export type RuntimeStatus = 'connecting' | 'connected' | 'failed' | 'disconnected';

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
  downloads?: number;
  url?: string;
  commandArgs?: string;
  environment?: Record<string, string>;
  headers?: Record<string, string>;
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
  requestCount?: number;
  headers?: Record<string, string>;
}

export interface Profile {
  id: string;
  name: string;
  endpointType: EndpointType;
  enabled: boolean;
  endpoint: string;
  instances: string[];
  description?: string;
}

export interface Host {
  id: string;
  name: string;
  profileId?: string;
  configStatus: 'configured' | 'misconfigured' | 'unknown';
  connectionStatus: ConnectionStatus;
  configPath?: string;
  icon?: string;
  needsUpdate?: boolean;
}

export interface RuntimeInstance {
  id: string;
  instanceId: string;
  profileId: string;
  hostId: string;
  status: RuntimeStatus;
  errorMessage?: string;
  startedAt: Date;
  requestCount: number;
  lastActivityAt?: Date;
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
    repository: 'https://github.com/mcp/postgres-tool',
    downloads: 3500,
    commandArgs: '--postgres-mcp',
    environment: { 
      'PG_HOST': 'localhost',
      'PG_PORT': '5432'
    }
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
    repository: 'https://github.com/mcp/github-copilot-proxy',
    downloads: 4200,
    url: 'https://api.github.com/copilot/v1',
    headers: {
      'Authorization': 'Bearer ${GITHUB_TOKEN}',
      'Content-Type': 'application/json'
    }
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
    repository: 'https://github.com/mcp/local-file-assistant',
    downloads: 2800
  },
  {
    id: 'code-assistant',
    name: 'Code Assistant',
    type: 'HTTP_SSE',
    description: 'AI-powered code completion and suggestions',
    author: 'MCP Community',
    version: '2.1.0',
    icon: '💻',
    isOfficial: false,
    categories: ['Development', 'AI', 'Productivity'],
    features: [
      'Code completion',
      'Documentation generation',
      'Code refactoring',
      'Bug detection'
    ],
    repository: 'https://github.com/mcp-community/code-assistant',
    downloads: 3700
  },
  {
    id: 'docker-compose-tools',
    name: 'Docker Compose Tools',
    type: 'STDIO',
    description: 'Tools for managing Docker Compose environments',
    author: 'MCP Community',
    version: '1.4.2',
    icon: '🐋',
    isOfficial: false,
    categories: ['DevOps', 'Containers'],
    features: [
      'Environment management',
      'Service scaling',
      'Config validation',
      'Performance monitoring'
    ],
    repository: 'https://github.com/mcp-community/docker-compose-tools',
    downloads: 2950
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
    requestCount: 124
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
    requestCount: 37
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
    requestCount: 892
  },
  {
    id: 'local-files',
    definitionId: 'local-file-assistant',
    name: 'Local File Assistant',
    status: 'error',
    enabled: true,
    connectionDetails: '/usr/local/bin/file-assistant',
    arguments: ['--watch', '/home/user/projects'],
    requestCount: 56
  },
  {
    id: 'code-assist-team1',
    definitionId: 'code-assistant',
    name: 'Team1 Code Assistant',
    status: 'running',
    enabled: true,
    connectionDetails: 'http://localhost:8090/code-assist',
    requestCount: 245
  },
  {
    id: 'code-assist-team2',
    definitionId: 'code-assistant',
    name: 'Team2 Code Assistant',
    status: 'error',
    enabled: true,
    connectionDetails: 'http://localhost:8091/code-assist',
    requestCount: 178
  },
  {
    id: 'code-assist-personal',
    definitionId: 'code-assistant',
    name: 'Personal Code Assistant',
    status: 'stopped',
    enabled: false,
    connectionDetails: 'http://localhost:8092/code-assist',
    requestCount: 57
  },
  {
    id: 'docker-tools-dev',
    definitionId: 'docker-compose-tools',
    name: 'Development Docker Tools',
    status: 'running',
    enabled: true,
    connectionDetails: '/usr/local/bin/docker-tools',
    requestCount: 325
  },
  {
    id: 'docker-tools-prod',
    definitionId: 'docker-compose-tools',
    name: 'Production Docker Tools',
    status: 'stopped',
    enabled: false,
    connectionDetails: '/usr/local/bin/docker-tools',
    requestCount: 112
  },
  {
    id: 'docker-tools-test',
    definitionId: 'docker-compose-tools',
    name: 'Testing Docker Tools',
    status: 'running',
    enabled: true,
    connectionDetails: '/usr/local/bin/docker-tools',
    requestCount: 204
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
    icon: '🧠',
    needsUpdate: true
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
    repository: 'https://github.com/AWS Community/aws toolkit',
    downloads: 4500
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
    repository: 'https://github.com/docker/assistant',
    downloads: 4000
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
    repository: 'https://github.com/k8s/helper',
    downloads: 3800
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
    repository: 'https://github.com/webdev/frontend-tools',
    downloads: 3800
  },
];
