
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
  const [visibleActions, setVisibleActions] = useState<string[]>(['back', 'close']);
  const [hiddenActions, setHiddenActions] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateVisibleActions = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      console.log('Container width:', containerWidth);
      
      // 基础按钮：返回(40px) + 关闭(40px) + 间隙(8px) = 88px
      const baseWidth = 88;
      // 导出按钮约需要 100px
      const exportButtonWidth = 100;
      // 菜单按钮需要 40px
      const menuButtonWidth = 40;
      
      let visible: string[] = ['back', 'close']; // 始终显示的按钮
      let hidden: string[] = [];

      // 如果有足够空间显示导出按钮
      if (containerWidth >= baseWidth + exportButtonWidth + 16) { // 16px额外间隙
        visible.splice(1, 0, 'export'); // 在close之前插入export
      } else {
        hidden.push('export');
      }

      setVisibleActions(visible);
      setHiddenActions(hidden);
    };

    updateVisibleActions();
    
    const resizeObserver = new ResizeObserver(updateVisibleActions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // 也监听窗口大小变化
    window.addEventListener('resize', updateVisibleActions);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateVisibleActions);
    };
  }, []);

  const renderAction = (actionId: string) => {
    switch (actionId) {
      case 'back':
        return (
          <Button
            key="back"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="flex-shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        );
      case 'export':
        return (
          <div key="export" className="flex-shrink-0">
            <ConversationExport
              messages={messages}
              sessionTitle={sessionTitle}
            />
          </div>
        );
      case 'close':
        return (
          <Button
            key="close"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div ref={containerRef} className="flex items-center gap-2 min-w-0">
      {visibleActions.map(actionId => renderAction(actionId))}
      
      {hiddenActions.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="flex-shrink-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {hiddenActions.includes('export') && (
              <DropdownMenuItem asChild>
                <div className="w-full">
                  <ConversationExport
                    messages={messages}
                    sessionTitle={sessionTitle}
                    variant="menu"
                  />
                </div>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};
