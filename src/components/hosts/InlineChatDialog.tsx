
import React, { useState, useEffect } from 'react';
import { X, MessageSquare, Bot, Send, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageThread } from '@/components/chat/MessageThread/MessageThread';
import { useChatHistory } from '@/components/chat/hooks/useChatHistory';
import { useMCPServers } from '@/components/chat/hooks/useMCPServers';
import { useToast } from '@/hooks/use-toast';
import { Message, MessageAttachment } from '@/components/chat/types/chat';

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
  } = useChatHistory();
  const { toast } = useToast();
  
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
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

  const handleSendMessage = async () => {
    if (!inputValue.trim() || selectedServers.length === 0 || isSending) return;
    
    setIsSending(true);

    let sessionId = currentSession?.id;
    if (!sessionId) {
      const newSession = createNewChat(selectedServers);
      sessionId = newSession.id;
      selectChat(sessionId);
    }

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: inputValue,
      timestamp: Date.now()
    };

    setCurrentMessages(prev => [...prev, userMessage]);
    addMessage(sessionId, userMessage);
    setInputValue('');

    try {
      // Simulate AI response
      setTimeout(async () => {
        const aiMessageId = `msg-${Date.now()}-ai`;
        const aiResponse = `我理解您的问题："${inputValue}"。基于当前连接的MCP服务器，我正在为您分析和处理这个请求。让我调用相关的工具来获取更多信息...`;

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageSquare className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold">AI Chat Configuration</DialogTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  与MCP服务器进行AI对话
                </p>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 pb-4">
          <div className="grid grid-cols-2 gap-6">
            {/* AI Model Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">AI Model</label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Claude 4 Sonnet">⭐ Claude 4 Sonnet</SelectItem>
                  <SelectItem value="GPT-4">GPT-4</SelectItem>
                  <SelectItem value="Claude 3">Claude 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* MCP Servers */}
            <div className="space-y-2">
              <label className="text-sm font-medium">MCP Servers</label>
              <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50">
                <span className="text-sm text-muted-foreground">
                  {connectedServers.length > 0 ? `${connectedServers.length} 个服务器已连接` : '无可用服务器'}
                </span>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-2xl font-bold">1</div>
                <div className="text-sm text-muted-foreground">Active Servers</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">170</div>
                <div className="text-sm text-muted-foreground">Total Requests</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">5</div>
                <div className="text-sm text-muted-foreground">Available Profiles</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator />

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="px-6 py-3 border-b">
            <h3 className="font-medium">🗄️ Server Profile Management</h3>
          </div>
          
          <div className="flex-1 overflow-hidden">
            {currentMessages.length > 0 ? (
              <MessageThread
                messages={currentMessages}
                isLoading={isSending}
                onDeleteMessage={() => {}}
                onEditMessage={() => {}}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">开始与AI对话</h3>
                  <p className="text-muted-foreground">
                    MCP Now AI助手已准备就绪
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="输入您的消息..."
                className="flex-1 min-h-[60px] resize-none"
                disabled={isSending}
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isSending}
                className="self-end"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
