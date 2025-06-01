
export type EndpointType = 'HTTP_SSE' | 'STDIO' | 'WS';
export type Status = 'running' | 'stopped' | 'error' | 'connecting';
export type ConnectionStatus = 'connected' | 'disconnected' | 'misconfigured' | 'unknown';
export type HostType = 'external' | 'mcpnow';

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

export interface ServerInstance {
  id: string;
  name: string;
  definitionId: string;
  status: Status;
  connectionDetails: string;
  requestCount?: number;
  environment?: Record<string, string>;
  arguments?: string[];
  url?: string;
  headers?: Record<string, string>;
  enabled: boolean;
}

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
export const discoveryItems: ServerDefinition[];
