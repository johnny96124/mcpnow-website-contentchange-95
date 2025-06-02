
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, X, MoreHorizontal } from 'lucide-react';
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
  const [showFullActions, setShowFullActions] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const updateLayout = () => {
      if (!containerRef.current) return;
      
      const width = containerRef.current.offsetWidth;
      setContainerWidth(width);
      
      // 如果宽度小于200px，隐藏导出按钮
      const shouldShowFull = width >= 200;
      setShowFullActions(shouldShowFull);
    };

    // 初始化
    updateLayout();

    // 使用ResizeObserver监听容器大小变化
    const resizeObserver = new ResizeObserver(updateLayout);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // 也监听窗口大小变化
    window.addEventListener('resize', updateLayout);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateLayout);
    };
  }, []);

  return (
    <div ref={containerRef} className="flex items-center gap-1 min-w-0">
      {/* 返回按钮 - 始终显示 */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="flex-shrink-0"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>

      {/* 根据空间显示不同的布局 */}
      {showFullActions ? (
        <>
          {/* 导出按钮 */}
          <div className="flex-shrink-0">
            <ConversationExport
              messages={messages}
              sessionTitle={sessionTitle}
            />
          </div>
          
          {/* 关闭按钮 */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <>
          {/* 更多操作菜单 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="flex-shrink-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <div className="w-full">
                  <ConversationExport
                    messages={messages}
                    sessionTitle={sessionTitle}
                    variant="menu"
                  />
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onClose}>
                关闭对话
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
    </div>
  );
};
