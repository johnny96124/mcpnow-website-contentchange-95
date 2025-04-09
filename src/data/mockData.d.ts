
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

export interface RuntimeInstance {
  id: string;
  instanceId: string;
  instanceName: string;
  definitionId: string;
  definitionName: string;
  definitionType: 'HTTP_SSE' | 'STDIO';
  profileId: string;
  profileName: string;
  hostId: string;
  hostName: string;
  status: 'connecting' | 'connected' | 'failed';
  errorMessage?: string;
  connectionDetails: string;
  startedAt: Date;
  requestCount: number;
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

export interface Host {
  id: string;
  name: string;
  icon: string;
  connectionStatus: ConnectionStatus;
  configStatus: "configured" | "misconfigured" | "unknown";
  configPath?: string;
}

export type ConnectionStatus = "connected" | "disconnected" | "error";

export const hosts: Host[];
