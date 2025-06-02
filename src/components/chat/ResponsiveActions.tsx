
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
  const [visibleActions, setVisibleActions] = useState<string[]>([]);
  const [hiddenActions, setHiddenActions] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // 所有可能的操作按钮，按优先级排序
  const allActions = [
    { id: 'back', priority: 1, component: 'back' },
    { id: 'export', priority: 2, component: 'export' },
    { id: 'close', priority: 1, component: 'close' } // 高优先级，始终显示
  ];

  useEffect(() => {
    const updateVisibleActions = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      
      // 计算基础按钮宽度：返回按钮(40px) + 关闭按钮(40px) + 间隙(16px) + 菜单按钮(40px)
      const baseWidth = 136;
      
      // 导出按钮大约需要额外 120px
      const exportButtonWidth = 120;
      
      let visible: string[] = ['back', 'close']; // 始终显示的按钮
      let hidden: string[] = [];

      if (containerWidth > baseWidth + exportButtonWidth) {
        visible.push('export');
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

    return () => {
      resizeObserver.disconnect();
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
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        );
      case 'export':
        return (
          <ConversationExport
            key="export"
            messages={messages}
            sessionTitle={sessionTitle}
          />
        );
      case 'close':
        return (
          <Button
            key="close"
            variant="ghost"
            size="icon"
            onClick={onClose}
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
            <Button variant="ghost" size="icon">
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
