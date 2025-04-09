
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
}

export interface ServerInstance {
  id: string;
  name: string;
  definitionId: string;
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

// New types for Instance Runtime functionality
export type RuntimeStatus = 'connecting' | 'connected' | 'failed' | 'disconnected';

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

export interface RuntimeHost {
  id: string;
  name: string;
  icon?: string;
}

export const runtimeInstances: RuntimeInstance[];
