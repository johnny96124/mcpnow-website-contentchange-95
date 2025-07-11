import React, { useState, useRef, useEffect } from 'react';
import { Send, Server, Paperclip, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MCPServer } from '../types/chat';
import { ToolControlPopover } from './ToolControlPopover';
import { ModelSelector } from './ModelSelector';

interface AttachedFile {
  id: string;
  file: File;
  preview?: string;
}

interface MessageInputProps {
  onSendMessage: (content: string, attachments?: AttachedFile[]) => void;
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
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [selectedModel, setSelectedModel] = useState('gpt-4o');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if ((content.trim() || attachedFiles.length > 0) && !disabled) {
      // TODO: Include selectedModel in the message sending logic
      console.log('Sending message with model:', selectedModel);
      onSendMessage(content.trim(), attachedFiles);
      setContent('');
      setAttachedFiles([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach(file => {
      const id = `file-${Date.now()}-${Math.random()}`;
      const attachedFile: AttachedFile = { id, file };
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setAttachedFiles(prev => 
            prev.map(f => f.id === id ? { ...f, preview: e.target?.result as string } : f)
          );
        };
        reader.readAsDataURL(file);
      }
      
      setAttachedFiles(prev => [...prev, attachedFile]);
    });
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (fileId: string) => {
    setAttachedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

      {/* Model Selector */}
      <div className="flex items-center justify-between">
        <ModelSelector
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
        />
      </div>

      {/* Attached Files Preview */}
      {attachedFiles.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">附件 ({attachedFiles.length})</div>
          <div className="flex flex-wrap gap-2">
            {attachedFiles.map(file => (
              <div key={file.id} className="relative group">
                <div className="flex items-center gap-2 bg-muted p-2 rounded-lg pr-8">
                  {file.preview ? (
                    <img 
                      src={file.preview} 
                      alt={file.file.name}
                      className="h-8 w-8 object-cover rounded"
                    />
                  ) : (
                    <div className="h-8 w-8 bg-secondary rounded flex items-center justify-center">
                      <Paperclip className="h-4 w-4" />
                    </div>
                  )}
                  <div className="text-xs">
                    <div className="font-medium truncate max-w-[120px]" title={file.file.name}>
                      {file.file.name}
                    </div>
                    <div className="text-muted-foreground">
                      {formatFileSize(file.file.size)}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeFile(file.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
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
          className="min-h-[80px] max-h-[200px] resize-none pr-28"
          style={{ height: 'auto' }}
        />
        
        <div className="absolute bottom-2 right-2 flex gap-1">
          <ToolControlPopover
            servers={servers}
            selectedServers={selectedServers}
            disabled={disabled}
          />
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          
          <Button
            onClick={handleSubmit}
            disabled={disabled || (!content.trim() && attachedFiles.length === 0)}
            size="icon"
            className="h-8 w-8"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileSelect}
        accept="image/*,.pdf,.doc,.docx,.txt,.json,.csv,.xlsx,.xls"
      />

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
