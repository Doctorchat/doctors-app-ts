import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui";
import { t } from "i18next";
import { FormProvider, useForm } from "react-hook-form";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

import React from "react";

import { toast } from "@/hooks";
import { useQueryClient } from "react-query";
import { getApiErrorMessages } from "@/utils";
import { deleteQuestion } from "../api";
import Notification from "@/components/ui/notification";

interface ModalQuestion {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const useDeleteQuestion = createWithEqualityFn<ModalQuestion>(
  (set) => ({
    open: false,
    setOpen: (open) => set({ open }),
  }),
  shallow
);
interface ModalProps {
  questionId: number;
}

export const ModalDeleteQuestion: React.FC<ModalProps> = ({ questionId }) => {
  const open = useDeleteQuestion((state) => state.open);
  const setOpen = useDeleteQuestion((state) => state.setOpen);
  const form = useForm<any>({});
  const [openNotification, setOpenNotification] = React.useState(false);
  const setOnOpenChange = (val: { type: "error" | "success"; message: string } | null) => () =>
    setOpenNotification(!!val);
  const queryClient = useQueryClient();

  const onDeleteQuestion = async () => {
    try {
      await deleteQuestion({
        id: questionId,
      });
      await Promise.allSettled([queryClient.invalidateQueries(["questions"])]);
      setOpen(false);
      setOpenNotification(true);
      setTimeout(() => {
        setOpenNotification(false);
      }, 3000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "common:something_went_wrong",
        description: getApiErrorMessages(error),
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        className="max-w-md"
      >
        <DialogHeader>
          <DialogTitle>{t("survey:title_delete")}</DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onDeleteQuestion)}>
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="question"
                render={() => (
                  <FormItem>
                    <FormLabel>{t("survey:delete_question_description")}</FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </FormProvider>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t("common:cancel")}
          </Button>
          <Button onClick={() => form.handleSubmit(onDeleteQuestion)()}>
            {t("common:confirm")}
          </Button>
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
