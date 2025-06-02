
import React, { useState } from 'react';
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

  return (
    <div className="h-full flex">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        {/* Left Panel - Hosts List */}
        <ResizablePanel 
          defaultSize={isHostsListCollapsed ? 8 : 25} 
          minSize={8}
          maxSize={40}
          className={cn(
            "transition-all duration-300",
            isHostsListCollapsed && "min-w-16"
          )}
        >
          <div className="h-full border-r bg-card relative">
            <div className="p-4 border-b flex items-center justify-between">
              {!isHostsListCollapsed && (
                <h3 className="font-semibold text-sm">Hosts</h3>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsHostsListCollapsed(!isHostsListCollapsed)}
                className="h-8 w-8 p-0"
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
        <ResizablePanel defaultSize={isChatOpen ? 50 : 75} minSize={30}>
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
