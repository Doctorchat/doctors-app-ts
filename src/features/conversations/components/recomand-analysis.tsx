import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

import ModalComponent from "@/components/ui/modal";
import { TreeSelect } from "antd";
import { useRecomandation } from "../hooks/use-recomandations";
import { useQuery } from "react-query";
import { apiGetRecomandations } from "../api";
import { Category, Recomandation } from "../types";

const { TreeNode, SHOW_PARENT } = TreeSelect;

interface RequestFileStore {
  open: boolean;
  setOpen: (open: boolean) => void;
}
interface TreeNodeData {
  title: string;
  value: string;
  children?: TreeNodeData[];
  checkable?: boolean;
}

export const useRecomandAnalysisStore = createWithEqualityFn<RequestFileStore>(
  (set) => ({
    open: false,
    setOpen: (open) => set({ open }),
  }),
  shallow
);

export const RecomandAnalysis: React.FC = () => {
  const setRecomandationAnalysisOpen = useRecomandAnalysisStore((store) => store.setOpen);
  const { t } = useTranslation();

  const open = useRecomandAnalysisStore((store) => store.open);
  const { treeData, isAnalysesLoading } = useRecomandation();

  const [value, setValue] = React.useState([]);

  const [searchValue, setSearchValue] = React.useState<string>("");
  const onChange = (newValue: React.SetStateAction<never[]>) => {
    setValue(newValue);
  };

  const renderTreeNodes = (nodes: TreeNodeData[] | undefined) => {
    if (!nodes) {
      return null;
    }

    return nodes.map((node) => {
      const hasChildren = node.children && node.children.length > 0;
      const matchesSearch =
        !searchValue || node.title.toLowerCase().includes(searchValue.toLowerCase());

      const showNode = matchesSearch || hasChildren;
      if (node.children) {
        // Nod cu copii, afișează recursiv copiii
        return (
          showNode && (
            <TreeNode
              key={node.value}
              value={node.value}
              title={node.title}
              checkable={!node.children}
            >
              {node.children && renderTreeNodes(node.children)}
            </TreeNode>
          )
        );
      } else if (node.title.toLowerCase().includes(searchValue.toLowerCase())) {
        // Nod leaf care se potrivește cu căutarea
        return (
          showNode && (
            <TreeNode
              key={node.value}
              value={node.value}
              title={node.title}
              checkable={!node.children}
            >
              {node.children && renderTreeNodes(node.children)}
            </TreeNode>
          )
        );
      } else {
        return null; // Nod leaf care nu se potrivește cu căutarea, nu-l afișa
      }
    });
  };

  const sendRecomandation = () => {
    console.log(value);
  };

  return (
    <ModalComponent
      disableSubmitButton={isAnalysesLoading}
      onSubmit={sendRecomandation}
      title={t("conversations:recomand_analysis_dialog:title")}
      isOpen={open}
      setOpen={() => setRecomandationAnalysisOpen(false)}
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
            style={{ width: "100%" }}
            placeholder={t("conversations:recomand_analysis_dialog.placeholder")}
            treeCheckable={true}
            treeDefaultExpandedKeys={["Favorite", "Categorii"]}
            treeCheckStrictly={true}
            onChange={onChange}
            onSearch={(value) => setSearchValue(value)}
          >
            {renderTreeNodes(treeData)}
          </TreeSelect>
        </div>
      }
      formKeyId="employeeForm"
    />
  );
};
