
export interface MCPServer {
  id: string;
  name: string;
  type: 'STDIO' | 'SSE';
  status: 'connected' | 'disconnected' | 'starting';
  enabled: boolean;
}

export interface MCPProfile {
  id: string;
  name: string;
  serverIds: string[];
}

export interface ToolInvocation {
  id: string;
  toolName: string;
  serverId: string;
  serverName: string;
  request: any;
  response: any;
  status: 'pending' | 'success' | 'error';
  duration?: number;
  timestamp: number;
  error?: string;
}

export interface PendingToolCall {
  toolName: string;
  serverId: string;
  serverName: string;
  request: any;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'tool_call';
  content: string;
  timestamp: number;
  toolInvocations?: ToolInvocation[];
  pendingToolCalls?: PendingToolCall[];
  toolCallStatus?: 'pending' | 'executing' | 'completed' | 'rejected';
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  selectedServers: string[];
  selectedProfile?: string;
  messages: Message[];
}
