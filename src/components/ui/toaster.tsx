
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { Info, Check, X } from "lucide-react"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, type = "default", variant, ...props }) {
        const Icon = type === "success" ? Check : type === "error" ? X : Info
        const bgColor = type === "success" 
          ? "bg-green-50 dark:bg-green-950" 
          : type === "error" 
          ? "bg-[#FFDEE2] dark:bg-red-950" 
          : "bg-gray-50 dark:bg-gray-950"
        
        const iconColor = type === "success"
          ? "text-green-500"
          : type === "error"
          ? "text-red-500"
          : "text-blue-500"

        return (
          <Toast key={id} className={`${bgColor} flex items-start gap-3`} {...props}>
            <div className={`${iconColor} mt-1.5`}>
              <Icon size={20} />
            </div>
            <div className="grid gap-1 flex-1">
              {title && (
                <ToastTitle className="text-sm font-medium">
                  {title}
                </ToastTitle>
              )}
              {description && (
                <ToastDescription className="text-sm opacity-90">
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
