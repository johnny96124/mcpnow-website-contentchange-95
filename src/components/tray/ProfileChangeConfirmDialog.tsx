
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ProfileChangeConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  profileName: string;
}

export function ProfileChangeConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  profileName,
}: ProfileChangeConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-[350px] relative">
        {/* 右上角关闭按钮 */}
        <Button
          variant="ghost"
          size="icon"
          aria-label="Close"
          className="absolute right-3 top-3 text-muted-foreground hover:bg-accent"
          onClick={() => onOpenChange(false)}
        >
          <X className="w-5 h-5" />
        </Button>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base">Change Profile Configuration</AlertDialogTitle>
          <AlertDialogDescription className="text-sm">
            Switching to profile "{profileName}" requires modifying the configuration file.
            Do you want to proceed with this change?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Confirm Change</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
