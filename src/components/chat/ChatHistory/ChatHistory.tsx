
import React, { useState } from 'react';
import { MessageSquare, Clock, Trash2, MoreVertical, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ChatSession } from '../types/chat';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { formatDistanceToNow } from 'date-fns';

interface ChatHistoryProps {
  sessions: ChatSession[];
  currentSessionId?: string;
  onSelectChat: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onDeleteMessage: (sessionId: string, messageId: string) => void;
  onRenameSession?: (sessionId: string, newTitle: string) => void;
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({
  sessions,
  currentSessionId,
  onSelectChat,
  onDeleteSession,
  onDeleteMessage,
  onRenameSession,
}) => {
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    type: 'session' | 'message';
    sessionId: string;
    messageId?: string;
    title: string;
  }>({
    open: false,
    type: 'session',
    sessionId: '',
    title: ''
  });

  const [renameDialog, setRenameDialog] = useState<{
    open: boolean;
    sessionId: string;
    currentTitle: string;
    newTitle: string;
  }>({
    open: false,
    sessionId: '',
    currentTitle: '',
    newTitle: ''
  });

  const handleDeleteSession = (sessionId: string, sessionTitle: string) => {
    setDeleteDialog({
      open: true,
      type: 'session',
      sessionId,
      title: sessionTitle
    });
  };

  const handleRenameSession = (sessionId: string, currentTitle: string) => {
    setRenameDialog({
      open: true,
      sessionId,
      currentTitle,
      newTitle: currentTitle
    });
  };

  const confirmDelete = () => {
    if (deleteDialog.type === 'session') {
      onDeleteSession(deleteDialog.sessionId);
    } else if (deleteDialog.type === 'message' && deleteDialog.messageId) {
      onDeleteMessage(deleteDialog.sessionId, deleteDialog.messageId);
    }
    setDeleteDialog({ ...deleteDialog, open: false });
  };

  const confirmRename = () => {
    if (onRenameSession && renameDialog.newTitle.trim()) {
      onRenameSession(renameDialog.sessionId, renameDialog.newTitle.trim());
    }
    setRenameDialog({ ...renameDialog, open: false });
  };

  if (sessions.length === 0) {
    return (
      <div className="p-4 text-center">
        <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">暂无对话历史</p>
      </div>
    );
  }

  return (
    <>
      <ScrollArea className="h-full">
        <div className="p-2 space-y-1">
          {sessions.map((session) => (
            <div 
              key={session.id}
              className="group relative"
            >
              <Button
                variant={session.id === currentSessionId ? "secondary" : "ghost"}
                className="w-full justify-start h-auto p-3 text-left pr-10"
                onClick={() => onSelectChat(session.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare className="h-4 w-4 flex-shrink-0" />
                    <span className="font-medium truncate text-sm">
                      {session.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>
                      {formatDistanceToNow(session.updatedAt, { addSuffix: true })}
                    </span>
                    <span>•</span>
                    <span>{session.messages.length} 条消息</span>
                  </div>
                </div>
              </Button>
              
              <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <MoreVertical className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleRenameSession(session.id, session.title)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      重命名对话
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeleteSession(session.id, session.title)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      删除对话
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <DeleteConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
        title="删除对话"
        description={`确定要删除对话"${deleteDialog.title}"吗？此操作无法撤销。`}
        onConfirm={confirmDelete}
      />

      <Dialog open={renameDialog.open} onOpenChange={(open) => setRenameDialog({ ...renameDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>重命名对话</DialogTitle>
            <DialogDescription>
              为对话设置一个新的标题
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={renameDialog.newTitle}
              onChange={(e) => setRenameDialog({ ...renameDialog, newTitle: e.target.value })}
              placeholder="输入新的对话标题"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  confirmRename();
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameDialog({ ...renameDialog, open: false })}>
              取消
            </Button>
            <Button onClick={confirmRename} disabled={!renameDialog.newTitle.trim()}>
              确认重命名
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
