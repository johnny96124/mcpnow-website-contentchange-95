
import React, { useState } from 'react';
import { Copy, RotateCcw, Edit, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface MessageActionsProps {
  content: string;
  messageId: string;
  onRegenerate?: () => void;
  onEdit?: (newContent: string) => void;
  isUserMessage?: boolean;
}

export const MessageActions: React.FC<MessageActionsProps> = ({
  content,
  messageId,
  onRegenerate,
  onEdit,
  isUserMessage = false
}) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);

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

  const handleEdit = () => {
    if (isEditing) {
      if (onEdit && editContent.trim() !== content) {
        onEdit(editContent.trim());
      }
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setEditContent(content);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex gap-2 mt-2">
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className="flex-1 min-h-[60px] p-2 border rounded resize-none"
          autoFocus
        />
        <div className="flex flex-col gap-1">
          <Button size="sm" onClick={handleEdit} className="h-8">
            <Check className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="outline" onClick={handleCancelEdit} className="h-8">
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <Button size="sm" variant="ghost" onClick={handleCopy} className="h-7 px-2">
        <Copy className="h-3 w-3" />
      </Button>
      
      {isUserMessage && onEdit && (
        <Button size="sm" variant="ghost" onClick={handleEdit} className="h-7 px-2">
          <Edit className="h-3 w-3" />
        </Button>
      )}
      
      {!isUserMessage && onRegenerate && (
        <Button size="sm" variant="ghost" onClick={onRegenerate} className="h-7 px-2">
          <RotateCcw className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
};
