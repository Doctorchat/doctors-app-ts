import React from "react";
import { useTranslation } from "react-i18next";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";
import {
  DialogHeader,
  DialogTitle,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
} from "@/components/ui";
import Button from "@/components/ui/buttonIcon";
import { useQueryClient } from "react-query";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/features/auth";
import { apiPostTemplate, apiPutTemplate } from "../../api";

export const useSelectTemplateStore = createWithEqualityFn<any>(
  (set) => ({
    open: false,
    setOpen: (open: any) => set({ open }),
  }),
  shallow
);
interface FormTemplateProps {
  setCreateForm: React.Dispatch<React.SetStateAction<boolean>>;
  templateItem: any;
  setTemplateItem: React.Dispatch<React.SetStateAction<any>>;
}

const schema = z.object({
  content: z.string().min(10),
  title: z.string(),
});

type FormValues = z.infer<typeof schema>;

export const FormTemplate: React.FC<FormTemplateProps> = ({
  setCreateForm,
  templateItem,
  setTemplateItem,
}) => {
  const { session } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [timeoutId, setTimeoutId] = React.useState<number | null>(null);
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const form = useForm<FormValues>({
    defaultValues: {
      content: templateItem?.content ?? "",
      title: templateItem?.title ?? "",
    },
    resolver: zodResolver(schema),
  });
  console.log(templateItem);
  const [apiResponse, setApiResponse] = React.useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const setOnOpenChange = (val: { type: "error" | "success"; message: string } | null) => () =>
    setApiResponse(val);

  const onSaveTemplate = async (values: FormValues) => {
    setLoading(true);
    console.log(values);
    console.log({
      ...values,
      id: templateItem.id,
      doctor_id: session?.user?.id ?? 0,
    });
    if (templateItem) {
      await apiPutTemplate({
        ...values,
        id: templateItem.id,
        doctor_id: session?.user?.id ?? 0,
      })
        .then(async () => {
          setApiResponse({ type: "success", message: t("common:success_update") });
          await Promise.allSettled([queryClient.invalidateQueries(["templates"])]);
        })
        .catch(() => {
          setApiResponse({ type: "error", message: t("common:error_update") });
        })
        .finally(() => {
          setLoading(false);
          setCreateForm(false);
          setTemplateItem(null);
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          const id = setTimeout(() => {
            setApiResponse(null);
          }, 2000) as unknown as number;
          setTimeoutId(id);
        });
    } else {
      await apiPostTemplate({
        ...values,
        doctor_id: session?.user?.id ?? 0,
      })
        .then(async () => {
          setApiResponse({ type: "success", message: t("common:success_update") });
          await Promise.allSettled([queryClient.invalidateQueries(["templates"])]);
        })
        .catch(() => {
          setApiResponse({ type: "error", message: t("common:error_update") });
        })
        .finally(() => {
          setLoading(false);
          setCreateForm(false);
          setTemplateItem(null);
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          const id = setTimeout(() => {
            setApiResponse(null);
          }, 2000) as unknown as number;
          setTimeoutId(id);
        });
    }
  };

  return (
    <>
      <DialogHeader className="flex !flex-row justify-between !space-y-0.5">
        <DialogTitle>
          {templateItem
            ? t("conversations:message_template.edit_template")
            : t("conversations:message_template.add_template")}
        </DialogTitle>
        <button
          onClick={() => {
            setCreateForm(false);
            setTemplateItem(null);
          }}
          className="cursor-pointer"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </DialogHeader>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSaveTemplate)}>
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> {t("conversations:message_template.title_template")}</FormLabel>
                  <FormControl>
                    <Input autoFocus {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("conversations:message_template.name_template")}</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end">
            <Button className="mt-2 rounded-lg" type="submit" variant="solid" disabled={loading}>
              {t("common:save")}
              {loading && "..."}
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
};
