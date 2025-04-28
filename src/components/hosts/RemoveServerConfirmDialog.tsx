
import { useState } from "react";
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

interface RemoveServerConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serverName: string;
  onConfirm: () => void;
}

export function RemoveServerConfirmDialog({
  open,
  onOpenChange,
  serverName,
  onConfirm
}: RemoveServerConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Server from Profile</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove <span className="font-medium">{serverName}</span> from this profile? 
            This will not delete the server instance, and you can add it back later.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
