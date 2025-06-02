
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, X, MoreHorizontal, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ConversationExport } from '@/components/chat/ConversationExport';
import { Message } from '@/components/chat/types/chat';

interface ResponsiveActionsProps {
  onClose: () => void;
  messages: Message[];
  sessionTitle?: string;
}

export const ResponsiveActions: React.FC<ResponsiveActionsProps> = ({
  onClose,
  messages,
  sessionTitle
}) => {
  const [isCompact, setIsCompact] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        // 如果宽度小于150px，使用紧凑模式
        setIsCompact(width < 150);
      }
    };

    // 初始检查
    checkWidth();

    // 使用ResizeObserver监听容器大小变化
    const resizeObserver = new ResizeObserver(checkWidth);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // 也监听窗口大小变化
    window.addEventListener('resize', checkWidth);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', checkWidth);
    };
  }, []);

  const exportAsMarkdown = () => {
    const title = sessionTitle || '对话记录';
    let markdown = `# ${title}\n\n`;
    
    messages.forEach((message) => {
      const role = message.role === 'user' ? '用户' : 'AI助手';
      const timestamp = new Date(message.timestamp).toLocaleString('zh-CN');
      
      markdown += `## ${role} (${timestamp})\n\n`;
      markdown += `${message.content}\n\n`;
      
      if (message.attachments && message.attachments.length > 0) {
        markdown += `**附件:**\n`;
        message.attachments.forEach(attachment => {
          markdown += `- ${attachment.name} (${Math.round(attachment.size / 1024)}KB)\n`;
        });
        markdown += `\n`;
      }
    });
    
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportAsJSON = () => {
    const data = {
      title: sessionTitle || '对话记录',
      exportTime: new Date().toISOString(),
      messages: messages
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${sessionTitle || '对话记录'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div ref={containerRef} className="flex items-center gap-1 min-w-0">
      {isCompact ? (
        // 紧凑模式：只显示返回按钮和更多操作菜单
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="flex-shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="flex-shrink-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={exportAsMarkdown} className="gap-2">
                <Download className="h-4 w-4" />
                导出为 Markdown
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportAsJSON} className="gap-2">
                <Download className="h-4 w-4" />
                导出为 JSON
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onClose} className="gap-2">
                <X className="h-4 w-4" />
                关闭对话
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        // 正常模式：显示所有按钮
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="flex-shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <ConversationExport
            messages={messages}
            sessionTitle={sessionTitle}
          />
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
  );
};
