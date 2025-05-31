
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

export interface ToolQueueItem {
  toolName: string;
  serverId: string;
  serverName: string;
  request: any;
  description: string;
  status: 'pending' | 'executing' | 'completed' | 'cancelled';
}

export interface MessageAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  preview?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'tool_call';
  content: string;
  timestamp: number;
  toolInvocations?: ToolInvocation[];
  pendingToolCalls?: PendingToolCall[];
  toolQueue?: ToolQueueItem[];
  currentToolIndex?: number;
  toolCallStatus?: 'pending' | 'executing' | 'completed' | 'rejected' | 'cancelled' | 'pending_first' | 'pending_next' | 'all_completed';
  attachments?: MessageAttachment[];
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
