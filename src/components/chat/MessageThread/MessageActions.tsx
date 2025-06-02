
import React from 'react';
import { Copy, RotateCcw, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface MessageActionsProps {
  content: string;
  messageId: string;
  onRegenerate?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isUserMessage?: boolean;
}

export const MessageActions: React.FC<MessageActionsProps> = ({
  content,
  messageId,
  onRegenerate,
  onEdit,
  onDelete,
  isUserMessage = false
}) => {
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "已复制",
        description: "消息内容已复制到剪贴板",
      });
    } catch (error) {
      toast({
        title: "复制失败",
        description: "无法复制到剪贴板",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <Button size="sm" variant="ghost" onClick={handleCopy} className="h-7 px-2">
        <Copy className="h-3 w-3" />
      </Button>
      
      {isUserMessage && onEdit && (
        <Button size="sm" variant="ghost" onClick={onEdit} className="h-7 px-2">
          <Edit className="h-3 w-3" />
        </Button>
      )}
      
      {!isUserMessage && onRegenerate && (
        <Button size="sm" variant="ghost" onClick={onRegenerate} className="h-7 px-2">
          <RotateCcw className="h-3 w-3" />
        </Button>
      )}

      {onDelete && (
        <Button size="sm" variant="ghost" onClick={onDelete} className="h-7 px-2 text-red-600 hover:text-red-700 hover:bg-red-50">
          <Trash2 className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
};
