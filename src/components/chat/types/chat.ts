
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
  id: string;
  toolName: string;
  serverId: string;
  serverName: string;
  request: any;
  status: 'pending' | 'executing' | 'completed' | 'cancelled' | 'failed';
  order: number; // 执行顺序
  visible: boolean; // 是否显示
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
  toolCallStatus?: 'pending' | 'executing' | 'completed' | 'rejected' | 'cancelled' | 'failed';
  attachments?: MessageAttachment[];
  errorMessage?: string;
  currentToolIndex?: number; // 当前显示的工具索引
  rating?: 'positive' | 'negative' | null; // 评分属性
  
  // 新增分阶段内容支持
  contentPhases?: string[]; // 存储多个阶段的内容
  currentPhase?: number; // 当前显示的阶段
  toolCallsPhase?: number; // 工具调用在哪个阶段之后出现
  streamingPhase?: 'pre-tools' | 'tools' | 'post-tools' | 'completed'; // 当前流式状态
  isStreamingPhase?: boolean; // 是否正在流式显示某个阶段
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
