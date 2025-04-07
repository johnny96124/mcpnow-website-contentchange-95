
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
import { useOnboarding } from "@/context/OnboardingContext";

interface ProfileChangeConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  profileName: string;
  hostId?: string;
  profileId?: string;
}

export function ProfileChangeConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  profileName,
  hostId,
  profileId,
}: ProfileChangeConfirmDialogProps) {
  const { isOnboarding, currentStep, setSelectedHostId, setSelectedProfileId, nextStep } = useOnboarding();

  const handleConfirm = () => {
    onConfirm();
    
    // 如果处于引导模式且当前是第四步，更新状态并继续
    if (isOnboarding && currentStep === "assign-profile" && hostId && profileId) {
      setSelectedHostId(hostId);
      setSelectedProfileId(profileId);
      nextStep(); // 完成引导
    }
  };

  // 添加引导高亮
  const shouldHighlight = isOnboarding && currentStep === "assign-profile";

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className={`max-w-[350px] ${shouldHighlight ? "border-2 border-primary" : ""}`}>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base">Change Profile Configuration</AlertDialogTitle>
          <AlertDialogDescription className="text-sm">
            Switching to profile "{profileName}" requires modifying the configuration file.
            Do you want to proceed with this change?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm}
            className={shouldHighlight ? "animate-pulse" : ""}
          >
            Confirm Change
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
