import React from "react";
import { useTranslation } from "react-i18next";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";
import { Card } from "antd";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui";
import Button from "@/components/ui/buttonIcon";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { useQuery } from "react-query";
import { apiGetTemplates } from "../api";
import { ArchiveBoxXMarkIcon, InboxIcon, XMarkIcon } from "@heroicons/react/24/outline";
// import { FormTemplate } from "./form-templates";

export const useSelectTemplateStore = createWithEqualityFn<any>(
  (set) => ({
    open: false,
    setOpen: (open: any) => set({ open }),
  }),
  shallow
);

export const SelectTemplate: React.FC = () => {
  const setSelectTemplateOpen = useSelectTemplateStore((store) => store.setOpen);
  const { t } = useTranslation();

  const { data: templates, isLoading } = useQuery({
    queryKey: ["templates"],
    queryFn: async () => {
      return apiGetTemplates();
    },
  });

  const open = useSelectTemplateStore((store) => store.open);

  const setOpen = useSelectTemplateStore((store) => store.setOpen);

  return (
    <Dialog open={open} onOpenChange={setOpen} key="dialog-template">
      <DialogContent
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        className="max-w-md"
      >
        {/* <FormTemplate /> */}
      </DialogContent>
    </Dialog>
  );
};
