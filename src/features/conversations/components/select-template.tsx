import React from "react";
import { useTranslation } from "react-i18next";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";
import { Dialog, DialogContent } from "@/components/ui";
import Notification from "@/components/ui/notification";
import { FormTemplate } from "./template/form";
import { Templates } from "./template/templates";

export const useSelectTemplateStore = createWithEqualityFn<any>(
  (set) => ({
    open: false,
    setOpen: (open: any) => set({ open }),
  }),
  shallow
);
interface SelectTemplateProps {
  setContent: React.Dispatch<React.SetStateAction<string>>;
}

export const SelectTemplate: React.FC<SelectTemplateProps> = ({ setContent }) => {
  const setSelectTemplateOpen = useSelectTemplateStore((store) => store.setOpen);
  const { t } = useTranslation();
  const [createForm, setCreateForm] = React.useState(false);
  const [templateItem, setTemplateItem] = React.useState<any>();
  const open = useSelectTemplateStore((store) => store.open);

  const setOpen = useSelectTemplateStore((store) => store.setOpen);
  const [apiResponse, setApiResponse] = React.useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const setOnOpenChange = (val: { type: "error" | "success"; message: string } | null) => () =>
    setApiResponse(val);
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen} key="dialog-template">
        <DialogContent
          onEscapeKeyDown={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
          className="max-w-md"
        >
          {createForm ? (
            <FormTemplate
              setCreateForm={setCreateForm}
              templateItem={templateItem ?? null}
              setTemplateItem={setTemplateItem}
            />
          ) : (
            <Templates
              setOpen={setOpen}
              setCreateForm={setCreateForm}
              setContent={setContent}
              setTemplateItem={setTemplateItem}
            />
          )}
        </DialogContent>
      </Dialog>
      <Notification
        open={apiResponse ? true : false}
        onOpenChange={setOnOpenChange(null)}
        type={apiResponse?.type}
        description={
          apiResponse?.type === "success" ? t("common:success_update") : t("common:error_update")
        }
      />
    </>
  );
};
