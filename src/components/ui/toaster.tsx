
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
import { cn } from "@/lib/utils"

export function Toaster() {
  const { toasts } = useToast()

  const getToastIcon = (type?: 'default' | 'success' | 'error') => {
    switch (type) {
      case 'success':
        return <Check className="h-5 w-5 text-green-500" />
      case 'error':
        return <X className="h-5 w-5 text-red-500" />
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const getToastClassName = (type?: 'default' | 'success' | 'error') => {
    switch (type) {
      case 'success':
        return 'border-l-4 border-l-green-500'
      case 'error':
        return 'border-l-4 border-l-red-500'
      default:
        return 'border-l-4 border-l-blue-500'
    }
  }

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, type, ...props }) {
        return (
          <Toast 
            key={id} 
            {...props}
            className={cn(
              "flex gap-3 items-start", 
              getToastClassName(type)
            )}
          >
            <div className="pt-1">
              {getToastIcon(type)}
            </div>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
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
