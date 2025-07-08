
import React, { useState, useEffect } from 'react';
import { X, MessageSquare, Bot, Send, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageThread } from '@/components/chat/MessageThread/MessageThread';
import { MessageInput } from '@/components/chat/InputArea/MessageInput';
import { ChatHistory } from '@/components/chat/ChatHistory/ChatHistory';
import { useChatHistory } from '@/components/chat/hooks/useChatHistory';
import { useMCPServers } from '@/components/chat/hooks/useMCPServers';
import { useToast } from '@/hooks/use-toast';
import { Message, MessageAttachment } from '@/components/chat/types/chat';

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
  const { toast } = useToast();
  
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [selectedModel, setSelectedModel] = useState('Claude 4 Sonnet');
  const [isSending, setIsSending] = useState(false);

  const connectedServers = getConnectedServers();
  const selectedServers = connectedServers.map(s => s.id);

  // Update current messages when session changes
  useEffect(() => {
    if (currentSession) {
      setCurrentMessages(currentSession.messages);
    } else {
      setCurrentMessages([]);
      if (selectedServers.length > 0) {
        const newSession = createNewChat(selectedServers);
        selectChat(newSession.id);
      }
    }
  }, [currentSession, selectedServers]);

  const handleNewChat = () => {
    selectChat('');
    setCurrentMessages([]);
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
      // Simulate AI response
      setTimeout(async () => {
        const aiMessageId = `msg-${Date.now()}-ai`;
        const aiResponse = `我理解您的问题："${content}"。基于当前连接的MCP服务器，我正在为您分析和处理这个请求。让我调用相关的工具来获取更多信息...`;

        const aiMessage: Message = {
          id: aiMessageId,
          role: 'assistant',
          content: aiResponse,
          timestamp: Date.now()
        };

        setCurrentMessages(prev => [...prev, aiMessage]);
        addMessage(sessionId, aiMessage);
        setIsSending(false);
      }, 1000);
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
      setIsSending(false);
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    if (!currentSession) return;
    deleteMessage(currentSession.id, messageId);
  };

  const canSendMessage = selectedServers.length > 0 && !isSending;

  return (
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
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Claude 4 Sonnet">⭐ Claude 4 Sonnet</SelectItem>
                  <SelectItem value="GPT-4">GPT-4</SelectItem>
                  <SelectItem value="Claude 3">Claude 3</SelectItem>
                </SelectContent>
              </Select>
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
              <Button onClick={handleNewChat} className="w-full">
                <MessageSquare className="h-4 w-4 mr-2" />
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
            {/* Connected Servers Info */}
            <div className="p-4 border-b bg-muted/30">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Connected to:</span>
                <Badge variant="secondary">
                  {connectedServers.length > 0 ? connectedServers[0].name : 'No servers'}
                </Badge>
              </div>
            </div>

            {/* Message Thread */}
            <div className="flex-1 overflow-hidden">
              {currentMessages.length > 0 ? (
                <MessageThread
                  messages={currentMessages}
                  isLoading={isSending}
                  onDeleteMessage={handleDeleteMessage}
                  onEditMessage={() => {}}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">欢迎使用AI对话</h3>
                    <p className="text-muted-foreground">
                      开始新的对话来与AI助手交流
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t p-4">
              <MessageInput
                onSendMessage={handleSendMessage}
                disabled={!canSendMessage}
                placeholder={
                  selectedServers.length === 0 
                    ? "请先连接MCP服务器..."
                    : "输入您的消息..."
                }
                selectedServers={selectedServers}
                servers={connectedServers}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
