
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
import { CloseIconButton } from "@/components/ui/CloseIconButton";
import React from "react";

interface DeleteProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profileName: string;
  onConfirmDelete: () => void;
}

export function DeleteProfileDialog({
  open,
  onOpenChange,
  profileName,
  onConfirmDelete,
}: DeleteProfileDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="relative">
        <CloseIconButton onClick={() => onOpenChange(false)} />
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Profile</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the profile "{profileName}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirmDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
