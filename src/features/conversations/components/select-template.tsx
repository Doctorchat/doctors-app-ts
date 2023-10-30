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
import { ArchiveBoxXMarkIcon } from "@heroicons/react/24/outline";

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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        className="max-w-md"
      >
        <DialogHeader className="flex justify-center">
          <DialogTitle>
            {t("conversations:message_template.templates")}
            {templates && templates.length > 0 && (
              <Button variant="twoTone" size="sm" className="ms-2 w-28 px-2">
                {t("conversations:message_template.create_template")}
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>
        {templates?.map((template) => {
          console.log(template);
          return (
            <Card bordered hoverable bodyStyle={{ padding: 8 }}>
              <p className=" truncate text-lg">{template.title}</p>
              <div className="min-h-[14px] font-medium">
                <p className="text-sm">{template.content}</p>
              </div>
              <div className="flex items-center justify-end">
                <div className="flex">
                  <Button
                    shape="circle"
                    variant="twoTone"
                    size="sm"
                    icon={<HiOutlineTrash />}
                    // onClick={() => {
                    //   setQuestionId(question.id);
                    //   setDeleteQuestion(true);
                    // }}
                  />

                  <Button
                    shape="circle"
                    variant="twoTone"
                    size="sm"
                    icon={<HiOutlinePencil />}
                    // onClick={() => {
                    //   setLanguageQuestion(question.language);
                    //   setIsEditable(true);
                    //   setQuestionContent(question.question);
                    //   setQuestionId(question.id);
                    //   setOpenModalQuestion(true);
                    // }}
                  />
                </div>
              </div>
            </Card>
          );
        })}

        {!isLoading && (!templates || !templates?.length) && (
          <div className="mt-2 flex flex-col items-center justify-center">
            <ArchiveBoxXMarkIcon className="h-16 w-16 text-gray-400" />
            <h4 className="text-md mb-2 font-medium text-gray-400">{t("common:empty_list")}</h4>
            <Button variant="solid" size="sm" className="ms-2  px-2">
              {t("conversations:message_template.create_template")}
            </Button>
            <Button variant="twoTone" onClick={() => setOpen(false)}>
              {t("common:cancel")}
            </Button>
          </div>
        )}
        {templates && templates.length ? (
          <DialogFooter>
            <Button variant="twoTone" onClick={() => setOpen(false)}>
              {t("common:cancel")}
            </Button>
            <Button variant="solid" size="sm" className="ms-2  px-2">
              {t("common:send")}
            </Button>
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};
