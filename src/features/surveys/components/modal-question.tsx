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
import { createQuestion } from "../api";

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

export const ModalQuestion: React.FC = () => {
  const open = useOpenModalQuestion((state) => state.open);
  const setOpen = useOpenModalQuestion((state) => state.setOpen);

  const form = useForm<any>({});
  const [content, setContent] = React.useState("");
  const [isSending, setIsSending] = React.useState(false);
  const closeWithTransition = () => {
    setOpen(false);
    setTimeout(() => {
      setContent("");
    }, 300);
  };
  const sessionUser = localStorage.getItem("session:user") ?? "";
  const user = !!sessionUser ? JSON.parse(localStorage.getItem("session:user") || "") : "";
  const language = localStorage.getItem("i18nextLng") ?? "";
  const queryClient = useQueryClient();

  const onSaveQuestion = async () => {
    setIsSending(true);
    try {
      console.log({ doctor_id: user.id, language: language, active: 1, question: content });

      await createQuestion({
        doctor_id: user.id,
        language: language,
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
          <DialogTitle>{t("survey:add_question")}</DialogTitle>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSaveQuestion)}>
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("survey:add_modal_description")}</FormLabel>
                    <FormControl>
                      <Textarea
                        autoFocus
                        maxRows={5}
                        disabled={isSending}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={t("survey:placeholder_question")}
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
          <Button disabled={isSending} onClick={() => form.handleSubmit(onSaveQuestion)()}>
            {t("common:save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
