import React from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/utils";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/features/auth";

import {
  Button,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  ToastClose,
  ToastTitle,
  Toast, ToastProvider, ToastViewport
} from "@/components/ui";
import Select from "@/components/shared/select";
import { updateDiscount } from "@/features/repeated-consultation/api";

const RepeatedConsultationForm = () => {
  const { t } = useTranslation();
  const { session } = useAuth();
  const user = session?.user

  const isValidSelectOption = (value: string) => {
    return ["yes", "no"].includes(value);
  };

  const schema = z.object({
    offer_discount:
      z.string().refine(value => isValidSelectOption(value), {
        message: t("common:zod_mixed_required"),
      }),
    discount_days:
      z.string()
        .refine((value: any) => parseInt(value, 10) < Number.MAX_SAFE_INTEGER, {
          message: `${t("common:zod_mixed_required")}${t("common:zod_mixed_number")}`,
        }),
    discount:
      z.string()
        .refine((value: any) => parseInt(value, 10) >= 10 && parseInt(value, 10) <= 50, {
          message: t("common:zod_number_range", { min: 10, max: 50 }),
        }),
  });

  type FormValues = z.infer<typeof schema>;

  const [apiResponse, setApiResponse] = React.useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [timeoutId, setTimeoutId] = React.useState<number | null>(null);
  const [loading, setLoading] = React.useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      offer_discount: user?.offer_discount ? "yes" : "no",
      discount_days: user?.discount_days ? `${user?.discount_days}` : "",
      discount: user?.discount ? `${user?.discount}` : "",
    },
    resolver: zodResolver(schema),
  });

  const onSubmitTestIsSubmitting = (values: FormValues) => {
    setLoading(true);
    updateDiscount({
      offer_discount: values.offer_discount === "yes" ? true : false,
      discount_days: parseInt(values.discount_days, 10),
      discount: parseInt(values.discount, 10)
    })
      .then(() => {
        setApiResponse({ type: 'success', message: t("common:success_update") });
      })
      .catch(() => {
        setApiResponse({ type: 'error', message: t("common:error_update") });
      })
      .finally(() => {
        setLoading(false);
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        const id = setTimeout(() => {
          setApiResponse(null);
        }, 2000) as unknown as number;
        setTimeoutId(id);
      });
  };

  const setOnOpenChange = (val: { type: "error" | "success"; message: string } | null) => () => setApiResponse(val);

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitTestIsSubmitting)}
      >
        <Notification
          open={apiResponse ? true : false}
          onOpenChange={setOnOpenChange(null)}
          type={apiResponse?.type}
        />
        <div className={cn("flex flex-col gap-4")}>
          <FormField
            control={form.control}
            name="offer_discount"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select
                    value={form.getValues("offer_discount")}
                    disabled={loading}
                    options={[
                      { value: "yes", label: t("common:yes") },
                      { value: "no", label: t("common:no") },
                    ]}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="discount_days"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("consultation:repeated_consultations.duration")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    className="w-full"
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="discount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("consultation:repeated_consultations.discount")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    className="w-full px-2 py-4"
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div
          className={cn(
            "flex justify-end",
          )}
        >
          <Button
            type="submit"
            disabled={loading}
            className="w-60 mt-4 text-sm bg-primary hover:bg-primary-hover xs:hover:bg-primary-hover sm:hover:bg-primary-hover md:hover:bg-primary-hover px-2 py-1"
          >
            {t("common:save")}
            {loading && "..."}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

type NotificationProps = {
  open: boolean;
  onOpenChange: () => void;
  type?: "success" | "error";
};

const Notification = (props: NotificationProps) => {
  const { t } = useTranslation();
  const { open, onOpenChange, type = "success" } = props;
  return (
    <div className="space-y-6 mb-3">
      <ToastProvider
        swipeDirection="up"
      >
        <Toast
          open={open}
          onOpenChange={onOpenChange}
        >
          <div className="grid gap-1">
            <ToastTitle className={cn("flex item-center justify-center px-5 py-2 rounded font-medium text-xs",
              type === "success"
                ? "bg-green-100 text-green-600 shadow-[inset_0_0_0_1px] shadow-green-200"
                : "bg-red-100 text-red-600 shadow-[inset_0_0_0_1px] shadow-red-200"
            )}
            >
              {type === "success" ? t("common:success_update") : t("common:error_update")}
            </ToastTitle>
          </div>
          <ToastClose />
        </Toast>
        <ToastViewport />
      </ToastProvider>
    </div>
  );
};

export default RepeatedConsultationForm;