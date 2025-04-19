
import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

export function EnhancedToaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, className, position = "top-right", ...props }) {
        // Generate position class based on the position prop
        let positionClass = "fixed top-0 right-0 flex flex-col p-4 sm:top-0 sm:right-0";
        
        if (position === "top-left") {
          positionClass = "fixed top-0 left-0 flex flex-col p-4 sm:top-0 sm:left-0";
        } else if (position === "bottom-right") {
          positionClass = "fixed bottom-0 right-0 flex flex-col p-4 sm:bottom-0 sm:right-0";
        } else if (position === "bottom-left") {
          positionClass = "fixed bottom-0 left-0 flex flex-col p-4 sm:bottom-0 sm:left-0";
        } else if (position === "top-center") {
          positionClass = "fixed top-0 left-1/2 -translate-x-1/2 flex flex-col p-4";
        } else if (position === "bottom-center") {
          positionClass = "fixed bottom-0 left-1/2 -translate-x-1/2 flex flex-col p-4";
        }

        return (
          <Toast key={id} className={className} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport className="fixed top-0 right-0 flex flex-col p-4 sm:top-0 sm:right-0 sm:flex-col md:max-w-[420px]" />
    </ToastProvider>
  );
}
