
import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Message } from '@/components/chat/types/chat';

interface ConversationExportProps {
  messages: Message[];
  sessionTitle?: string;
  variant?: 'button' | 'menu';
}

export const ConversationExport: React.FC<ConversationExportProps> = ({
  messages,
  sessionTitle,
  variant = 'button'
}) => {
  const exportAsMarkdown = () => {
    const title = sessionTitle || '对话记录';
    let markdown = `# ${title}\n\n`;
    
    messages.forEach((message, index) => {
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

  if (variant === 'menu') {
    return (
      <>
        <DropdownMenuItem onClick={exportAsMarkdown}>
          导出为 Markdown
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportAsJSON}>
          导出为 JSON
        </DropdownMenuItem>
      </>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          导出
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportAsMarkdown}>
          导出为 Markdown
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportAsJSON}>
          导出为 JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
