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
import React, { useEffect } from "react";
import Select from "@/components/ui/SelectElstar";
import { toast } from "@/hooks";
import { useQuery, useQueryClient } from "react-query";
import { getApiErrorMessages } from "@/utils";
import { createQuestion, updateQuestion } from "../api";

interface ModalQuestion {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const useOpenModalQuestion = createWithEqualityFn<ModalQuestion>(
  (set) => ({
    open: false,
    setOpen: (open) => set({ open }),
  }),
  shallow
);
interface ModalProps {
  editable: boolean;
  questionId: number;
  questionContent: string;
  languageQuestion: "ro" | "en" | "ru";
}

export const ModalQuestion: React.FC<ModalProps> = ({
  editable,
  questionId,
  questionContent,
  languageQuestion,
}) => {
  const open = useOpenModalQuestion((state) => state.open);
  const setOpen = useOpenModalQuestion((state) => state.setOpen);
  const form = useForm<any>({});
  const [content, setContent] = React.useState("");

  const [isSending, setIsSending] = React.useState(false);
  useEffect(() => {
    setContent(questionContent);
  }, [questionContent]);

  const closeWithTransition = () => {
    setOpen(false);
    setTimeout(() => {
      setContent("");
    }, 300);
  };
  const sessionUser = localStorage.getItem("session:user") ?? "";
  const user = !!sessionUser ? JSON.parse(localStorage.getItem("session:user") || "") : "";
  const queryClient = useQueryClient();

  const onSaveQuestion = async () => {
    setIsSending(true);
    try {
      await createQuestion({
        doctor_id: user.id,
        language: languageQuestion,
        active: 1,
        question: content,
      });
      await Promise.allSettled([queryClient.invalidateQueries(["questions"])]);
      closeWithTransition();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "common:something_went_wrong",
        description: getApiErrorMessages(error),
      });
    } finally {
      setIsSending(false);
    }
  };
  const onEditQuestion = async () => {
    setIsSending(true);
    try {
      await updateQuestion({
        id: questionId,
        doctor_id: user.id,
        language: languageQuestion,
        active: 1,
        question: content,
      });
      await Promise.allSettled([queryClient.invalidateQueries(["questions"])]);
      closeWithTransition();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "common:something_went_wrong",
        description: getApiErrorMessages(error),
      });
    } finally {
      setIsSending(false);
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
          <DialogTitle>
            {editable ? t("survey:edit_question") : t("survey:add_question")}
          </DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(editable ? onEditQuestion : onSaveQuestion)}>
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="question"
                render={() => (
                  <FormItem>
                    <FormLabel>
                      {editable
                        ? t("survey:edit_modal_description")
                        : t("survey:add_modal_description")}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        autoFocus
                        maxRows={5}
                        disabled={isSending}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={editable ? "" : t("survey:placeholder_question")}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </FormProvider>
        <DialogFooter>
          <Button variant="outline" disabled={isSending} onClick={() => setOpen(false)}>
            {t("common:cancel")}
          </Button>
          <Button
            disabled={isSending}
            onClick={() => form.handleSubmit(editable ? onEditQuestion : onSaveQuestion)()}
          >
            {t("common:save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
