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
import { apiCancelVacation } from "../api";

interface CancelVacation {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const useCancelVacation = createWithEqualityFn<CancelVacation>(
  (set) => ({
    open: false,
    setOpen: (open) => set({ open }),
  }),
  shallow
);

export const CancelVacation: React.FC = () => {
  const { t } = useTranslation();
  const open = useCancelVacation((state) => state.open);
  const queryClient = useQueryClient();
  const setOpen = useCancelVacation((state) => state.setOpen);
  const [isSending, setIsSending] = React.useState(false);
  const revalidateQueries = async () => {
    await Promise.allSettled([queryClient.invalidateQueries(["vacations"])]);
  };
  const onCancelVacation = async () => {
    setIsSending(true);
    await apiCancelVacation()
      .then(() => setOpen(false))
      .then(() => revalidateQueries());
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        className="max-w-md gap-6"
      >
        <DialogHeader>
          <DialogTitle> {t("vacation:cancel.title")}</DialogTitle>
          <DialogDescription>{t("vacation:cancel.description")}</DialogDescription>
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
            <Button className="ml-2 w-full" disabled={isSending} onClick={onCancelVacation}>
              {t("common:confirm")}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
