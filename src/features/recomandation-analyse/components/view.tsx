import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";
import { t } from "i18next";
import React from "react";
import { TreeSelect } from "antd";
import { toast } from "@/hooks";
import { cn, getApiErrorMessages } from "@/utils";
import { RequestFileStore, TreeNodeData } from "@/features/conversations/types";
import {
  extractIdsFromArray,
  useRecomandation,
} from "@/features/conversations/hooks/use-recomandations";
import { apiPutRecomandations } from "@/features/conversations/api";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui";

const { TreeNode } = TreeSelect;

export const useRecomandAnalysisStore = createWithEqualityFn<RequestFileStore>(
  (set) => ({
    open: false,
    setOpen: (open) => set({ open }),
  }),
  shallow
);

interface MessageTemplatesStore {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const useRecomandationTemplatesStore = createWithEqualityFn<MessageTemplatesStore>(
  (set) => ({
    open: false,
    setOpen: (open) => set({ open }),
  }),
  shallow
);
export const View = () => {
  const { treeData, chat_id } = useRecomandation();
  const [value, setValue] = React.useState([]);
  const navigate = useNavigate();
  const [isSending, setIsSending] = React.useState(false);
  const onChange = (newValue: React.SetStateAction<never[]>) => {
    setValue(newValue);
  };
  const renderTreeNodes = (nodes: TreeNodeData[] | undefined) => {
    if (!nodes) {
      return null;
    }

    return nodes.map((node) => {
      return (
        <TreeNode key={node.value} value={node.value} title={node.title} checkable={!node.children}>
          {node.children ? renderTreeNodes(node.children) : null}
        </TreeNode>
      );
    });
  };

  const sendRecomandation = async () => {
    const extractedIds = extractIdsFromArray(value);
    const data = { chat_id: chat_id, analyzes: extractedIds };
    try {
      setIsSending(true);
      await apiPutRecomandations(data);

      navigate(`/conversations?id=${chat_id}&anonymous=false`);
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
  const filterTreeNode = (inputValue: string, treeNode: TreeNodeData): boolean => {
    if (treeNode.title.toLowerCase().includes(inputValue.toLowerCase())) {
      return true;
    }

    if (treeNode.children) {
      // Recursively check the children
      return treeNode.children.some((child) => filterTreeNode(inputValue, child));
    }

    return false;
  };

  return (
    <div
      className={cn(
        "custom-scroll-bar h-full w-full p-10 md:rounded-lg md:border md:border-neutral-200"
      )}
    >
      <div className={cn("gap flex flex-col justify-between")}>
        <TreeSelect
          value={value}
          showSearch
          allowClear
          multiple
          style={{ width: "100%" }}
          placeholder={t("conversations:recomand_analysis_dialog.placeholder")}
          treeCheckable
          treeDefaultExpandAll
          treeNodeFilterProp="title"
          onChange={onChange}
        >
          {renderTreeNodes(treeData)}
        </TreeSelect>
        <div className="flex flex-col-reverse space-y-2 space-y-reverse py-3 sm:flex-row sm:justify-end sm:space-x-2 sm:space-y-0">
          <button
            onClick={sendRecomandation}
            type="button"
            disabled={isSending}
            className="inline-flex h-9 items-center justify-center rounded-md bg-rose-600 px-4 py-2 text-sm font-medium text-white shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400 active:bg-rose-600/90 disabled:pointer-events-none disabled:opacity-50 md:hover:bg-rose-600/90"
          >
            {isSending ? <Spinner className="h-5 w-5 text-white" /> : t("common:send")}
          </button>
        </div>
      </div>
    </div>
  );
};
