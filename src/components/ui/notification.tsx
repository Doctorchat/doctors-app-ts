import { useTranslation } from "react-i18next";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from ".";
import { cn } from "@/utils";

type NotificationProps = {
  open: boolean;
  onOpenChange: () => void;
  type?: "success" | "error";
  description?: string;
};

const Notification = (props: NotificationProps) => {
  const { t } = useTranslation();
  const { open, onOpenChange, type = "success", description } = props;
  return (
    <div className="space-y-6 mb-3">
      <ToastProvider
        swipeDirection="up"
      >
        <Toast
          open={open}
          onOpenChange={onOpenChange}
        >
          <div className="grid gap-1">
            <ToastTitle className={cn("flex item-center justify-center px-5 py-2 rounded font-medium text-xs",
              type === "success"
                ? "bg-green-100 text-green-600 shadow-[inset_0_0_0_1px] shadow-green-200"
                : "bg-red-100 text-red-600 shadow-[inset_0_0_0_1px] shadow-red-200"
            )}
            >
              {type === "success" ? t("common:success") : t("common:error")}
            </ToastTitle>
            <ToastDescription className="flex item-center justify-center px-5 py-2  font-medium text-xs">
              {description}
            </ToastDescription>
          </div>
          <ToastClose />
        </Toast>
        <ToastViewport />
      </ToastProvider>
    </div>
  );
};

export default Notification;