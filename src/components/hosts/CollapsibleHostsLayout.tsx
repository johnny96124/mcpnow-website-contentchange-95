
import React, { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, MessageSquare, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

interface CollapsibleHostsLayoutProps {
  hostsList: React.ReactNode;
  hostsListCollapsed: React.ReactNode;
  hostDetails: React.ReactNode;
  chatPanel?: React.ReactNode;
  isChatOpen: boolean;
  onToggleChat: () => void;
}

export const CollapsibleHostsLayout: React.FC<CollapsibleHostsLayoutProps> = ({
  hostsList,
  hostsListCollapsed,
  hostDetails,
  chatPanel,
  isChatOpen,
  onToggleChat
}) => {
  const [isHostsListCollapsed, setIsHostsListCollapsed] = useState(false);

  // 动态计算面板尺寸
  const getLeftPanelSize = () => {
    if (isHostsListCollapsed) {
      return isChatOpen ? 6 : 8; // 收起时的最小宽度
    }
    return isChatOpen ? 20 : 25; // 展开时的默认宽度
  };

  const getMiddlePanelSize = () => {
    if (isHostsListCollapsed) {
      return isChatOpen ? 69 : 92; // 收起时中间面板的宽度
    }
    return isChatOpen ? 55 : 75; // 展开时中间面板的宽度
  };

  // 监听左侧面板尺寸变化
  const handleLeftPanelResize = useCallback((size: number) => {
    // 设定展开阈值为15%
    const expandThreshold = 15;
    
    // 如果当前是收起状态，且拖拽宽度超过阈值，则自动展开
    if (isHostsListCollapsed && size > expandThreshold) {
      setIsHostsListCollapsed(false);
    }
  }, [isHostsListCollapsed]);

  return (
    <div className="h-full flex">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        {/* Left Panel - Hosts List */}
        <ResizablePanel 
          defaultSize={getLeftPanelSize()}
          minSize={isHostsListCollapsed ? 6 : 15}
          maxSize={isHostsListCollapsed ? 8 : 40}
          onResize={handleLeftPanelResize}
          className={cn(
            "transition-all duration-300 ease-in-out",
            isHostsListCollapsed && "min-w-16 max-w-20"
          )}
        >
          <div className="h-full border-r bg-card relative">
            <div className={cn(
              "p-4 border-b flex items-center transition-all duration-300",
              isHostsListCollapsed ? "justify-center p-2" : "justify-between"
            )}>
              {!isHostsListCollapsed && (
                <h3 className="font-semibold text-sm">Hosts</h3>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsHostsListCollapsed(!isHostsListCollapsed)}
                className={cn(
                  "h-8 w-8 p-0 transition-all duration-200",
                  isHostsListCollapsed && "hover:bg-muted"
                )}
              >
                {isHostsListCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="overflow-hidden">
              {isHostsListCollapsed ? hostsListCollapsed : hostsList}
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Middle Panel - Host Details */}
        <ResizablePanel 
          defaultSize={getMiddlePanelSize()} 
          minSize={30}
        >
          <div className="h-full bg-background">
            {hostDetails}
          </div>
        </ResizablePanel>

        {/* Right Panel - AI Chat */}
        {isChatOpen && (
          <>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={25} minSize={20} maxSize={50}>
              <div className="h-full border-l bg-card">
                <div className="p-4 border-b flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <h3 className="font-semibold text-sm">AI Chat</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onToggleChat}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="h-[calc(100%-4rem)]">
                  {chatPanel}
                </div>
              </div>
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  );
};
