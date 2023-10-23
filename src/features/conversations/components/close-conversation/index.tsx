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

import { useConversation } from "../../hooks";
import { apiCloseChat } from "../../api";

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
  const onCloseConversation = async () => {
    if (patientId) await apiCloseChat({ chat_id: patientId });
    setOpen(false);
    revalidateQueries();
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
            <Button
              variant="outline"
              className="w-full"
              disabled={isSending}
              onClick={() => setOpen(false)}
            >
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
    </Dialog>
  );
};
