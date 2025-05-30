
import React, { useState, useRef, useEffect } from 'react';
import { Send, Server } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MCPServer } from '../types/chat';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  disabled: boolean;
  placeholder: string;
  selectedServers: string[];
  servers: MCPServer[];
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  disabled,
  placeholder,
  selectedServers,
  servers,
}) => {
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (content.trim() && !disabled) {
      onSendMessage(content.trim());
      setContent('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [content]);

  const characterCount = content.length;
  const maxCharacters = 4000;

  return (
    <div className="space-y-3">
      {/* Selected Servers Indicator */}
      {selectedServers.length > 0 && (
        <div className="flex items-center gap-2 text-sm">
          <Server className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Connected to:</span>
          <div className="flex gap-1 flex-wrap">
            {selectedServers.map(serverId => {
              const server = servers.find(s => s.id === serverId);
              return server ? (
                <Badge key={serverId} variant="secondary" className="text-xs">
                  {server.name}
                </Badge>
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="min-h-[80px] max-h-[200px] resize-none pr-12"
          style={{ height: 'auto' }}
        />
        
        <Button
          onClick={handleSubmit}
          disabled={disabled || !content.trim()}
          size="icon"
          className="absolute bottom-2 right-2 h-8 w-8"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <div>
          {disabled ? (
            <span>Select servers to start chatting</span>
          ) : (
            <span>Press <kbd className="bg-muted px-1 rounded">Cmd+Enter</kbd> to send</span>
          )}
        </div>
        <div className={characterCount > maxCharacters * 0.9 ? 'text-warning' : ''}>
          {characterCount}/{maxCharacters}
        </div>
      </div>
    </div>
  );
};
