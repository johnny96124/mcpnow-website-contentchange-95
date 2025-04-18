
export type EventType = 'request' | 'response' | 'error' | 'notification';
export type EventCategory = 'Tools' | 'Resources' | 'Prompts' | 'Ping' | 'Sampling' | 'Roots';

export interface ServerEvent {
  id: string;
  timestamp: string;
  type: EventType;
  category: EventCategory;
  content: any;
  isError?: boolean;
  profileName?: string;
  hostName?: string;
  method?: string;
  params?: any;
  jsonrpc?: string;
}
