
import React, { useState, useEffect } from 'react';
import { X, MessageSquare, Bot, Send, Settings, History, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { MessageThread } from '@/components/chat/MessageThread/MessageThread';
import { MessageInput } from '@/components/chat/InputArea/MessageInput';
import { ChatHistory } from '@/components/chat/ChatHistory/ChatHistory';
import { ServerSelectionDialog } from './ServerSelectionDialog';
import { useChatHistory } from '@/components/chat/hooks/useChatHistory';
import { useMCPServers } from '@/components/chat/hooks/useMCPServers';
import { useStreamingChat } from '@/components/chat/hooks/useStreamingChat';
import { useToast } from '@/hooks/use-toast';
import { Message, MessageAttachment } from '@/components/chat/types/chat';
import { HistoryDrawer } from './HistoryDrawer';

interface AttachedFile {
  id: string;
  file: File;
  preview?: string;
}

interface InlineChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const InlineChatDialog: React.FC<InlineChatDialogProps> = ({
  open,
  onOpenChange
}) => {
  const { getConnectedServers } = useMCPServers();
  const { 
    chatSessions, 
    currentSession, 
    createNewChat, 
    selectChat, 
    addMessage,
    updateMessage,
    deleteSession,
    deleteMessage,
    renameSession,
  } = useChatHistory();
  const { streamingMessageId, generateAIResponseWithInlineTools } = useStreamingChat();
  const { toast } = useToast();
  
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const [showServerSelectionDialog, setShowServerSelectionDialog] = useState(false);

  const connectedServers = getConnectedServers();
  const selectedServers = connectedServers.map(s => s.id);

  // Update current messages when session changes
  useEffect(() => {
    if (currentSession) {
      setCurrentMessages(currentSession.messages);
    } else {
      setCurrentMessages([]);
    }
  }, [currentSession]);

  const handleNewChat = () => {
    if (selectedServers.length > 0) {
      const newSession = createNewChat(selectedServers);
      selectChat(newSession.id);
      setCurrentMessages([]);
    }
  };

  const handleSelectHistorySession = (sessionId: string) => {
    selectChat(sessionId);
  };

  const handleConfigureServer = (serverId: string) => {
    setShowServerSelectionDialog(true);
  };

  const handleServerConfigured = () => {
    setShowServerSelectionDialog(false);
    toast({
      title: "服务器配置成功",
      description: "MCP 服务器已添加到当前 Profile",
    });
  };

  const handleSendMessage = async (content: string, attachedFiles?: AttachedFile[]) => {
    if (!content.trim() || selectedServers.length === 0 || isSending) return;
    
    setIsSending(true);

    // Process attachments
    const attachments: MessageAttachment[] = [];
    if (attachedFiles && attachedFiles.length > 0) {
      for (const attachedFile of attachedFiles) {
        const attachment: MessageAttachment = {
          id: attachedFile.id,
          name: attachedFile.file.name,
          size: attachedFile.file.size,
          type: attachedFile.file.type,
          preview: attachedFile.preview,
        };
        attachments.push(attachment);
      }
    }

    let sessionId = currentSession?.id;
    if (!sessionId) {
      const newSession = createNewChat(selectedServers);
      sessionId = newSession.id;
      selectChat(sessionId);
    }

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content,
      timestamp: Date.now(),
      attachments: attachments.length > 0 ? attachments : undefined
    };

    setCurrentMessages(prev => [...prev, userMessage]);
    addMessage(sessionId, userMessage);

    try {
      // Use streaming chat with inline tools and server discovery
      await generateAIResponseWithInlineTools(
        content,
        selectedServers,
        sessionId,
        addMessage,
        updateMessage
      );
    } catch (error) {
      console.error('Failed to get AI response:', error);
      const errorMessage: Message = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: '抱歉，处理您的请求时遇到了错误，请稍后重试。',
        timestamp: Date.now()
      };
      setCurrentMessages(prev => [...prev, errorMessage]);
      addMessage(sessionId, errorMessage);
    } finally {
      setIsSending(false);
    }
  };

  const handleToolAction = (messageId: string, action: 'run' | 'cancel') => {
    if (!currentSession) return;
    
    if (action === 'run') {
      updateMessage(currentSession.id, messageId, { 
        toolCallStatus: 'executing' as const 
      });
      
      // Simulate tool execution
      setTimeout(() => {
        updateMessage(currentSession.id, messageId, { 
          toolCallStatus: 'completed' as const 
        });
        
        // Add AI response after tool completion
        const aiResponse: Message = {
          id: `msg-${Date.now()}-ai`,
          role: 'assistant',
          content: '已成功获取 Figma 数据。根据工具调用的结果，我可以看到该节点是一个设计组件，包含了宽度375px、高度812px的白色背景框架。这些信息可以帮助您进行前端界面开发。',
          timestamp: Date.now()
        };
        
        setCurrentMessages(prev => [...prev, aiResponse]);
        addMessage(currentSession.id, aiResponse);
      }, 2000);
    } else {
      updateMessage(currentSession.id, messageId, { 
        toolCallStatus: 'rejected' as const 
      });
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    if (!currentSession) return;
    deleteMessage(currentSession.id, messageId);
  };

  const canSendMessage = selectedServers.length > 0 && !isSending;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl h-[90vh] flex flex-col p-0">
          <DialogHeader className="p-6 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-semibold">AI Chat</DialogTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    与MCP服务器进行AI对话
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setHistoryDrawerOpen(true)}
                  className="gap-2"
                >
                  <History className="h-4 w-4" />
                  历史
                </Button>
              </div>
            </div>
          </DialogHeader>

          <Separator />

          {/* Main Chat Area */}
          <div className="flex-1 flex min-h-0">
            {/* Left Sidebar - Chat History */}
            <div className="w-80 border-r bg-card flex flex-col">
              {/* New Chat Button */}
              <div className="p-4 border-b">
                <Button 
                  onClick={handleNewChat} 
                  className="w-full gap-2"
                  disabled={selectedServers.length === 0}
                >
                  <Plus className="h-4 w-4" />
                  新建对话
                </Button>
              </div>

              {/* Chat History */}
              <div className="flex-1 overflow-hidden">
                <ChatHistory
                  sessions={chatSessions}
                  currentSessionId={currentSession?.id}
                  onSelectChat={selectChat}
                  onDeleteSession={deleteSession}
                  onDeleteMessage={deleteMessage}
                  onRenameSession={renameSession}
                />
              </div>
            </div>

            {/* Right Side - Chat Area */}
            <div className="flex-1 flex flex-col">
              {/* Message Thread */}
              <div className="flex-1 overflow-hidden">
                {currentMessages.length > 0 ? (
                  <MessageThread
                    messages={currentMessages}
                    isLoading={isSending}
                    streamingMessageId={streamingMessageId}
                    onUpdateMessage={handleToolAction}
                    onDeleteMessage={handleDeleteMessage}
                    onEditMessage={() => {}}
                    onConfigureServer={handleConfigureServer}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Bot className="h-8 w-8 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">欢迎使用AI对话</h3>
                      <p className="text-muted-foreground mb-4">
                        开始新的对话来与AI助手交流，支持MCP工具调用
                      </p>
                      <Button
                        variant="outline"
                        onClick={handleNewChat}
                        className="gap-2"
                        disabled={selectedServers.length === 0}
                      >
                        <Plus className="h-4 w-4" />
                        开始新对话
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Simplified Input Area */}
              <div className="border-t p-4">
                <MessageInput
                  onSendMessage={handleSendMessage}
                  disabled={!canSendMessage}
                  placeholder={
                    selectedServers.length === 0 
                      ? "请先连接MCP服务器..."
                      : "输入您的消息..."
                  }
                  selectedServers={[]}
                  servers={[]}
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ServerSelectionDialog
        open={showServerSelectionDialog}
        onOpenChange={setShowServerSelectionDialog}
        onAddServers={handleServerConfigured}
      />

      <HistoryDrawer
        open={historyDrawerOpen}
        onOpenChange={setHistoryDrawerOpen}
        sessions={chatSessions}
        onSelectSession={handleSelectHistorySession}
      />
    </>
  );
};
