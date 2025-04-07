
export interface ServerDefinition {
  id: string;
  name: string;
  type: 'HTTP_SSE' | 'CLI_PROCESS';
  version: string;
  description: string;
  icon?: string;
  downloads?: number;
  stars?: number;
  author?: string;
  categories?: string[];
  isOfficial?: boolean;
  features?: string[];
  repository?: string;
}

export interface ServerInstance {
  id: string;
  name: string;
  definitionId: string;
  status: 'running' | 'stopped' | 'connecting' | 'error';
  connectionDetails: string;
  requestCount?: number;
  environment?: Record<string, string>;
  arguments?: string;
}

export const serverDefinitions: ServerDefinition[];
export const serverInstances: ServerInstance[];
