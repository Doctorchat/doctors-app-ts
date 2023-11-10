import React from "react";

import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
import Notification from "@/components/ui/notification";
import { useConversation } from "../../hooks";
import { apiCloseChat } from "../../api";
import { useToast } from "@/hooks";
import { getApiErrorMessages } from "@/utils";

interface CloseConversation {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const useCloseConversation = createWithEqualityFn<CloseConversation>(
  (set) => ({
    open: false,
    setOpen: (open) => set({ open }),
  }),
  shallow
);

export const CloseConversation: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { patientId } = useConversation();
  const open = useCloseConversation((state) => state.open);
  const queryClient = useQueryClient();
  const setOpen = useCloseConversation((state) => state.setOpen);
  const [isSending, setIsSending] = React.useState(false);
  const revalidateQueries = async () => {
    await Promise.allSettled([
      queryClient.invalidateQueries(["list-patients", "patients"]),
      queryClient.invalidateQueries(["conversation-patient", patientId]),
    ]);
  };
  const [openNotification, setOpenNotification] = React.useState(false);
  const setOnOpenChange = (val: { type: "error" | "success"; message: string } | null) => () =>
    setOpenNotification(!!val);
  const onCloseConversation = async () => {
    setIsSending(true);
    console.log(patientId);

    if (patientId) {
      try {
        await apiCloseChat({ chat_id: patientId }).then(() => revalidateQueries());

        setOpenNotification(true);
        setTimeout(() => {
          setOpenNotification(false);
        }, 3000);
        setIsSending(false);
        setOpen(false);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "common:something_went_wrong",
          description: getApiErrorMessages(error),
        });
        setIsSending(false);
        setOpen(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        className="max-w-md gap-6"
      >
        <DialogHeader>
          <DialogTitle>{t("conversations:close_conversation:title")}</DialogTitle>
          <DialogDescription>{t("conversations:close_conversation:description")}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="flex items-center">
            <Button variant="outline" className="w-full" onClick={() => setOpen(false)}>
              {t("common:cancel")}
            </Button>
            <Button
              className="ml-2 w-full"
              disabled={isSending}
              onClick={onCloseConversation}
              variant="primary"
            >
              {t("common:confirm")}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
      <Notification
        onOpenChange={setOnOpenChange(null)}
        open={openNotification ? true : false}
        type={"success"}
        description={t("common:on_succes_notification")}
      />
    </Dialog>
  );
};
