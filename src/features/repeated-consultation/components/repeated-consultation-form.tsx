import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/utils";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/components/ui";
import Select from "@/components/shared/select";
import { updateDiscount } from "@/features/repeated-consultation/api";
import Notification from "@/components/ui/notification";
import { useAuth } from "@/features/auth";

const RepeatedConsultationForm = () => {
  const { t } = useTranslation();
  const { session, revalidateSession } = useAuth();
  const isValidSelectOption = (value: string) => {
    return ["yes", "no"].includes(value);
  };
  const timeSchema = (min: number, max: number) =>
    z.string().refine((value: any) => parseInt(value, 10) >= min && parseInt(value, 10) <= max, {
      message: t("common:zod_number_range", { min, max }),
    });

  const schema = z.object({
    offer_discount: z.string().refine((value) => isValidSelectOption(value), {
      message: t("common:zod_mixed_required"),
    }),
    discount_days: z.string().refine((value: any) => parseInt(value, 10) < 365, {
      message: `${t("common:zod_mixed_required")}${t("common:zod_mixed_number")}`,
    }),
    discount: z
      .string()
      .refine((value: any) => parseInt(value, 10) >= 10 && parseInt(value, 10) <= 50, {
        message: t("common:zod_number_range", { min: 10, max: 50 }),
      }),
  });

  type FormValues = z.infer<typeof schema>;
  const [apiResponse, setApiResponse] = React.useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [timeoutId, setTimeoutId] = React.useState<number | null>(null);
  const [loading, setLoading] = React.useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      offer_discount: session?.user?.offer_discount ? "yes" : "no",
      discount_days: `${session?.user?.["discount_days"]}` || "",
      discount: `${session?.user?.["discount"]}` || "",
    },
    resolver: zodResolver(schema),
  });

  const onSubmitTestIsSubmitting = async (values: any) => {
    setLoading(true);
    updateDiscount({
      offer_discount: values.offer_discount === "yes" ? true : false,
      discount_days: parseInt(values.discount_days, 10),
      discount: parseInt(values.discount, 10),
    })
      .then(() => {
        setApiResponse({ type: "success", message: t("common:success_update") });
        revalidateSession();
      })
      .catch(() => {
        setApiResponse({ type: "error", message: t("common:error_update") });
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

  const setOnOpenChange = (val: { type: "error" | "success"; message: string } | null) => () =>
    setApiResponse(val);

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmitTestIsSubmitting)}>
        <Notification
          open={apiResponse ? true : false}
          onOpenChange={setOnOpenChange(null)}
          type={apiResponse?.type}
          description={
            apiResponse?.type === "success" ? t("common:success_update") : t("common:error_update")
          }
        />
        <div className={cn("flex flex-col gap-4")}>
          <FormField
            control={form.control}
            name="offer_discount"
            render={({ field }) => (
              <FormItem>
                <Select
                  value={field.value}
                  disabled={loading}
                  options={[
                    { value: "yes", label: t("common:yes") },
                    { value: "no", label: t("common:no") },
                  ]}
                  onChange={field.onChange}
                />
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
                  <Input type="number" className="w-full" disabled={loading} {...field} />
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
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className={cn("flex justify-end")}>
          <Button
            type="submit"
            disabled={loading}
            className="xs:hover:bg-primary-hover mt-4 w-60 bg-primary px-2 py-1 text-sm hover:bg-primary-hover sm:hover:bg-primary-hover md:hover:bg-primary-hover"
          >
            {t("common:save")}
            {loading && "..."}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default RepeatedConsultationForm;
