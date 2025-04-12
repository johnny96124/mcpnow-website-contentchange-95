

export interface ServerDefinition {
  id: string;
  name: string;
  type: 'HTTP_SSE' | 'STDIO';
  version: string;
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
  tools?: Tool[]; // Add tools array
  views?: number;
  updated?: string;
  trending?: boolean;
  forks?: number;
  watches?: number;
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

export interface ServerInstance {
  id: string;
  definitionId: string;
  name: string;
  status: 'running' | 'stopped' | 'connecting' | 'error';
  connectionDetails: string;
  requestCount?: number;
  environment?: Record<string, string>;
  arguments?: string[];
  url?: string;
  headers?: Record<string, string>;
  enabled: boolean;
}

export type EndpointType = 'HTTP_SSE' | 'STDIO';

export const serverDefinitions: ServerDefinition[];
export const serverInstances: ServerInstance[];

export interface Profile {
  id: string;
  name: string;
  endpointType: EndpointType;
  enabled: boolean;
  endpoint: string;
  instances: string[];
  description?: string;
}

export const profiles: Profile[];

// Add EnhancedServerDefinition interface
export interface EnhancedServerDefinition extends ServerDefinition {
  views: number;
  updated: string;
  trending?: boolean;
  forks?: number;
  watches?: number;
}

