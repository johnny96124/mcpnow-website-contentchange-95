
import React, { useState } from 'react';
import { Download, FileText, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { Message } from './types/chat';

interface ConversationExportProps {
  messages: Message[];
  sessionTitle?: string;
}

export const ConversationExport: React.FC<ConversationExportProps> = ({
  messages,
  sessionTitle = '对话记录'
}) => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const exportAsMarkdown = () => {
    setIsExporting(true);
    
    let markdown = `# ${sessionTitle}\n\n`;
    markdown += `导出时间: ${new Date().toLocaleString()}\n\n`;
    
    messages.forEach((message, index) => {
      const role = message.role === 'user' ? '用户' : 'AI助手';
      markdown += `## ${role}\n\n`;
      markdown += `${message.content}\n\n`;
      
      if (message.attachments && message.attachments.length > 0) {
        markdown += `附件:\n`;
        message.attachments.forEach(attachment => {
          markdown += `- ${attachment.name} (${attachment.type})\n`;
        });
        markdown += '\n';
      }
      
      if (message.pendingToolCalls && message.pendingToolCalls.length > 0) {
        markdown += `工具调用:\n`;
        message.pendingToolCalls.forEach(tool => {
          markdown += `- ${tool.toolName} (${tool.status})\n`;
        });
        markdown += '\n';
      }
      
      markdown += '---\n\n';
    });

    downloadFile(markdown, `${sessionTitle}.md`, 'text/markdown');
    setIsExporting(false);
  };

  const exportAsJSON = () => {
    setIsExporting(true);
    
    const exportData = {
      title: sessionTitle,
      exportTime: new Date().toISOString(),
      messages: messages.map(msg => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp,
        attachments: msg.attachments,
        toolCalls: msg.pendingToolCalls
      }))
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    downloadFile(jsonString, `${sessionTitle}.json`, 'application/json');
    setIsExporting(false);
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "导出成功",
      description: `对话已导出为 ${filename}`,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isExporting || messages.length === 0}>
          <Download className="h-4 w-4 mr-2" />
          导出对话
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={exportAsMarkdown}>
          <FileText className="h-4 w-4 mr-2" />
          导出为 Markdown
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportAsJSON}>
          <Code className="h-4 w-4 mr-2" />
          导出为 JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
