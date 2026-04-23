// @ts-nocheck

import { useToast } from "@/hooks/use-toast";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast";
import { CircleCheckBig, CircleXIcon, TriangleAlertIcon } from "lucide-react";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              <div className="flex items-center gap-2">
                {props.variant === "success" && <CircleCheckBig className="h-4 w-4" />}
                {props.variant === "destructive" && <CircleXIcon className="h-4 w-4" />}
                {props.variant === "warning" && <TriangleAlertIcon className="h-4 w-4" />}
                {title && <ToastTitle>{title}</ToastTitle>}
              </div>
              {description && <ToastDescription className="ml-6">{description}</ToastDescription>}
            </div>
            {action}
            <ToastClose  />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
