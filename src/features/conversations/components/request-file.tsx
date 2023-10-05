import React from "react";

import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

import { useConversationLayoutStore } from "./layout";
import { apiRequestFile } from "../api";
import { useConversation } from "../hooks";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Textarea,
} from "@/components/ui";
import { useToast } from "@/hooks";
import { getApiErrorMessages } from "@/utils";
import { useChat } from "./chat-context";
import { useSelector } from "react-redux";

interface RequestFileStore {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const useRequestFileStore = createWithEqualityFn<RequestFileStore>(
  (set) => ({
    open: false,
    setOpen: (open) => set({ open }),
  }),
  shallow
);

export const RequestFile: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useConversation();
  const { toast } = useToast();
  const { chatConversation } = useSelector((store: any) => ({
    chatConversation: store.chatContent?.conversation,
  }));

  const conversationsType = useConversationLayoutStore((store) => store.conversationsType);
  const queryClient = useQueryClient();
  const open = useRequestFileStore((store) => store.open);
  const setOpen = useRequestFileStore((store) => store.setOpen);

  const [content, setContent] = React.useState("");
  const [isSending, setIsSending] = React.useState(false);

  const closeWithTransition = () => {
    setOpen(false);
    setTimeout(() => {
      setContent("");
    }, 300);
  };

  const onRequestFileHandler = async () => {
    if (content && chatConversation?.chat_id) {
      setIsSending(true);
      try {
        await apiRequestFile({
          chat_id: chatConversation.chat_id,
          content,
        });
        await Promise.allSettled([
          queryClient.invalidateQueries(["conversations", conversationsType]),
          queryClient.invalidateQueries(["conversation", id]),
        ]);
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
          <DialogTitle>{t("conversations:request_file_dialog.title")}</DialogTitle>
          <DialogDescription>
            {t("conversations:request_file_dialog.description")}
          </DialogDescription>
        </DialogHeader>
        <Textarea
          autoFocus
          maxRows={5}
          disabled={isSending}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t("conversations:request_file_dialog.placeholder")}
          className="mt-5"
        />
        <DialogFooter>
          <Button variant="outline" disabled={isSending} onClick={() => setOpen(false)}>
            {t("common:cancel")}
          </Button>
          <Button disabled={isSending || content.length === 0} onClick={onRequestFileHandler}>
            {t("common:send")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
