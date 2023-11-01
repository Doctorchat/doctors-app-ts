import React from "react";
import { useTranslation } from "react-i18next";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";
import { Card } from "antd";
import {
  DialogHeader,
  DialogTitle,
} from "@/components/ui";
import Button from "@/components/ui/buttonIcon";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { useQuery, useQueryClient } from "react-query";

import { ArchiveBoxXMarkIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { apiDeleteTemplate, apiGetTemplates } from "../../api";

export const useSelectTemplateStore = createWithEqualityFn<any>(
  (set) => ({
    open: false,
    setOpen: (open: any) => set({ open }),
  }),
  shallow
);
interface SelectTemplateProps {
  setContent: React.Dispatch<React.SetStateAction<string>>;
  setOpen: any;
  setCreateForm: React.Dispatch<React.SetStateAction<boolean>>;
  setTemplateItem: React.Dispatch<React.SetStateAction<any>>;
}

export const Templates: React.FC<SelectTemplateProps> = ({
  setContent,
  setOpen,
  setCreateForm,
  setTemplateItem,
}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data: templates, isLoading } = useQuery({
    queryKey: ["templates"],
    queryFn: async () => {
      return apiGetTemplates();
    },
  });
  const [loading, setLoading] = React.useState(false);
  const [templateId, setTemplateId] = React.useState();
  return (
    <>
      <DialogHeader className="flex !flex-row justify-between !space-y-0.5">
        <DialogTitle>
          {t("conversations:message_template.templates")}
          {templates && templates.length > 0 && (
            <Button
              variant="twoTone"
              size="sm"
              className="w-30 ms-2 px-2"
              onClick={() => setCreateForm(true)}
            >
              {t("conversations:message_template.create_template")}
            </Button>
          )}
        </DialogTitle>

        <button onClick={() => (setOpen(false), setCreateForm(false))} className="cursor-pointer">
          <XMarkIcon className="h-6 w-6" />
        </button>
      </DialogHeader>

      {templates && templates?.length ? (
        <div
          className={`
          ${
            templates?.length && templates?.length === 1
              ? `h-36`
              : templates?.length && templates?.length > 1
              ? `h-72`
              : ``
          }
           custom-scroll-bar space-y-0.5 overflow-y-auto `}
        >
          {templates?.map((template, index) => (
            <div className="p-2" key={index}>
              <Card
                key={index}
                bordered
                hoverable
                bodyStyle={{ paddingBottom: 0, paddingTop: 12, paddingInline: 12 }}
                onClick={() => {
                  setContent(template.content);
                  setOpen(false);
                }}
              >
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
                      icon={!!(loading && templateId === template.id) ? "..." : <HiOutlineTrash />}
                      onClick={async (event) => {
                        event.stopPropagation();
                        setLoading(true);
                        setTemplateId(template);
                        await apiDeleteTemplate(template.id)
                          .then(
                            async () =>
                              await Promise.allSettled([
                                queryClient.invalidateQueries(["templates"]),
                              ])
                          )
                          .finally(() => {
                            setLoading(false);
                          });
                      }}
                    />

                    <Button
                      shape="circle"
                      variant="twoTone"
                      size="sm"
                      icon={<HiOutlinePencil />}
                      onClick={async (event) => {
                        event.stopPropagation();
                        setTemplateItem(template);
                        setCreateForm(true);
                      }}
                    />
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      ) : null}

      {!isLoading && (!templates || !templates?.length) && (
        <div className="flex flex-col items-center justify-center">
          <ArchiveBoxXMarkIcon className="h-16 w-16 text-gray-400" />
          <h4 className="text-md mb-2 font-medium text-gray-400">{t("common:empty_list")}</h4>
          <Button
            variant="solid"
            size="sm"
            className="ms-2  px-2"
            onClick={() => setCreateForm(true)}
          >
            {t("conversations:message_template.create_template")}
          </Button>
        </div>
      )}
    </>
  );
};
