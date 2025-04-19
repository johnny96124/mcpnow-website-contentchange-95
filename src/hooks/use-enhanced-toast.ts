
import { toast as baseToast } from "@/hooks/use-toast";

type ToastOptions = {
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center";
  duration?: number;
  nonBlocking?: boolean;
  className?: string; // Added className property to fix TypeScript errors
};

const defaultOptions = {
  position: "top-right" as const,
  duration: 3000,
  nonBlocking: true,
};

// Enhanced toast functions to provide better UX
export function useEnhancedToast() {
  const toast = (
    title: string, 
    description?: string, 
    options?: ToastOptions
  ) => {
    const mergedOptions = { ...defaultOptions, ...options };
    return baseToast({
      title,
      description,
      ...mergedOptions
    });
  };

  const success = (
    title: string,
    description?: string,
    options?: ToastOptions
  ) => {
    return toast(title, description, { 
      ...options,
      className: "bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-800"
    });
  };

  const error = (
    title: string,
    description?: string,
    options?: ToastOptions
  ) => {
    return toast(title, description, { 
      ...options,
      duration: options?.duration || 5000, // Errors stay a bit longer by default
      className: "bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-800"
    });
  };

  const info = (
    title: string,
    description?: string,
    options?: ToastOptions
  ) => {
    return toast(title, description, { 
      ...options,
      className: "bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-800"
    });
  };

  const warning = (
    title: string,
    description?: string,
    options?: ToastOptions
  ) => {
    return toast(title, description, { 
      ...options,
      className: "bg-yellow-50 dark:bg-yellow-900 border-yellow-200 dark:border-yellow-800"
    });
  };

  return {
    toast,
    success,
    error,
    info,
    warning
  };
}
