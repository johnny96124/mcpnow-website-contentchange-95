
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
      <AlertDialogContent className="max-w-[350px]">
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
