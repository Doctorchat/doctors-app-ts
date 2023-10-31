import React from "react";
import { useTranslation } from "react-i18next";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";
import { Card } from "antd";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Input,
  Textarea,
} from "@/components/ui";
import Button from "@/components/ui/buttonIcon";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { useQuery } from "react-query";
import { apiGetTemplates } from "../api";
import { ArchiveBoxXMarkIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { FormProvider, useForm } from "react-hook-form";

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
  const [createForm, setCreateForm] = React.useState(false);
  const { data: templates, isLoading } = useQuery({
    queryKey: ["templates"],
    queryFn: async () => {
      return apiGetTemplates();
    },
  });
  React.useEffect(() => {}, []);

  const open = useSelectTemplateStore((store) => store.open);

  const setOpen = useSelectTemplateStore((store) => store.setOpen);
  const form = useForm<any>({});
  return (
    <Dialog open={open} onOpenChange={setOpen} key="dialog-template">
      <DialogContent
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        className="max-w-md"
      >
        <DialogHeader className="flex !flex-row justify-between !space-y-0.5">
          <DialogTitle>
            {createForm ? "Adăugați un șablon" : t("conversations:message_template.templates")}
            {!createForm && templates && templates.length > 0 && (
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
          <button onClick={() => setOpen(false)} className="cursor-pointer ">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </DialogHeader>

        {!createForm && templates && templates?.length ? (
          <div
            className={`
          ${
            templates?.length && templates?.length === 1
              ? `h-36`
              : templates?.length && templates?.length > 1
              ? `h-72`
              : ``
          }
           space-y-0.5 overflow-y-auto`}
          >
            {templates?.map((template, index) => (
              <div className="p-2" key={index}>
                <Card
                  key={index}
                  bordered
                  hoverable
                  bodyStyle={{ paddingBottom: 0, paddingTop: 12, paddingInline: 12 }}
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
              </div>
            ))}
          </div>
        ) : null}

        {createForm && (
          <FormProvider {...form}>
            <form>
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="question"
                  render={() => (
                    <FormItem>
                      <FormLabel>Titlu</FormLabel>
                      <FormControl>
                        <Input />
                      </FormControl>
                    </FormItem>
                  )}
                ></FormField>

                <FormField
                  control={form.control}
                  name="question"
                  render={() => (
                    <FormItem>
                      <FormLabel>Sablonul</FormLabel>
                      <FormControl>
                        <Textarea
                          autoFocus
                          // disabled={isSending}
                          // value={content}
                          // onChange={(e) => setContent(e.target.value)}
                          // placeholder={editable ? "" : t("survey:placeholder_question")}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div >
                <Button className="mt-4" variant="plain">
                  {t("common:cancel")}
                </Button>
                <Button className="mt-4" type="submit" variant="solid">
                  {t("common:save")}
                </Button>
              </div>
            </form>
          </FormProvider>
        )}
        {!isLoading && (!templates || !templates?.length) && (
          <div className="flex flex-col items-center justify-center">
            <ArchiveBoxXMarkIcon className="h-16 w-16 text-gray-400" />
            <h4 className="text-md mb-2 font-medium text-gray-400">{t("common:empty_list")}</h4>
            <Button variant="solid" size="sm" className="ms-2  px-2">
              {t("conversations:message_template.create_template")}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
