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

interface RequestFileStore {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const useRecomandAnalysisStore = createWithEqualityFn<RequestFileStore>(
  (set) => ({
    open: false,
    setOpen: (open) => set({ open }),
  }),
  shallow
);

export const RecomandAnalysis: React.FC = () => {
  const { t } = useTranslation();
  const { id, conversation } = useConversation();
  const { toast } = useToast();

  const conversationsType = useConversationLayoutStore((store) => store.conversationsType);
  const queryClient = useQueryClient();
  const open = useRecomandAnalysisStore((store) => store.open);
  const setOpen = useRecomandAnalysisStore((store) => store.setOpen);

  const [content, setContent] = React.useState("");
  const [isSending, setIsSending] = React.useState(false);

  const onRequestFileHandler = async () => {};

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        className="max-w-md"
      >
        <DialogHeader>
          <DialogTitle>{t("conversations:recomand_analysis_dialog:title")}</DialogTitle>
          <DialogDescription>
            {t("conversations:recomand_analysis_dialog.description")}
          </DialogDescription>
        </DialogHeader>
        zfdsdf
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
