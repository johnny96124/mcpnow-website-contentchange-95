import React, { useState, useRef, useEffect } from 'react';
import { Send, Server, Paperclip, X, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MCPServer } from '../types/chat';
import { ToolControlPopover } from './ToolControlPopover';
import { ModelSelector } from './ModelSelector';
import { SuggestionsPanel } from './SuggestionsPanel';
import { useInputSuggestions } from './useInputSuggestions';

interface AttachedFile {
  id: string;
  file: File;
  preview?: string;
}

interface MessageInputProps {
  onSendMessage: (content: string, attachments?: AttachedFile[]) => void;
  onStopGeneration?: () => void;
  disabled: boolean;
  isGenerating?: boolean;
  placeholder: string;
  selectedServers: string[];
  servers: MCPServer[];
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onStopGeneration,
  disabled,
  isGenerating = false,
  placeholder,
  selectedServers,
  servers,
}) => {
  const [content, setContent] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [selectedModel, setSelectedModel] = useState('gpt-4o');
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock data for suggestions - in real app, these would come from props or context
  const mockProfiles = [
    { id: 'dev-profile', name: 'Development Profile', serverInstances: [] },
    { id: 'prod-profile', name: 'Production Profile', serverInstances: [] }
  ];
  
  const mockHosts = [
    { id: 'local-host', name: 'Local Host', url: 'localhost:3000', connectionStatus: 'active' },
    { id: 'remote-host', name: 'Remote Server', url: 'remote.example.com', connectionStatus: 'inactive' }
  ];

  const {
    showSuggestions,
    suggestions,
    selectedIndex,
    triggerInfo,
    selectSuggestion,
    moveCursor,
    closeSuggestions
  } = useInputSuggestions({
    inputValue: content,
    cursorPosition,
    servers,
    profiles: mockProfiles,
    hosts: mockHosts
  });

  console.log('MessageInput render - isGenerating:', isGenerating, 'disabled:', disabled);

  const handleSubmit = () => {
    if ((content.trim() || attachedFiles.length > 0) && !disabled && !isGenerating) {
      console.log('Sending message with model:', selectedModel);
      onSendMessage(content.trim(), attachedFiles);
      setContent('');
      setAttachedFiles([]);
      closeSuggestions();
    }
  };

  const handleStop = () => {
    console.log('Stop button clicked');
    if (onStopGeneration) {
      onStopGeneration();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle suggestions navigation
    if (showSuggestions) {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        moveCursor('up');
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        moveCursor('down');
        return;
      }
      if (e.key === 'Enter' && !e.shiftKey && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        const result = selectSuggestion(selectedIndex);
        if (result) {
          setContent(result.newValue);
          setCursorPosition(result.newCursorPosition);
          setTimeout(() => {
            if (textareaRef.current) {
              textareaRef.current.setSelectionRange(result.newCursorPosition, result.newCursorPosition);
              textareaRef.current.focus();
            }
          }, 0);
        }
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        closeSuggestions();
        return;
      }
    }

    // Handle normal input
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      if (isGenerating) {
        handleStop();
      } else {
        handleSubmit();
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setCursorPosition(e.target.selectionStart);
  };

  const handleCursorChange = () => {
    if (textareaRef.current) {
      setCursorPosition(textareaRef.current.selectionStart);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach(file => {
      const id = `file-${Date.now()}-${Math.random()}`;
      const attachedFile: AttachedFile = { id, file };
      
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
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onSelect={handleCursorChange}
          onClick={handleCursorChange}
          placeholder={isGenerating ? "AI正在回复中..." : placeholder}
          disabled={disabled}
          className="min-h-[80px] max-h-[200px] resize-none pr-28"
          style={{ height: 'auto' }}
        />
        
        {/* Suggestions Panel */}
        {showSuggestions && (
          <SuggestionsPanel
            suggestions={suggestions}
            selectedIndex={selectedIndex}
            onSelect={(index) => {
              const result = selectSuggestion(index);
              if (result) {
                setContent(result.newValue);
                setCursorPosition(result.newCursorPosition);
                setTimeout(() => {
                  if (textareaRef.current) {
                    textareaRef.current.setSelectionRange(result.newCursorPosition, result.newCursorPosition);
                    textareaRef.current.focus();
                  }
                }, 0);
              }
            }}
            triggerType={triggerInfo.type || 'template'}
          />
        )}
        
        <div className="absolute bottom-2 right-2 flex gap-1">
          <ToolControlPopover
            servers={servers}
            selectedServers={selectedServers}
            disabled={disabled || isGenerating}
          />
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isGenerating}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          
          {isGenerating ? (
            <Button
              onClick={handleStop}
              variant="outline"
              size="icon"
              className="h-8 w-8 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
              title="停止生成"
            >
              <Square className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={disabled || (!content.trim() && attachedFiles.length === 0)}
              size="icon"
              className="h-8 w-8"
            >
              <Send className="h-4 w-4" />
            </Button>
          )}
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
          ) : isGenerating ? (
            <span>Press <kbd className="bg-muted px-1 rounded">Cmd+Enter</kbd> or click stop button to terminate</span>
          ) : showSuggestions ? (
            <span>Type <kbd className="bg-muted px-1 rounded">/</kbd> for templates, <kbd className="bg-muted px-1 rounded">@</kbd> for resources</span>
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
