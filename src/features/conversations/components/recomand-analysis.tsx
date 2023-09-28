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
import { TreeSelect } from "antd";
const { SHOW_PARENT } = TreeSelect;
interface RequestFileStore {
  open: boolean;
  setOpen: (open: boolean) => void;
}
const treeData = [
  {
    value: "parent 1",
    title: "parent 1",
    children: [
      {
        value: "parent 1-0",
        title: "parent 1-0",
        children: [
          {
            value: "leaf1",
            title: "my leaf",
          },
          {
            value: "leaf2",
            title: "your leaf",
          },
        ],
      },
      {
        value: "parent 1-1",
        title: "parent 1-1",
        children: [
          {
            value: "sss",
            title: <b style={{ color: "#08c" }}>sss</b>,
          },
        ],
      },
    ],
  },
];
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
  const [value, setValue] = React.useState(["0-0-0"]);

  const onChange = (newValue: string[]) => {
    console.log("onChange ", value);
    setValue(newValue);
  };

  

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
        <TreeSelect
          showSearch
          dropdownStyle={{ maxHeight: 400, overflow: "auto", minWidth: 300 }}
          placeholder="Please select"
          dropdownMatchSelectWidth={false}
          // placement={placement}
          allowClear
          treeDefaultExpandAll
          treeData={treeData}
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
