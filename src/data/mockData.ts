export type HostType = 'external' | 'mcpnow';
export type EndpointType = 'HTTP_SSE' | 'STDIO' | 'WS';
export type ConnectionStatus = 'connected' | 'disconnected' | 'misconfigured' | 'unknown';

export interface Host {
  id: string;
  name: string;
  type: HostType;
  connectionStatus: ConnectionStatus;
  configStatus: 'configured' | 'misconfigured' | 'unknown';
  configPath?: string;
  icon?: string;
  description?: string;
  isDefault?: boolean;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  parameters?: ToolParameter[];
}

export interface ToolParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  description: string;
  required?: boolean;
  default?: any;
}

export interface ServerDefinition {
  id: string;
  name: string;
  type: EndpointType;
  description: string;
  icon?: string;
  downloads: number;
  stars?: number;
  author?: string;
  categories?: string[];
  isOfficial?: boolean;
  features?: string[];
  repository?: string;
  url?: string;
  commandArgs?: string;
  environment?: Record<string, string>;
  headers?: Record<string, string>;
  tools?: Tool[];
  version?: string;
}

export interface ServerInstance {
  id: string;
  name: string;
  definitionId: string;
  status: 'running' | 'stopped' | 'error' | 'connecting';
  connectionDetails: string;
  requestCount?: number;
  environment?: Record<string, string>;
  arguments?: string[];
  url?: string;
  headers?: Record<string, string>;
  enabled: boolean;
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

export const hosts: Host[] = [
  {
    id: 'mcpnow-host',
    name: 'MCP Now',
    type: 'mcpnow',
    connectionStatus: 'connected',
    configStatus: 'configured',
    icon: '🚀',
    description: 'Built-in MCP Now host for direct AI chat integration',
    isDefault: true
  },
  {
    id: 'cursor-host',
    name: 'Cursor',
    type: 'external',
    connectionStatus: 'connected',
    configStatus: 'configured',
    configPath: '/Users/username/.cursor/mcp_servers.json',
    icon: '⚡'
  },
  {
    id: 'claude-host',
    name: 'Claude Desktop',
    type: 'external',
    connectionStatus: 'disconnected',
    configStatus: 'configured',
    configPath: '/Users/username/Library/Application Support/Claude/claude_desktop_config.json',
    icon: '🤖'
  },
  {
    id: 'vscode-host',
    name: 'VS Code',
    type: 'external',
    connectionStatus: 'misconfigured',
    configStatus: 'configured',
    configPath: '/Users/username/.vscode/settings.json',
    icon: '💻'
  }
];

export const serverDefinitions: ServerDefinition[] = [
  {
    id: 'fastgpt-server',
    name: 'FastGPT Server',
    type: 'HTTP_SSE',
    description: 'High-performance GPT model server with streaming responses',
    icon: '🚀',
    downloads: 2342,
    stars: 4.9,
    author: 'AI Systems Inc',
    categories: ['AI', 'LLM', 'NLP'],
    isOfficial: true,
    features: ['High throughput streaming responses', 'Automatic model quantization', 'Multi-model support', 'Custom prompt templates'],
    repository: 'https://github.com/ai-systems/fastgpt-server',
    url: 'http://localhost:8000',
    commandArgs: '--model gpt-4',
    version: '1.2.3',
    environment: {
      'API_KEY': 'your_api_key'
    },
    headers: {
      'Content-Type': 'application/json'
    },
    tools: [{
      id: 'summarize',
      name: 'Summarize Text',
      description: 'Summarizes the given text into a concise summary.',
      parameters: [{
        name: 'text',
        type: 'string',
        description: 'The text to summarize',
        required: true
      }, {
        name: 'maxLength',
        type: 'number',
        description: 'Maximum length of the summary',
        default: 100
      }]
    }, {
      id: 'translate',
      name: 'Translate Text',
      description: 'Translates the given text to a specified language.',
      parameters: [{
        name: 'text',
        type: 'string',
        description: 'The text to translate',
        required: true
      }, {
        name: 'language',
        type: 'string',
        description: 'The target language',
        required: true
      }]
    }]
  },
  {
    id: 'code-assistant',
    name: 'CodeAssistant',
    type: 'STDIO',
    description: 'Code completion and analysis server with multiple language support',
    icon: '💻',
    downloads: 1856,
    stars: 4.8,
    author: 'DevTools Ltd',
    categories: ['Development', 'AI', 'Code'],
    isOfficial: true,
    features: ['Multi-language support', 'Context-aware completions', 'Semantic code search', 'Integration with popular IDEs'],
    repository: 'https://github.devtools/code-assistant',
    commandArgs: '--lang python',
    version: '2.1.0',
    environment: {
      'PYTHON_PATH': '/usr/bin/python3'
    },
    headers: {
      'Authorization': 'Bearer your_token'
    },
    tools: [{
      id: 'complete-code',
      name: 'Complete Code',
      description: 'Completes the given code snippet.',
      parameters: [{
        name: 'code',
        type: 'string',
        description: 'The code snippet to complete',
        required: true
      }]
    }, {
      id: 'analyze-code',
      name: 'Analyze Code',
      description: 'Analyzes the given code for potential issues.',
      parameters: [{
        name: 'code',
        type: 'string',
        description: 'The code to analyze',
        required: true
      }]
    }]
  },
  {
    id: 'prompt-wizard',
    name: 'PromptWizard',
    type: 'HTTP_SSE',
    description: 'Advanced prompt engineering and testing server',
    icon: '✨',
    downloads: 1543,
    stars: 4.7,
    author: 'PromptLabs',
    categories: ['AI', 'Prompting', 'Testing'],
    isOfficial: false,
    features: ['Prompt versioning', 'A/B testing framework', 'Performance analytics', 'Template library'],
    repository: 'https://github.com/promptlabs/prompt-wizard',
    url: 'http://localhost:8001',
    commandArgs: '--test-mode',
    version: '1.5.2',
    environment: {
      'PROMPT_API_KEY': 'your_prompt_key'
    },
    headers: {
      'X-Request-ID': 'unique_id'
    },
    tools: [{
      id: 'generate-prompt',
      name: 'Generate Prompt',
      description: 'Generates a prompt based on the given parameters.',
      parameters: [{
        name: 'topic',
        type: 'string',
        description: 'The topic of the prompt',
        required: true
      }, {
        name: 'style',
        type: 'string',
        description: 'The style of the prompt',
        default: 'informative'
      }]
    }, {
      id: 'test-prompt',
      name: 'Test Prompt',
      description: 'Tests the given prompt and returns the results.',
      parameters: [{
        name: 'prompt',
        type: 'string',
        description: 'The prompt to test',
        required: true
      }]
    }]
  },
  {
    id: 'semantic-search',
    name: 'SemanticSearch',
    type: 'HTTP_SSE',
    description: 'Vector database integration for semantic search capabilities',
    icon: '🔍',
    downloads: 1278,
    stars: 4.6,
    author: 'SearchTech',
    categories: ['Search', 'Embeddings', 'Vector DB'],
    isOfficial: false,
    features: ['Multiple vector DB integrations', 'Hybrid search capabilities', 'Custom embeddings support', 'Query optimization'],
    repository: 'https://github.com/searchtech/semantic-search',
    url: 'http://localhost:8002',
    commandArgs: '--db-type pinecone',
    version: '3.0.1',
    environment: {
      'PINECONE_API_KEY': 'your_pinecone_key'
    },
    headers: {
      'Accept': 'application/json'
    },
    tools: [{
      id: 'search-documents',
      name: 'Search Documents',
      description: 'Searches for documents related to the given query.',
      parameters: [{
        name: 'query',
        type: 'string',
        description: 'The search query',
        required: true
      }, {
        name: 'limit',
        type: 'number',
        description: 'The maximum number of results to return',
        default: 10
      }]
    }, {
      id: 'embed-document',
      name: 'Embed Document',
      description: 'Embeds the given document into the vector database.',
      parameters: [{
        name: 'document',
        type: 'string',
        description: 'The document to embed',
        required: true
      }]
    }]
  },
  {
    id: 'document-loader',
    name: 'DocumentLoader',
    type: 'HTTP_SSE',
    description: 'Document parsing and processing for various file formats',
    icon: '📄',
    downloads: 1150,
    stars: 4.5,
    author: 'DocTools',
    categories: ['Document', 'Processing', 'Parsing'],
    isOfficial: true,
    features: ['Multi-format support (PDF, DOCX, TXT)', 'Extraction of structured data', 'Document chunking', 'Metadata extraction'],
    repository: 'https://github.com/doctools/document-loader',
    url: 'http://localhost:8003',
    commandArgs: '--formats pdf,docx',
    version: '2.3.1',
    environment: {
      'OCR_API_KEY': 'your_ocr_key'
    },
    headers: {
      'User-Agent': 'DocumentLoader/1.0'
    },
    tools: [{
      id: 'load-document',
      name: 'Load Document',
      description: 'Loads and parses the given document.',
      parameters: [{
        name: 'url',
        type: 'string',
        description: 'The URL of the document',
        required: true
      }]
    }, {
      id: 'extract-metadata',
      name: 'Extract Metadata',
      description: 'Extracts metadata from the given document.',
      parameters: [{
        name: 'document',
        type: 'string',
        description: 'The document to extract metadata from',
        required: true
      }]
    }]
  },
  {
    id: 'vector-store',
    name: 'VectorStore',
    type: 'HTTP_SSE',
    description: 'High-performance vector database for AI applications',
    icon: '🔮',
    downloads: 1050,
    stars: 4.4,
    author: 'VectorTech',
    categories: ['Database', 'Vectors', 'Storage'],
    isOfficial: false,
    features: ['Fast similarity search', 'Efficient vector storage', 'Hybrid queries', 'Multi-tenancy support'],
    repository: 'https://github.com/vectortech/vector-store',
    url: 'http://localhost:8004',
    commandArgs: '--port 5432',
    version: '1.8.0',
    environment: {
      'DATABASE_URL': 'your_db_url'
    },
    headers: {
      'X-API-Version': '1.0'
    },
    tools: [{
      id: 'store-vector',
      name: 'Store Vector',
      description: 'Stores the given vector in the database.',
      parameters: [{
        name: 'vector',
        type: 'array',
        description: 'The vector to store',
        required: true
      }, {
        name: 'metadata',
        type: 'object',
        description: 'Metadata associated with the vector',
        required: false
      }]
    }, {
      id: 'query-vector',
      name: 'Query Vector',
      description: 'Queries the database for similar vectors.',
      parameters: [{
        name: 'vector',
        type: 'array',
        description: 'The query vector',
        required: true
      }, {
        name: 'limit',
        type: 'number',
        description: 'The maximum number of results to return',
        default: 5
      }]
    }]
  },
  {
    id: 'image-processor',
    name: 'ImageProcessor',
    type: 'STDIO',
    description: 'Image analysis and transformation server',
    icon: '🖼️',
    downloads: 980,
    stars: 4.3,
    author: 'PixelWorks',
    categories: ['Image', 'Processing', 'AI'],
    isOfficial: true,
    features: ['Object detection', 'Image classification', 'Image transformations', 'Batch processing'],
    repository: 'https://github.com/pixelworks/image-processor',
    commandArgs: '--model resnet50',
    version: '1.4.5',
    environment: {
      'CUDA_VISIBLE_DEVICES': '0'
    },
    headers: {
      'Cache-Control': 'no-cache'
    },
    tools: [{
      id: 'detect-objects',
      name: 'Detect Objects',
      description: 'Detects objects in the given image.',
      parameters: [{
        name: 'image',
        type: 'string',
        description: 'The URL or path to the image',
        required: true
      }]
    }, {
      id: 'transform-image',
      name: 'Transform Image',
      description: 'Transforms the given image using specified parameters.',
      parameters: [{
        name: 'image',
        type: 'string',
        description: 'The URL or path to the image',
        required: true
      }, {
        name: 'rotation',
        type: 'number',
        description: 'The rotation angle in degrees',
        default: 0
      }]
    }]
  },
  {
    id: 'audio-transcriber',
    name: 'AudioTranscriber',
    type: 'STDIO',
    description: 'Speech-to-text and audio analysis server',
    icon: '🎵',
    downloads: 920,
    stars: 4.2,
    author: 'AudioLabs',
    categories: ['Audio', 'Transcription', 'Speech'],
    isOfficial: false,
    features: ['Multi-language transcription', 'Speaker diarization', 'Noise reduction', 'Audio summarization'],
    repository: 'https://github.com/audiolabs/audio-transcriber',
    commandArgs: '--lang en',
    version: '2.0.3',
    environment: {
      'WHISPER_MODEL': 'base'
    },
    headers: {
      'X-Real-IP': '127.0.0.1'
    },
    tools: [{
      id: 'transcribe-audio',
      name: 'Transcribe Audio',
      description: 'Transcribes the given audio file.',
      parameters: [{
        name: 'audio',
        type: 'string',
        description: 'The URL or path to the audio file',
        required: true
      }]
    }, {
      id: 'summarize-audio',
      name: 'Summarize Audio',
      description: 'Summarizes the content of the given audio file.',
      parameters: [{
        name: 'audio',
        type: 'string',
        description: 'The URL or path to the audio file',
        required: true
      }]
    }]
  },
  {
    id: 'data-analyzer',
    name: 'DataAnalyzer',
    type: 'HTTP_SSE',
    description: 'Data analysis and visualization server',
    icon: '📊',
    downloads: 870,
    stars: 4.1,
    author: 'DataWorks',
    categories: ['Data', 'Analysis', 'Visualization'],
    isOfficial: true,
    features: ['Statistical analysis', 'Data visualization', 'Automated insights', 'Report generation'],
    repository: 'https://github.com/dataworks/data-analyzer',
    url: 'http://localhost:8005',
    commandArgs: '--format csv',
    version: '3.2.1',
    environment: {
      'DATABASE_URL': 'your_db_url'
    },
    headers: {
      'Content-Encoding': 'gzip'
    },
    tools: [{
      id: 'analyze-data',
      name: 'Analyze Data',
      description: 'Analyzes the given data and returns insights.',
      parameters: [{
        name: 'data',
        type: 'string',
        description: 'The URL or path to the data file',
        required: true
      }]
    }, {
      id: 'visualize-data',
      name: 'Visualize Data',
      description: 'Visualizes the given data using specified parameters.',
      parameters: [{
        name: 'data',
        type: 'string',
        description: 'The URL or path to the data file',
        required: true
      }, {
        name: 'chartType',
        type: 'string',
        description: 'The type of chart to generate',
        default: 'bar'
      }]
    }]
  },
  {
    id: 'chat-bot',
    name: 'ChatBot',
    type: 'HTTP_SSE',
    description: 'Conversational AI platform with multiple personalities',
    icon: '💬',
    downloads: 820,
    stars: 4.0,
    author: 'ChatTech',
    categories: ['Chat', 'Conversational', 'AI'],
    isOfficial: false,
    features: ['Multiple personality templates', 'Context management', 'Knowledge base integration', 'Multi-turn conversations'],
    repository: 'https://github.com/chattech/chatbot',
    url: 'http://localhost:8006',
    commandArgs: '--personality friendly',
    version: '1.9.2',
    environment: {
      'CHATBOT_API_KEY': 'your_chatbot_key'
    },
    headers: {
      'X-Origin': 'MCP'
    },
    tools: [{
      id: 'send-message',
      name: 'Send Message',
      description: 'Sends a message to the chatbot and returns the response.',
      parameters: [{
        name: 'message',
        type: 'string',
        description: 'The message to send',
        required: true
      }]
    }, {
      id: 'get-context',
      name: 'Get Context',
      description: 'Retrieves the current context of the conversation.',
      parameters: []
    }]
  }
];

export const serverInstances: ServerInstance[] = [
  {
    id: 'fastgpt-instance-1',
    name: 'FastGPT Instance 1',
    definitionId: 'fastgpt-server',
    status: 'running',
    connectionDetails: 'http://localhost:8000',
    requestCount: 120,
    environment: {
      'API_KEY': 'your_api_key'
    },
    arguments: ['--model gpt-4'],
    url: 'http://localhost:8000',
    headers: {
      'Content-Type': 'application/json'
    },
    enabled: true
  },
  {
    id: 'code-assistant-instance-1',
    name: 'CodeAssistant Instance 1',
    definitionId: 'code-assistant',
    status: 'stopped',
    connectionDetails: 'stdio',
    requestCount: 50,
    environment: {
      'PYTHON_PATH': '/usr/bin/python3'
    },
    arguments: ['--lang python'],
    url: null,
    headers: {
      'Authorization': 'Bearer your_token'
    },
    enabled: false
  },
  {
    id: 'prompt-wizard-instance-1',
    name: 'PromptWizard Instance 1',
    definitionId: 'prompt-wizard',
    status: 'running',
    connectionDetails: 'http://localhost:8001',
    requestCount: 80,
    environment: {
      'PROMPT_API_KEY': 'your_prompt_key'
    },
    arguments: ['--test-mode'],
    url: 'http://localhost:8001',
    headers: {
      'X-Request-ID': 'unique_id'
    },
    enabled: true
  },
  {
    id: 'semantic-search-instance-1',
    name: 'SemanticSearch Instance 1',
    definitionId: 'semantic-search',
    status: 'error',
    connectionDetails: 'http://localhost:8002',
    requestCount: 30,
    environment: {
      'PINECONE_API_KEY': 'your_pinecone_key'
    },
    arguments: ['--db-type pinecone'],
    url: 'http://localhost:8002',
    headers: {
      'Accept': 'application/json'
    },
    enabled: false
  },
  {
    id: 'document-loader-instance-1',
    name: 'DocumentLoader Instance 1',
    definitionId: 'document-loader',
    status: 'running',
    connectionDetails: 'http://localhost:8003',
    requestCount: 90,
    environment: {
      'OCR_API_KEY': 'your_ocr_key'
    },
    arguments: ['--formats pdf,docx'],
    url: 'http://localhost:8003',
    headers: {
      'User-Agent': 'DocumentLoader/1.0'
    },
    enabled: true
  },
  {
    id: 'vector-store-instance-1',
    name: 'VectorStore Instance 1',
    definitionId: 'vector-store',
    status: 'stopped',
    connectionDetails: 'http://localhost:8004',
    requestCount: 40,
    environment: {
      'DATABASE_URL': 'your_db_url'
    },
    arguments: ['--port 5432'],
    url: 'http://localhost:8004',
    headers: {
      'X-API-Version': '1.0'
    },
    enabled: false
  },
  {
    id: 'image-processor-instance-1',
    name: 'ImageProcessor Instance 1',
    definitionId: 'image-processor',
    status: 'running',
    connectionDetails: 'stdio',
    requestCount: 70,
    environment: {
      'CUDA_VISIBLE_DEVICES': '0'
    },
    arguments: ['--model resnet50'],
    url: null,
    headers: {
      'Cache-Control': 'no-cache'
    },
    enabled: true
  },
  {
    id: 'audio-transcriber-instance-1',
    name: 'AudioTranscriber Instance 1',
    definitionId: 'audio-transcriber',
    status: 'error',
    connectionDetails: 'stdio',
    requestCount: 20,
    environment: {
      'WHISPER_MODEL': 'base'
    },
    arguments: ['--lang en'],
    url: null,
    headers: {
      'X-Real-IP': '127.0.0.1'
    },
    enabled: false
  },
  {
    id: 'data-analyzer-instance-1',
    name: 'DataAnalyzer Instance 1',
    definitionId: 'data-analyzer',
    status: 'running',
    connectionDetails: 'http://localhost:8005',
    requestCount: 60,
    environment: {
      'DATABASE_URL': 'your_db_url'
    },
    arguments: ['--format csv'],
    url: 'http://localhost:8005',
    headers: {
      'Content-Encoding': 'gzip'
    },
    enabled: true
  },
  {
    id: 'chat-bot-instance-1',
    name: 'ChatBot Instance 1',
    definitionId: 'chat-bot',
    status: 'stopped',
    connectionDetails: 'http://localhost:8006',
    requestCount: 100,
    environment: {
      'CHATBOT_API_KEY': 'your_chatbot_key'
    },
    arguments: ['--personality friendly'],
    url: 'http://localhost:8006',
    headers: {
      'X-Origin': 'MCP'
    },
    enabled: false
  }
];

export const profiles: Profile[] = [
  {
    id: 'profile-1',
    name: 'AI Development',
    endpointType: 'HTTP_SSE',
    enabled: true,
    endpoint: 'http://localhost:8000',
    instances: ['fastgpt-instance-1', 'code-assistant-instance-1'],
    description: 'Profile for AI development servers'
  },
  {
    id: 'profile-2',
    name: 'Data Analysis',
    endpointType: 'HTTP_SSE',
    enabled: false,
    endpoint: 'http://localhost:8001',
    instances: ['prompt-wizard-instance-1', 'data-analyzer-instance-1'],
    description: 'Profile for data analysis servers'
  },
  {
    id: 'profile-3',
    name: 'Image Processing',
    endpointType: 'STDIO',
    enabled: true,
    endpoint: 'stdio',
    instances: ['image-processor-instance-1', 'audio-transcriber-instance-1'],
    description: 'Profile for image and audio processing servers'
  },
  {
    id: 'profile-4',
    name: 'Semantic Search',
    endpointType: 'HTTP_SSE',
    enabled: false,
    endpoint: 'http://localhost:8002',
    instances: ['semantic-search-instance-1', 'document-loader-instance-1'],
    description: 'Profile for semantic search servers'
  },
  {
    id: 'profile-5',
    name: 'Vector Storage',
    endpointType: 'HTTP_SSE',
    enabled: true,
    endpoint: 'http://localhost:8003',
    instances: ['vector-store-instance-1', 'chat-bot-instance-1'],
    description: 'Profile for vector storage servers'
  }
];

// Export discoveryItems as an alias for serverDefinitions
export const discoveryItems = serverDefinitions;
