import React from "react";

import { useTranslation } from "react-i18next";

import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

import ModalComponent from "@/components/ui/modal";
import { TreeSelect } from "antd";
import { extractIdsFromArray, useRecomandation } from "../hooks/use-recomandations";
import { RequestFileStore, TreeNodeData } from "../types";
import { apiPutRecomandations } from "../api";
import { toast } from "@/hooks";
import { getApiErrorMessages } from "@/utils";
import { useConversationLayoutStore } from "./layout";
import { useQueryClient } from "react-query";

const { TreeNode } = TreeSelect;

export const useRecomandAnalysisStore = createWithEqualityFn<RequestFileStore>(
  (set) => ({
    open: false,
    setOpen: (open) => set({ open }),
  }),
  shallow
);
type RecProps = {
  id: any;
  conversationsType: any;
};
export const RecomandAnalysis: React.FC<RecProps> = ({ id, conversationsType }) => {
  const setRecomandationAnalysisOpen = useRecomandAnalysisStore((store) => store.setOpen);
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const open = useRecomandAnalysisStore((store) => store.open);
  const { treeData, isAnalysesLoading, chat_id } = useRecomandation();

  const [value, setValue] = React.useState([]);

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
  const closeModal = () => setRecomandationAnalysisOpen(false);
  const sendRecomandation = async () => {
    const extractedIds = extractIdsFromArray(value);
    const data = { chat_id: chat_id, analyzes: extractedIds };
    try {
      await apiPutRecomandations(data);
      await Promise.allSettled([
        queryClient.invalidateQueries(["conversations", conversationsType]),
        queryClient.invalidateQueries(["conversation", id]),
      ]);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "common:something_went_wrong",
        description: getApiErrorMessages(error),
      });
    } finally {
      closeModal();
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
    <ModalComponent
      disableSubmitButton={isAnalysesLoading}
      onSubmit={sendRecomandation}
      title={t("conversations:recomand_analysis_dialog:title")}
      isOpen={open}
      setOpen={closeModal}
      submitBtnText={t("common:send")}
      cancelBtnText={t("common:cancel")}
      children={
        <div>
          <p className="pb-4 text-sm text-typography-secondary">
            {t("conversations:recomand_analysis_dialog.description")}
          </p>
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
        </div>
      }
      formKeyId="employeeForm"
    />
  );
};
