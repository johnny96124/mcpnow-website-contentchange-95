
import { EndpointType } from "@/components/status/EndpointLabel";

export interface ServerDefinition {
  id: string;
  name: string;
  type: EndpointType;
  version: string;
  description: string;
  icon?: string;
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
