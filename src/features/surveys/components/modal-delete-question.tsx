import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
} from "@/components/ui";
import { t } from "i18next";
import { FormProvider, useForm } from "react-hook-form";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import Select from "@/components/ui/SelectElstar";
import { toast } from "@/hooks";
import { useQuery, useQueryClient } from "react-query";
import { getApiErrorMessages } from "@/utils";
import { createQuestion, deleteQuestion } from "../api";

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

  const queryClient = useQueryClient();

  const onDeleteQuestion = async () => {
    try {
      await deleteQuestion({
        id: questionId,
      });
      await Promise.allSettled([queryClient.invalidateQueries(["questions"])]);
      setOpen(false);
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
    </Dialog>
  );
};
