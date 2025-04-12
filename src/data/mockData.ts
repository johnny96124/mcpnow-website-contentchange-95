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
  downloads?: number;
  url?: string;
  commandArgs?: string;
  environment?: Record<string, string>;
  headers?: Record<string, string>;
  tools?: Tool[];
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  parameters?: ToolParameter[];
}

export interface ToolParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object';
  description: string;
  required?: boolean;
}

export interface EnhancedServerDefinition extends ServerDefinition {
  views: number;
  updated: string;
  trending?: boolean;
  forks?: number;
  watches?: number;
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
  url?: string;
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
    },
    tools: [
      {
        id: "query",
        name: "Run SQL Query",
        description: "Execute SQL queries against a PostgreSQL database.",
        parameters: [
          {
            name: "query",
            type: "string",
            description: "The SQL query to execute",
            required: true
          },
          {
            name: "database",
            type: "string",
            description: "Database name to connect to",
            required: true
          }
        ]
      },
      {
        id: "listTables",
        name: "List Tables",
        description: "List all tables in the specified database schema.",
        parameters: [
          {
            name: "database",
            type: "string",
            description: "Database name to connect to",
            required: true
          },
          {
            name: "schema",
            type: "string",
            description: "Schema name (defaults to public)",
            required: false
          }
        ]
      },
      {
        id: "describeTable",
        name: "Describe Table",
        description: "Show detailed information about a table's structure.",
        parameters: [
          {
            name: "database",
            type: "string",
            description: "Database name to connect to",
            required: true
          },
          {
            name: "table",
            type: "string",
            description: "Table name to describe",
            required: true
          },
          {
            name: "schema",
            type: "string",
            description: "Schema name (defaults to public)",
            required: false
          }
        ]
      }
    ]
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
    },
    tools: [
      {
        id: "getCompletion",
        name: "Get Code Completion",
        description: "Get code completions from GitHub Copilot for your current cursor position.",
        parameters: [
          {
            name: "prompt",
            type: "string",
            description: "The code context before the cursor",
            required: true
          },
          {
            name: "language",
            type: "string",
            description: "Programming language of the code",
            required: true
          },
          {
            name: "maxTokens",
            type: "number",
            description: "Maximum number of tokens to generate",
            required: false
          }
        ]
      },
      {
        id: "generateDocumentation",
        name: "Generate Documentation",
        description: "Generate documentation for the provided code snippet.",
        parameters: [
          {
            name: "code",
            type: "string",
            description: "The code to document",
            required: true
          },
          {
            name: "language",
            type: "string",
            description: "Programming language of the code",
            required: true
          },
          {
            name: "style",
            type: "string",
            description: "Documentation style (e.g., JSDoc, DocBlock)",
            required: false
          }
        ]
      }
    ]
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
    downloads: 2800,
    tools: [
      {
        id: "searchFiles",
        name: "Search Files",
        description: "Search for files matching specific patterns or content.",
        parameters: [
          {
            name: "pattern",
            type: "string",
            description: "File pattern to search for (supports glob patterns)",
            required: true
          },
          {
            name: "directory",
            type: "string",
            description: "Directory to search within",
            required: true
          },
          {
            name: "recursive",
            type: "boolean",
            description: "Whether to search recursively in subdirectories",
            required: false
          }
        ]
      },
      {
        id: "readFile",
        name: "Read File",
        description: "Read the contents of a file.",
        parameters: [
          {
            name: "filePath",
            type: "string",
            description: "Path to the file to read",
            required: true
          },
          {
            name: "encoding",
            type: "string",
            description: "File encoding (defaults to UTF-8)",
            required: false
          }
        ]
      }
    ]
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
    downloads: 2950,
    tools: [
      {
        id: "compose-up",
        name: "Docker Compose Up",
        description: "Start services defined in a docker-compose.yml file.",
        parameters: [
          {
            name: "file",
            type: "string",
            description: "Path to docker-compose.yml file",
            required: true
          },
          {
            name: "services",
            type: "string",
            description: "Specific services to start (comma-separated)",
            required: false
          },
          {
            name: "detached",
            type: "boolean",
            description: "Run containers in detached mode",
            required: false
          }
        ]
      },
      {
        id: "compose-down",
        name: "Docker Compose Down",
        description: "Stop and remove containers, networks, and volumes defined in docker-compose.yml.",
        parameters: [
          {
            name: "file",
            type: "string",
            description: "Path to docker-compose.yml file",
            required: true
          },
          {
            name: "removeVolumes",
            type: "boolean",
            description: "Also remove volumes",
            required: false
          },
          {
            name: "removeImages",
            type: "string",
            description: "Remove images, one of: 'all' or 'local'",
            required: false
          }
        ]
      },
      {
        id: "compose-logs",
        name: "Docker Compose Logs",
        description: "View output from containers.",
        parameters: [
          {
            name: "file",
            type: "string",
            description: "Path to docker-compose.yml file",
            required: true
          },
          {
            name: "services",
            type: "string",
            description: "Specific services to show logs for (comma-separated)",
            required: false
          },
          {
            name: "follow",
            type: "boolean",
            description: "Follow log output",
            required: false
          },
          {
            name: "tail",
            type: "number",
            description: "Number of lines to show from the end of logs",
            required: false
          }
        ]
      }
    ]
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

export const extendedItems: EnhancedServerDefinition[] = [
  ...discoveryItems.map(item => ({
    ...item,
    views: Math.floor(Math.random() * 50000) + 1000,
    updated: "2025-03-15",
    author: item.author || "API Team"
  })),
  ...discoveryItems.map((item, index) => ({
    ...item,
    id: `trending-${item.id}-${index}`,
    name: `${item.name} API`,
    views: Math.floor(Math.random() * 1000000) + 50000,
    updated: "2025-04-03",
    isOfficial: true,
    trending: true,
    forks: Math.floor(Math.random() * 100) + 30,
    watches: Math.floor(Math.random() * 1000) + 200,
    author: item.author || "API Team",
    downloads: Math.floor(Math.random() * 5000) + 500
  })),
  ...discoveryItems.map((item, index) => ({
    ...item,
    id: `community-${item.id}-${index}`,
    name: `${item.name} Community`,
    isOfficial: false,
    views: Math.floor(Math.random() * 50000) + 1000,
    updated: "2025-02-15",
    author: "Community Contributor",
    categories: [...(item.categories || []), "Community"],
    downloads: Math.floor(Math.random() * 2000) + 100,
    watches: Math.floor(Math.random() * 500) + 50
  }))
];

extendedItems.forEach(item => {
  if (item.name.toLowerCase().includes('aws')) {
    item.tools = [
      {
        id: "invoke-lambda",
        name: "Invoke AWS Lambda",
        description: "Invoke an AWS Lambda function and retrieve its response.",
        parameters: [
          {
            name: "functionName",
            type: "string",
            description: "Name or ARN of the Lambda function",
            required: true
          },
          {
            name: "payload",
            type: "string",
            description: "JSON payload to pass to the function",
            required: true
          },
          {
            name: "region",
            type: "string",
            description: "AWS region of the Lambda function",
            required: false
          }
        ]
      },
      {
        id: "list-s3-objects",
        name: "List S3 Objects",
        description: "List objects in an S3 bucket with optional prefix filtering.",
        parameters: [
          {
            name: "bucket",
            type: "string",
            description: "Name of the S3 bucket",
            required: true
          },
          {
            name: "prefix",
            type: "string",
            description: "Object key prefix for filtering results",
            required: false
          },
          {
            name: "maxKeys",
            type: "number",
            description: "Maximum number of keys to return",
            required: false
          }
        ]
      }
    ];
  }
  
  if (item.name.toLowerCase().includes('database') || item.name.toLowerCase().includes('sql')) {
    item.tools = [
      {
        id: "execute-query",
        name: "Execute Database Query",
        description: "Run SQL queries against various database systems.",
        parameters: [
          {
            name: "query",
            type: "string",
            description: "SQL query to execute",
            required: true
          },
          {
            name: "connectionString",
            type: "string",
            description: "Database connection string",
            required: true
          },
          {
            name: "parameters",
            type: "object",
            description: "Query parameters as key-value pairs",
            required: false
          }
        ]
      },
      {
        id: "backup-database",
        name: "Backup Database",
        description: "Create a backup of a database.",
        parameters: [
          {
            name: "connectionString",
            type: "string",
            description: "Database connection string",
            required: true
          },
          {
            name: "targetPath",
            type: "string",
            description: "Path to save the backup file",
            required: true
          },
          {
            name: "compressionLevel",
            type: "number",
            description: "Compression level (0-9)",
            required: false
          }
        ]
      }
    ];
  }

  const originalDefinition = serverDefinitions.find(def => def.id === item.id);
  if (originalDefinition?.tools) {
    item.tools = originalDefinition.tools;
  }
});

discoveryItems[0].tools = [
  {
    id: "aws-cloudformation",
    name: "Deploy CloudFormation",
    description: "Deploy an AWS CloudFormation template to create or update a stack.",
    parameters: [
      {
        name: "templatePath",
        type: "string",
        description: "Path to CloudFormation template (JSON or YAML)",
        required: true
      },
      {
        name: "stackName",
        type: "string",
        description: "Name of the CloudFormation stack",
        required: true
      },
      {
        name: "parameters",
        type: "object",
        description: "Key-value pairs for template parameters",
        required: false
      },
      {
        name: "region",
        type: "string",
        description: "AWS region for deployment",
        required: true
      }
    ]
  }
];

discoveryItems[1].tools = [
  {
    id: "docker-build",
    name: "Build Docker Image",
    description: "Build a Docker image from a Dockerfile.",
    parameters: [
      {
        name: "contextPath",
        type: "string",
        description: "Path to the build context directory",
        required: true
      },
      {
        name: "dockerfile",
        type: "string",
        description: "Path to Dockerfile (relative to context)",
        required: false
      },
      {
        name: "tag",
        type: "string",
        description: "Tag for the built image",
        required: true
      },
      {
        name: "buildArgs",
        type: "object",
        description: "Build-time variables as key-value pairs",
        required: false
      }
    ]
  },
  {
    id: "docker-push",
    name: "Push Docker Image",
    description: "Push a Docker image to a registry.",
    parameters: [
      {
        name: "imageTag",
        type: "string",
        description: "Tag of the image to push",
        required: true
      },
      {
        name: "registry",
        type: "string",
        description: "Docker registry URL",
        required: false
      },
      {
        name: "username",
        type: "string",
        description: "Registry username",
        required: false
      },
      {
        name: "password",
        type: "string",
        description: "Registry password",
        required: false
      }
    ]
  }
];
